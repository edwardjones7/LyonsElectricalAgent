"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Layers, Cable } from "lucide-react";
import { BrandImage } from "@/components/ui/BrandImage";
import { Reveal } from "@/components/ui/Reveal";
import { services } from "@/content/services";
import { serviceImages } from "@/content/images";

type Category = {
  key: string;
  title: string;
  blurb: string;
  icon: React.ReactNode;
  imageSlug: keyof typeof serviceImages;
  serviceSlugs: string[];
};

const CATEGORIES: Category[] = [
  {
    key: "emergency",
    title: "24/7 Emergency",
    blurb: "Power loss, sparks, storm damage, anything that can&rsquo;t wait. A master electrician answers, day or night.",
    icon: <Zap className="w-5 h-5" />,
    imageSlug: "emergency",
    serviceSlugs: ["emergency"],
  },
  {
    key: "panels",
    title: "Panels & Service",
    blurb: "Panel replacements, service-line work, smart-meter conversions, generator hookups. The big-iron jobs.",
    icon: <Layers className="w-5 h-5" />,
    imageSlug: "panel-upgrades",
    serviceSlugs: ["panel-upgrades", "service-line-replacement", "smart-meter-conversions"],
  },
  {
    key: "wiring",
    title: "Wiring & Code",
    blurb: "Whole-house rewires, outlets, GFCIs, dedicated circuits, code compliance, light commercial work.",
    icon: <Cable className="w-5 h-5" />,
    imageSlug: "rewiring",
    serviceSlugs: ["rewiring", "outlets-and-switches", "code-compliance", "light-commercial"],
  },
];

export function ServiceCategories() {
  return (
    <section className="py-20 lg:py-28 bg-[var(--color-cream-100)] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 30%, var(--color-navy-900) 1px, transparent 1px), radial-gradient(circle at 75% 70%, var(--color-electric-700) 1px, transparent 1px)",
          backgroundSize: "48px 48px, 64px 64px",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-electric-600)] font-bold">
              What we do
            </div>
            <h2 className="mt-3 text-[var(--color-navy-900)]">From a single GFCI to a full service-line replacement.</h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-[var(--color-navy-800)] font-semibold hover:text-[var(--color-navy-900)] group"
          >
            All services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <CategoryTile key={cat.key} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryTile({ category, index }: { category: Category; index: number }) {
  const subServices = category.serviceSlugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={{ y: -4 }}
      className="group relative rounded-[2rem] bg-[var(--color-navy-900)] text-white overflow-hidden ring-1 ring-[var(--color-navy-200)] shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-pop)] transition-shadow"
    >
      <div className="relative aspect-[5/4] overflow-hidden">
        <BrandImage
          photo={serviceImages[category.imageSlug]}
          treatment="duotone"
          rounded="none"
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
          imageClassName="transition-transform duration-700 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-950)]/90 to-transparent" />
        <div className="absolute top-5 left-5 grid place-items-center w-11 h-11 rounded-xl bg-[var(--color-brass-500)] text-[var(--color-navy-950)]">
          {category.icon}
        </div>
        <div className="absolute bottom-5 left-5 right-5">
          <h3 className="text-white">{category.title}</h3>
        </div>
      </div>

      <div className="p-6 lg:p-7">
        <p
          className="text-[0.9375rem] text-[var(--color-navy-200)] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: category.blurb }}
        />
        <ul className="mt-5 space-y-1.5">
          {subServices.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="group/link flex items-center justify-between gap-3 py-1.5 text-[0.9375rem] text-[var(--color-navy-100)] hover:text-white transition-colors"
              >
                <span>{s.shortTitle}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--color-electric-300)] -translate-x-1 opacity-0 group-hover/link:translate-x-0 group-hover/link:opacity-100 transition-all" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}
