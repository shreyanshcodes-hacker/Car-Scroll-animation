"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import StatCard from "./StatCard";
import {
  ANCHOR_RATIO,
  CARD_RANGES_PX,
  END_INSET_RATIO,
  HEADLINE,
  SCROLL_LENGTH_VH,
  STATS,
} from "../lib/config";

gsap.registerPlugin(ScrollTrigger);
// Do not re-calculate the pin when the mobile address bar shows / hides.
ScrollTrigger.config({ ignoreMobileResize: true });

// useLayoutEffect warns during SSR in older React versions – fall back to useEffect there.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const LETTERS = Array.from(HEADLINE).map((ch) => (ch === " " ? "\u00A0" : ch));

export default function CarScrollAnimation() {
  const sectionRef = useRef(null);
  const roadRef = useRef(null);
  const carRef = useRef(null);
  const trailRef = useRef(null);
  const headlineRef = useRef(null);
  const letterRefs = useRef([]);
  const cardRefs = useRef([]);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const road = roadRef.current;
    const car = carRef.current;
    const trail = trailRef.current;
    const headline = headlineRef.current;
    const letters = letterRefs.current.filter(Boolean);
    const cards = cardRefs.current.filter(Boolean);

    // Everything the animation needs, measured from the DOM (never hard-coded to a width).
    const m = { roadW: 0, carW: 0, anchor: 0, endX: 0, thresholds: [] };
    let revealed = 0; // how many letters are currently visible

    const measure = () => {
      const carH = car.offsetHeight; // == road height (CSS variable --road-h)
      m.roadW = road.clientWidth;
      m.carW = car.offsetWidth;
      m.anchor = carH * ANCHOR_RATIO; // reference: 75px on a 200px road
      m.endX = m.roadW - carH * END_INSET_RATIO; // reference: viewport - 150px
      // x position (inside the road) at which each letter starts
      m.thresholds = letters.map((l) => headline.offsetLeft + l.offsetLeft);
    };

    // Runs on every scroll tick: moves the trail and reveals the letters the car has reached.
    const update = () => {
      const carX = gsap.getProperty(car, "x") + m.anchor;

      gsap.set(trail, { scaleX: Math.min(1, carX / m.roadW) });

      let count = 0;
      while (count < m.thresholds.length && carX >= m.thresholds[count]) count++;

      if (count !== revealed) {
        const from = Math.min(count, revealed);
        const to = Math.max(count, revealed);
        for (let i = from; i < to; i++) {
          gsap.set(letters[i], { opacity: i < count ? 1 : 0 });
        }
        revealed = count;
      }
    };

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* ------------------------------------------------------------------ */
      /*  Normal motion: pinned, scrubbed animation                          */
      /* ------------------------------------------------------------------ */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(trail, { scaleX: 0, transformOrigin: "0% 50%" });

        // 1) Car + trail + letters  (single ScrollTrigger that also pins the section)
        const carTween = gsap.to(car, {
          x: () => {
            // Re-measure on every (re)calculation so resize / orientation change just work.
            measure();
            gsap.set(letters, { opacity: 0 });
            revealed = 0;
            return m.endX;
          },
          ease: "none",
          force3D: true,
          onUpdate: update,
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerHeight * SCROLL_LENGTH_VH}`,
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // After a resize / refresh the car is repositioned by ScrollTrigger without an
            // onUpdate tick, so re-sync the trail and the revealed letters explicitly.
            onRefresh: update,
          },
        });

        // 2) Statistic cards – each fades in during its own slice of the scroll.
        // The windows are anchored to the main (pinning) trigger's start position, so they
        // stay in sync with the car no matter how the pin spacing is measured.
        const main = carTween.scrollTrigger;
        const clampToPin = (px) => Math.min(px, window.innerHeight * SCROLL_LENGTH_VH);
        cards.forEach((card, i) => {
          const [from, to] = CARD_RANGES_PX[i];
          gsap.to(card, {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: () => main.start + clampToPin(from),
              end: () => main.start + clampToPin(to),
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        });

        // Letter positions depend on the font – refresh once fonts are ready.
        let cancelled = false;
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(() => {
            if (!cancelled) ScrollTrigger.refresh();
          });
        }
        return () => {
          cancelled = true;
        };
      });

      /* ------------------------------------------------------------------ */
      /*  Reduced motion: no pinning, no scrubbing – show the finished scene */
      /* ------------------------------------------------------------------ */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const showFinalState = () => {
          measure();
          gsap.set(car, { x: Math.max(0, m.roadW - m.carW - 24) });
          gsap.set(trail, { scaleX: 1, transformOrigin: "0% 50%" });
          gsap.set(letters, { opacity: 1 });
          gsap.set(cards, { opacity: 1 });
        };
        showFinalState();
        window.addEventListener("resize", showFinalState);
        return () => window.removeEventListener("resize", showFinalState);
      });
    }, sectionRef);

    return () => ctx.revert(); // kills every tween + ScrollTrigger and removes the pin spacer
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen bg-[#121212]">
      {/* Pinned viewport */}
      <div className="relative flex h-full w-full items-center justify-center bg-[#d1d1d1]">
        {/* Road */}
        <div
          ref={roadRef}
          className="relative h-[var(--road-h)] w-full overflow-hidden bg-[#1e1e1e]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={carRef}
            src="/car.svg"
            alt="Sports car"
            draggable={false}
            className="absolute left-0 top-0 z-10 aspect-[420/200] h-[var(--road-h)] w-auto max-w-none select-none will-change-transform"
          />

          {/* Green trail (scaleX is driven by GSAP) */}
          <div
            ref={trailRef}
            className="absolute left-0 top-0 z-[1] h-full w-full origin-left bg-[#45db7d] will-change-transform [transform:scaleX(0)]"
          />

          {/* Headline – every character is its own element */}
          <h1
            ref={headlineRef}
            aria-label={HEADLINE}
            className="value-add absolute left-[5%] top-[15%] z-[5] flex font-bold"
          >
            {LETTERS.map((letter, i) => (
              <span
                key={i}
                aria-hidden="true"
                ref={(el) => (letterRefs.current[i] = el)}
                className="value-letter text-[#111] opacity-0"
              >
                {letter}
              </span>
            ))}
          </h1>
        </div>

        {/* Statistic cards */}
        {STATS.map((stat, i) => (
          <StatCard
            key={stat.id}
            {...stat}
            innerRef={(el) => (cardRefs.current[i] = el)}
          />
        ))}
      </div>
    </section>
  );
}
