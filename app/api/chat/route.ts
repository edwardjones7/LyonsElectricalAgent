import Groq from "groq-sdk";
import { NextRequest } from "next/server";
import { z } from "zod";
import { classifyDanger } from "@/lib/chatbot/dangerClassifier";
import { buildSystemPrompt } from "@/lib/chatbot/systemPrompt";
import type { StreamEvent } from "@/components/ChatWidget/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(40),
  mode: z.enum(["text", "voice"]).optional(),
});

const MODEL = "llama-3.3-70b-versatile";

export async function POST(req: NextRequest) {
  let body: z.infer<typeof requestSchema>;
  try {
    const json = await req.json();
    body = requestSchema.parse(json);
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const lastUser = [...body.messages].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return new Response("No user message", { status: 400 });
  }

  // 1) Deterministic safety pre-check. Hazards short-circuit the LLM entirely.
  const verdict = classifyDanger(lastUser.content);
  if (verdict.verdict === "danger") {
    return streamResponse(async (write) => {
      await write({ type: "danger", reason: verdict.reason ?? "hazard detected" });
      await write({ type: "done" });
    });
  }

  // 2) "Talk to a human" / live agent intent — give them a calm tap-to-call CTA,
  // not the big hazard panel.
  if (
    /\b(talk|speak|connect|put me|reach|get in touch|contact)\b.*\b(human|person|electrician|someone|agent|you|lyons|arthur)\b/i.test(lastUser.content) ||
    /^(human|agent|live|representative|operator)\b/i.test(lastUser.content.trim()) ||
    /\b(phone number|your number|call you|how (do|can) i (call|reach|contact))\b/i.test(lastUser.content)
  ) {
    return streamResponse(async (write) => {
      await write({
        type: "text",
        delta: "Easiest way is to tap below — Arthur or one of the masters picks up day or night.",
      });
      await write({ type: "call_cta" });
      await write({ type: "done" });
    });
  }

  // 3) Main chat turn — Groq + Llama 3.3 70B, streaming.
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return streamResponse(async (write) => {
      await write({
        type: "text",
        delta:
          "I'm offline at the moment, but a master electrician is on the line right now. Tap the call button to reach them.",
      });
      await write({ type: "escalate" });
      await write({ type: "done" });
    });
  }

  const client = new Groq({ apiKey });
  const systemPrompt = buildSystemPrompt({ mode: body.mode });

  return streamResponse(async (write) => {
    let buffer = "";
    let escalated = false;
    let resourceEmitted = false;
    let callCtaEmitted = false;

    const flushMarkers = async (final = false) => {
      const escIdx = buffer.indexOf("[[ESCALATE]]");
      if (escIdx !== -1) {
        const before = buffer.slice(0, escIdx);
        if (before) await write({ type: "text", delta: before });
        buffer = buffer.slice(escIdx + "[[ESCALATE]]".length);
        if (!escalated) {
          escalated = true;
          await write({ type: "escalate" });
        }
      }
      const ctaIdx = buffer.indexOf("[[CALL_CTA]]");
      if (ctaIdx !== -1) {
        const before = buffer.slice(0, ctaIdx);
        if (before) await write({ type: "text", delta: before });
        buffer = buffer.slice(ctaIdx + "[[CALL_CTA]]".length);
        if (!callCtaEmitted) {
          callCtaEmitted = true;
          await write({ type: "call_cta" });
        }
      }
      const resMatch = buffer.match(/\[\[RESOURCE:([a-z0-9-]+)\]\]/i);
      if (resMatch && resMatch.index !== undefined) {
        const before = buffer.slice(0, resMatch.index);
        if (before) await write({ type: "text", delta: before });
        buffer = buffer.slice(resMatch.index + resMatch[0].length);
        if (!resourceEmitted) {
          resourceEmitted = true;
          await write({ type: "resource", slug: resMatch[1] });
        }
      }
      // Hold back any unfinished `[[...` so we don't leak a marker as raw text.
      // A slug-bearing marker like [[RESOURCE:long-slug]] can exceed any fixed
      // window, so we anchor on bracket structure instead of a char count.
      let safe = buffer.length;
      if (!final) {
        const lastOpen = buffer.lastIndexOf("[[");
        if (lastOpen !== -1 && buffer.indexOf("]]", lastOpen) === -1) {
          safe = lastOpen;
        } else if (buffer.endsWith("[")) {
          safe = buffer.length - 1;
        }
      }
      if (safe > 0) {
        const out = buffer.slice(0, safe);
        if (out) await write({ type: "text", delta: out });
        buffer = buffer.slice(safe);
      }
    };

    try {
      const stream = await client.chat.completions.create({
        model: MODEL,
        stream: true,
        max_tokens: 600,
        temperature: 0.6,
        messages: [
          { role: "system", content: systemPrompt },
          ...body.messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      });

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (typeof delta === "string" && delta.length > 0) {
          buffer += delta;
          await flushMarkers(false);
        }
      }
      await flushMarkers(true);
      await write({ type: "done" });
    } catch (err) {
      console.error("[chat] groq error:", err);
      await write({
        type: "text",
        delta:
          "I hit a snag on my end. For anything urgent please call (856) 895-9667 — a master electrician will pick up.",
      });
      await write({ type: "done" });
    }
  });
}

function streamResponse(
  handler: (write: (event: StreamEvent) => Promise<void>) => Promise<void>,
) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const write = async (event: StreamEvent) => {
        controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      };
      try {
        await handler(write);
      } catch (err) {
        console.error("[chat] stream error:", err);
        await write({ type: "error", message: "stream failed" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
