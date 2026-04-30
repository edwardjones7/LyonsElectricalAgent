"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquareText, X, Send, Phone, Loader2, BookOpen, CheckCircle2, Mic, MicOff } from "lucide-react";
import Link from "next/link";
import { LYONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useChatStore } from "./chatStore";
import { DangerPanel } from "./DangerPanel";
import { AllieAvatar } from "./AllieAvatar";
import { TypingRow } from "./TypingRow";
import { VoiceControls } from "./VoiceControls";
import { useVoiceSession } from "./useVoiceSession";
import type { ChatMessage, StreamEvent } from "./types";
import { findResource } from "@/content/resources";

const QUICK_REPLIES = [
  "My power just went out",
  "I want to get a panel quote",
  "Do you cover my town?",
  "Put me through to a real person",
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function ChatWidget() {
  const open = useChatStore((s) => s.open);
  const setOpen = useChatStore((s) => s.setOpen);
  const voiceMode = useChatStore((s) => s.voiceMode);
  const setVoiceMode = useChatStore((s) => s.setVoiceMode);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [streaming, setStreaming] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const abortRef = React.useRef<AbortController | null>(null);

  // Refs let closures read live values without re-binding on every change.
  const voiceModeRef = React.useRef(voiceMode);
  React.useEffect(() => {
    voiceModeRef.current = voiceMode;
  }, [voiceMode]);

  const sendRef = React.useRef<((text: string) => Promise<void>) | null>(null);

  const handleUtterance = React.useCallback((text: string) => {
    void sendRef.current?.(text);
  }, []);

  const voice = useVoiceSession({ onUtterance: handleUtterance });

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = React.useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    const userMsg: ChatMessage = { id: uid(), role: "user", content: trimmed };
    const assistantId = uid();
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      state: "streaming",
    };

    setInput("");
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setStreaming(true);

    const isVoice = voiceModeRef.current;
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode: isVoice ? "voice" : "text",
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error("Chat request failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          let evt: StreamEvent;
          try {
            evt = JSON.parse(line);
          } catch {
            continue;
          }
          applyEvent(assistantId, evt, setMessages);

          if (isVoice) {
            if (evt.type === "text") {
              voice.speakStream(evt.delta);
            } else if (evt.type === "done") {
              voice.flushSpeech();
            } else if (evt.type === "call_cta" || evt.type === "escalate" || evt.type === "danger") {
              // Markers that hand off to the dialer — stop talking and exit
              // voice so the user sees the call UI uninterrupted.
              voice.cancelSpeech();
              voice.stop();
              setVoiceMode(false);
            }
          }
        }
      }
    } catch (err) {
      if ((err as { name?: string }).name === "AbortError") {
        // user closed/cancelled
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                ...m,
                content:
                  m.content ||
                  `Sorry — having trouble connecting. For anything urgent, please call ${LYONS.phone}.`,
                state: "done",
              }
              : m,
          ),
        );
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [messages, streaming, voice, setVoiceMode]);

  React.useEffect(() => {
    sendRef.current = send;
  }, [send]);

  // When voice mode toggles on, start listening and ensure chat is open.
  // When it toggles off, stop listening and silence any active TTS.
  React.useEffect(() => {
    if (voiceMode) {
      if (!open) setOpen(true);
      voice.start();
    } else {
      voice.stop();
      voice.cancelSpeech();
    }
  }, [voiceMode, voice, open, setOpen]);

  // Closing the chat also exits voice mode.
  React.useEffect(() => {
    if (!open && voiceMode) setVoiceMode(false);
  }, [open, voiceMode, setVoiceMode]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  return (
    <>
      {/* Floating launcher (desktop) */}
      <motion.button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close chat" : "Open chat with Allie at Lyons"}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        className={cn(
          "hidden lg:inline-flex fixed bottom-6 right-6 z-50 items-center gap-2.5 rounded-full bg-[var(--color-navy-900)] hover:bg-[var(--color-navy-800)] text-white px-5 h-14 shadow-[var(--shadow-pop)] transition-colors",
          !open && "ambient-pulse",
        )}
      >
        <span className="relative grid place-items-center w-6 h-6">
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="absolute inset-0 grid place-items-center"
              >
                <X className="w-5 h-5" />
              </motion.span>
            ) : (
              <motion.span
                key="msg"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="absolute inset-0 grid place-items-center"
              >
                <MessageSquareText className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        <span className="font-medium">{open ? "Close chat" : "Message Allie"}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.4, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 12 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 28,
              mass: 0.7,
            }}
            style={{ transformOrigin: "bottom right" }}
            className={cn(
              "fixed z-[60] bg-[var(--color-cream)] flex flex-col overflow-hidden",
              // Desktop: floating panel anchored just above the launcher
              "lg:left-auto lg:top-auto lg:bottom-24 lg:right-6 lg:w-[400px] lg:h-[600px] lg:rounded-3xl lg:shadow-[var(--shadow-pop)] lg:border lg:border-[var(--color-navy-200)]",
              // Mobile: full sheet from bottom, sit above the call/chat bar
              "inset-x-0 bottom-0 top-16 rounded-t-3xl shadow-[0_-12px_48px_rgba(11,31,58,0.24)]",
            )}
          >
            {/* Tail/pointer connecting the panel to the launcher button — desktop only */}
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.2 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              aria-hidden
              className="hidden lg:block absolute -bottom-2 right-12 w-4 h-4 rotate-45 bg-[var(--color-cream)] border-r border-b border-[var(--color-navy-200)] z-[-1]"
            />
            {/* Header — Allie identity */}
            <div className="bg-[var(--color-navy-900)] text-white px-4 py-3.5 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <AllieAvatar size="md" />
                <div className="min-w-0">
                  <div className="font-industrial text-base font-extrabold tracking-tight uppercase leading-none">
                    Allie
                  </div>
                  <div className="text-[0.7rem] text-[var(--color-navy-200)] mt-1.5 leading-none">
                    Responds in seconds.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {voice.supported && (
                  <button
                    type="button"
                    onClick={() => setVoiceMode(!voiceMode)}
                    className={cn(
                      "grid place-items-center w-9 h-9 rounded-full transition-colors",
                      voiceMode
                        ? "bg-[var(--color-electric-500)] hover:bg-[var(--color-electric-400)] text-white"
                        : "hover:bg-white/10 text-white",
                    )}
                    aria-label={voiceMode ? "Turn off voice mode" : "Talk to Allie out loud"}
                    title={voiceMode ? "Turn off voice mode" : "Talk to Allie out loud"}
                  >
                    {voiceMode ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid place-items-center w-9 h-9 rounded-full hover:bg-white/10"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Persistent call-now strip — handoff is always one tap */}
            <a
              href={`tel:${LYONS.phoneTel}`}
              className="flex items-center justify-between gap-3 bg-[var(--color-emergency-500)] hover:bg-[var(--color-emergency-600)] text-white px-4 py-2.5 transition-colors shrink-0"
            >
              <div className="flex items-center gap-2.5">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inset-0 rounded-full bg-white pulse-dot" />
                  <span className="relative rounded-full bg-white w-2 h-2" />
                </span>
                <span className="text-sm font-semibold">Need a real master electrician? Tap to call</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                <Phone className="w-4 h-4" />
                {LYONS.phone}
              </span>
            </a>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
              {messages.length === 0 && <Greeting />}
              {renderMessageList(messages)}
              {messages.length === 0 && (
                <div className="pt-2 grid gap-2">
                  <div className="text-xs uppercase tracking-wider text-[var(--color-muted)] font-semibold">
                    Or pick one
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_REPLIES.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => void send(q)}
                        className="text-sm px-3.5 py-2 rounded-full bg-white border border-[var(--color-navy-200)] hover:border-[var(--color-electric-600)] hover:text-[var(--color-electric-700)] text-[var(--color-navy-800)] transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {voiceMode ? (
              <VoiceControls
                listening={voice.listening}
                speaking={voice.speaking}
                interimTranscript={voice.interimTranscript}
                onToggleListen={() => (voice.listening ? voice.stop() : voice.start())}
                onExitVoice={() => setVoiceMode(false)}
              />
            ) : (
              <form
                onSubmit={onSubmit}
                className="border-t border-[var(--color-navy-200)] bg-white p-3 [padding-bottom:calc(env(safe-area-inset-bottom)+12px)] shrink-0"
              >
                <div className="flex items-end gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void send(input);
                      }
                    }}
                    rows={1}
                    placeholder="Tell me what's going on…"
                    className="flex-1 resize-none rounded-2xl border border-[var(--color-navy-200)] focus:border-[var(--color-electric-600)] focus:ring-2 focus:ring-[var(--color-electric-200)] outline-none px-3.5 py-2.5 text-[0.9375rem] text-[var(--color-ink)] placeholder:text-[var(--color-muted)] max-h-32"
                  />
                  <button
                    type="submit"
                    disabled={streaming || !input.trim()}
                    aria-label="Send message"
                    className="grid place-items-center w-11 h-11 rounded-full bg-[var(--color-electric-600)] hover:bg-[var(--color-electric-700)] text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    {streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function renderMessageList(messages: ChatMessage[]) {
  return messages.map((m, i) => {
    const prev = messages[i - 1];
    const isFirstInGroup = !prev || prev.role !== m.role;
    return <MessageBubble key={m.id} message={m} isFirstInGroup={isFirstInGroup} />;
  });
}

