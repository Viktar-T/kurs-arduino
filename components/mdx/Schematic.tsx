/**
 * Jak używać w lekcji MDX:
 *
 *   <Schematic
 *     src="/img/lekcje/dzien-01/uklad-led.png"
 *     caption="Połączenie diody LED z rezystorem"
 *     alt="Schemat połączenia Arduino, rezystora i diody LED"
 *   />
 *
 * <Schematic src="/img/lekcje/dzien-NN/foo.png" caption="…" alt="…" />
 *
 * Wraps a circuit diagram / Fritzing export / photo with a caption.
 * Uses next/image for optimization. Server Component.
 */
import Image from "next/image";

interface SchematicProps {
  src: string;
  caption?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export function Schematic({
  src,
  caption,
  alt,
  width = 800,
  height = 500,
}: SchematicProps) {
  return (
    <figure className="my-6">
      <Image
        src={src}
        alt={alt ?? caption ?? "Schemat"}
        width={width}
        height={height}
        className="mx-auto rounded-md border border-slate-200"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm opacity-70">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
