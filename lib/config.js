/**
 * Single place to tune the animation and edit the content.
 * All timing values were taken from the reference implementation
 * (https://paraschaturvedi.github.io/car-scroll-animation/).
 */

export const HEADLINE = "WELCOME ITZFIZZ";

/**
 * Scroll distance of the pinned animation, as a multiple of the viewport height.
 * Reference: the section is 200vh tall and pinned for its whole height  ->  2.
 * Raise it to make the car "slower", lower it to make it "faster".
 */
export const SCROLL_LENGTH_VH = 2;

/**
 * Reference constants are expressed in px for a 200px road:
 *   trail / letter-reveal point = carX + 75px   (75 / 200  = 0.375 of road height)
 *   final car position          = viewport - 150px (150 / 200 = 0.75 of road height)
 * They are stored as ratios of the road height so the effect scales on every screen.
 */
export const ANCHOR_RATIO = 0.375;
export const END_INSET_RATIO = 0.75;

/**
 * Scroll window (in px of scroll distance) in which each card fades in.
 * These are the reference values (400-600, 600-800, 800-1000, 1000-1200).
 * They are automatically clamped to the pin length, so on very short screens the
 * cards still finish before the animation ends.
 */
export const CARD_RANGES_PX = [
  [400, 600],
  [600, 800],
  [800, 1000],
  [1000, 1200],
];

/**
 * The four statistic cards.
 * `position` holds Tailwind classes. Below the `lg` breakpoint the cards sit in
 * the four corners; from `lg` up they use the exact reference offsets.
 */
export const STATS = [
  {
    id: "box1",
    large: true, // reference: only the first card uses 18px text, the others use 16px
    value: "58%",
    label: "Increase in pick up point use",
    theme: "bg-[#def54f] text-[#111]",
    position: "left-[4%] top-[4%] lg:left-auto lg:right-[30%] lg:top-[5%]",
  },
  {
    id: "box2",
    value: "23%",
    label: "Decreased in customer phone calls",
    theme: "bg-[#6ac9ff] text-[#111]",
    position: "bottom-[4%] left-[4%] lg:bottom-[5%] lg:left-auto lg:right-[35%]",
  },
  {
    id: "box3",
    value: "27%",
    label: "Increase in pick up point use",
    theme: "bg-[#333] text-white",
    position: "right-[4%] top-[4%] lg:right-[10%] lg:top-[5%]",
  },
  {
    id: "box4",
    value: "40%",
    label: "Decreased in customer phone calls",
    theme: "bg-[#fa7328] text-[#111]",
    position: "bottom-[4%] right-[4%] lg:bottom-[5%] lg:right-[12.5%]",
  },
];
