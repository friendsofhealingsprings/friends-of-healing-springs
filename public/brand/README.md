# Logo System — Friends of Healing Springs Natural Area, Inc.

Conservation-grade identity system for grant applications, government partners, reports, web, and signage.

## Recommended Direction

**Concept B — Watershed Contour**

Use the files in `watershed-contour/` as the primary brand lockup.

### Rationale

- Reads as **scientific cartography** — contour lines signal hydrology, watershed science, and land-trust professionalism.
- **Scales cleanly to 16px** — concentric ellipses and a single origin point remain legible as a favicon; detail does not collapse into noise.
- **Communicates core mission** — watershed protection and spring-fed ecosystem stewardship without literal clipart.
- **Partner-ready** — aligns visually with agencies, land trusts, and national conservation NGOs that use topo/contour language.
- **Flexible** — works in single color (`currentColor`) for print and emboss; optional color variant maps to site palette.

Concept A is the strongest alternate for spring-specific storytelling. Concept C works well for digital/stream connectivity contexts but is slightly less distinctive at very small sizes.

---

## Concept A — Spring Emergence

**Idea:** A spring origin point within a circular basin, with upward emergence and outward radial flow lines.

**Strengths:** Directly names the organization’s spring focus; dynamic without being decorative.

**Considerations:** Multiple flow lines can compete at favicon scale; best when spring narrative is the primary message.

**File:** `concepts/concept-a-spring-emergence.svg`

---

## Concept B — Watershed Contour *(recommended)*

**Idea:** Topographic contour ellipses forming a basin, with a central spring origin point.

**Strengths:** Credible, minimal, hydrology-forward; strongest for grants and agency partnerships.

**Considerations:** Less literally “spring-shaped” than A — compensated by scientific clarity.

**Files:** `concepts/concept-b-watershed-contour.svg` · `watershed-contour/*`

---

## Concept C — Stream Path S

**Idea:** An abstract S-curve stream path within a circular basin, with a spring head at the path origin.

**Strengths:** Emphasizes water connectivity and movement; memorable silhouette.

**Considerations:** The S-curve requires slightly heavier stroke weight at 16px; reads more “stream” than “spring basin.”

**File:** `concepts/concept-c-stream-path-s.svg`

---

## Production Files (Watershed Contour)

| File | Use |
|------|-----|
| `watershed-contour/mark-icon.svg` | Favicon, app icon, social avatar, watermarks |
| `watershed-contour/mark-icon-color.svg` | Web header, presentations (forest + spring palette) |
| `watershed-contour/logo-horizontal.svg` | Website header, letterhead, email signature |
| `watershed-contour/logo-stacked.svg` | Posters, signage, square social graphics |
| `watershed-contour/logo-full.svg` | Primary lockup (same as horizontal) |

## Usage

### Single color

Set `color` on the SVG or a parent element. All stroke-based marks use `currentColor`.

```html
<img src="/brand/watershed-contour/mark-icon.svg" alt="" class="text-forest-800" />
```

Or inline:

```html
<svg class="text-forest-800" ...>...</svg>
```

### Brand colors (color mark)

| Element | Hex | Tailwind |
|---------|-----|----------|
| Outer contour | `#2b4027` | `forest-800` |
| Mid contour | `#406338` | `forest-600` |
| Inner contour | `#3988a3` | `spring-500` |
| Spring origin | `#54a3bc` | `spring-400` |

### Minimum size

- **Icon mark:** 16px minimum (favicon)
- **Full logo:** 180px width minimum for readable wordmark

### Clear space

Maintain clear space equal to the height of the innermost contour ellipse on all sides of the mark.

### Wordmark

- **Typeface:** Source Serif 4 (matches site headings)
- **Primary name:** Friends of Healing Springs Natural Area
- **Legal suffix:** Inc. — use in formal documents and footer only, not in the primary logo lockup

---

## File Map

```
public/brand/
├── README.md
├── preview-ab.html          # Concepts A & B
├── preview-c.html             # Concept C
├── preview-d.html             # Concept D (flowing fish)
├── preview-e-i.html           # Concepts E–I (water, darter, stream, watershed, springs)
├── concepts/
│   ├── concept-a-spring-emergence.svg
│   ├── concept-b-watershed-contour.svg
│   ├── concept-c-stream-path-s.svg
│   ├── concept-d-flowing-fish.svg
│   ├── concept-d-alt-unified-flow.svg
│   ├── concept-e-headwaters-spring.svg
│   ├── concept-f-stream-darter.svg
│   ├── concept-g-watershed-stream.svg
│   ├── concept-h-spring-confluence.svg
│   └── concept-i-darter-in-flow.svg
└── watershed-contour/
    ├── mark-icon.svg
    ├── mark-icon-color.svg
    ├── logo-horizontal.svg
    ├── logo-stacked.svg
    └── logo-full.svg
```

---

## Concepts E–I (Water · Darter · Stream · Watershed · Springs)

| Concept | Name | Emphasis |
|---------|------|----------|
| **E** | Headwaters Spring | Vertical: spring → tributaries → stream → darter |
| **F** | Stream Darter | Horizontal stream channel; benthic darter with dorsal hint |
| **G** | Watershed Stream | Open contour arcs + spring-fed vertical stream |
| **H** | Spring Confluence | Drainage lines converging on spring pool |
| **I** | Darter in Flow | Diagonal stream ribbon; darter as focal point |

Preview all five: `/brand/preview-e-i.html`
