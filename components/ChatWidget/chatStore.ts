"use client";

import { useSyncExternalStore } from "react";

type ChatState = {
  open: boolean;
};

let state: ChatState = { open: false };
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
  state = { open };
  emit();
}

export function toggleOpen() {
  setOpen(!state.open);
}

export function useChatStore<T>(selector: (s: ChatState & { setOpen: typeof setOpen; toggleOpen: typeof toggleOpen }) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector({ ...state, setOpen, toggleOpen }),
    () => selector({ open: false, setOpen, toggleOpen }),
  );
}
