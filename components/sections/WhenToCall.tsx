"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertOctagon, CalendarClock, PhoneCall, ArrowRight } from "lucide-react";
import { LYONS } from "@/lib/constants";
import { BrandImage } from "@/components/ui/BrandImage";
import { Reveal } from "@/components/ui/Reveal";
import { serviceImages } from "@/content/images";

export function WhenToCall() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-electric-600)] font-bold">
            How to use us
          </div>
          <h2 className="mt-3 text-[var(--color-navy-900)]">Three ways to call Lyons.</h2>
          <p className="mt-4 text-lg text-[var(--color-ink-soft)] max-w-xl leading-relaxed">
            Some of our best calls end without a truck rolling. Whatever the situation, you reach a
            master electrician — not a dispatcher.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-12 lg:grid-rows-[auto_auto] auto-rows-[minmax(0,1fr)]">
          {/* Featured emergency tile — spans 2 rows */}
          <Reveal direction="left" className="lg:col-span-7 lg:row-span-2 group">
            <a
              href={`tel:${LYONS.phoneTel}`}
              className="relative block h-full min-h-[420px] rounded-[2rem] overflow-hidden ring-1 ring-[var(--color-emergency-500)]/30 hover:ring-[var(--color-emergency-500)] transition-all"
            >
              <BrandImage
                photo={serviceImages.emergency}
                treatment="duotone"
                rounded="none"
                className="absolute inset-0"
                sizes="(min-width: 1024px) 60vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-950)]/95 via-[var(--color-navy-900)]/65 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-7 lg:p-10 text-white">
                <div className="grid place-items-center w-14 h-14 rounded-2xl bg-[var(--color-emergency-500)] text-white shadow-[var(--shadow-emergency)]">
                  <AlertOctagon className="w-7 h-7" />
                </div>
                <h3 className="mt-5 text-white max-w-md">It&rsquo;s an emergency.</h3>
                <p className="mt-3 text-[var(--color-navy-100)] max-w-md leading-relaxed">
                  Sparks, burning smell, water near electrical, panel acting up. We pick up — call now and
                  a master electrician will tell you exactly what to do.
                </p>
                <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-emergency-500)] group-hover:bg-[var(--color-emergency-600)] px-5 h-12 font-semibold w-fit transition-colors shadow-[var(--shadow-emergency)]">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inset-0 rounded-full bg-white pulse-dot" />
                    <span className="relative rounded-full bg-white w-2 h-2" />
                  </span>
                  Call {LYONS.phone}
                </span>
              </div>
            </a>
          </Reveal>

          <Reveal direction="right" delay={0.1} className="lg:col-span-5">
            <CompactCard
              icon={<PhoneCall className="w-6 h-6" />}
              tone="brass"
              title="You're not sure if it's urgent."
              blurb="Free phone consultations, day or night. Half the time we tell people they don't need a service call — and we mean it."
              cta="Talk it through"
              href={`tel:${LYONS.phoneTel}`}
            />
          </Reveal>

          <Reveal direction="right" delay={0.2} className="lg:col-span-5">
            <CompactCard
              icon={<CalendarClock className="w-6 h-6" />}
              tone="navy"
              title="You want a quote."
              blurb="Panel upgrade, EV charger, whole-house rewire. Tell us what you need and an estimator will follow up — usually same day."
              cta="Get a callback"
              href="/contact"
            />
          </Reveal>
        </div>

        <p className="mt-12 text-sm text-[var(--color-muted)]">
          Or chat with our AI assistant — it can answer the basics and connect you to a human in
          one tap. Look for the chat button in the corner.
        </p>
      </div>
    </section>
  );
}

function CompactCard({
  icon,
  tone,
  title,
  blurb,
  cta,
  href,
}: {
  icon: React.ReactNode;
  tone: "brass" | "navy";
  title: string;
  blurb: string;
  cta: string;
  href: string;
}) {
  const styles = {
    brass: {
      ring: "ring-[var(--color-brass-500)]/40 hover:ring-[var(--color-brass-600)]",
      icon: "bg-[var(--color-brass-50)] text-[var(--color-brass-700)]",
      cta: "text-[var(--color-brass-700)] group-hover:text-[var(--color-brass-600)]",
    },
    navy: {
      ring: "ring-[var(--color-navy-300)] hover:ring-[var(--color-navy-700)]",
      icon: "bg-[var(--color-navy-100)] text-[var(--color-navy-700)]",
      cta: "text-[var(--color-navy-800)] group-hover:text-[var(--color-navy-700)]",
    },
  }[tone];

  const isExternal = href.startsWith("tel:");
  const className = `group relative h-full block rounded-3xl bg-white p-6 lg:p-7 ring-1 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)] ${styles.ring}`;
  const inner = (
    <>
      <div className="flex items-start gap-4">
        <div className={`grid place-items-center w-12 h-12 rounded-2xl shrink-0 ${styles.icon}`}>{icon}</div>
        <h3 className="text-[var(--color-navy-900)] leading-snug">{title}</h3>
      </div>
      <p className="mt-4 text-[0.9375rem] text-[var(--color-ink-soft)] leading-relaxed">{blurb}</p>
      <div className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${styles.cta}`}>
        {cta}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </>
  );

  if (isExternal) {
    return (
      <a href={href} className={className}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
