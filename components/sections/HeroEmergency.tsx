"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, ArrowRight, Star } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LYONS } from "@/lib/constants";
import { StatCounter } from "@/components/ui/StatCounter";
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
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const established = new Date().getFullYear() - LYONS.yearsInBusiness;

  return (
    <section
      ref={ref}
      className="relative bg-[var(--color-navy-950)] text-white overflow-hidden isolate"
    >
      {/* Full-bleed cinematic hero background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 -z-10"
        aria-hidden
      >
        <Image
          src={heroPanel.src}
          alt={heroPanel.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[60%_center] lg:object-[70%_center]"
        />
      </motion.div>

      {/* Uniform dark overlay so the image reads as atmospheric backdrop everywhere */}
      <div
        className="absolute inset-0 -z-10 bg-[var(--color-navy-950)]/55"
        aria-hidden
      />
      {/* Centered radial darkening — extra contrast directly behind the text block */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 65% 70% at center, var(--color-navy-950) 0%, rgba(6,19,39,0.55) 55%, transparent 90%)",
        }}
        aria-hidden
      />
      {/* Top + bottom vignette to anchor the content and ease the seam to the next section */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--color-navy-950)]/40 via-transparent to-[var(--color-navy-950)]"
        aria-hidden
      />

      <div className="absolute inset-0 bg-grid opacity-[0.08] pointer-events-none" aria-hidden />
      <motion.div
        style={{ y: orbY1, x: orbX1 }}
        className="absolute -top-32 -right-32 w-[40rem] h-[40rem] rounded-full opacity-20 blur-3xl pointer-events-none"
        aria-hidden
      >
        <div
          className="w-full h-full"
          style={{
            background:
              "radial-gradient(circle, var(--color-brass-500), transparent 70%)",
          }}
        />
      </motion.div>
      <motion.div
        style={{ y: orbY2 }}
        className="absolute -bottom-40 -left-32 w-[36rem] h-[36rem] rounded-full opacity-15 blur-3xl pointer-events-none"
        aria-hidden
      >
        <div
          className="w-full h-full"
          style={{
            background:
              "radial-gradient(circle, var(--color-emergency-500), transparent 70%)",
          }}
        />
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-16 pb-28 md:pt-20 md:pb-32 lg:pt-28 lg:pb-36 min-h-[720px] lg:min-h-[820px] flex justify-center">
        {/* Single column — centered horizontally + vertically in the section */}
        <div className="w-full max-w-3xl flex flex-col items-center text-center justify-center">
          {/* Brass eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex items-center gap-3 text-[var(--color-brass-300)]"
          >
            <span className="h-px w-10 bg-[var(--color-brass-500)]" aria-hidden />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
              Master Electricians · Blackwood NJ · Est. {established}
            </span>
            <span className="h-px w-10 bg-[var(--color-brass-500)]" aria-hidden />
          </motion.div>

          {/* Headline */}
          <h1
            className="mt-6 text-white text-[2.5rem] sm:text-[3.25rem] lg:text-[4.5rem] xl:text-[5.25rem] text-balance"
            style={{ lineHeight: 0.92, letterSpacing: "-0.02em" }}
          >
            <RevealHeadline />
          </h1>

          {/* Brass underline — centered */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 1.05, ease: [0.2, 0.8, 0.2, 1] }}
            className="mt-5 h-[3px] w-24 bg-[var(--color-brass-500)] rounded-full"
            aria-hidden
          />

          {/* 5-star inline chip */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.25 }}
            className="mt-6 inline-flex items-center gap-2.5 text-sm text-[var(--color-navy-100)]"
          >
            <span className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-[var(--color-brass-300)] text-[var(--color-brass-300)]"
                  strokeWidth={0}
                />
              ))}
            </span>
            <span className="font-semibold tabular-nums">
              {LYONS.googleRating.toFixed(1)}
            </span>
            <span className="text-[var(--color-navy-300)]">·</span>
            <span className="text-[var(--color-navy-200)]">
              {LYONS.googleReviewCount} Google reviews
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 1.4 }}
            className="mt-5 text-lg sm:text-xl text-[var(--color-navy-100)] leading-relaxed max-w-xl text-balance"
          >
            Family-owned for {LYONS.yearsInBusiness} years. Open 24/7/365. Not
            an answering service. Not a robot. The same people your neighbors
            gave 5 stars.
          </motion.p>

          {/* CTAs — centered */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 1.55 }}
            className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
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
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/20 ring-1 ring-white/30 hover:ring-white text-white px-6 h-14 font-medium transition-all backdrop-blur-sm"
            >
              See what we do
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Stats — centered with brass dividers between */}
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.8 }}
            className="mt-10 flex items-center justify-center gap-x-8 sm:gap-x-12"
          >
            <Stat value={LYONS.yearsInBusiness} suffix="+" label="Years in business" />
            <span className="h-10 w-px bg-[var(--color-brass-500)]/40" aria-hidden />
            <Stat value={LYONS.googleReviewCount} label="5-star reviews" />
            <span className="h-10 w-px bg-[var(--color-brass-500)]/40" aria-hidden />
            <Stat raw="24/7" label="Phone answered" />
          </motion.dl>
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  raw,
  suffix,
  label,
}: {
  value?: number;
  raw?: string;
  suffix?: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="font-industrial text-[2rem] sm:text-4xl text-[var(--color-brass-300)] tabular-nums leading-none">
        {raw !== undefined ? raw : <StatCounter to={value!} suffix={suffix} />}
      </span>
      <span className="mt-2 text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-navy-200)] font-semibold leading-tight">
        {label}
      </span>
    </div>
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
        show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } },
      }}
      className="block"
    >
      {HEADLINE_PARTS.flatMap((part, i) =>
        part.text.split(" ").map((word, j) => (
          <motion.span
            key={`${i}-${j}`}
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] },
              },
            }}
            className={`inline-block whitespace-pre ${part.accent
                ? "text-[var(--color-electric-300)]"
                : "text-white"
              }`}
          >
            {word}
            {j < part.text.split(" ").length - 1
              ? " "
              : i < HEADLINE_PARTS.length - 1
                ? " "
                : ""}
          </motion.span>
        )),
      )}
    </motion.span>
  );
}
