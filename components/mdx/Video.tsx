/**
 * Jak używać w lekcji MDX:
 *
 *   <Video youtube="dQw4w9WgXcQ" title="Jak działa Arduino?" />
 *
 *   <Video
 *     src="https://www.youtube.com/embed/dQw4w9WgXcQ"
 *     title="Film z YouTube"
 *     caption="Krótki materiał uzupełniający lekcję."
 *   />
 *
 * <Video youtube="…" title="…" />
 * <Video vimeo="…" title="…" />
 * <Video src="…" title="…" />
 *
 * Responsive video embed for lessons. Server Component.
 */
interface VideoProps {
  src?: string;
  youtube?: string;
  vimeo?: string;
  title?: string;
  caption?: string;
}

function extractYouTubeId(value: string) {
  const trimmed = value.trim();

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);

    if (url.hostname.includes("youtu.be")) {
      return url.pathname.split("/").filter(Boolean)[0];
    }

    if (url.hostname.includes("youtube.com")) {
      return (
        url.searchParams.get("v") ??
        url.pathname.split("/").filter(Boolean).at(-1)
      );
    }
  } catch {
    return trimmed;
  }

  return trimmed;
}

function extractVimeoId(value: string) {
  const trimmed = value.trim();

  if (/^\d+$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    return url.pathname.split("/").filter(Boolean).at(-1) ?? trimmed;
  } catch {
    return trimmed;
  }
}

function resolveVideoSrc({ src, youtube, vimeo }: VideoProps) {
  if (src) {
    return src;
  }

  if (youtube) {
    return `https://www.youtube-nocookie.com/embed/${extractYouTubeId(youtube)}`;
  }

  if (vimeo) {
    return `https://player.vimeo.com/video/${extractVimeoId(vimeo)}`;
  }

  throw new Error("Video component requires `src`, `youtube`, or `vimeo`.");
}

export function Video({ src, youtube, vimeo, title = "Film", caption }: VideoProps) {
  const videoSrc = resolveVideoSrc({ src, youtube, vimeo });

  return (
    <figure className="my-6">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-black shadow-sm">
        <iframe
          src={videoSrc}
          title={title}
          className="aspect-video w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm opacity-70">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
