# Car Scroll Animation

A pinned, scroll-driven animation: a top-view sports car drives across a dark road while a green trail follows it, the headline **WELCOME ITZFIZZ** is revealed letter by letter as the car passes, and four statistic cards fade in one after another.

It recreates https://paraschaturvedi.github.io/car-scroll-animation/ — layout values (200px road, `#45db7d` trail, 8rem headline, card colours, card offsets, scroll windows) were taken from that page's source, then made responsive.

## Tech stack

- Next.js 15 (App Router) + React 19
- Tailwind CSS 3
- GSAP 3 + ScrollTrigger (no other animation library)
- Plain JavaScript (JSX) — no TypeScript

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open http://localhost:3000.

## Production build

```bash
npm run build
npm start
```

## Project structure

```text
car-scroll-animation/
├── app/
│   ├── layout.jsx          # root layout + metadata
│   ├── page.jsx            # animation + subtle "following content"
│   └── globals.css         # reset, headline + card sizing, reduced-motion
├── components/
│   ├── CarScrollAnimation.jsx   # all GSAP / ScrollTrigger logic
│   └── StatCard.jsx             # one statistic card
├── lib/
│   └── config.js           # headline, stats, scroll length, timing windows
├── public/
│   ├── car.svg             # local top-view car (works offline)
│   └── assets/
└── tailwind.config.js, postcss.config.js, next.config.js
```

## How GSAP ScrollTrigger works here

1. **Pinning + scrub.** One `ScrollTrigger` pins the section (`pin: true`) and ties a tween of the car's `x` to scroll progress (`scrub: true`, `ease: "none"`). Scroll 0% puts the car at the left edge, 100% at the right.
2. **Trail.** On every update the car's x position is read and the trail's `scaleX` is set to `carX / roadWidth`. Only a transform changes, so no layout work happens while scrolling.
3. **Letters.** Each character is its own `<span>`. Their positions are measured once per refresh; as the car's x passes a letter's position, that letter's opacity flips to 1 (and back to 0 when scrolling up).
4. **Cards.** Each card has its own scrubbed `ScrollTrigger` whose start/end are offsets from the pin's start (`CARD_RANGES_VH`), so the cards appear one after another.
5. **No React state** is touched while scrolling. Refs + `gsap.context()` inside `useLayoutEffect` set everything up; `ctx.revert()` kills all tweens, triggers and the pin spacer on unmount.
6. **Responsive.** All measurements happen inside function-based values with `invalidateOnRefresh: true`, so resize and rotation recalculate the car's travel, letter positions and scroll length. `ignoreMobileResize` stops the mobile address bar from causing jumps.
7. **Reduced motion.** With `prefers-reduced-motion: reduce`, nothing is pinned or scrubbed; the finished scene (car at the end, full trail, all text and cards) is shown statically.

## Replace the car image

1. Drop your transparent top-view image into `public/` (e.g. `public/car.png`), with the car's nose pointing **right**.
2. In `components/CarScrollAnimation.jsx` change `src="/car.svg"` to your file and update the `aspect-[420/200]` class to your image's width/height ratio.

The car's height always equals the road height (`--road-h` in `globals.css`), so only the aspect ratio matters.

## Modify the statistics

Edit the `STATS` array in `lib/config.js`: `value`, `label`, `theme` (Tailwind colour classes) and `position` (Tailwind positioning classes). Cards are placed in the four corners on small screens and at the reference offsets from `lg` upward. Add or remove entries and also adjust `CARD_RANGES_VH`.

## Change animation speed

In `lib/config.js`:

- `SCROLL_LENGTH_VH` — how many viewport heights of scrolling the car needs to cross the screen. Higher = slower car, lower = faster. (Reference: `2`.)
- `CARD_RANGES_VH` — the scroll windows in which each card fades in.

## Deploy to Vercel

1. Push the project to a Git repository.
2. Import it at https://vercel.com/new — Next.js is detected automatically.
3. Keep the defaults (`npm run build`) and deploy. No environment variables are needed.

Or from the CLI: `npx vercel`.
