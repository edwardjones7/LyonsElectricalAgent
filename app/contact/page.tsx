import { Phone } from "lucide-react";
import { LYONS } from "@/lib/constants";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us what's going on."
        blurb="For non-emergency work, drop us a note and an estimator will reach out — usually same day. For anything urgent, call now."
      >
        <a
          href={`tel:${LYONS.phoneTel}`}
          className="inline-flex items-center gap-2.5 rounded-full bg-[var(--color-emergency-500)] hover:bg-[var(--color-emergency-600)] text-white px-6 h-13 font-semibold py-3.5 shadow-[var(--shadow-emergency)] transition-colors"
        >
          <Phone className="w-4 h-4" />
          Call {LYONS.phone}
        </a>
      </PageHero>

      <section className="pb-28">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
