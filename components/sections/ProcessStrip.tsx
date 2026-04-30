"use client";

import { motion } from "framer-motion";
import { Phone, Wrench, Sparkles } from "lucide-react";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";

const STEPS = [
  {
    icon: <Phone className="w-6 h-6" />,
    title: "A master electrician picks up.",
    body: "Day, night, weekends, holidays. Arthur or one of our master electricians answers — usually before the second ring.",
  },
  {
    icon: <Wrench className="w-6 h-6" />,
    title: "We figure it out together.",
    body: "We'll ask what's happening, walk you through what to check, and tell you whether it's a turn-the-breaker-off-and-wait situation or a truck-on-the-way situation.",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Real fix, fully cleaned up.",
    body: "When we roll, we roll with permits and master credentials. Site cleaner than we found it. Inspector signs off. Many jobs done in a single visit.",
  },
];

export function ProcessStrip() {
  return (
    <section className="relative py-20 lg:py-28 bg-[var(--color-navy-900)] text-white overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
      <div
        className="absolute -top-32 right-0 w-[40rem] h-[40rem] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-brass-500), transparent 70%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-electric-300)] font-semibold">
            What happens when you call
          </div>
          <h2 className="mt-3 text-white">No phone tree. No dispatcher. No callback in 4-6 hours.</h2>
        </Reveal>

        <div className="relative mt-14">
          {/* Animated connecting line behind the steps — desktop only */}
          <div className="hidden lg:block absolute left-0 right-0 top-[2.75rem] h-px pointer-events-none">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
              style={{ transformOrigin: "left" }}
              className="h-px w-full bg-gradient-to-r from-[var(--color-electric-500)]/0 via-[var(--color-electric-500)]/70 to-[var(--color-electric-500)]/0"
            />
          </div>

          <RevealStagger stagger={0.18} className="grid gap-10 lg:gap-8 lg:grid-cols-3">
            {STEPS.map((s, i) => (
              <RevealItem key={i} direction="up" className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative grid place-items-center w-[5.5rem] h-[5.5rem] rounded-3xl bg-[var(--color-navy-800)] ring-1 ring-white/15 text-[var(--color-electric-300)]">
                    {s.icon}
                    <span className="absolute -top-2 -right-2 grid place-items-center w-7 h-7 rounded-full bg-[var(--color-electric-500)] text-white text-xs font-bold ring-2 ring-[var(--color-navy-900)]">
                      {i + 1}
                    </span>
                  </div>
                </div>
                <h3 className="text-white">{s.title}</h3>
                <p className="mt-3 text-[var(--color-navy-200)] leading-relaxed">{s.body}</p>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </div>
    </section>
  );
}
