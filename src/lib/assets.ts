import type { ImageMetadata } from 'astro';

const images = import.meta.glob<{ default: ImageMetadata }>('../assets/**/*.{png,jpg,jpeg,webp}', { eager: true });

/** Resolve a file name from site data (relative to src/assets/) to an image. Fails the build if missing. */
export function asset(path: string): ImageMetadata {
  const img = images[`../assets/${path}`];
  if (!img) throw new Error(`Image not found: src/assets/${path}`);
  return img.default;
}
