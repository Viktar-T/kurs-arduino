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

  return (
    <figure className="my-6">
      <Image
        src={imageSrc}
        alt={alt ?? caption ?? "Zdjęcie z lekcji"}
        width={width}
        height={height}
        priority={priority}
        className="mx-auto h-auto rounded-lg border border-slate-200 shadow-sm"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm opacity-70">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
