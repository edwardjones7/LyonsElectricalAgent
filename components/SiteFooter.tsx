import Link from "next/link";
import { Phone, MapPin, Clock, ShieldCheck } from "lucide-react";
import { LYONS } from "@/lib/constants";
import { WordMark } from "@/components/ui/WordMark";

export function SiteFooter() {
  return (
    <footer className="bg-[var(--color-navy-900)] text-[var(--color-navy-100)] mt-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <WordMark variant="light" />
            <p className="text-[var(--color-navy-200)] text-[0.9375rem] leading-relaxed max-w-md">
              {LYONS.mission} A master electrician answers the phone 24 hours a day, 7 days a week,
              365 days a year. Family-owned in {LYONS.hq} for {LYONS.yearsInBusiness}+ years.
            </p>
            <a
              href={`tel:${LYONS.phoneTel}`}
              className="inline-flex items-center gap-2.5 rounded-full bg-[var(--color-emergency-500)] hover:bg-[var(--color-emergency-600)] text-white px-5 h-12 font-semibold shadow-[var(--shadow-emergency)] transition-colors"
            >
              <Phone className="w-4 h-4" />
              {LYONS.phone}
            </a>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-display text-lg text-white mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/emergency" className="hover:text-white">24/7 Emergency</Link></li>
              <li><Link href="/services/panel-upgrades" className="hover:text-white">Panel Upgrades</Link></li>
              <li><Link href="/services/service-line-replacement" className="hover:text-white">Service Lines</Link></li>
              <li><Link href="/services/rewiring" className="hover:text-white">Whole-House Rewiring</Link></li>
              <li><Link href="/services/light-commercial" className="hover:text-white">Commercial</Link></li>
              <li><Link href="/services" className="hover:text-white text-[var(--color-brass-300)]">All services →</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-display text-lg text-white mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/team" className="hover:text-white">Our Team</Link></li>
              <li><Link href="/service-area" className="hover:text-white">Service Area</Link></li>
              <li><Link href="/resources" className="hover:text-white">Resources</Link></li>
              <li><Link href="/reviews" className="hover:text-white">Reviews</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-display text-lg text-white mb-4">Reach us</h4>
            <ul className="space-y-3 text-sm text-[var(--color-navy-200)]">
              <li className="flex gap-2"><Clock className="w-4 h-4 mt-0.5 shrink-0 text-[var(--color-brass-300)]" />Open 24/7/365</li>
              <li className="flex gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[var(--color-brass-300)]" />{LYONS.hq}</li>
              <li className="flex gap-2"><ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-[var(--color-brass-300)]" />Licensed · Insured · Bonded</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[var(--color-navy-300)]">
          <div>© {new Date().getFullYear()} {LYONS.legalName}. All rights reserved.</div>
          <div className="max-w-xl text-[var(--color-navy-300)]">
            Allie&rsquo;s a digital stand-in for after-hours messages. Anything urgent — sparks, smoke, water near electrical — call {LYONS.phone} and a master electrician picks up day or night.
          </div>
        </div>
      </div>
    </footer>
  );
}
