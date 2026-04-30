import { citiesByState } from "@/content/serviceArea";
import { LYONS } from "@/lib/constants";
import { PageHero } from "@/components/PageHero";
import { ZipCheck } from "@/components/ZipCheck";
import { InteractiveServiceArea } from "@/components/InteractiveServiceArea";
import { Reveal } from "@/components/ui/Reveal";

export const metadata = { title: "Service Area" };

export default function ServiceAreaPage() {
  return (
    <>
      <PageHero
        eyebrow="Service area"
        title="Across South Jersey, into PA & DE."
        blurb={`Headquartered in ${LYONS.hq} and serving over ${
          citiesByState.NJ.length + citiesByState.PA.length + citiesByState.DE.length
        } cities and towns. If your town isn&rsquo;t listed, call us — we probably still come out.`}
      >
        <ZipCheck />
      </PageHero>

      <section className="py-12 lg:py-16 bg-[var(--color-cream)]">
        <Reveal className="mx-auto max-w-7xl px-5 sm:px-8">
          <InteractiveServiceArea />
        </Reveal>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 grid gap-12 lg:grid-cols-12">
          <CityColumn state="New Jersey" cities={citiesByState.NJ} className="lg:col-span-6" />
          <CityColumn state="Pennsylvania" cities={citiesByState.PA} className="lg:col-span-3" />
          <CityColumn state="Delaware" cities={citiesByState.DE} className="lg:col-span-3" />
        </div>
      </section>
    </>
  );
}

function CityColumn({
  state,
  cities,
  className,
}: {
  state: string;
  cities: { name: string }[];
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <div className="font-display text-2xl text-[var(--color-navy-900)] mb-1">{state}</div>
      <div className="text-sm text-[var(--color-muted)] mb-5">{cities.length} towns served</div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-y-2 gap-x-4 text-[0.9375rem] text-[var(--color-ink)]">
        {cities.map((c) => (
          <li key={c.name} className="border-b border-[var(--color-navy-100)] py-1.5">
            {c.name}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
