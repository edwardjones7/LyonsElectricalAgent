"use client";

import { Phone, MessageSquareText } from "lucide-react";
import { LYONS } from "@/lib/constants";
import { useChatStore } from "@/components/ChatWidget/chatStore";

export function CallNowBar() {
  const open = useChatStore((s) => s.open);
  const setOpen = useChatStore((s) => s.setOpen);
  return (
    <div
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-[var(--color-cream)]/95 backdrop-blur-md border-t border-[var(--color-navy-200)] shadow-[0_-8px_24px_rgba(11,31,58,0.08)]"
      role="navigation"
      aria-label="Primary contact"
    >
      <div className="px-3 py-2.5 flex gap-2 [padding-bottom:calc(env(safe-area-inset-bottom)+10px)]">
        <a
          href={`tel:${LYONS.phoneTel}`}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-emergency-500)] hover:bg-[var(--color-emergency-600)] text-white h-12 font-semibold shadow-[var(--shadow-emergency)] transition-colors"
        >
          <Phone className="w-4 h-4" />
          Call 24/7
        </a>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-navy-900)] hover:bg-[var(--color-navy-800)] text-white h-12 font-semibold shadow-[var(--shadow-soft)] transition-colors"
        >
          <MessageSquareText className="w-4 h-4" />
          Chat
        </button>
      </div>
    </div>
  );
}
