"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { stripMarkers } from "@/lib/chatbot/stripMarkers";

/**
 * Web Speech API wrapper. Free voice IO using only browser-built-in
 * SpeechRecognition + SpeechSynthesis. No server cost, no SDK.
 *
 * Supported in Chrome / Edge / Safari (desktop + mobile). Firefox desktop has
 * SpeechSynthesis but no SpeechRecognition — we report supported: false.
 *
 * Listening behavior: continuous + interim results. We treat a 1.2s pause as
 * "user finished a sentence" and fire onUtterance(text). The widget routes
 * that text through the existing send() pipeline.
 *
 * Speaking behavior: chunk by sentence boundary so TTS can start before the
 * LLM finishes streaming. Markers are stripped before speech.
 */

type RecognitionLike = {
  start: () => void;
  stop: () => void;
  abort: () => void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string };
  }>;
};

type WindowWithSpeech = Window & {
  SpeechRecognition?: { new (): RecognitionLike };
  webkitSpeechRecognition?: { new (): RecognitionLike };
};

const SILENCE_MS = 1200;

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const en = voices.filter((v) => /^en[-_]/i.test(v.lang));
  const preferred = [
    "Samantha",
    "Karen",
    "Google US English",
    "Microsoft Aria Online (Natural) - English (United States)",
    "Microsoft Jenny Online (Natural) - English (United States)",
    "Microsoft Zira",
  ];
  for (const name of preferred) {
    const found = en.find((v) => v.name === name);
    if (found) return found;
  }
  const female = en.find((v) => /female|samantha|karen|aria|jenny|zira|google us/i.test(v.name));
  return female ?? en[0] ?? voices[0] ?? null;
}

export type UseVoiceSession = {
  supported: boolean;
  listening: boolean;
  speaking: boolean;
  interimTranscript: string;
  start: () => void;
  stop: () => void;
  speakStream: (delta: string) => void;
  flushSpeech: () => void;
  cancelSpeech: () => void;
};

export function useVoiceSession({
  onUtterance,
}: {
  onUtterance: (text: string) => void;
}): UseVoiceSession {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");

  const recognitionRef = useRef<RecognitionLike | null>(null);
  const finalBufferRef = useRef("");
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wantListeningRef = useRef(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const speechBufferRef = useRef("");
  const onUtteranceRef = useRef(onUtterance);

  useEffect(() => {
    onUtteranceRef.current = onUtterance;
  }, [onUtterance]);

  // Detect support + warm up the voice list (browsers populate it asynchronously)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as WindowWithSpeech;
    const ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    const hasTTS = "speechSynthesis" in window;
    const ok = Boolean(ctor && hasTTS);
    setSupported(ok);
    if (!ok) return;

    const refreshVoice = () => {
      voiceRef.current = pickVoice();
    };
    refreshVoice();
    window.speechSynthesis.addEventListener("voiceschanged", refreshVoice);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", refreshVoice);
    };
  }, []);

  const fireUtterance = useCallback(() => {
    const text = finalBufferRef.current.trim();
    finalBufferRef.current = "";
    setInterimTranscript("");
    if (text) onUtteranceRef.current(text);
  }, []);

  const armSilence = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(fireUtterance, SILENCE_MS);
  }, [fireUtterance]);

  const start = useCallback(() => {
    if (!supported) return;
    if (recognitionRef.current) return;
    const w = window as WindowWithSpeech;
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) return;

    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (e: SpeechRecognitionEventLike) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i += 1) {
        const r = e.results[i];
        if (r.isFinal) {
          finalBufferRef.current += (finalBufferRef.current ? " " : "") + r[0].transcript.trim();
        } else {
          interim += r[0].transcript;
        }
      }
      setInterimTranscript((finalBufferRef.current + " " + interim).trim());
      armSilence();
    };

    rec.onerror = (event) => {
      // "no-speech" / "aborted" are normal — recovery is handled by onend.
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        wantListeningRef.current = false;
        setListening(false);
      }
    };

    rec.onend = () => {
      // Auto-restart if the user is still in voice mode (Chrome ends sessions
      // periodically on its own).
      if (wantListeningRef.current && recognitionRef.current === rec) {
        try {
          rec.start();
        } catch {
          // already started — ignore
        }
      } else {
        setListening(false);
      }
    };

    wantListeningRef.current = true;
    recognitionRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      // permission already pending or blocked
    }
  }, [supported, armSilence]);

  const stop = useCallback(() => {
    wantListeningRef.current = false;
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    const rec = recognitionRef.current;
    if (rec) {
      try {
        rec.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    setListening(false);
    setInterimTranscript("");
    finalBufferRef.current = "";
  }, []);

  const speakChunk = useCallback((sentence: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const trimmed = stripMarkers(sentence);
    if (!trimmed) return;
    const utter = new SpeechSynthesisUtterance(trimmed);
    if (voiceRef.current) utter.voice = voiceRef.current;
    utter.rate = 1.05;
    utter.pitch = 1;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => {
      // Only flip speaking off when the queue is fully drained.
      if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
        setSpeaking(false);
      }
    };
    window.speechSynthesis.speak(utter);
  }, []);

  // Buffer streamed text and flush whole sentences as TTS chunks. Reduces
  // perceived latency vs. waiting for the entire response to finish.
  const speakStream = useCallback(
    (delta: string) => {
      speechBufferRef.current += delta;
      const buf = speechBufferRef.current;
      const re = /[^.!?]+[.!?]+["')\]]?\s*/g;
      let lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = re.exec(buf)) !== null) {
        speakChunk(match[0]);
        lastIndex = re.lastIndex;
      }
      speechBufferRef.current = buf.slice(lastIndex);
    },
    [speakChunk],
  );

  const flushSpeech = useCallback(() => {
    const remainder = speechBufferRef.current;
    speechBufferRef.current = "";
    if (remainder.trim()) speakChunk(remainder);
  }, [speakChunk]);

  const cancelSpeech = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    speechBufferRef.current = "";
    setSpeaking(false);
  }, []);

  // Pause listening when the tab is hidden so we don't ghost-listen in the
  // background.
  useEffect(() => {
    if (!supported) return;
    const onVisibility = () => {
      if (document.hidden && wantListeningRef.current) stop();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [supported, stop]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      wantListeningRef.current = false;
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    supported,
    listening,
    speaking,
    interimTranscript,
    start,
    stop,
    speakStream,
    flushSpeech,
    cancelSpeech,
  };
}