function Greeting() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3"
    >
      <div className="flex items-end gap-2 max-w-[92%]">
        <AllieAvatar size="sm" />
        <div className="bg-white border border-[var(--color-navy-200)] rounded-2xl rounded-bl-md px-4 py-3 flex-1">
          <div className="font-display text-[1.0625rem] text-[var(--color-navy-900)] leading-snug">
            Hey — Allie here.
          </div>
          <p className="text-sm text-[var(--color-ink-soft)] mt-1.5 leading-relaxed">
            I&rsquo;m on 24/7 as the chat assistant for Lyons. I can help with quotes, schedules, our service area, and the basic stuff. If anything&rsquo;s urgent — sparks, smoke, water near electrical — tap call up top and one of our master electricians picks up before the second ring.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function MessageBubble({
  message,
  isFirstInGroup,
}: {
  message: ChatMessage;
  isFirstInGroup: boolean;
}) {
  if (message.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex justify-end"
      >
        <div className="bg-[var(--color-navy-900)] text-white rounded-2xl rounded-br-md px-3.5 py-2.5 max-w-[88%]">
          <p className="text-[0.9375rem] leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </motion.div>
    );
  }

  if (message.state === "danger") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <DangerPanel />
      </motion.div>
    );
  }

  // Assistant message — but if it's still streaming with no content yet, show
  // the "Allie's typing…" row instead of an empty bubble. As soon as a delta
  // arrives, swap to the proper bubble.
  if (message.state === "streaming" && message.content.length === 0) {
    return <TypingRow />;
  }

  const resource = message.resourceSlug ? findResource(message.resourceSlug) : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-2"
    >
      <div className="flex items-end gap-2 max-w-[92%]">
        {isFirstInGroup ? (
          <AllieAvatar size="sm" />
        ) : (
          <span className="w-7 shrink-0" aria-hidden />
        )}
        <div className="flex-1 min-w-0">
          {isFirstInGroup && (
            <div className="text-[0.7rem] uppercase tracking-wider text-[var(--color-muted)] mb-1 ml-1 font-semibold">
              Allie
            </div>
          )}
          <div className="bg-white border border-[var(--color-navy-200)] rounded-2xl rounded-bl-md px-4 py-3">
            <p className="text-[0.9375rem] leading-relaxed whitespace-pre-wrap text-[var(--color-ink)]">
              {message.content}
              {message.state === "streaming" && <TypingDot />}
            </p>
          </div>
        </div>
      </div>
      {resource && (
        <div className="ml-9">
          <Link
            href={`/resources/${resource.slug}`}
            className="flex items-start gap-3 max-w-[88%] bg-[var(--color-cream-100)] hover:bg-white border border-[var(--color-navy-200)] hover:border-[var(--color-electric-600)] rounded-2xl px-4 py-3 transition-colors"
          >
            <BookOpen className="w-4 h-4 mt-0.5 shrink-0 text-[var(--color-electric-700)]" />
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-wider text-[var(--color-muted)]">From our resources</div>
              <div className="text-[0.9375rem] font-medium text-[var(--color-navy-900)] mt-0.5 leading-snug">
                {resource.title}
              </div>
              <div className="text-xs text-[var(--color-muted)] mt-0.5">{resource.readMinutes}-min read</div>
            </div>
          </Link>
        </div>
      )}
      {message.callbackConfirmed && (
        <div className="ml-9 flex items-start gap-3 max-w-[88%] bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-700" />
          <div className="text-sm text-emerald-900">
            Got it — we&rsquo;ll call you back shortly. For anything urgent in the meantime, ring{" "}
            <a className="underline" href={`tel:${LYONS.phoneTel}`}>{LYONS.phone}</a>.
          </div>
        </div>
      )}
      {message.callCta && (
        <div className="ml-9">
          <a
            href={`tel:${LYONS.phoneTel}`}
            className="inline-flex items-center gap-2.5 max-w-[88%] bg-white hover:bg-[var(--color-cream-100)] border border-[var(--color-navy-200)] hover:border-[var(--color-electric-600)] rounded-full pl-4 pr-5 py-2.5 transition-colors group"
          >
            <span className="grid place-items-center w-7 h-7 rounded-full bg-[var(--color-electric-600)] group-hover:bg-[var(--color-electric-700)] text-white shrink-0 transition-colors">
              <Phone className="w-3.5 h-3.5" />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.7rem] uppercase tracking-wider text-[var(--color-muted)] leading-none mb-0.5">Tap to call</span>
              <span className="block text-[0.9375rem] font-semibold text-[var(--color-navy-900)] leading-none">{LYONS.phone}</span>
            </span>
          </a>
        </div>
      )}
    </motion.div>
  );
}

function TypingDot() {
  return (
    <span className="inline-flex items-center gap-0.5 ml-1 align-middle">
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-electric-400)] animate-pulse" />
    </span>
  );
}

function applyEvent(
  assistantId: string,
  evt: StreamEvent,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
) {
  setMessages((prev) =>
    prev.map((m) => {
      if (m.id !== assistantId) return m;
      switch (evt.type) {
        case "text":
          return { ...m, content: m.content + evt.delta };
        case "danger":
          return { ...m, state: "danger", content: "" };
        case "resource":
          return { ...m, resourceSlug: evt.slug };
        case "callback":
          return { ...m, callbackConfirmed: true };
        case "call_cta":
          return { ...m, callCta: true };
        case "escalate":
          return { ...m, state: "danger" };
        case "done":
          return { ...m, state: m.state === "danger" ? "danger" : "done" };
        case "error":
          return {
            ...m,
            state: "done",
            content: m.content || `Sorry — something went wrong. For anything urgent please call ${LYONS.phone}.`,
          };
        default:
          return m;
      }
    }),
  );
}
