import { leadership, fieldElectricians } from "@/content/team";
import { LYONS } from "@/lib/constants";
import { PageHero } from "@/components/PageHero";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";

export const metadata = { title: "Our Team" };

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Our team"
        title="The people answering the phone."
        blurb={`${LYONS.shortName} is a family-owned business with ${LYONS.yearsInBusiness}+ years of history in ${LYONS.hq}. Our customers know our team by name — and they say so in our reviews.`}
        eyebrowTone="brass"
      />

      <section className="pb-12">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Reveal>
            <div className="rounded-3xl bg-[var(--color-cream-100)] ring-1 ring-[var(--color-brass-200)] p-5 lg:p-6 text-sm text-[var(--color-navy-800)] leading-relaxed">
              <strong className="text-[var(--color-navy-900)]">A note on these portraits:</strong>{" "}
              Real headshots of our team are coming soon. The placeholders below are stand-ins
              styled in our brand colors so you can put a name to the role today.
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Reveal>
            <h2 className="text-[var(--color-navy-900)] mb-8">Leadership</h2>
          </Reveal>
          <RevealStagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {leadership.map((m) => (
              <RevealItem key={m.name} direction="up">
                <PersonCard name={m.name} role={m.role} accent="navy" />
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      <section className="pb-28 bg-[var(--color-cream-100)] py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Reveal>
            <h2 className="text-[var(--color-navy-900)] mb-2">Field electricians</h2>
            <p className="text-[var(--color-ink-soft)] mb-8">
              Master and journeyman electricians who carry the work. Many of them are named in
              specific Google reviews.
            </p>
          </Reveal>
          <RevealStagger stagger={0.04} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {fieldElectricians.map((m, i) => (
              <RevealItem key={m.name} direction="up">
                <PersonCard name={m.name} role={m.role} accent={i % 3 === 0 ? "brass" : "navy"} compact />
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>
    </>
  );
}

function PersonCard({
  name,
  role,
  accent,
  compact,
}: {
  name: string;
  role: string;
  accent: "navy" | "brass";
  compact?: boolean;
}) {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`group rounded-3xl bg-white ring-1 ring-[var(--color-navy-200)] hover:ring-[var(--color-navy-700)] hover:-translate-y-1 hover:shadow-[var(--shadow-pop)] transition-all overflow-hidden ${
        compact ? "p-5" : "p-6"
      }`}
    >
      <div
        className={`relative aspect-square w-full rounded-2xl mb-4 grid place-items-center overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] ${
          accent === "navy"
            ? "bg-gradient-to-br from-[var(--color-navy-700)] via-[var(--color-navy-800)] to-[var(--color-navy-950)]"
            : "bg-gradient-to-br from-[var(--color-brass-400)] via-[var(--color-brass-600)] to-[var(--color-brass-800)]"
        }`}
      >
        {/* Atmospheric overlay pattern */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.4), transparent 50%)",
          }}
        />
        <span className="relative font-display text-5xl text-white/95 leading-none select-none drop-shadow">
          {initials}
        </span>
        <div className="absolute bottom-2 left-2 right-2 text-[0.6rem] uppercase tracking-wider text-white/65 text-center">
          Portrait coming soon
        </div>
      </div>
      <div className="font-display text-lg text-[var(--color-navy-900)] leading-snug">{name}</div>
      <div className="text-sm text-[var(--color-muted)] mt-0.5">{role}</div>
    </div>
  );
}
