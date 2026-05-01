import { leadership, fieldElectricians } from "@/content/team";
import { LYONS } from "@/lib/constants";
import { PageHero } from "@/components/PageHero";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";

export const metadata = { title: "Our Team" };

export default function TeamPage() {
  const teamSize = leadership.length + fieldElectricians.length;
  const masters = fieldElectricians.filter((m) => m.role === "Master Electrician");
  const electricians = fieldElectricians.filter((m) => m.role === "Electrician");

  const stats: { value: string; label: string }[] = [
    { value: String(teamSize), label: "strong" },
    { value: `${LYONS.yearsInBusiness}+`, label: `years in ${LYONS.hq}` },
    {
      value: `${LYONS.googleRating.toFixed(1)}★`,
      label: `across ${LYONS.googleReviewCount} reviews`,
    },
    { value: "Family-owned", label: "multi-generational" },
  ];

  return (
    <>
      <PageHero
        eyebrow="Our team"
        title="The people answering the phone."
        blurb={`${LYONS.shortName} is a family-owned business with ${LYONS.yearsInBusiness}+ years of history in ${LYONS.hq}. Our customers know our team by name — and they say so in our reviews.`}
        eyebrowTone="brass"
      />

      <section className="bg-[var(--color-cream-100)] py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <RevealStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <RevealItem key={s.label} direction="up">
                <div className="rounded-3xl bg-white ring-1 ring-[var(--color-navy-200)] p-6 text-center h-full">
                  <div
                    className={`font-display text-[var(--color-navy-900)] leading-none ${
                      s.value.length > 4 ? "text-3xl lg:text-4xl" : "text-5xl lg:text-6xl"
                    }`}
                  >
                    {s.value}
                  </div>
                  <div className="mt-3 text-sm text-[var(--color-muted)]">{s.label}</div>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 prose-lyons">
          <Reveal>
            <p>
              Lyons is family-owned, multi-generational. Arthur Carroll runs the company and
              answers most of the calls himself. His son Tom handles estimates. Gene Goodman
              keeps operations running. Allie and Jean coordinate the schedule and the paperwork.
              Out in the field, our master electricians and electricians carry the work — the
              same names that show up, by name, in our Google reviews.
            </p>
          </Reveal>
          <Reveal>
            <p className="text-xl text-[var(--color-navy-900)] font-display italic leading-snug border-l-4 border-[var(--color-brass-500)] pl-5 my-8">
              “Every five-star review names a real person on our crew.”
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-28 bg-[var(--color-cream-100)] py-20">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <RevealStagger className="space-y-16">
            <RevealItem direction="up">
              <RosterGroup heading="Leadership & office">
                <ul className="divide-y divide-[var(--color-brass-200)] border-y border-[var(--color-brass-200)]">
                  {leadership.map((m) => (
                    <li
                      key={m.name}
                      className="py-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1"
                    >
                      <span className="font-display text-lg text-[var(--color-navy-900)]">
                        {m.name}
                      </span>
                      <span className="text-sm text-[var(--color-muted)] sm:text-right">
                        {m.role}
                      </span>
                    </li>
                  ))}
                </ul>
              </RosterGroup>
            </RevealItem>

            <RevealItem direction="up">
              <RosterGroup heading="Master electricians">
                <NameColumns names={masters.map((m) => m.name)} />
              </RosterGroup>
            </RevealItem>

            <RevealItem direction="up">
              <RosterGroup heading="Electricians">
                <NameColumns names={electricians.map((m) => m.name)} />
              </RosterGroup>
            </RevealItem>
          </RevealStagger>
        </div>
      </section>
    </>
  );
}

function RosterGroup({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-brass-700)] mb-5">
        {heading}
      </div>
      {children}
    </div>
  );
}

function NameColumns({ names }: { names: string[] }) {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3 border-y border-[var(--color-brass-200)] py-4">
      {names.map((name) => (
        <li
          key={name}
          className="font-display text-lg text-[var(--color-navy-900)] leading-snug"
        >
          {name}
        </li>
      ))}
    </ul>
  );
}
