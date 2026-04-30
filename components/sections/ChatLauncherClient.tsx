"use client";

import { MessageSquareText } from "lucide-react";
import { useChatStore } from "@/components/ChatWidget/chatStore";

export function ChatLauncherClient() {
  const setOpen = useChatStore((s) => s.setOpen);
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="inline-flex items-center justify-center gap-2.5 rounded-full bg-white/10 hover:bg-white/20 ring-1 ring-white/30 hover:ring-white text-white px-7 h-14 font-medium text-[1.0625rem] transition-all"
    >
      <MessageSquareText className="w-4 h-4" />
      Or chat with us
    </button>
  );
}
