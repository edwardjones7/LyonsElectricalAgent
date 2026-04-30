import { LYONS } from "@/lib/constants";
import { PageHero } from "@/components/PageHero";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Lyons"
        title="Twenty-nine years of picking up the phone."
        blurb={`${LYONS.legalName} has been answering calls in ${LYONS.hq} for ${LYONS.yearsInBusiness}+ years. Family-owned. Master electricians on every job. Every customer named a real person on our crew when they wrote a review.`}
        eyebrowTone="brass"
      />

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 prose-lyons">
          <h2 className="text-[var(--color-navy-900)]">Our mission, in our own words.</h2>
          <p className="text-xl text-[var(--color-navy-900)] font-display italic leading-snug border-l-4 border-[var(--color-brass-500)] pl-5 my-8">
            “{LYONS.mission}”
          </p>
          <p>
            That sentence shows up in our review responses because we believe it. Electricity makes
            modern life possible — and when it goes wrong, it can hurt or kill someone, or burn a
            family&rsquo;s house down. The work is serious. We treat it that way.
          </p>

          <h2 className="text-[var(--color-navy-900)]">Who we are.</h2>
          <p>
            Lyons is family-owned, multi-generational. Arthur Carroll runs the company and answers
            most of the calls himself. His son Tom handles estimates. Gene Goodman keeps operations
            running. Allie and Jean coordinate the schedule and the paperwork. Out in the field, our
            master electricians — Tim, Tom O., Brian, Tyree, Maurice, Sean, Carlos, Darnell, Chris,
            Alvin, Randy, Josh, Stacey, and Bill — carry the work.
          </p>
          <p>
            We&rsquo;re premium-priced. We don&rsquo;t apologize for it. Master credentials, 24/7 phone
            coverage with real humans, and a five-star track record across {LYONS.googleReviewCount}{" "}
            reviews cost more to deliver than a one-truck operation that doesn&rsquo;t answer at night.
            We think the math works out for our customers — they keep telling us it does.
          </p>

          <h2 className="text-[var(--color-navy-900)]">What you can expect.</h2>
          <p>
            A live master electrician on the phone, day or night. A clear estimate before any work
            starts. Pulled permits and inspector sign-offs on jobs that need them. A clean job site.
            Honest answers — including the ones where we tell you not to hire us because the fix is
            simpler than you thought.
          </p>
        </div>
      </section>
    </>
  );
}
