import type { CSSProperties } from 'react';
import { PHOTOS, type PhotoName } from '../content/photos';

type Props = {
  name: PhotoName;
  alt: string;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  imgStyle?: CSSProperties;
  priority?: boolean;
  /** Shared id for Flip transitions between the grid and the full view. */
  flipId?: string;
};

const BASE = `${import.meta.env.BASE_URL}photos/`;

export function photoSrc(name: PhotoName, width?: number) {
  const meta = PHOTOS[name];
  const w = width ? (meta.widths.find((x) => x >= width) ?? meta.widths[meta.widths.length - 1]) : meta.widths[meta.widths.length - 1];
  return `${BASE}${name}-${w}.webp`;
}

/** Joe's photo as AVIF/WebP at the right size for the screen, with its real
 *  dimensions so nothing jumps while it loads. */
export function Photo({ name, alt, sizes = '100vw', className, imgClassName, imgStyle, priority = false, flipId }: Props) {
  const meta = PHOTOS[name];
  const set = (ext: string) => meta.widths.map((w) => `${BASE}${name}-${w}.${ext} ${w}w`).join(', ');
  return (
    <picture className={className} style={{ backgroundColor: meta.color }}>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={photoSrc(name)}
        width={meta.w}
        height={meta.h}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        draggable={false}
        data-flip-id={flipId}
        className={imgClassName}
        style={imgStyle}
      />
    </picture>
  );
}
