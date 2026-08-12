/**
 * Generates the "watershed contour" logo set for
 * Friends of Healing Springs Natural Area, Inc.
 *
 * The mark is an emblem of nested topographic contour lines that converge
 * inward toward a single spring-source dot, transitioning from land-greens
 * (outer) to spring-water blues (inner). Rings are procedurally perturbed so
 * they read as organic map contours rather than a mechanical target.
 *
 * Run: node scripts/generate-logo.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// --- Brand palette -----------------------------------------------------------
const COLORS = {
  forest: '#2F5D50',
  ozark: '#4C6B3C',
  teal: '#2A9D8F',
  water: '#1F6F8B',
  base: '#F7F6F2',
  sand: '#EAE6DC',
};

// Ring colors, outer -> inner (land greens transitioning to spring blues).
const RING_COLORS = ['#2F5D50', '#4C6B3C', '#3F8471', '#2A9D8F', '#1F6F8B'];
// Normalized radii (in a 0..100 box centered at 50,50), outer -> inner.
const RING_RADII = [45, 36.5, 28, 20, 12];
const CENTER = { x: 50, y: 50 };
const DOT_R = 4.4;

// --- Geometry ---------------------------------------------------------------
/** Smooth, deterministic radial perturbation so contours look organic. */
function perturb(angle, seed) {
  return (
    1 +
    0.038 * Math.sin(3 * angle + seed) +
    0.024 * Math.sin(5 * angle + seed * 1.7 + 0.6) +
    0.014 * Math.sin(2 * angle - seed * 0.9)
  );
}

/** Build a closed, smooth contour path (Catmull-Rom -> cubic Bezier). */
function ringPath(cx, cy, R, seed, samples = 72) {
  const pts = [];
  for (let i = 0; i < samples; i++) {
    const a = (i / samples) * Math.PI * 2;
    const r = R * perturb(a, seed);
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  const n = pts.length;
  const p = (i) => pts[((i % n) + n) % n];
  let d = `M ${p(0)[0].toFixed(2)} ${p(0)[1].toFixed(2)} `;
  for (let i = 0; i < n; i++) {
    const p0 = p(i - 1);
    const p1 = p(i);
    const p2 = p(i + 1);
    const p3 = p(i + 2);
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)} `;
  }
  return d + 'Z';
}

/**
 * Returns the mark's inner SVG (assumes a 0 0 100 100 coordinate space).
 * mode: 'color' | 'mono' | 'light'
 * ringCount lets the favicon use fewer rings for legibility.
 */
function mark({ mode = 'color', ringCount = RING_RADII.length, strokeWidth = 2 } = {}) {
  const radii = RING_RADII.slice(0, ringCount);
  const parts = [];
  radii.forEach((R, i) => {
    const seed = 0.7 + i * 1.37;
    let stroke;
    if (mode === 'color') stroke = RING_COLORS[i] ?? RING_COLORS[RING_COLORS.length - 1];
    else if (mode === 'mono') stroke = COLORS.forest;
    else stroke = COLORS.base; // light
    // Inner rings a touch thinner for a delicate, contour-map feel.
    const sw = strokeWidth * (1 - i * 0.06);
    parts.push(
      `<path d="${ringPath(CENTER.x, CENTER.y, R, seed)}" fill="none" stroke="${stroke}" stroke-width="${sw.toFixed(
        2,
      )}" stroke-linejoin="round" />`,
    );
  });
  const dotColor = mode === 'light' ? COLORS.base : mode === 'mono' ? COLORS.forest : COLORS.water;
  parts.push(`<circle cx="${CENTER.x}" cy="${CENTER.y}" r="${DOT_R}" fill="${dotColor}" />`);
  return parts.join('\n    ');
}

// --- Wordmark ---------------------------------------------------------------
const FONT = "'Inter', 'Helvetica Neue', Arial, sans-serif";
function wordmark({ x, yTop, dark = true, align = 'start' } = {}) {
  const line1 = dark ? COLORS.forest : COLORS.base;
  const main = dark ? COLORS.forest : COLORS.base;
  const line3 = dark ? COLORS.ozark : COLORS.sand;
  return `
  <text x="${x}" y="${yTop}" fill="${line1}" font-family="${FONT}" font-size="12" font-weight="500" letter-spacing="0.28em" text-anchor="${align}">FRIENDS OF</text>
  <text x="${x}" y="${yTop + 30}" fill="${main}" font-family="${FONT}" font-size="30" font-weight="700" letter-spacing="0.01em" text-anchor="${align}">HEALING SPRINGS</text>
  <text x="${x}" y="${yTop + 52}" fill="${line3}" font-family="${FONT}" font-size="12" font-weight="500" letter-spacing="0.30em" text-anchor="${align}">NATURAL AREA</text>`;
}

const svg = (w, h, body, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">\n    ${body}\n</svg>\n`;

const LABEL = 'Friends of Healing Springs Natural Area';

// --- Compose files ----------------------------------------------------------
function iconGroup(opts, transform) {
  return `<g${transform ? ` transform="${transform}"` : ''}>\n    ${mark(opts)}\n  </g>`;
}

const files = {};

// Color icon (also used as mobile header logo).
files['public/logo.svg'] = svg(100, 100, mark({ mode: 'color', strokeWidth: 2 }), LABEL);
files['public/brand/logo/logo-icon-only.svg'] = files['public/logo.svg'];

// Monochrome + light icon variants.
files['public/brand/logo/logo-icon-monochrome.svg'] = svg(100, 100, mark({ mode: 'mono', strokeWidth: 2 }), LABEL);
files['public/brand/logo/logo-icon-light.svg'] = svg(100, 100, mark({ mode: 'light', strokeWidth: 2.2 }), LABEL);

// Favicon: fewer rings + heavier strokes so it stays legible at 16px.
files['public/favicon.svg'] = svg(100, 100, mark({ mode: 'color', ringCount: 3, strokeWidth: 5 }), LABEL);

// Horizontal lockup: icon left, three-line wordmark right.
{
  const iconT = 'translate(6 20) scale(0.8)'; // 80x80 icon
  const body = `${iconGroup({ mode: 'color', strokeWidth: 2.2 }, iconT)}${wordmark({ x: 104, yTop: 44, dark: true })}`;
  files['public/brand/logo/logo-horizontal.svg'] = svg(430, 120, body, LABEL);
}

// Stacked lockup: icon centered on top, centered wordmark below.
{
  const iconT = 'translate(110 8) scale(0.9)'; // 90x90 icon centered (viewBox width 310)
  const body = `${iconGroup({ mode: 'color', strokeWidth: 2.2 }, iconT)}${wordmark({ x: 155, yTop: 130, dark: true, align: 'middle' })}`;
  files['public/brand/logo/logo-full-stacked.svg'] = svg(310, 200, body, LABEL);
}

// --- Write ------------------------------------------------------------------
mkdirSync(resolve(root, 'public/brand/logo'), { recursive: true });
for (const [rel, content] of Object.entries(files)) {
  const abs = resolve(root, rel);
  writeFileSync(abs, content);
  console.log('wrote', rel, `(${content.length} bytes)`);
}
console.log('done');
