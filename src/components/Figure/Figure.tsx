import Image from 'next/image';

export type FigureProps = {
  src: string;
  alt: string;
  caption?: string;
};

/**
 * A case-study figure. The image sits in the 16:10 frame every image uses (cropped on
 * upload, per the schema), at code-block width (660px) and flush left like a code block.
 *
 * layouts.md lets "a full-bleed diagram" run to 1440px, but nothing in the schema says
 * whether a figure is a diagram, so none go full-bleed yet. That needs a schema field.
 *
 * Alt follows accessibility.md: when the caption already describes the image the author
 * sets alt to "" and the caption carries it — never both.
 */
export function Figure({ src, alt, caption }: FigureProps) {
  return (
    <figure className="flex max-w-code flex-col gap-2">
      <div className="relative aspect-media w-full overflow-hidden rounded border border-ink-200">
        <Image src={src} alt={alt} fill sizes="(min-width: 768px) 660px, 100vw" className="object-cover" />
      </div>
      {caption ? <figcaption className="font-mono text-mono text-ink-600">{caption}</figcaption> : null}
    </figure>
  );
}
