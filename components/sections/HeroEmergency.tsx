"use client";

import Link from "next/link";
import { Phone, ArrowRight, Clock, ShieldCheck, MapPin, Quote } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LYONS } from "@/lib/constants";
import { StarsBadge } from "@/components/ui/StarsBadge";
import { BrandImage } from "@/components/ui/BrandImage";
import { heroPanel } from "@/content/images";

export function HeroEmergency() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const orbX1 = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section ref={ref} className="relative bg-[var(--color-navy-900)] text-white overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
      <motion.div
        style={{ y: orbY1, x: orbX1 }}
        className="absolute -top-32 -right-32 w-[40rem] h-[40rem] rounded-full opacity-25 blur-3xl"
      >
        <div
          className="w-full h-full"
          style={{ background: "radial-gradient(circle, var(--color-brass-500), transparent 70%)" }}
        />
      </motion.div>
      <motion.div
        style={{ y: orbY2 }}
        className="absolute -bottom-40 -left-32 w-[36rem] h-[36rem] rounded-full opacity-20 blur-3xl"
      >
        <div
          className="w-full h-full"
          style={{ background: "radial-gradient(circle, var(--color-emergency-500), transparent 70%)" }}
        />
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-12 pb-20 md:pt-16 md:pb-24 lg:pt-20 lg:pb-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <StarsBadge variant="dark" />
            </motion.div>
            <h1 className="mt-6 text-white">
              <RevealHeadline />
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-6 text-lg text-[var(--color-navy-100)] leading-relaxed max-w-xl"
            >
              Family-owned for {LYONS.yearsInBusiness}+ years. {LYONS.hours}. Not an answering
              service. Not a robot. The same people who&rsquo;ve earned {LYONS.googleReviewCount}{" "}
              five-star reviews from your neighbors.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <a
                href={`tel:${LYONS.phoneTel}`}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--color-emergency-500)] hover:bg-[var(--color-emergency-600)] text-white px-6 h-14 font-semibold text-[1.0625rem] shadow-[var(--shadow-emergency)] transition-all hover:-translate-y-0.5"
              >
                <span className="relative flex w-2 h-2">
                  <span className="absolute inset-0 rounded-full bg-white pulse-dot" />
                  <span className="relative rounded-full bg-white w-2 h-2" />
                </span>
                <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Call {LYONS.phone}
              </a>
              <Link
                href="/services"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/20 ring-1 ring-white/30 hover:ring-white text-white px-6 h-14 font-medium transition-all"
              >
                See what we do
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3 text-sm text-[var(--color-navy-200)]"
            >
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--color-brass-300)]" />
                Open 24/7/365
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--color-brass-300)]" />
                Licensed master electricians
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--color-brass-300)]" />
                South NJ · PA · DE
              </li>
            </motion.ul>
          </div>

          <motion.div
            style={{ y: imageY }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] max-h-[min(640px,62vh)]">
              <BrandImage
                photo={heroPanel}
                treatment="duotone"
                priority
                rounded="3xl"
                className="absolute inset-0"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
              {/* Brass corner accent */}
              <div className="absolute -top-3 -left-3 w-20 h-20 rounded-tl-[2.5rem] border-l-2 border-t-2 border-[var(--color-brass-500)]/70 pointer-events-none" />
              <div className="absolute -bottom-3 -right-3 w-20 h-20 rounded-br-[2.5rem] border-r-2 border-b-2 border-[var(--color-brass-500)]/70 pointer-events-none" />

              {/* Floating mission quote overlay */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.9 }}
                className="absolute left-4 right-4 -bottom-8 lg:-bottom-10"
              >
                <div className="rounded-2xl bg-[var(--color-cream)] text-[var(--color-navy-900)] p-5 shadow-[var(--shadow-pop)] ring-1 ring-[var(--color-navy-200)]">
                  <Quote className="w-5 h-5 text-[var(--color-brass-600)] mb-2" />
                  <p className="font-display text-[1.0625rem] leading-snug">
                    &ldquo;{LYONS.mission}&rdquo;
                  </p>
                  <div className="mt-2 text-xs uppercase tracking-wider text-[var(--color-muted)]">
                    Our promise — every call, every time
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const HEADLINE_PARTS = [
  { text: "When the power's out at 2 a.m.,", accent: false },
  { text: "a master electrician", accent: true },
  { text: "picks up the phone.", accent: false },
];

function RevealHeadline() {
  return (
    <motion.span
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
      }}
      className="block"
    >
      {HEADLINE_PARTS.flatMap((part, i) =>
        part.text.split(" ").map((word, j) => (
          <motion.span
            key={`${i}-${j}`}
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] } },
            }}
            className={`inline-block whitespace-pre ${part.accent ? "text-[var(--color-electric-300)]" : "text-white"}`}
          >
            {word}
            {j < part.text.split(" ").length - 1 ? " " : i < HEADLINE_PARTS.length - 1 ? " " : ""}
          </motion.span>
        )),
      )}
    </motion.span>
  );
}
