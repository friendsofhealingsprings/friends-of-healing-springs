# POA social handout — print and tracking

Friends of Healing Springs Natural Area. Half-page card for tonight’s gathering.

## Print

Use **`handout-letter-two-up.pdf`**.

1. Print on letter paper (**8.5 × 11**), **landscape**, **actual size / 100%** (do not “fit to page”).
2. Cut on the dashed line. You get two **5.5 × 8.5** cards per sheet.

Single card: `handout-5.5x8.5.pdf`.

## QR tracking

The code encodes:

`https://friendsofhealingsprings.org/go/poa-social`

That path is unique to this flyer. After deploy it **302-redirects** to the homepage with:

`utm_source=print&utm_medium=flyer&utm_campaign=poa-social-20260822`

**Dynamic:** change the destination later in `public/_redirects` (and `public/go/poa-social/index.html`) without reprinting.

**Traceable:** scans of this flyer hit `/go/poa-social`, not the trailhead homepage QR. In Cloudflare Web Analytics or any later Google Analytics, filter that path or the `poa-social-20260822` campaign.

The flyer does not mention the POA. The campaign slug is only in the URL.

**This short link must be live on the website before people scan.** Deploy the redirect before handing cards out.
