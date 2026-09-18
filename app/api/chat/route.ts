import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from "@google/genai";
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
// Order: best quality first, lighter free-tier variants next, then cross-provider.
// Free Gemini "lite" models have substantially higher daily quotas than full flash,
// so they're our buffer when the prime models hit their RPD ceiling.
type ProviderId =
  | "gemini-2.5-flash"
  | "gemini-2.5-flash-lite"
  | "gemini-2.0-flash-lite"
  | "gemini-1.5-flash"
  | "groq-llama-3.3-70b";

const PROVIDER_CHAIN: ProviderId[] = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
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

    // Tolerant matchers: accept whitespace inside the brackets and underscores
    // in slugs, since model output sometimes drifts from the exact format.
    const ESCALATE_RE = /\[\[\s*ESCALATE\s*\]\]/i;
    const CALL_CTA_RE = /\[\[\s*CALL[_-]?CTA\s*\]\]/i;
    const RESOURCE_RE = /\[\[\s*RESOURCE\s*:\s*([a-z0-9_-]+)\s*\]\]/i;

    const flushMarkers = async (final = false) => {
      const escMatch = buffer.match(ESCALATE_RE);
      if (escMatch && escMatch.index !== undefined) {
        const before = buffer.slice(0, escMatch.index);
        if (before) await write({ type: "text", delta: before });
        buffer = buffer.slice(escMatch.index + escMatch[0].length);
        if (!escalated) {
          escalated = true;
          await write({ type: "escalate" });
        }
      }
      const ctaMatch = buffer.match(CALL_CTA_RE);
      if (ctaMatch && ctaMatch.index !== undefined) {
        const before = buffer.slice(0, ctaMatch.index);
        if (before) await write({ type: "text", delta: before });
        buffer = buffer.slice(ctaMatch.index + ctaMatch[0].length);
        if (!callCtaEmitted) {
          callCtaEmitted = true;
          await write({ type: "call_cta" });
        }
      }
      const resMatch = buffer.match(RESOURCE_RE);
      if (resMatch && resMatch.index !== undefined) {
        const before = buffer.slice(0, resMatch.index);
        if (before) await write({ type: "text", delta: before });
        buffer = buffer.slice(resMatch.index + resMatch[0].length);
        if (!resourceEmitted) {
          resourceEmitted = true;
          await write({ type: "resource", slug: resMatch[1] });
        }
      }
      // Determine how much of the remaining buffer is safe to flush as text.
      // An unclosed `[[...` is held back during streaming (it may complete on
      // the next chunk) and dropped entirely on final flush (model truncated
      // mid-marker — don't leak `[[RESOURCE:foo` to the user as raw text).
      let safe = buffer.length;
      let dropTail = false;

      const lastOpen = buffer.lastIndexOf("[[");
      if (lastOpen !== -1 && buffer.indexOf("]]", lastOpen) === -1) {
        safe = lastOpen;
        dropTail = final;
      } else if (buffer.endsWith("[")) {
        safe = buffer.length - 1;
        dropTail = final;
      }

      if (safe > 0) {
        const out = buffer.slice(0, safe);
        if (out) await write({ type: "text", delta: out });
      }
      if (dropTail) {
        if (buffer.length > safe) {
          console.warn("[chat] dropping truncated marker tail:", buffer.slice(safe));
        }
        buffer = "";
      } else {
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

/** Per-provider time budget to receive the first token. Beyond this we give up
 * and try the next provider. Prevents hangs when an SDK is internally retrying
 * with a long backoff (e.g. Groq's 10-minute retry-after on TPD limits). */
const FIRST_CHUNK_TIMEOUT_MS = 7000;

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
      const peeked = await peekFirstChunkWithTimeout(
        handle.iterator,
        FIRST_CHUNK_TIMEOUT_MS,
      );
      if (!peeked) continue; // empty stream — try next provider
      return { providerId, iterator: peeked };
    } catch (err) {
      console.error(`[chat] ${providerId} failed to start:`, err);
    }
  }
  return null;
}

/** Reads the first chunk under a time budget; returns an iterator that yields
 * the first chunk then the rest. Throws if the budget elapses. */
async function peekFirstChunkWithTimeout(
  iter: AsyncIterable<string>,
  timeoutMs: number,
): Promise<AsyncIterable<string> | null> {
  const it = iter[Symbol.asyncIterator]();

  const peek = (async () => {
    const first = await it.next();
    if (first.done) return null;
    if (!first.value) {
      const next = await it.next();
      if (next.done) return null;
      return wrap(next.value, it);
    }
    return wrap(first.value, it);
  })();

  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(
      () => reject(new Error(`first-chunk timeout after ${timeoutMs}ms`)),
      timeoutMs,
    );
  });

  try {
    return await Promise.race([peek, timeout]);
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  }
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
      maxOutputTokens: 800,
      // Lyons is an electrical-safety chatbot — talking about sparks, hot
      // panels, and downed lines is the whole point. Default Gemini safety
      // filtering on DANGEROUS_CONTENT trips on those topics and truncates
      // mid-stream, leaving the user with half a sentence. Disable that
      // category. Other categories (harassment, hate, sexual) stay on the
      // default to catch real abuse.
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
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
  // maxRetries: 0 — on rate-limit (429) the SDK would otherwise wait through
  // the server-suggested retry-after, which can be many minutes. We'd rather
  // fail fast and let the chain move to the next provider.
  const client = new Groq({ apiKey: args.apiKey, maxRetries: 0 });
  const stream = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    stream: true,
    max_tokens: 800,
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
