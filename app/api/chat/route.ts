import { GoogleGenAI } from "@google/genai";
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

type ChatMsg = z.infer<typeof requestSchema>["messages"][number];

// Fallback chain — tried in order. First one to successfully yield a token wins.
type ProviderId = "gemini-2.5-flash" | "gemini-2.0-flash" | "groq-llama-3.3-70b";

const PROVIDER_CHAIN: ProviderId[] = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "groq-llama-3.3-70b",
];

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

  // 1) Deterministic safety pre-check.
  const verdict = classifyDanger(lastUser.content);
  if (verdict.verdict === "danger") {
    return streamResponse(async (write) => {
      await write({ type: "danger", reason: verdict.reason ?? "hazard detected" });
      await write({ type: "done" });
    });
  }

  // 2) "Talk to a human" intent.
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

  // 3) Main chat turn — try providers in order, fall back on failure.
  const systemPrompt = buildSystemPrompt({ mode: body.mode });
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  if (!geminiKey && !groqKey) {
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

    const stream = await openStreamWithFallback({
      providers: PROVIDER_CHAIN,
      messages: body.messages,
      systemPrompt,
      geminiKey,
      groqKey,
    });

    if (!stream) {
      console.error("[chat] all providers failed");
      await write({
        type: "text",
        delta:
          "I hit a snag on my end. For anything urgent please call (856) 895-9667 — a master electrician will pick up.",
      });
      await write({ type: "done" });
      return;
    }

    try {
      for await (const delta of stream.iterator) {
        if (delta) {
          buffer += delta;
          await flushMarkers(false);
        }
      }
      await flushMarkers(true);
      await write({ type: "done" });
    } catch (err) {
      console.error(`[chat] ${stream.providerId} mid-stream error:`, err);
      // Mid-stream failure — flush what we've got and finish gracefully.
      await flushMarkers(true);
      if (buffer.length === 0) {
        await write({
          type: "text",
          delta:
            "Lost my connection mid-thought. For anything urgent please call (856) 895-9667.",
        });
      }
      await write({ type: "done" });
    }
  });
}

// -- Provider chain -----------------------------------------------------

type StreamHandle = {
  providerId: ProviderId;
  iterator: AsyncIterable<string>;
};

async function openStreamWithFallback(args: {
  providers: ProviderId[];
  messages: ChatMsg[];
  systemPrompt: string;
  geminiKey?: string;
  groqKey?: string;
}): Promise<StreamHandle | null> {
  for (const providerId of args.providers) {
    const isGemini = providerId.startsWith("gemini");
    if (isGemini && !args.geminiKey) continue;
    if (!isGemini && !args.groqKey) continue;

    try {
      const handle = await openStream({
        providerId,
        messages: args.messages,
        systemPrompt: args.systemPrompt,
        geminiKey: args.geminiKey,
        groqKey: args.groqKey,
      });
      // Peek the first chunk — if creation succeeded but the first iteration
      // throws (rate limit, model unavailable), we still want to fall back.
      const peeked = await peekFirstChunk(handle.iterator);
      if (!peeked) continue; // empty stream — try next provider
      return { providerId, iterator: peeked };
    } catch (err) {
      console.error(`[chat] ${providerId} failed to start:`, err);
    }
  }
  return null;
}

/** Reads the first chunk; returns an iterator that yields it then the rest. */
async function peekFirstChunk(iter: AsyncIterable<string>): Promise<AsyncIterable<string> | null> {
  const it = iter[Symbol.asyncIterator]();
  let first: IteratorResult<string>;
  try {
    first = await it.next();
  } catch (err) {
    throw err;
  }
  if (first.done) return null;
  if (!first.value) {
    // Empty first chunk — keep looking for a real one before committing.
    let next: IteratorResult<string>;
    try {
      next = await it.next();
    } catch (err) {
      throw err;
    }
    if (next.done) return null;
    return wrap(next.value, it);
  }
  return wrap(first.value, it);
}

function wrap(first: string, rest: AsyncIterator<string>): AsyncIterable<string> {
  return {
    [Symbol.asyncIterator]() {
      let yieldedFirst = false;
      return {
        async next() {
          if (!yieldedFirst) {
            yieldedFirst = true;
            return { value: first, done: false };
          }
          return rest.next();
        },
      };
    },
  };
}

async function openStream(args: {
  providerId: ProviderId;
  messages: ChatMsg[];
  systemPrompt: string;
  geminiKey?: string;
  groqKey?: string;
}): Promise<{ iterator: AsyncIterable<string> }> {
  if (args.providerId.startsWith("gemini")) {
    return openGeminiStream({
      model: args.providerId,
      apiKey: args.geminiKey!,
      messages: args.messages,
      systemPrompt: args.systemPrompt,
    });
  }
  return openGroqStream({
    apiKey: args.groqKey!,
    messages: args.messages,
    systemPrompt: args.systemPrompt,
  });
}

async function openGeminiStream(args: {
  model: string;
  apiKey: string;
  messages: ChatMsg[];
  systemPrompt: string;
}): Promise<{ iterator: AsyncIterable<string> }> {
  const ai = new GoogleGenAI({ apiKey: args.apiKey });
  const contents = args.messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const stream = await ai.models.generateContentStream({
    model: args.model,
    contents,
    config: {
      systemInstruction: args.systemPrompt,
      temperature: 0.6,
      maxOutputTokens: 600,
    },
  });
  return {
    iterator: {
      async *[Symbol.asyncIterator]() {
        for await (const chunk of stream) {
          const text = chunk.text;
          if (typeof text === "string" && text.length > 0) {
            yield text;
          }
        }
      },
    },
  };
}

async function openGroqStream(args: {
  apiKey: string;
  messages: ChatMsg[];
  systemPrompt: string;
}): Promise<{ iterator: AsyncIterable<string> }> {
  const client = new Groq({ apiKey: args.apiKey });
  const stream = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    stream: true,
    max_tokens: 600,
    temperature: 0.6,
    messages: [
      { role: "system", content: args.systemPrompt },
      ...args.messages.map((m) => ({ role: m.role, content: m.content })),
    ],
  });
  return {
    iterator: {
      async *[Symbol.asyncIterator]() {
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content;
          if (typeof delta === "string" && delta.length > 0) {
            yield delta;
          }
        }
      },
    },
  };
}

// -- Response helper ---------------------------------------------------

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
