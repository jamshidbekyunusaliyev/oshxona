import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const iconsDirectory = path.join(projectRoot, "public", "icons");
const svg = await readFile(path.join(iconsDirectory, "tasty.svg"));

await mkdir(iconsDirectory, { recursive: true });
for (const [fileName, size] of [
  ["tasty-192.png", 192],
  ["tasty-512.png", 512],
  ["tasty-maskable-512.png", 512],
  ["apple-touch-icon.png", 180],
]) {
  await sharp(svg).resize(size, size).png().toFile(path.join(iconsDirectory, fileName));
}

console.log("Generated 192px, 512px, maskable 512px, and 180px Apple touch icons.");