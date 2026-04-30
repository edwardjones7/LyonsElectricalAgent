import { Phone, AlertOctagon, Flame, Droplets, Plug, Cable, Zap, CheckCircle2, XCircle } from "lucide-react";
import { LYONS } from "@/lib/constants";
import { PageHero } from "@/components/PageHero";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";

export const metadata = { title: "24/7 Emergency Electrical Service" };

const HAZARDS = [
  {
    icon: <Flame className="w-7 h-7" />,
    title: "Smoke, sparks, or burning smell",
    do: "Turn off the breaker for that circuit if you can do so safely. Leave the area if the smell is intense or smoke is visible. Call us.",
    dont: "Don't spray water near anything electrical. Don't try to find the source by feeling for heat with your hand.",
  },
  {
    icon: <Droplets className="w-7 h-7" />,
    title: "Water near a panel, outlet, or fixture",
    do: "Turn off the main breaker if you can reach it without stepping in water. Stay clear. Call us.",
    dont: "Don't touch anything wet that's near electrical. Don't throw towels onto a live panel.",
  },
  {
    icon: <Plug className="w-7 h-7" />,
    title: "Sparking outlet or melted plug",
    do: "Unplug whatever was in it if you can do so without touching the burned area. Turn off the breaker for that circuit. Call us.",
    dont: "Don't plug anything else into it. Don't 'test' the next outlet over with a different appliance.",
  },
  {
    icon: <Cable className="w-7 h-7" />,
    title: "Downed power line",
    do: "Stay at least 30 feet away. Keep kids and pets inside. Call 911 first if anyone is near it, then call us — we coordinate with the utility.",
    dont: "Don't touch the line. Don't touch a vehicle or fence the line is touching.",
  },
  {
    icon: <Zap className="w-7 h-7" />,
    title: "Someone got shocked",
    do: "Get them away from the source — only after the power is off. Call 911 if they're unresponsive, dizzy, or burned. Call us next.",
    dont: "Don't pull a person off a live wire with your hands. Use a wooden broom handle, a rubber-soled shoe, or shut the breaker.",
  },
  {
    icon: <AlertOctagon className="w-7 h-7" />,
    title: "Breaker that won't reset",
    do: "Leave it off. A breaker that won't reset is doing its job — something on that circuit is wrong. Call us.",
    dont: "Don't hold the breaker in the ON position. Don't replace it with a higher-amperage one.",
  },
];

export default function EmergencyPage() {
  return (
    <>
      <PageHero
        eyebrow="24/7 emergency service"
        title="When it can&rsquo;t wait, call now."
        blurb={`A master electrician picks up the phone — ${LYONS.hours.toLowerCase()}. Often we resolve the issue with you on the line at no cost. When we can&rsquo;t, a truck is on the way.`}
        variant="dark"
      >
        <a
          href={`tel:${LYONS.phoneTel}`}
          className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--color-emergency-500)] hover:bg-[var(--color-emergency-600)] text-white px-7 h-16 font-semibold text-lg shadow-[var(--shadow-emergency)] transition-all hover:-translate-y-0.5"
        >
          <span className="relative flex w-2.5 h-2.5">
            <span className="absolute inset-0 rounded-full bg-white pulse-dot" />
            <span className="relative rounded-full bg-white w-2.5 h-2.5" />
          </span>
          <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Call {LYONS.phone}
        </a>
      </PageHero>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Reveal className="max-w-2xl mb-14">
            <h2 className="text-[var(--color-navy-900)]">Common emergencies — what to do, what not to do.</h2>
            <p className="mt-4 text-lg text-[var(--color-ink-soft)] leading-relaxed">
              Quick reference if you&rsquo;re facing one of these right now. The better answer is always
              to call us — but if you&rsquo;re alone and waiting, here&rsquo;s the safe move.
            </p>
          </Reveal>

          <RevealStagger className="space-y-8">
            {HAZARDS.map((h, i) => (
              <RevealItem key={h.title} direction={i % 2 === 0 ? "left" : "right"} duration={0.6}>
                <article
                  className={`relative rounded-[2rem] bg-white ring-1 ring-[var(--color-navy-200)] shadow-[var(--shadow-soft)] overflow-hidden grid gap-0 lg:grid-cols-12 ${
                    i % 2 === 0 ? "" : "lg:[&>*:first-child]:order-2"
                  }`}
                >
                  <div
                    className={`relative lg:col-span-4 grid place-items-center p-8 lg:p-10 bg-[var(--color-emergency-50)]`}
                  >
                    <div className="grid place-items-center w-20 h-20 rounded-3xl bg-[var(--color-emergency-500)] text-white shadow-[var(--shadow-emergency)]">
                      {h.icon}
                    </div>
                    <div className="absolute top-4 left-4 text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-emergency-700)] font-semibold">
                      Hazard {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <div className="lg:col-span-8 p-7 lg:p-9">
                    <h3 className="text-[var(--color-navy-900)] leading-snug">{h.title}</h3>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-emerald-700 mb-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Do
                        </div>
                        <p className="text-[0.9375rem] text-[var(--color-ink)] leading-relaxed">{h.do}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[var(--color-emergency-600)] mb-1.5">
                          <XCircle className="w-3.5 h-3.5" />
                          Don&rsquo;t
                        </div>
                        <p className="text-[0.9375rem] text-[var(--color-ink)] leading-relaxed">{h.dont}</p>
                      </div>
                    </div>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      <section className="py-16 bg-[var(--color-cream-100)]">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
          <Reveal>
            <h2 className="text-[var(--color-navy-900)]">When in doubt, call.</h2>
            <p className="mt-4 text-lg text-[var(--color-ink-soft)] leading-relaxed">
              Plenty of calls end with us telling you it&rsquo;s a bulb, a GFCI button, or a switch you
              forgot you had. We don&rsquo;t charge for that.
            </p>
            <a
              href={`tel:${LYONS.phoneTel}`}
              className="group mt-7 inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--color-emergency-500)] hover:bg-[var(--color-emergency-600)] text-white px-7 h-14 font-semibold transition-all hover:-translate-y-0.5"
            >
              <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {LYONS.phone}
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
