/**
 * Half-page handout (5.5" × 8.5") for Friends of Healing Springs Natural Area.
 * Prints two-up on landscape letter (8.5" × 11") with a center cut line.
 *
 * QR encodes a campaign short link that can be retargeted in public/_redirects
 * without reprinting: https://friendsofhealingsprings.org/go/poa-social
 *
 * Run: node scripts/poa-social-flyer.mjs
 *
 * Output: public/brand/flyers/poa-social/
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Buffer } from 'node:buffer';
import sharp from 'sharp';
import QRCode from 'qrcode';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'public/brand/flyers/poa-social');
mkdirSync(outDir, { recursive: true });

const QR_URL = 'https://friendsofhealingsprings.org/go/poa-social';
const LOGO_SRC = resolve(root, 'public/brand/logo/logo-icon-only.svg');
const PHOTO_SRC = [
  resolve(root, 'assets/images/gallery/20260421_145836639_iOS.jpg'),
  resolve(root, 'public/images/gallery/20260421_145836639_iOS.jpg'),
].find((p) => existsSync(p));

if (!PHOTO_SRC) throw new Error('Healing Springs stream photograph not found');

const C = {
  water: '#1F6F8B',
  teal: '#2A9D8F',
  forest: '#2F5D50',
  heading: '#244740',
  ozark: '#4C6B3C',
  sand: '#D9D2C3',
  sandLight: '#EAE6DC',
  stone: '#8C8579',
  base: '#F7F6F2',
  body: '#3A3733',
  scrim: '#16302A',
  white: '#FFFFFF',
  qrDark: '#244740',
};

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Segoe UI', Arial, Helvetica, sans-serif";

const DPI = 200;
const W_IN = 5.5;
const H_IN = 8.5;
const W = Math.round(W_IN * DPI);
const H = Math.round(H_IN * DPI);
const px = (inches) => Math.round(inches * DPI);

const SAFE = 0.32;
const PHOTO_IN = 2.62;
const QR_IN = 1.72;
const LOGO_IN = 0.72;
const CROP = { left: 520, top: 70, width: 4900, height: 3543 };

function extractLogoInner(svg) {
  return svg
    .replace(/<\?xml[^>]*>/i, '')
    .replace(/<svg[^>]*>/i, '')
    .replace(/<\/svg>\s*$/i, '')
    .trim();
}

function extractQrInner(svg) {
  const viewBox = (svg.match(/viewBox="([^"]+)"/) || [null, '0 0 37 37'])[1];
  const inner = svg
    .replace(/<\?xml[^>]*>/i, '')
    .replace(/<svg[^>]*>/i, '')
    .replace(/<\/svg>\s*$/i, '')
    .trim();
  return { viewBox, inner };
}

function jpegToPdf(jpeg, widthPx, heightPx, pageWIn, pageHIn) {
  const pageW = pageWIn * 72;
  const pageH = pageHIn * 72;
  const content = `q ${pageW} 0 0 ${pageH} 0 0 cm /Im0 Do Q\n`;
  const parts = [];
  const offsets = [];
  let pos = 0;
  const pushStr = (s) => {
    const b = Buffer.from(s, 'utf8');
    parts.push(b);
    pos += b.length;
  };
  const pushBuf = (b) => {
    parts.push(b);
    pos += b.length;
  };
  const markObj = () => {
    offsets.push(pos);
  };

  pushStr('%PDF-1.4\n%\xFF\xFF\xFF\xFF\n');
  markObj();
  pushStr('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  markObj();
  pushStr('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
  markObj();
  pushStr(
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`,
  );
  markObj();
  pushStr(
    `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${widthPx} /Height ${heightPx} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`,
  );
  pushBuf(jpeg);
  pushStr('\nendstream\nendobj\n');
  markObj();
  pushStr(`5 0 obj\n<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}endstream\nendobj\n`);

  const xrefPos = pos;
  let xref = `xref\n0 6\n0000000000 65535 f \n`;
  for (const off of offsets) {
    xref += `${String(off).padStart(10, '0')} 00000 n \n`;
  }
  pushStr(xref);
  pushStr(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`);
  return Buffer.concat(parts);
}

function writeFileRetry(path, data) {
  let lastErr;
  for (let i = 0; i < 6; i++) {
    try {
      writeFileSync(path, data);
      return;
    } catch (err) {
      lastErr = err;
      if (err.code !== 'EBUSY' && err.code !== 'EPERM') throw err;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 400 * (i + 1));
    }
  }
  const alt = path.replace(/(\.[^.]+)$/, '-new$1');
  writeFileSync(alt, data);
  console.warn('locked, wrote', alt, 'instead of', path);
  if (lastErr) console.warn(lastErr.message);
}

function buildArtwork({ logoInner, qr, mode }) {
  const photoH = px(PHOTO_IN);
  const safe = px(SAFE);
  const logo = px(LOGO_IN);
  const qrSize = px(QR_IN);
  const isOverlay = mode === 'overlay';
  const uid = 'handout';

  const sizeAttr = isOverlay ? `width="${W}" height="${H}"` : `width="${W_IN}in" height="${H_IN}in"`;
  const barY = photoH;
  const barH = px(0.07);

  const identityTop = photoH + px(0.28);
  const logoX = safe;
  const logoY = identityTop;
  const textX = logoX + logo + px(0.2);
  const missionY = identityTop + logo + px(0.36);
  const explainY = missionY + px(0.58);
  const ruleY = explainY + px(0.72);

  const actionTop = ruleY + px(0.32);
  const qrX = W - safe - qrSize;
  const qrY = actionTop;
  const ctaX = safe;
  const ctaGap = px(0.86);

  const photoBlock = isOverlay
    ? ''
    : `<image href="handout-photo.jpg" x="0" y="0" width="${W}" height="${photoH}" preserveAspectRatio="xMidYMid slice"/>`;

  const bgRect = isOverlay
    ? `<rect width="${W}" height="${H}" fill="none"/>`
    : `<rect width="${W}" height="${H}" fill="${C.base}"/>`;

  const cta = (i, label, line1, line2) => {
    const y = actionTop + i * ctaGap;
    return `
    <g>
      <rect x="${ctaX}" y="${y + px(0.04)}" width="${px(0.22)}" height="${px(0.04)}" fill="${C.water}"/>
      <text x="${ctaX}" y="${y + px(0.28)}" font-family="${SANS}" font-size="${px(0.2)}" font-weight="700" fill="${C.heading}" letter-spacing="${px(0.012)}">${label}</text>
      <text x="${ctaX}" y="${y + px(0.48)}" font-family="${SANS}" font-size="${px(0.13)}" fill="${C.body}">${line1}</text>
      ${line2 ? `<text x="${ctaX}" y="${y + px(0.64)}" font-family="${SANS}" font-size="${px(0.13)}" fill="${C.body}">${line2}</text>` : ''}
    </g>`;
  };

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" ${sizeAttr} viewBox="0 0 ${W} ${H}" role="img" aria-label="Friends of Healing Springs Natural Area handout">
  <title>Friends of Healing Springs Natural Area — half-page handout</title>
  <defs>
    <linearGradient id="scrim-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${C.scrim}" stop-opacity="0"/>
      <stop offset="45%" stop-color="${C.scrim}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${C.scrim}" stop-opacity="0.78"/>
    </linearGradient>
    <filter id="titleShadow-${uid}" x="-8%" y="-30%" width="116%" height="180%">
      <feDropShadow dx="0" dy="2" stdDeviation="5" flood-color="#0c231d" flood-opacity="0.4"/>
    </filter>
  </defs>

  ${bgRect}
  ${photoBlock}

  <rect x="0" y="${photoH - px(1.55)}" width="${W}" height="${px(1.55)}" fill="url(#scrim-${uid})"/>

  <g filter="url(#titleShadow-${uid})" text-anchor="middle">
    <text x="${W / 2}" y="${photoH - px(1.18)}" font-family="${SANS}" font-size="${px(0.26)}" font-weight="700" fill="${C.white}" letter-spacing="${px(0.028)}">FRIENDS OF</text>
    <text x="${W / 2}" y="${photoH - px(0.78)}" font-family="${SANS}" font-size="${px(0.26)}" font-weight="700" fill="${C.white}" letter-spacing="${px(0.028)}">HEALING SPRINGS</text>
    <text x="${W / 2}" y="${photoH - px(0.38)}" font-family="${SANS}" font-size="${px(0.26)}" font-weight="700" fill="${C.white}" letter-spacing="${px(0.028)}">NATURAL AREA</text>
  </g>

  <rect x="0" y="${barY}" width="${W}" height="${barH}" fill="${C.water}"/>
  <rect x="0" y="${barY + barH}" width="${W}" height="${H - barY - barH}" fill="${C.base}"/>

  <g id="mark" transform="translate(${logoX} ${logoY}) scale(${logo / 100})">
    ${logoInner}
  </g>
  <text x="${textX}" y="${logoY + px(0.3)}" font-family="${SANS}" font-size="${px(0.155)}" font-weight="700" fill="${C.heading}">Friends of Healing Springs</text>
  <text x="${textX}" y="${logoY + px(0.5)}" font-family="${SANS}" font-size="${px(0.155)}" font-weight="700" fill="${C.heading}">Natural Area</text>

  <text x="${safe}" y="${missionY}" font-family="${SERIF}" font-size="${px(0.175)}" font-style="italic" fill="${C.ozark}">Help us care for, protect, and enjoy</text>
  <text x="${safe}" y="${missionY + px(0.24)}" font-family="${SERIF}" font-size="${px(0.175)}" font-style="italic" fill="${C.ozark}">Healing Springs Natural Area.</text>

  <text x="${safe}" y="${explainY}" font-family="${SANS}" font-size="${px(0.132)}" fill="${C.body}">We support stewardship, trails, and the enjoyment</text>
  <text x="${safe}" y="${explainY + px(0.2)}" font-family="${SANS}" font-size="${px(0.132)}" fill="${C.body}">of this special place. Neighbors are welcome to learn,</text>
  <text x="${safe}" y="${explainY + px(0.4)}" font-family="${SANS}" font-size="${px(0.132)}" fill="${C.body}">volunteer, and give.</text>

  <rect x="${safe}" y="${ruleY}" width="${px(1.15)}" height="2" fill="${C.teal}"/>

  ${cta(0, 'LEARN MORE', 'Discover Healing Springs Natural Area', 'and our work.')}
  ${cta(1, 'VOLUNTEER', 'Join your neighbors on the trails.')}
  ${cta(2, 'GIVE', 'Support stewardship and future projects.')}

  <g id="qr">
    <rect x="${qrX - px(0.06)}" y="${qrY - px(0.06)}" width="${qrSize + px(0.12)}" height="${qrSize + px(0.12)}" fill="${C.white}"/>
    <svg x="${qrX}" y="${qrY}" width="${qrSize}" height="${qrSize}" viewBox="${qr.viewBox}">
      ${qr.inner}
    </svg>
    <text x="${qrX + qrSize / 2}" y="${qrY + qrSize + px(0.28)}" text-anchor="middle" font-family="${SANS}" font-size="${px(0.1)}" font-weight="700" fill="${C.heading}" letter-spacing="${px(0.004)}">SCAN FOR MORE</text>
    <text x="${W / 2}" y="${H - px(0.38)}" text-anchor="middle" font-family="${SANS}" font-size="${px(0.125)}" font-weight="600" fill="${C.water}">friendsofhealingsprings.org/go/poa-social</text>
  </g>
</svg>`;
}

function cutLineSvg(letterW, letterH) {
  const mid = letterW / 2;
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${letterW}" height="${letterH}" viewBox="0 0 ${letterW} ${letterH}">
  <line x1="${mid}" y1="0" x2="${mid}" y2="${letterH}" stroke="#8C8579" stroke-width="2" stroke-dasharray="10 8"/>
</svg>`);
}

async function main() {
  console.log('QR input URL:', QR_URL);

  const created = QRCode.create(QR_URL, { errorCorrectionLevel: 'Q' });
  const payload = created.segments?.[0]?.data;
  const decoded = typeof payload === 'string' ? payload : Buffer.from(payload).toString('utf8');
  console.log('QR encoder payload:', decoded);
  if (decoded !== QR_URL) throw new Error(`QR payload mismatch: ${JSON.stringify(decoded)}`);

  const qrSvgRaw = await QRCode.toString(QR_URL, {
    type: 'svg',
    margin: 4,
    errorCorrectionLevel: 'Q',
    color: { dark: C.qrDark, light: C.white },
  });
  writeFileSync(resolve(outDir, 'qr-poa-social.svg'), qrSvgRaw);

  const qr = extractQrInner(qrSvgRaw);
  const logoInner = extractLogoInner(readFileSync(LOGO_SRC, 'utf8'));
  const photoH = px(PHOTO_IN);

  async function loadPhoto() {
    const resize = (img) =>
      img
        .resize(W, photoH, { fit: 'cover', position: 'bottom', kernel: 'lanczos3' })
        .modulate({ saturation: 1.03, brightness: 1.01 })
        .jpeg({ quality: 90, chromaSubsampling: '4:4:4', mozjpeg: true })
        .toBuffer();
    try {
      return await resize(sharp(PHOTO_SRC).extract(CROP));
    } catch {
      return await resize(sharp(PHOTO_SRC));
    }
  }

  const photoBuf = await loadPhoto();

  await sharp(photoBuf).jpeg({ quality: 90, mozjpeg: true }).toFile(resolve(outDir, 'handout-photo.jpg'));

  writeFileSync(resolve(outDir, 'handout-5.5x8.5.svg'), buildArtwork({ logoInner, qr, mode: 'editable' }));

  const overlayPng = await sharp(Buffer.from(buildArtwork({ logoInner, qr, mode: 'overlay' })))
    .png()
    .toBuffer();

  const card = await sharp({
    create: { width: W, height: H, channels: 3, background: { r: 247, g: 246, b: 242 } },
  })
    .composite([
      { input: photoBuf, top: 0, left: 0 },
      { input: overlayPng, top: 0, left: 0 },
    ])
    .png({ compressionLevel: 8 })
    .toBuffer();

  await sharp(card).png({ compressionLevel: 9 }).toFile(resolve(outDir, 'handout-5.5x8.5.png'));
  await sharp(card).resize(825, 1275, { kernel: 'lanczos3' }).png({ compressionLevel: 9 }).toFile(resolve(outDir, 'handout-preview.png'));

  const cardJpeg = await sharp(card).jpeg({ quality: 90, chromaSubsampling: '4:4:4', mozjpeg: true }).toBuffer();
  writeFileRetry(resolve(outDir, 'handout-5.5x8.5.pdf'), jpegToPdf(cardJpeg, W, H, W_IN, H_IN));

  const letterWIn = 11;
  const letterHIn = 8.5;
  const letterW = Math.round(letterWIn * DPI);
  const letterH = Math.round(letterHIn * DPI);
  const letter = await sharp({
    create: { width: letterW, height: letterH, channels: 3, background: { r: 247, g: 246, b: 242 } },
  })
    .composite([
      { input: card, top: 0, left: 0 },
      { input: card, top: 0, left: W },
      { input: cutLineSvg(letterW, letterH), top: 0, left: 0 },
    ])
    .png({ compressionLevel: 8 })
    .toBuffer();

  await sharp(letter).png({ compressionLevel: 9 }).toFile(resolve(outDir, 'handout-letter-two-up.png'));
  const letterJpeg = await sharp(letter).jpeg({ quality: 90, chromaSubsampling: '4:4:4', mozjpeg: true }).toBuffer();
  writeFileRetry(resolve(outDir, 'handout-letter-two-up.pdf'), jpegToPdf(letterJpeg, letterW, letterH, letterWIn, letterHIn));

  writeFileSync(
    resolve(outDir, 'PRINT-AND-TRACKING.md'),
    `# POA social handout — print and tracking

Friends of Healing Springs Natural Area. Half-page card for tonight’s gathering.

## Print

Use **\`handout-letter-two-up.pdf\`**.

1. Print on letter paper (**8.5 × 11**), **landscape**, **actual size / 100%** (do not “fit to page”).
2. Cut on the dashed line. You get two **5.5 × 8.5** cards per sheet.

Single card: \`handout-5.5x8.5.pdf\`.

## QR tracking

The code encodes:

\`https://friendsofhealingsprings.org/go/poa-social\`

That path is unique to this flyer. After deploy it **302-redirects** to the homepage with:

\`utm_source=print&utm_medium=flyer&utm_campaign=poa-social-20260822\`

**Dynamic:** change the destination later in \`public/_redirects\` (and \`public/go/poa-social/index.html\`) without reprinting.

**Traceable:** scans of this flyer hit \`/go/poa-social\`, not the trailhead homepage QR. In Cloudflare Web Analytics or any later Google Analytics, filter that path or the \`poa-social-20260822\` campaign.

The flyer does not mention the POA. The campaign slug is only in the URL.

**This short link must be live on the website before people scan.** Deploy the redirect before handing cards out.
`,
  );

  for (const f of [
    'handout-5.5x8.5.svg',
    'handout-5.5x8.5.pdf',
    'handout-5.5x8.5.png',
    'handout-preview.png',
    'handout-letter-two-up.pdf',
    'handout-letter-two-up.png',
    'qr-poa-social.svg',
  ]) {
    const p = resolve(outDir, f);
    const st = statSync(p);
    const meta = /\.(png|jpg)$/.test(f) ? await sharp(p).metadata() : {};
    console.log(f.padEnd(36), (st.size / 1024).toFixed(0) + ' KB', meta.width ? `${meta.width}x${meta.height}` : '');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
