import { gsap } from "gsap";

export const heroAnimationConfig = {
  wordmark: {
    duration: 0.8,
    ease: "power3.out",
    from: { opacity: 0, scale: 0.9, y: 30 },
    to: { opacity: 1, scale: 1, y: 0 },
  },
  cards: {
    duration: 0.6,
    stagger: 0.1,
    ease: "power2.out",
    from: { opacity: 0, y: 60, rotate: -3 },
    to: { opacity: 1, y: 0, rotate: 0 },
  },
  meta: {
    duration: 0.4,
    ease: "power2.out",
    from: { opacity: 0, x: 20 },
    to: { opacity: 1, x: 0 },
  },
  tagline: {
    duration: 0.4,
    ease: "power2.out",
    from: { opacity: 0, y: 10 },
    to: { opacity: 1, y: 0 },
  },
  parallax: {
    intensity: 0.3,
  },
} as const;

export function createHeroTimeline(
  wordmark: Element,
  cards: Element[],
  metaCard: Element,
  tagline: Element
) {
  const tl = gsap.timeline({
    defaults: { ease: "power2.out" },
  });

  // Wordmark entrance
  tl.fromTo(wordmark, heroAnimationConfig.wordmark.from, heroAnimationConfig.wordmark.to, 0);

  // Cards stagger in
  tl.fromTo(
    cards,
    heroAnimationConfig.cards.from,
    heroAnimationConfig.cards.to,
    0.2
  );

  // Meta card
  tl.fromTo(metaCard, heroAnimationConfig.meta.from, heroAnimationConfig.meta.to, 0.6);

  // Tagline
  tl.fromTo(tagline, heroAnimationConfig.tagline.from, heroAnimationConfig.tagline.to, 0.7);

  return tl;
}
