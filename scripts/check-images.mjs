import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = path.join(projectRoot, "lib", "data", "uzbek-recipes.ts");
const source = readFileSync(dataPath, "utf8");
const imagePaths = [...source.matchAll(/\bimage:\s*["'](\/images\/recipes\/[^"']+)["']/g)]
  .map((match) => match[1]);
const missingPaths = [...new Set(imagePaths)].filter((imagePath) =>
  !existsSync(path.join(projectRoot, "public", imagePath.slice(1))),
);

if (missingPaths.length === 0) {
  console.log(`All ${new Set(imagePaths).size} recipe images exist.`);
} else {
  console.error(`Missing ${missingPaths.length} of ${new Set(imagePaths).size} recipe images:`);
  missingPaths.forEach((imagePath) => console.error(`- ${imagePath}`));
  process.exitCode = 1;
}