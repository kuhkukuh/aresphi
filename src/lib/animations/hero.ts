import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function createHeroTimeline(
  wordmark: Element,
  cards: Element[],
  cardStack: Element,
  metaCard: Element,
  tagline: Element
) {
  // Initial states - elements start hidden/offset
  gsap.set(wordmark, { yPercent: 40, opacity: 0 });
  gsap.set(cards, { y: 120, opacity: 0, scale: 0.92 });
  gsap.set(metaCard, { y: 30, opacity: 0 });
  gsap.set(tagline, { y: 30, opacity: 0 });

  // Intro timeline - paused until ScrollTrigger is refreshed
  const heroIntro = gsap.timeline({
    paused: true,
    onComplete() {
      // Scroll-triggered animation after intro completes
      const heroScrub = gsap.timeline({
        scrollTrigger: {
          trigger: wordmark.closest("#hero"),
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1.5,
          refreshPriority: 1,
        },
      });

      heroScrub
        .to(wordmark, { yPercent: -60, ease: "none", duration: 1 }, 0)
        .to([metaCard, tagline], { opacity: 0, y: -40, ease: "power1.inOut", duration: 0.6 }, 0)
        .to(cardStack, { y: -80, scale: 1.05, ease: "none", duration: 1 }, 0)
        .to(cards[0], { rotation: -4, ease: "none", duration: 1 }, 0)
        .to(cards[1], { x: "-38vw", y: -50, rotation: -9, ease: "none", duration: 1 }, 0)
        .to(cards[2], { x: "38vw", y: 50, rotation: 9, ease: "none", duration: 1 }, 0)
        .fromTo([cardStack, wordmark], { opacity: 1 }, { opacity: 0, ease: "power1.in", duration: 0.15, immediateRender: false }, 0.88);

      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    },
  });

  heroIntro
    .to(wordmark, { yPercent: 0, opacity: 1, duration: 1.4, ease: "power4.out" })
    .to(cards, { y: 0, opacity: 1, scale: 1, duration: 1.2, stagger: 0.12, ease: "power3.out" }, "-=1")
    .to(tagline, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, "-=0.7")
    .to(metaCard, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, "-=0.7");

  // Refresh ScrollTrigger first, then play intro
  ScrollTrigger.refresh();
  heroIntro.play();

  return heroIntro;
}
