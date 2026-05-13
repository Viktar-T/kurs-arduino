/**
 * Jak używać w lekcji MDX:
 *
 *   <Photo file="stanowisko.jpg" day="dzien-01" caption="Stanowisko pracy" alt="Arduino UNO podłączone do komputera" />
 *
 * Zdjęcia trzymaj w `public/img/lekcje`, np. `public/img/lekcje/dzien-01/stanowisko.jpg`.
 * Możesz też podać pełną ścieżkę przez `src`.
 *
 * <Photo file="stanowisko.jpg" day="dzien-01" caption="…" alt="…" />
 * <Photo src="/img/lekcje/dzien-01/stanowisko.jpg" caption="…" alt="…" />
 *
 * Displays a lesson photo stored under `public/img/lekcje`. Server Component.
 */
import Image from "next/image";

interface PhotoProps {
  src?: string;
  file?: string;
  day?: string;
  caption?: string;
  alt?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

function resolvePhotoSrc({ src, file, day }: Pick<PhotoProps, "src" | "file" | "day">) {
  if (src) return src;
  if (!file) {
    throw new Error("Photo requires either `src` or `file`.");
  }

  const normalizedFile = file.replace(/^\/+/, "");
  const normalizedDay = day?.replace(/^\/+|\/+$/g, "");
  return normalizedDay
    ? `/img/lekcje/${normalizedDay}/${normalizedFile}`
    : `/img/lekcje/${normalizedFile}`;
}

export function Photo({
  src,
  file,
  day,
  caption,
  alt,
  width = 960,
  height = 640,
  priority = false,
}: PhotoProps) {
  const imageSrc = resolvePhotoSrc({ src, file, day });

  // width ≤ 100 → percentage of container; > 100 → pixel cap
  const figureStyle =
    width <= 100
      ? { maxWidth: `${width}%` }
      : width < 960
      ? { maxWidth: `${width}px` }
      : undefined;

  // Intrinsic dimensions for Next.js Image (must be > 100 to avoid tiny optimized images)
  const intrinsicW = width <= 100 ? 960 : width;
  const intrinsicH = height <= 100 ? 640 : height;

  return (
    <figure className="my-6 mx-auto" style={figureStyle}>
      <Image
        src={imageSrc}
        alt={alt ?? caption ?? "Zdjęcie z lekcji"}
        width={intrinsicW}
        height={intrinsicH}
        priority={priority}
        className="w-full h-auto rounded-lg border border-slate-200 shadow-sm"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm opacity-70">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
