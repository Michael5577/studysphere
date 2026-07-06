import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const root = new URL("..", import.meta.url).pathname;
const masterPath = join(root, "public/brand/logo-master.png");
const sheetPath = join(root, "public/brand/asset-sheet.png");

/** Pre-rendered app icons from the official brand sheet (1024×682). */
const SHEET_CROPS = {
  greenIcon: { left: 560, top: 38, width: 200, height: 200 },
  whiteIcon: { left: 560, top: 248, width: 200, height: 200 },
};

/** Emblem crop from logo-master for nav/header usage. */
const EMBLEM_CROP = { left: 200, top: 72, width: 624, height: 520 };

async function cropFromSheet(region, size) {
  return sharp(sheetPath)
    .extract(region)
    .resize(size, size, { fit: "fill" })
    .ensureAlpha()
    .png()
    .toBuffer();
}

async function emblemForNav(size) {
  return sharp(masterPath)
    .extract(EMBLEM_CROP)
    .trim({ threshold: 12 })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
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

const icon512 = await cropFromSheet(SHEET_CROPS.greenIcon, 512);
const icon192 = await cropFromSheet(SHEET_CROPS.greenIcon, 192);
const appleTouch = await cropFromSheet(SHEET_CROPS.whiteIcon, 180);
const favicon32 = await cropFromSheet(SHEET_CROPS.greenIcon, 32);
const favicon16 = await cropFromSheet(SHEET_CROPS.greenIcon, 16);
const logoEmblem = await emblemForNav(192);

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
