/**
 * Curated Lorem Picsum IDs matched to StudySphere's academic / focus vibe.
 * Used by `npm run images` — see scripts/fetch-landing-images.mjs.
 *
 * Browse IDs: https://picsum.photos/v2/list
 * Preview:    https://picsum.photos/id/{id}/800/500.jpg
 */
export const landingPicsumImages = {
  hero: {
    id: 277,
    width: 1800,
    height: 1000,
    label: "Campus collaboration",
  },
  features: {
    id: 213,
    width: 1400,
    height: 900,
    label: "Notebook and planner",
  },
  howItWorks: {
    id: 849,
    width: 1400,
    height: 900,
    label: "Library shelves",
  },
  focus: {
    id: 24,
    width: 1400,
    height: 900,
    label: "Laptop deep work",
  },
} as const;

export function picsumUrl(
  id: number,
  width: number,
  height: number,
  options?: { grayscale?: boolean; blur?: number },
) {
  const params = new URLSearchParams();

  if (options?.grayscale) {
    params.set("grayscale", "");
  }

  if (options?.blur !== undefined) {
    params.set("blur", String(options.blur));
  }

  const query = params.toString();
  return `https://picsum.photos/id/${id}/${width}/${height}.jpg${query ? `?${query}` : ""}`;
}
