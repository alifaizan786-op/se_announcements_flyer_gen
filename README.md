# SE Announcements Flyer Generator

A React-based flyer builder for the **Ismaili Council for the Southeastern USA**. Produces print-ready US Letter announcements matching the official Local Announcements flyer format — with live preview, overflow protection, and one-click export to PDF, PNG, or JPEG.

---

## Features

### Flyer Builder
- **Live preview** — the flyer updates in real time as you type
- **Locked to US Letter** — flyer is fixed at 8.5" × 11" (680 × 880px display scale); content never overflows the page
- **Smart layout engine** — announcements with 3+ Jamatkhanas render full-width; 1–2 JK announcements are grouped by location into 2- or 3-column section grids
- **Space-between distribution** — rows are spaced equidistantly so the flyer always looks balanced regardless of content count
- **Alternating section labels** — JK section badges alternate between left and right edges with a divider line extending from the opposite side
- **Gold accents** — full-width cards have a left gold border; section cards have a top gold border

### Announcement Fields
| Field | Input Type |
|---|---|
| Icon | Upload (PNG, SVG, JPG) — displayed white on colored circle |
| Icon Background Color | Dropdown: Evergreen / Gold / Charcoal |
| Title | Text input |
| Description | Textarea |
| Date | Date picker |
| Time | Time picker |
| Jamatkhanas | Multi-select dropdown with All / Clear shortcuts |

### Overflow Protection
When a new announcement is added, a `useLayoutEffect` check fires synchronously after the DOM paints. It compares `scrollHeight` vs `clientHeight` on the flyer body. If the content overflows:
- The announcement is **automatically rolled back** — it is never saved
- The Add tab is replaced with a contextual error explaining what happened and what to do
- The error clears automatically once the user removes an announcement and space is freed

### Export
Export the finished flyer as:
- **PNG** — lossless, ideal for digital sharing
- **JPEG** — compressed, smaller file size
- **PDF** — print-ready, preserves exact dimensions

Exports are rendered via `html2canvas` at 2× scale for sharpness, then saved via `jsPDF` (for PDF) or a data URI anchor (for PNG/JPEG).

---

## Jamatkhana Locations

| Group | Locations |
|---|---|
| Georgia | Atlanta Headquarters, Atlanta Northeast, Atlanta Northwest, Atlanta South, Duluth |
| Alabama | Birmingham |
| Tennessee | Chattanooga, Knoxville, Memphis, Nashville |
| Carolinas | Spartanburg, Raleigh (G), Charleston (G) |
| Kentucky | Kentucky (G) |

Announcements with **1–2 JKs** appear under a named section. Announcements with **3+ JKs** appear full-width above all sections (intended for region-wide or multi-location events).

---

## Layout Rules

```
┌─────────────────────────────────────┐
│           HEADER (dark green)        │
│        LOCAL ANNOUNCEMENTS          │
│           MARCH – APRIL 2026        │
├─────────────────────────────────────┤
│  Full-width card (3+ JKs)           │◄── Gold left border
│  Full-width card (3+ JKs)           │
│                                     │
│  ─────────────── ATLANTA NORTHEAST ►│
│  ┌──────────┐ ┌──────────┐          │◄── Gold top border on each card
│  │ Card     │ │ Card     │          │
│  └──────────┘ └──────────┘          │
│                                     │
│◄ ATLANTA SOUTH ────────────────────│
│  ┌──────────┐ ┌──────────┐          │
│  │ Card     │ │ Card     │          │
│  └──────────┘ └──────────┘          │
│                                     │
├─────────────────────────────────────┤
│  For More Information ─────────────  │◄── Always pinned to bottom
└─────────────────────────────────────┘
```

---

## Tech Stack

| Concern | Library / Approach |
|---|---|
| Framework | React 18 (CRA) |
| Icons | Lucide React |
| Typography | Gotham (embedded as base64 `@font-face`) |
| Export — image | `html2canvas` 1.4.1 via CDN |
| Export — PDF | `jsPDF` 2.5.1 via CDN |
| Styling | Inline styles (no CSS-in-JS library) |
| State | `useState`, `useReducer`-style patterns |
| Overflow detection | `useLayoutEffect` + `scrollHeight` / `clientHeight` |

---

## Project Structure

```
se_announcements_flyer_gen/
├── public/
│   └── index.html
├── src/
│   └── App.js          ← entire application (single-file component)
├── package.json
└── README.md
```

> All logic, components, and embedded fonts live in `App.js`. The app was intentionally kept single-file for portability and ease of handoff.

---

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server
npm start
```

App runs at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

Output in `/build`. The built app is fully self-contained — no external font requests, no CDN dependencies at build time (export libraries load lazily on first export).

---

## Fonts

Gotham is embedded directly in the component as base64-encoded `@font-face` declarations. No external font requests are made. The four weights used are:

| Weight | File | Role |
|---|---|---|
| 400 | GothamBook.ttf | Body text, descriptions, JK lists |
| 500 | GothamMedium.ttf | UI labels, subtle emphasis |
| 700 | GothamBold.ttf | Card titles, dates, section headers |
| 800 | Gotham-Black.otf | Flyer main header |

> **Note:** Gotham is a licensed typeface. The font files are not included in this repository. To embed them, place the `.ttf`/`.otf` files locally, base64-encode each (`base64 -w 0 GothamBold.ttf`), and paste the output into the `@font-face` `src` data URIs at the top of `App.js`.

---

## Brand Colors

| Name | Hex | Usage |
|---|---|---|
| Evergreen | `#1C4B3A` | Header background, date text, UI accents |
| Gold | `#B4995A` | Card accent borders, section badges, footer rule |
| Cream | `#F5F4EE` | Flyer background |
| Evergreen (icon) | `#005D35` | Icon background option |
| Charcoal | `#404040` | Icon background option |

---

## Adding / Editing Announcements

1. Fill in the **Add** tab on the left panel
2. Upload an icon image (white or transparent PNGs work best — the image is auto-inverted to white)
3. Select background color, date/time, and Jamatkhanas
4. Click **+ Add Announcement**
5. If the announcement doesn't fit, it is automatically rejected with a clear error — remove or shorten an existing announcement to make room
6. Use the **List** tab to edit or delete any existing announcement
7. Use the **Settings** tab to change the header title, subtitle, and footer text

---

## Export Notes

- Exports are rendered at **2× pixel density** for print sharpness
- PDF dimensions match the flyer exactly (no margins added)
- `html2canvas` and `jsPDF` load asynchronously from Cloudflare CDN on first use — if export fails immediately after page load, wait a moment and retry
- Icon images uploaded as base64 data URIs export correctly without CORS issues

---

## Maintainer

Built for the **Ismaili Council for the Southeastern USA** by Faizan Ali.