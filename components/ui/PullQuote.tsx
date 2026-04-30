type Props = {
  text: string;
  attribution?: string;
};

export function PullQuote({ text, attribution }: Props) {
  return (
    <figure className="my-10 border-l-4 border-[var(--color-brass-500)] pl-6 py-1">
      <blockquote className="font-display text-2xl lg:text-3xl leading-snug text-[var(--color-navy-900)]">
        &ldquo;{text}&rdquo;
      </blockquote>
      {attribution && (
        <figcaption className="mt-3 text-sm uppercase tracking-wider font-semibold text-[var(--color-brass-700)]">
          — {attribution}
        </figcaption>
      )}
    </figure>
  );
}
