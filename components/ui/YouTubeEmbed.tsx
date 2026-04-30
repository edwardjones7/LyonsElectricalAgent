type Props = {
  youtubeId: string;
  caption?: string;
  title?: string;
};

export function YouTubeEmbed({ youtubeId, caption, title = "YouTube video" }: Props) {
  return (
    <figure className="my-10">
      <div className="relative aspect-video overflow-hidden rounded-2xl ring-1 ring-[var(--color-navy-200)] bg-[var(--color-navy-900)]">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
          title={title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-[var(--color-muted)] italic font-display leading-snug">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
