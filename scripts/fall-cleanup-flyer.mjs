/**
 * Generate a QR code and a letter-size PNG flyer for the October 3 workday.
 * Run: node scripts/fall-cleanup-flyer.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import QRCode from 'qrcode';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'public/brand/flyers');
mkdirSync(outDir, { recursive: true });

const RSVP_URL = 'https://friendsofhealingsprings.org/news/fall-cleanup-october-3-2026/#rsvp';
const PHOTO = resolve(root, 'public/images/gallery/20260312_215012055_iOS.jpg');

const qrSvg = await QRCode.toString(RSVP_URL, {
  type: 'svg',
  margin: 1,
  color: { dark: '#244740', light: '#F7F6F2' },
});
writeFileSync(resolve(outDir, 'fall-cleanup-qr.svg'), qrSvg);
console.log('wrote public/brand/flyers/fall-cleanup-qr.svg');

const W = 1275;
const H = 1650;
const photo = await sharp(PHOTO).resize(1155, 390, { fit: 'cover' }).jpeg({ quality: 82 }).toBuffer();
const qrPng = await sharp(Buffer.from(qrSvg)).resize(220, 220).png().toBuffer();

const overlay = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#F7F6F2"/>
  <text x="60" y="78" fill="#2F5D50" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" letter-spacing="6">FRIENDS OF HEALING SPRINGS NATURAL AREA</text>
  <text x="60" y="150" fill="#244740" font-family="Georgia, serif" font-size="48" font-weight="700">Fall Cleanup &amp; Stewardship</text>
  <text x="60" y="206" fill="#244740" font-family="Georgia, serif" font-size="48" font-weight="700">Workday</text>
  <text x="60" y="268" fill="#2F5D50" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700">Saturday, October 3, 2026</text>
  <text x="60" y="308" fill="#2F5D50" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="600">9:00 AM – 4:00 PM</text>
  <text x="60" y="352" fill="#244740" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="600">Meet at the Healing Springs Common-Area Pond</text>
  <text x="60" y="392" fill="#4C6B3C" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">Rain date: Sunday, October 4</text>
  <text x="60" y="860" fill="#2A9D8F" font-family="Georgia, serif" font-size="36" font-weight="700">Everyone is welcome!</text>
  <text x="60" y="910" fill="#3A3733" font-family="Arial, Helvetica, sans-serif" font-size="22">Help us clean up and care for Healing Springs Natural Area.</text>
  <text x="60" y="970" fill="#244740" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">Possible activities include:</text>
  <text x="80" y="1014" fill="#3A3733" font-family="Arial, Helvetica, sans-serif" font-size="21">• Cleanup and debris removal</text>
  <text x="80" y="1052" fill="#3A3733" font-family="Arial, Helvetica, sans-serif" font-size="21">• Trail stewardship</text>
  <text x="80" y="1090" fill="#3A3733" font-family="Arial, Helvetica, sans-serif" font-size="21">• Vegetation trimming</text>
  <text x="80" y="1128" fill="#3A3733" font-family="Arial, Helvetica, sans-serif" font-size="21">• Other hands-on stewardship projects</text>
  <text x="60" y="1200" fill="#244740" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700">Come for an hour or stay all day!</text>
  <rect x="48" y="1250" width="1179" height="330" rx="12" fill="#FFFFFF" stroke="#D4D0C9"/>
  <text x="320" y="1360" fill="#244740" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700">RSVP online</text>
  <text x="320" y="1410" fill="#5E5951" font-family="Arial, Helvetica, sans-serif" font-size="20">Scan the code or visit the event page.</text>
  <text x="320" y="1458" fill="#1F6F8B" font-family="Arial, Helvetica, sans-serif" font-size="16">friendsofhealingsprings.org/news/fall-cleanup-october-3-2026/</text>
</svg>
`;

await sharp({
  create: { width: W, height: H, channels: 3, background: { r: 247, g: 246, b: 242 } },
})
  .composite([
    { input: Buffer.from(overlay), top: 0, left: 0 },
    { input: photo, top: 430, left: 60 },
    { input: qrPng, top: 1305, left: 80 },
  ])
  .png()
  .toFile(resolve(outDir, 'fall-cleanup-october-3-2026.png'));

console.log('wrote public/brand/flyers/fall-cleanup-october-3-2026.png');
