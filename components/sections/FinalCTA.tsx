"use client";

import { Phone } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LYONS } from "@/lib/constants";
import { ChatLauncherClient } from "./ChatLauncherClient";

export function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 0.9]);

  return (
    <section ref={ref} className="relative py-24 lg:py-32 bg-[var(--color-navy-950)] text-white overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />
      <motion.div
        style={{ y: glowY, scale: glowScale }}
        className="absolute inset-0 opacity-40"
        aria-hidden
      >
        <div
          className="absolute inset-x-0 bottom-0 h-2/3"
          style={{
            background:
              "radial-gradient(60% 80% at 50% 100%, rgba(201, 162, 74, 0.5), transparent 70%)",
          }}
        />
      </motion.div>
      {/* Brass radial pulse behind the buttons */}
      <div className="absolute left-1/2 bottom-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none" aria-hidden>
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full rounded-full"
          style={{ background: "radial-gradient(circle, var(--color-brass-500), transparent 60%)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto max-w-4xl px-5 sm:px-8 text-center"
      >
        <h2 className="text-white">Whenever you need us, someone&rsquo;s on the line.</h2>
        <p className="mt-5 text-lg text-[var(--color-navy-200)] max-w-2xl mx-auto leading-relaxed">
          {LYONS.hours}. A master electrician — not a robot, not a dispatcher — answers the phone.
          Try us.
        </p>
        <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`tel:${LYONS.phoneTel}`}
            className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--color-emergency-500)] hover:bg-[var(--color-emergency-600)] text-white px-7 h-14 font-semibold text-[1.0625rem] shadow-[var(--shadow-emergency)] transition-all hover:-translate-y-0.5"
          >
            <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Call {LYONS.phone}
          </a>
          <ChatLauncherClient />
        </div>
      </motion.div>
    </section>
  );
}
