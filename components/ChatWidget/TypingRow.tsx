"use client";

import { motion } from "framer-motion";
import { AllieAvatar } from "./AllieAvatar";

export function TypingRow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-end gap-2 max-w-[88%]"
    >
      <AllieAvatar size="sm" />
      <div className="bg-white border border-[var(--color-navy-200)] rounded-2xl rounded-bl-md px-4 py-3 inline-flex items-center gap-2">
        <span className="text-xs text-[var(--color-muted)]">Allie&rsquo;s typing</span>
        <span className="flex items-end gap-1 h-3">
          <Dot delay={0} />
          <Dot delay={0.15} />
          <Dot delay={0.3} />
        </span>
      </div>
    </motion.div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.9, repeat: Infinity, delay, ease: "easeInOut" }}
      className="block w-1.5 h-1.5 rounded-full bg-[var(--color-electric-600)]"
    />
  );
}
