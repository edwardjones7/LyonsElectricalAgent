"use client";

import { motion } from "framer-motion";
import { Mic, MicOff, Volume2, Type as TypeIcon } from "lucide-react";

export function VoiceControls({
  listening,
  speaking,
  interimTranscript,
  onToggleListen,
  onExitVoice,
}: {
  listening: boolean;
  speaking: boolean;
  interimTranscript: string;
  onToggleListen: () => void;
  onExitVoice: () => void;
}) {
  const status = speaking ? "Allie is talking..." : listening ? "Listening..." : "Tap the mic to talk";

  return (
    <div className="border-t border-[var(--color-navy-200)] bg-[var(--color-cream)] px-4 py-5 flex flex-col items-center gap-3 shrink-0">
      <button
        type="button"
        onClick={onToggleListen}
        aria-label={listening ? "Stop listening" : "Start listening"}
        className="relative grid place-items-center w-16 h-16 rounded-full bg-[var(--color-navy-900)] hover:bg-[var(--color-navy-800)] text-white shadow-[var(--shadow-pop)] transition-colors"
      >
        {listening && (
          <>
            <motion.span
              className="absolute inset-0 rounded-full bg-[var(--color-electric-500)] opacity-30"
              animate={{ scale: [1, 1.45, 1], opacity: [0.35, 0, 0.35] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
              aria-hidden
            />
            <motion.span
              className="absolute inset-0 rounded-full bg-[var(--color-electric-500)] opacity-30"
              animate={{ scale: [1, 1.45, 1], opacity: [0.35, 0, 0.35] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
              aria-hidden
            />
          </>
        )}
        {speaking ? (
          <Volume2 className="w-7 h-7 relative" />
        ) : listening ? (
          <Mic className="w-7 h-7 relative" />
        ) : (
          <MicOff className="w-7 h-7 relative" />
        )}
      </button>

      <div className="text-xs uppercase tracking-wider text-[var(--color-navy-700)] font-semibold">
        {status}
      </div>

      <div className="min-h-[2.25rem] w-full text-center text-sm text-[var(--color-ink-soft)] italic px-2">
        {interimTranscript ? `"${interimTranscript}"` : "Try: “What does a panel upgrade cost?”"}
      </div>

      <button
        type="button"
        onClick={onExitVoice}
        className="text-xs text-[var(--color-navy-600)] hover:text-[var(--color-navy-900)] underline-offset-4 hover:underline inline-flex items-center gap-1.5 transition-colors"
      >
        <TypeIcon className="w-3.5 h-3.5" />
        Switch back to typing
      </button>
    </div>
  );
}
