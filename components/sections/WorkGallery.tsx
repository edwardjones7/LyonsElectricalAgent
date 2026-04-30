import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandImage } from "@/components/ui/BrandImage";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { galleryImages } from "@/content/images";

export function WorkGallery() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-brass-700)] font-semibold">
              Behind the work
            </div>
            <h2 className="mt-3 text-[var(--color-navy-900)]">Tidy. Labeled. Inspector-ready.</h2>
            <p className="mt-4 text-lg text-[var(--color-ink-soft)] max-w-xl leading-relaxed">
              How a Lyons job looks when we&rsquo;re done. Real photos of our team&rsquo;s work
              are coming soon — these are illustrative for now.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-[var(--color-navy-800)] font-semibold hover:text-[var(--color-navy-900)] group"
          >
            See services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>

        <RevealStagger
          stagger={0.08}
          className="grid grid-cols-12 gap-3 sm:gap-4 h-[480px] sm:h-[560px] lg:h-[640px]"
        >
          {/* Hero tile — left half, full height */}
          <RevealItem direction="up" className="col-span-12 sm:col-span-7 row-span-2 relative">
            <BrandImage
              photo={galleryImages[0]}
              treatment="navy"
              rounded="2xl"
              className="absolute inset-0"
              sizes="(min-width: 1024px) 58vw, 100vw"
            />
          </RevealItem>

          {/* Top right */}
          <RevealItem direction="up" className="hidden sm:block col-span-5 row-span-1 relative">
            <BrandImage
              photo={galleryImages[1]}
              treatment="brass"
              rounded="2xl"
              className="absolute inset-0"
              sizes="(min-width: 1024px) 41vw, 100vw"
            />
          </RevealItem>

          {/* Middle right - small */}
          <RevealItem direction="up" className="hidden sm:block col-span-2 row-span-1 relative">
            <BrandImage
              photo={galleryImages[2]}
              treatment="navy"
              rounded="2xl"
              className="absolute inset-0"
              sizes="20vw"
            />
          </RevealItem>

          {/* Middle right - dominant */}
          <RevealItem direction="up" className="hidden sm:block col-span-3 row-span-1 relative">
            <BrandImage
              photo={galleryImages[3]}
              treatment="duotone"
              rounded="2xl"
              className="absolute inset-0"
              sizes="(min-width: 1024px) 25vw, 50vw"
            />
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="text-white text-center px-4">
                <div className="font-display text-3xl">5.0</div>
                <div className="text-xs uppercase tracking-wider mt-1 opacity-80">Star average</div>
              </div>
            </div>
          </RevealItem>
        </RevealStagger>
      </div>
    </section>
  );
}
