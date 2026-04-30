"use client";

import { useSyncExternalStore } from "react";

type ChatState = {
  open: boolean;
  voiceMode: boolean;
};

let state: ChatState = { open: false, voiceMode: false };
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function setOpen(open: boolean) {
  if (state.open === open) return;
  state = { ...state, open };
  emit();
}

export function toggleOpen() {
  setOpen(!state.open);
}

export function setVoiceMode(voiceMode: boolean) {
  if (state.voiceMode === voiceMode) return;
  state = { ...state, voiceMode };
  emit();
}

export function toggleVoiceMode() {
  setVoiceMode(!state.voiceMode);
}

type StoreApi = ChatState & {
  setOpen: typeof setOpen;
  toggleOpen: typeof toggleOpen;
  setVoiceMode: typeof setVoiceMode;
  toggleVoiceMode: typeof toggleVoiceMode;
};

export function useChatStore<T>(selector: (s: StoreApi) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector({ ...state, setOpen, toggleOpen, setVoiceMode, toggleVoiceMode }),
    () =>
      selector({
        open: false,
        voiceMode: false,
        setOpen,
        toggleOpen,
        setVoiceMode,
        toggleVoiceMode,
      }),
  );
}
