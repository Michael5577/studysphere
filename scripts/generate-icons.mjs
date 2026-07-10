import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const root = new URL("..", import.meta.url).pathname;
const masterPath = join(root, "public/brand/logo-master.png");

/**
 * The top region of logo-master contains only the circular mark; the
 * wordmark sits below y≈700. Auto-trim then finds the exact mark bounds.
 */
const EMBLEM_CROP = { left: 0, top: 0, width: 1024, height: 690 };

/** Trimmed emblem, resized to fit a square (two passes: sharp runs trim before extract). */
async function emblem(size) {
  const topRegion = await sharp(masterPath)
    .extract(EMBLEM_CROP)
    .png()
    .toBuffer();

  return sharp(topRegion)
    .trim({ threshold: 12 })
    .resize(size, size, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .ensureAlpha()
    .png()
    .toBuffer();
}

/**
 * Full-bleed square app icon: white tile + centered emblem (matches the
 * brand sheet's "on light background" icon). The emblem source has a white
 * backdrop, so a pure-white tile blends seamlessly.
 */
async function appIcon(size) {
  const emblemSize = Math.round(size * 0.78);
  const offset = Math.round((size - emblemSize) / 2);
  const mark = await emblem(emblemSize);

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: mark, left: offset, top: offset }])
    .png()
    .toBuffer();
}

function createIco(images) {
  const count = images.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let dataOffset = headerSize + dirEntrySize * count;
  const result = Buffer.alloc(
    dataOffset + images.reduce((sum, image) => sum + image.buffer.length, 0),
  );

  result.writeUInt16LE(0, 0);
  result.writeUInt16LE(1, 2);
  result.writeUInt16LE(count, 4);

  let dirPos = headerSize;
  for (const image of images) {
    result.writeUInt8(image.size >= 256 ? 0 : image.size, dirPos);
    result.writeUInt8(image.size >= 256 ? 0 : image.size, dirPos + 1);
    result.writeUInt8(0, dirPos + 2);
    result.writeUInt8(0, dirPos + 3);
    result.writeUInt16LE(1, dirPos + 4);
    result.writeUInt16LE(32, dirPos + 6);
    result.writeUInt32LE(image.buffer.length, dirPos + 8);
    result.writeUInt32LE(dataOffset, dirPos + 12);
    image.buffer.copy(result, dataOffset);
    dataOffset += image.buffer.length;
    dirPos += dirEntrySize;
  }

  return result;
}

mkdirSync(join(root, "public/brand"), { recursive: true });

const icon512 = await appIcon(512);
const icon192 = await appIcon(192);
const appleTouch = await appIcon(180);
const favicon32 = await appIcon(32);
const favicon16 = await appIcon(16);
const logoEmblem = await emblem(192);

const pngExports = [
  { file: "public/icon-512.png", buffer: icon512 },
  { file: "public/icon-192.png", buffer: icon192 },
  { file: "public/apple-touch-icon.png", buffer: appleTouch },
  { file: "public/favicon-32x32.png", buffer: favicon32 },
  { file: "public/favicon-16x16.png", buffer: favicon16 },
  { file: "public/logo-emblem.png", buffer: logoEmblem },
  { file: "public/brand/orbit-flow-master.png", buffer: icon512 },
];

for (const { file, buffer } of pngExports) {
  writeFileSync(join(root, file), buffer);
  console.log(`Wrote ${file}`);
}

const ico = createIco([
  { size: 16, buffer: favicon16 },
  { size: 32, buffer: favicon32 },
]);

writeFileSync(join(root, "public/favicon.ico"), ico);
console.log("Wrote public/favicon.ico");

writeFileSync(
  join(root, "public/icon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <image href="/icon-512.png" width="512" height="512"/>
</svg>`,
);
console.log("Wrote public/icon.svg");
