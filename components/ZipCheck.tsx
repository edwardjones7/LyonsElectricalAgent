"use client";

import { useState, useTransition } from "react";
import { Search, CheckCircle2, AlertCircle, Phone } from "lucide-react";
import { checkCity } from "@/content/serviceArea";
import { LYONS } from "@/lib/constants";

type Result = ReturnType<typeof checkCity> | null;

export function ZipCheck() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    startTransition(() => {
      setResult(checkCity(q));
    });
  };

  return (
    <div className="max-w-xl">
      <form onSubmit={onSubmit} className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 rounded-full bg-white ring-1 ring-[var(--color-navy-200)] focus-within:ring-2 focus-within:ring-[var(--color-navy-700)] px-4 h-12">
          <Search className="w-4 h-4 text-[var(--color-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your town"
            className="flex-1 bg-transparent outline-none text-[var(--color-ink)] placeholder:text-[var(--color-muted)]"
            aria-label="Your town"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-[var(--color-navy-900)] hover:bg-[var(--color-navy-800)] text-white px-5 h-12 font-semibold transition-colors"
        >
          Check
        </button>
      </form>
      {result && <ResultPanel result={result} />}
    </div>
  );
}

function ResultPanel({ result }: { result: NonNullable<Result> }) {
  if (result.covered && result.city) {
    return (
      <div className="mt-4 rounded-2xl bg-emerald-50 ring-1 ring-emerald-200 p-4 flex gap-3">
        <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-emerald-700" />
        <div className="text-sm text-emerald-900">
          Yes — we serve <strong>{result.city.name}, {result.city.state}</strong>. Call us and we&rsquo;ll
          have someone out as soon as you need them.
        </div>
      </div>
    );
  }
  return (
    <div className="mt-4 rounded-2xl bg-[var(--color-cream-100)] ring-1 ring-[var(--color-brass-200)] p-4 flex gap-3">
      <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-[var(--color-brass-700)]" />
      <div className="text-sm text-[var(--color-navy-900)]">
        We&rsquo;re not sure that&rsquo;s on our regular route
        {result.closest ? `, but we cover ${result.closest.name}, ${result.closest.state} nearby` : ""}.
        Call <a className="underline font-semibold" href={`tel:${LYONS.phoneTel}`}>{LYONS.phone}</a> — the team can confirm in 30 seconds.
      </div>
    </div>
  );
}
