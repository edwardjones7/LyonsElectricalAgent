import { Phone, AlertOctagon } from "lucide-react";
import { LYONS } from "@/lib/constants";

export function DangerPanel() {
  return (
    <div className="rounded-2xl border-2 border-[var(--color-emergency-500)] bg-[var(--color-emergency-50)] p-4 shadow-[var(--shadow-emergency)]">
      <div className="flex items-start gap-3">
        <div className="shrink-0 grid place-items-center w-9 h-9 rounded-full bg-[var(--color-emergency-500)] text-white">
          <AlertOctagon className="w-5 h-5" strokeWidth={2.25} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-lg text-[var(--color-emergency-700)] leading-tight">
            Stop. This sounds like an active hazard.
          </div>
          <p className="mt-1.5 text-sm text-[var(--color-ink)] leading-relaxed">
            Don't troubleshoot it yourself. If you can do so safely, turn off the breaker for that
            circuit and step away. A master electrician will pick up — day or night.
          </p>
        </div>
      </div>
      <a
        href={`tel:${LYONS.phoneTel}`}
        className="mt-3 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[var(--color-emergency-500)] hover:bg-[var(--color-emergency-600)] text-white h-12 font-semibold transition-colors"
      >
        <Phone className="w-4 h-4" />
        Call {LYONS.phone}
      </a>
    </div>
  );
}
