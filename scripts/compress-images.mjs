/**
 * Compress gallery images for production.
 *
 * Source (originals):  assets/images/gallery/
 * Output (optimized):  public/images/gallery/
 *
 * Usage:
 *   npm run compress-images          — compress assets → public
 *   npm run compress-images -- --sync — copy new JPGs from public → assets, then compress
 */
import sharp from 'sharp';
import { readdir, mkdir, stat, copyFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SOURCE_DIR = join(ROOT, 'assets', 'images', 'gallery');
const DEST_DIR = join(ROOT, 'public', 'images', 'gallery');

const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 82;
const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const syncFromPublic = process.argv.includes('--sync');

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function listImages(dir) {
  let entries;
  try {
    entries = await readdir(dir);
  } catch {
    return [];
  }
  const files = [];
  for (const name of entries) {
    const ext = extname(name).toLowerCase();
    if (SUPPORTED.has(ext)) {
      files.push(name);
    }
  }
  return files.sort();
}

async function syncPublicToAssets() {
  await ensureDir(SOURCE_DIR);
  const publicFiles = await listImages(DEST_DIR);
  let copied = 0;

  for (const name of publicFiles) {
    const src = join(DEST_DIR, name);
    const dest = join(SOURCE_DIR, name);
    const destStat = await stat(dest).catch(() => null);
    const srcStat = await stat(src);

    if (!destStat || srcStat.mtimeMs > destStat.mtimeMs) {
      await copyFile(src, dest);
      copied++;
      console.log(`  synced → assets: ${name}`);
    }
  }

  return copied;
}

async function compressImage(filename) {
  const inputPath = join(SOURCE_DIR, filename);
  const outputPath = join(DEST_DIR, filename);
  const inputStat = await stat(inputPath);
  const inputBuffer = await sharp(inputPath)
    .rotate()
    .resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({
      quality: JPEG_QUALITY,
      mozjpeg: true,
      progressive: true,
    })
    .toBuffer();

  await sharp(inputBuffer).toFile(outputPath);
  const outputStat = await stat(outputPath);

  return {
    filename,
    before: inputStat.size,
    after: outputStat.size,
  };
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function main() {
  console.log('Compressing gallery images for production…\n');

  await ensureDir(SOURCE_DIR);
  await ensureDir(DEST_DIR);

  if (syncFromPublic) {
    console.log('Syncing newer files from public/images/gallery → assets/images/gallery…');
    const copied = await syncPublicToAssets();
    console.log(copied ? '' : '  (nothing new to sync)\n');
  }

  const sourceFiles = await listImages(SOURCE_DIR);

  if (sourceFiles.length === 0) {
    console.error(
      'No images found in assets/images/gallery/\n' +
        'Add originals there, or run: npm run compress-images -- --sync'
    );
    process.exit(1);
  }

  let totalBefore = 0;
  let totalAfter = 0;
  const results = [];

  for (const filename of sourceFiles) {
    try {
      const result = await compressImage(filename);
      results.push(result);
      totalBefore += result.before;
      totalAfter += result.after;
    } catch (err) {
      console.error(`  ✗ ${filename}: ${err.message}`);
    }
  }

  console.log(`Optimized ${results.length} image(s):\n`);
  for (const { filename, before, after } of results) {
    const pct = before > 0 ? Math.round((1 - after / before) * 100) : 0;
    console.log(
      `  ${filename}\n    ${formatSize(before)} → ${formatSize(after)} (${pct}% smaller)`
    );
  }

  const totalPct = totalBefore > 0 ? Math.round((1 - totalAfter / totalBefore) * 100) : 0;
  console.log(
    `\nTotal: ${formatSize(totalBefore)} → ${formatSize(totalAfter)} (${totalPct}% smaller)`
  );
  console.log(`\nOutput: public/images/gallery/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
