import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(
  __dirname,
  '../public/documents/governance/articles-of-incorporation-summary.pdf'
);

const sections = [
  {
    heading: 'Articles of Incorporation Summary',
    paragraphs: [
      'Friends of Healing Springs Natural Area, Inc.',
      '',
      'This summary describes key provisions of the organization\'s Articles of Incorporation for public transparency. Personal street addresses and other private identifying information from the official filing are not included here.',
    ],
  },
  {
    heading: 'Article I — Name',
    paragraphs: [
      'The corporation name is Friends of Healing Springs Natural Area, Inc.',
    ],
  },
  {
    heading: 'Article II — Type and Duration',
    paragraphs: [
      'The corporation is a public-benefit nonprofit organized under the Arkansas Nonprofit Corporation Act of 1993 (Act 1147 of 1993) for charitable, scientific, and educational purposes within the meaning of Section 501(c)(3) of the Internal Revenue Code.',
      'The corporation has perpetual existence and is organized on a non-membership basis.',
    ],
  },
  {
    heading: 'Article III — Registered Agent',
    paragraphs: [
      'The registered agent for the corporation is Northwest Registered Agent, Mountain Home, Arkansas.',
    ],
  },
  {
    heading: 'Article IV — Purposes',
    paragraphs: [
      'The corporation is organized exclusively for charitable, scientific, and educational purposes under Section 501(c)(3). Specific purposes include:',
      '• Preserve, protect, restore, and enhance the ecological integrity and natural resources of Healing Springs Natural Area in Highfill, Arkansas and surrounding conservation lands;',
      '• Promote environmental education, outdoor learning, and stewardship of natural habitats;',
      '• Support public access, passive recreation, and trail-based recreation consistent with conservation objectives;',
      '• Provide for the conservation of rare and imperiled species, including the Arkansas Darter and Least Darter, and their spring-fed ecosystems;',
      '• Coordinate volunteer activities including habitat restoration, litter removal, invasive species management, and trail maintenance;',
      '• Support watershed protection, streambank stabilization, and ecological restoration within the Little Osage Creek watershed using science-based conservation practices;',
      '• Collaborate with state and local governmental entities, landowners, and conservation organizations for long-term stewardship of the property.',
    ],
  },
  {
    heading: 'Article V — Limitations and Restrictions',
    paragraphs: [
      'No part of the corporation\'s net earnings shall inure to the benefit of directors, officers, or other private persons, except that reasonable compensation for services rendered is permitted.',
      'No substantial part of the corporation\'s activities shall consist of attempting to influence legislation, except as permitted under Section 501(c)(3).',
    ],
  },
  {
    heading: 'Article VI — Dissolution',
    paragraphs: [
      'Upon dissolution, assets shall be distributed for exempt purposes under Section 501(c)(3), to government for public purposes, or as otherwise permitted by law.',
      'Assets related to stewardship of Healing Springs Natural Area should, to the extent practicable, be distributed to a governmental conservation agency or a qualified 501(c)(3) conservation organization with similar purposes.',
    ],
  },
  {
    heading: 'Article VII — Membership',
    paragraphs: ['The corporation shall have no members.'],
  },
  {
    heading: 'Article VIII — Board of Directors',
    paragraphs: [
      'The corporation is governed by a Board of Directors of five (5) members, consisting of one (1) director designated by the Healing Springs Property Owners Association (POA) and four (4) at-large directors elected or appointed in accordance with the bylaws.',
      'Initial directors named in the Articles of Incorporation: John Rogers, Jesse Johnson, Suze Tylock, Leonard Ogden, and Jordan Kunkel.',
    ],
  },
  {
    heading: 'Article IX — Incorporator',
    paragraphs: ['The incorporator of the corporation is John Rogers.'],
  },
  {
    heading: 'Official Document Availability',
    paragraphs: [
      'The official Articles of Incorporation are maintained in the organization\'s corporate records and are available upon reasonable request.',
      'Contact: info@healingsprings.org',
      'Website: https://healingsprings.org',
    ],
  },
];

function wrapText(text, font, size, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

const pdf = await PDFDocument.create();
const font = await pdf.embedFont(StandardFonts.Helvetica);
const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

const pageWidth = 612;
const pageHeight = 792;
const margin = 54;
const maxWidth = pageWidth - margin * 2;
const bodySize = 10.5;
const headingSize = 12;
const titleSize = 18;
const bodyLineHeight = 14;
const headingGap = 10;
const sectionGap = 8;

let page = pdf.addPage([pageWidth, pageHeight]);
let y = pageHeight - margin;

function ensureSpace(needed) {
  if (y - needed < margin) {
    page = pdf.addPage([pageWidth, pageHeight]);
    y = pageHeight - margin;
  }
}

for (const section of sections) {
  const isMainTitle = section.heading === 'Articles of Incorporation Summary';

  ensureSpace(isMainTitle ? 40 : 24);
  page.drawText(section.heading, {
    x: margin,
    y,
    size: isMainTitle ? titleSize : headingSize,
    font: bold,
    color: rgb(0.18, 0.36, 0.31),
  });
  y -= isMainTitle ? 28 : headingSize + headingGap;

  for (const paragraph of section.paragraphs) {
    if (paragraph === '') {
      y -= sectionGap;
      continue;
    }

    const lines = wrapText(paragraph, font, bodySize, maxWidth);
    for (const line of lines) {
      ensureSpace(bodyLineHeight);
      page.drawText(line, {
        x: margin,
        y,
        size: bodySize,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
      y -= bodyLineHeight;
    }
    y -= 4;
  }

  y -= sectionGap;
}

writeFileSync(outputPath, await pdf.save());
console.log(`Wrote ${outputPath}`);
