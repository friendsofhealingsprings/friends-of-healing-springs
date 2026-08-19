# Friends of Healing Springs Natural Area, Inc.

Production-ready static website for a Northwest Arkansas conservation nonprofit. Built with **Astro**, **Tailwind CSS**, and **vanilla JavaScript** — deployable to **Cloudflare Pages** with serverless contact forms.

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm (included with Node.js)

### Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

> **Note:** Contact forms POST to `/api/contact`, which only runs on Cloudflare Pages (not during `npm run dev`). To test forms locally, see [Contact Forms](#contact-forms-cloudflare-pages).

### Build for Production

```bash
npm run build
```

Static output is written to the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## Deploy to Cloudflare Pages

1. Push this repository to GitHub (or GitLab / Bitbucket).
2. In the [Cloudflare dashboard](https://dash.cloudflare.com/), go to **Workers & Pages → Create → Pages → Connect to Git**.
3. Select your repository and configure:

   | Setting | Value |
   |---------|-------|
   | **Framework preset** | Astro |
   | **Build command** | `npm run build` |
   | **Build output directory** | `dist` |
   | **Node.js version** | 20 (set via Environment variable `NODE_VERSION=20`) |

4. Deploy. Cloudflare will rebuild on every push to your production branch.

### Custom Domain

After deployment, add your domain under **Pages → Custom domains** (e.g. `friendsofhealingsprings.org`). Update `site.url` in `src/data/site.ts` and `site` in `astro.config.mjs` to match.

---

## Contact Forms (Cloudflare Pages)

Contact forms on `/contact/` and `/get-involved/` (volunteer, partnership, and general) submit to a **Cloudflare Pages Function** at `functions/api/contact.ts`. Inquiries are stored as [MailerLite](https://www.mailerlite.com) subscribers using the same `MAILERLITE_API_KEY` as newsletter signup. Resend email is optional extra delivery only.

### Production setup (MailerLite)

If `MAILERLITE_API_KEY` is already set in Cloudflare (newsletter signup), volunteer, partnership, and general contact forms work without a Resend account. After someone submits:

1. Open **MailerLite → Subscribers** and find their email.
2. Open the subscriber to read **form_type** (Volunteer Inquiry vs Partnership Inquiry vs General Inquiry), **inquiry_subject**, and **inquiry_message**.

A new group env var is not required. Optionally set `MAILERLITE_CONTACT_GROUP_ID` to drop inquiries into a dedicated group such as “Website Inquiries.” Do not reuse the newsletter group unless you want inquiry-only contacts to receive campaigns.

This stores the message in MailerLite; it does **not** send an email to `info@`. For inbox delivery, add Resend later.

### Optional: email delivery via Resend

1. Create a free [Resend](https://resend.com) account and add an API key.
2. Verify your sending domain in Resend (e.g. `friendsofhealingsprings.org`), or use `onboarding@resend.dev` for testing only.
3. In **Cloudflare Pages → your project → Settings → Environment variables**, add:

   | Variable | Example | Notes |
   |----------|---------|-------|
   | `RESEND_API_KEY` | `re_...` | Secret — Production and Preview |
   | `CONTACT_TO_EMAIL` | `info@friendsofhealingsprings.org` | Where inquiries are delivered |
   | `CONTACT_FROM_EMAIL` | `Friends of Healing Springs <notify@friendsofhealingsprings.org>` | Must use a verified Resend domain |

4. Redeploy the site after saving variables. When all three Resend vars are present, the function still stores the inquiry in MailerLite and also emails it.

### Local form testing

```bash
cp .dev.vars.example .dev.vars   # add MAILERLITE_API_KEY (required for forms)
npm run pages:dev                # builds site + runs Pages Functions locally
```

`npm run dev` (Astro on port 4321) does **not** run Pages Functions, so local form posts will not hit this API.

### How it works

- Browser POSTs JSON to `/api/contact`
- The Pages Function validates input (including a honeypot field)
- If MailerLite is configured, it upserts a subscriber with name, email, form type, subject, and message
- If Resend is also configured, it emails a copy (reply-to is the visitor)

---

## Project Structure

```
├── assets/images/gallery/ # Original photos (compressed to public/ on build)
├── functions/api/         # Cloudflare Pages Functions (contact form)
├── public/
│   ├── images/            # Optimized site photos (generated)
│   ├── documents/         # Governance PDFs
│   ├── brand/logo/        # Stream Path S logo system (SVG)
│   ├── logo.svg           # Site icon (alias of brand mark)
│   └── favicon.svg
├── src/
│   ├── components/        # Reusable UI components
│   ├── content/posts/     # Markdown blog posts
│   ├── data/              # Site content (projects, gallery, navigation)
│   ├── layouts/           # Page layouts
│   ├── pages/             # Route pages
│   ├── scripts/           # Client-side JavaScript
│   └── styles/            # Global CSS
├── astro.config.mjs
├── tailwind.config.mjs
├── wrangler.toml
└── package.json
```

---

## Site Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, mission, priorities, news preview, volunteer CTA |
| `/about/` | Mission, vision, agency partnerships, stewardship philosophy |
| `/why-it-matters/` | Ecological significance (4 sections) |
| `/projects/` | Conservation project cards with status and funding notes |
| `/news/` | Blog index (Markdown-powered) |
| `/news/[slug]/` | Individual blog posts |
| `/gallery/` | Filterable photo gallery |
| `/get-involved/` | Volunteer opportunities and inquiry forms |
| `/governance/` | Transparency documents, board, meeting summaries |
| `/contact/` | Contact and inquiry forms |
| `/donate/` | Tax-deductible donations via Stripe Checkout (one-time and monthly) |

---

## Content Management (No CMS Required)

### Blog Posts

Add a Markdown file to `src/content/posts/`:

```markdown
---
title: "Your Post Title"
description: "Brief summary for SEO and previews."
pubDate: 2025-07-01
author: "Friends of Healing Springs Natural Area, Inc."
image: "/images/your-photo.jpg"
imageAlt: "Description of the image"
---

Your content here...
```

Posts appear automatically on `/news/` sorted by date.

### Projects

Edit `src/data/projects.ts` — each project includes title, description, status, image, and funding notes structured for future grant reporting.

### Gallery

Edit `src/data/gallery.ts` to add images and assign categories: `streams`, `forest`, `wildlife`, `restoration`, `volunteers`.

### Navigation

Edit `src/data/navigation.ts`.

### Site-Wide Settings

Edit `src/data/site.ts` for organization name, email, URL, EIN, and SEO keywords.

---

## Stripe Donations (Cloudflare Pages)

The `/donate/` page collects one-time and monthly gifts via **Stripe Checkout**. A Cloudflare Pages Function at `functions/api/create-checkout.ts` creates checkout sessions server-side.

### One-time setup

1. Create a [Stripe](https://stripe.com) account and complete nonprofit verification if applicable.
2. In the Stripe Dashboard, create **Products** or use dynamic Checkout (already configured in the API).
3. In **Cloudflare Pages → Settings → Environment variables**, add:

   | Variable | Example | Notes |
   |----------|---------|-------|
   | `STRIPE_SECRET_KEY` | `sk_live_...` | Secret — Production and Preview |
   | `SITE_URL` | `https://friendsofhealingsprings.org` | Used for success/cancel redirect URLs |

4. Add your **EIN** to `src/data/site.ts` (`export const ein = 'XX-XXXXXXX'`) for public disclosure and receipts.
5. Redeploy after saving variables.

### Local donation testing

```bash
cp .dev.vars.example .dev.vars   # add STRIPE_SECRET_KEY (use sk_test_... for test mode)
npm run pages:dev                # builds site + runs Pages Functions locally
```

Use [Stripe test card numbers](https://docs.stripe.com/testing) in test mode.

### How it works

- Visitor selects amount and frequency on `/donate/`
- Browser POSTs to `/api/create-checkout`
- The Pages Function creates a Stripe Checkout Session and returns the redirect URL
- Stripe handles payment and emails a receipt
- Success and cancel return to `/donate/?success=1` or `/donate/?canceled=1`

Until `STRIPE_SECRET_KEY` is set, the donate form shows a clear error and directs donors to email for offline giving.

---

## Adding Your Photos

1. Drop full-resolution originals in **`assets/images/gallery/`**
2. Register new photos in **`src/data/gallery.ts`** (filename, alt text, category)
3. Compress for the web:
   ```bash
   npm run compress-images
   ```

Compression runs automatically before every production build (`npm run build`). Settings: max 1920px, JPEG quality 82, progressive encoding.

Optimized files are written to `public/images/gallery/` (regenerated — do not edit those directly).

Main site images (hero, projects, etc.) are configured in `src/data/images.ts` and typically point to the best gallery photo for each use.

---

## Future Phase: Interactive Map (Leaflet.js)

A `MapPlaceholder.astro` component is included at `src/components/MapPlaceholder.astro`.

1. **Install Leaflet:**
   ```bash
   npm install leaflet
   ```

2. **Create a map component** (e.g. `src/components/HealingSpringsMap.astro`):
   ```astro
   ---
   // Healing Springs Natural Area approximate coordinates
   ---
   <div id="map" class="h-96 rounded-lg"></div>
   <script>
     import L from 'leaflet';
     import 'leaflet/dist/leaflet.css';
     const map = L.map('map').setView([36.261, -94.349], 14);
     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
       attribution: '© OpenStreetMap contributors'
     }).addTo(map);
     L.marker([36.261, -94.349]).addTo(map)
       .bindPopup('Healing Springs Natural Area');
   </script>
   ```

3. Add the map to `/about/` or a dedicated `/visit/` page.

For Mapbox, replace the tile layer URL and add your Mapbox access token.

---

## Future Phase: Volunteer Signup System

Contact forms already store volunteer, partnership, and general inquiries as MailerLite subscribers. A dedicated volunteer signup system could add:

- Workday date selection and RSVP tracking
- Airtable or Google Sheets integration for volunteer rosters
- Automated confirmation emails to volunteers

See `functions/api/contact.ts` as a pattern for additional Pages Functions.

---

## Future Phase: Grant Reporting / Project Tracking

Project data in `src/data/projects.ts` is structured with:

- `status` — planning, in-progress, ongoing, completed
- `fundingNotes` — grant and donor accountability text
- Expandable fields for budget, timeline, outcomes

For a full tracking system, consider adding a `projects` content collection (Markdown or JSON) with frontmatter fields for budget, grant ID, and reporting dates — the current architecture supports this without redesign.

---

## Design System

| Token | Usage |
|-------|-------|
| `forest-*` | Primary brand green |
| `spring-*` | Water / accent blue |
| `earth-*` | Warm earth tones |
| `neutral-*` | Backgrounds and text |

Fonts: **Source Serif 4** (headings), **Source Sans 3** (body) — loaded from Google Fonts.

---

## License

© Friends of Healing Springs Natural Area, Inc. All rights reserved.
