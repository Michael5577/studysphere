import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const outDir = join(root, "public/images");

/**
 * StudySphere landing images — curated for an academic / focus vibe.
 *
 * Source order: tteg (semantic search) → Lorem Picsum (stable IDs) → direct Unsplash.
 * Picsum IDs are hand-picked from https://picsum.photos/v2/list (Unsplash-backed).
 */
const LANDING_IMAGES = [
  {
    file: "hero.jpg",
    query: "college students studying together campus",
    picsumId: 277,
    width: 1800,
    height: 1000,
    fallbackUrl:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=80",
  },
  {
    file: "features.jpg",
    query: "student planner notebook desk writing",
    picsumId: 213,
    width: 1400,
    height: 900,
    fallbackUrl:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1400&q=80",
  },
  {
    file: "how-it-works.jpg",
    query: "university library bookshelves study",
    picsumId: 849,
    width: 1400,
    height: 900,
    fallbackUrl:
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1400&q=80",
  },
];

const TTEG_API = "https://tteg-api-53227342417.asia-south1.run.app/search";

function picsumUrl(id, width, height) {
  return `https://picsum.photos/id/${id}/${width}/${height}.jpg`;
}

async function searchTteg(query, orientation = "landscape") {
  const params = new URLSearchParams({
    q: query,
    n: "1",
    orientation,
  });

  const response = await fetch(`${TTEG_API}?${params.toString()}`, {
    signal: AbortSignal.timeout(12_000),
  });

  if (!response.ok) {
    throw new Error(`tteg API ${response.status}`);
  }

  const data = await response.json();
  const first = data.results?.[0] ?? data.result ?? data[0];

  if (!first?.image_url && !first?.url) {
    throw new Error("tteg returned no image_url");
  }

  return first.image_url ?? first.url;
}

async function downloadImage(url, destination) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(30_000),
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`download failed ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync(destination, buffer);
}

mkdirSync(outDir, { recursive: true });

for (const image of LANDING_IMAGES) {
  const destination = join(outDir, image.file);
  let savedFrom = "picsum";

  try {
    const ttegUrl = await searchTteg(image.query);
    await downloadImage(ttegUrl, destination);
    savedFrom = "tteg";
  } catch {
    try {
      await downloadImage(
        picsumUrl(image.picsumId, image.width, image.height),
        destination,
      );
      savedFrom = `picsum/id/${image.picsumId}`;
    } catch (picsumError) {
      try {
        await downloadImage(image.fallbackUrl, destination);
        savedFrom = "unsplash-fallback";
      } catch (fallbackError) {
        console.error(
          `Failed ${image.file}: picsum=${picsumError.message}, fallback=${fallbackError.message}`,
        );
        process.exitCode = 1;
        continue;
      }
    }
  }

  console.log(`Wrote public/images/${image.file} (${savedFrom})`);
}
