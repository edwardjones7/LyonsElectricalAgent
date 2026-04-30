/**
 * Inline SVG of the L|E + lightning bolt monogram from the Lyons logo.
 *
 * The L and E letterforms inherit `currentColor` from the parent text color, so
 * a single component works on any background — light or dark — by setting the
 * `text-...` class on the parent. The bolt is always painted in
 * `var(--color-electric-500)` so the brand mark remains recognisable.
 *
 * Used as: chat avatar (Allie), dark-surface wordmark mark, brand inflection
 * points (about, hero accents).
 */
export function LELogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* L letterform */}
      <path d="M 14 14 L 26 14 L 26 74 L 40 74 L 40 86 L 14 86 Z" fill="currentColor" />
      {/* E letterform */}
      <path
        d="M 60 14 L 86 14 L 86 26 L 72 26 L 72 44 L 82 44 L 82 56 L 72 56 L 72 74 L 86 74 L 86 86 L 60 86 Z"
        fill="currentColor"
      />
      {/* Lightning bolt slashing between the L and E */}
      <path
        d="M 50 12 L 32 56 L 45 56 L 42 88 L 60 44 L 47 44 Z"
        fill="var(--color-electric-500)"
      />
    </svg>
  );
}
