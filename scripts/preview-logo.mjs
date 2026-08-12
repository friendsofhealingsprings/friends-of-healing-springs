import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const bg = { r: 247, g: 246, b: 242, alpha: 1 };

const jobs = [
  ['public/logo.svg', 'assets/_preview-icon.png', 400, 400],
  ['public/favicon.svg', 'assets/_preview-favicon.png', 64, 64],
  ['public/brand/logo/logo-horizontal.svg', 'assets/_preview-horizontal.png', 860, 240],
  ['public/brand/logo/logo-full-stacked.svg', 'assets/_preview-stacked.png', 465, 300],
  ['public/brand/logo/logo-icon-light.svg', 'assets/_preview-icon-light.png', 400, 400],
];

for (const [src, out, w, h] of jobs) {
  const svg = readFileSync(resolve(root, src));
  const bgColor = out.includes('light') ? { r: 47, g: 93, b: 80, alpha: 1 } : bg;
  await sharp(svg, { density: 384 })
    .resize(w, h, { fit: 'contain', background: bgColor })
    .flatten({ background: bgColor })
    .png()
    .toFile(resolve(root, out));
  console.log('rendered', out);
}
