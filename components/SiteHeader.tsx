"use client";

import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";
import { LYONS } from "@/lib/constants";
import { WordMark } from "@/components/ui/WordMark";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/team", label: "Team" },
  { href: "/service-area", label: "Coverage" },
  { href: "/resources", label: "Resources" },
  { href: "/reviews", label: "Reviews" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--color-cream)]/85 border-b border-[var(--color-navy-100)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-[88px] flex items-center justify-between gap-6">
        <WordMark />

        <nav className="hidden lg:flex items-center gap-0.5 ml-auto">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative px-3.5 py-2 text-[0.8125rem] font-semibold tracking-wide uppercase text-[var(--color-navy-700)] hover:text-[var(--color-navy-900)] rounded-full transition-colors group"
            >
              <span className="relative z-10">{item.label}</span>
              <span className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-[var(--color-electric-600)] origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`tel:${LYONS.phoneTel}`}
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[var(--color-emergency-500)] hover:bg-[var(--color-emergency-600)] text-white px-4 h-11 text-sm font-semibold shadow-[var(--shadow-emergency)] transition-all hover:-translate-y-0.5"
          >
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-white pulse-dot" />
              <span className="relative rounded-full bg-white w-2 h-2" />
            </span>
            <Phone className="w-4 h-4" />
            <span className="hidden md:inline tabular-nums">{LYONS.phone}</span>
            <span className="md:hidden">Call 24/7</span>
          </a>
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full hover:bg-[var(--color-navy-100)] text-[var(--color-navy-900)] transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 border-t border-[var(--color-navy-100)] bg-[var(--color-cream)]/95 backdrop-blur-md",
          open ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="px-5 sm:px-8 py-4 grid gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="px-3 py-3 text-[0.9375rem] font-semibold uppercase tracking-wide text-[var(--color-navy-800)] hover:bg-[var(--color-navy-100)] hover:text-[var(--color-electric-700)] rounded-lg transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="px-3 py-3 text-[0.9375rem] font-semibold uppercase tracking-wide text-[var(--color-navy-800)] hover:bg-[var(--color-navy-100)] hover:text-[var(--color-electric-700)] rounded-lg transition-colors"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
