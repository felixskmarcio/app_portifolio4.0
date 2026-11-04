import { gsap } from "gsap";
import { $, clamp } from "./util.js";

/**
 * 5 · Marquee de sintaxe com inércia: velocidade e skewX (máx. 6°) seguem a
 * velocidade do Lenis e invertem no scroll reverso. Pausa fora da tela.
 */
export function initMarquee({ lenis, reduced }) {
  const root = $(".marquee");
  const track = $(".marquee__track");
  if (!root || !track || reduced) return;

  const BASE = 70; // px/s em repouso
  const skewTo = gsap.quickTo(track, "skewX", { duration: 0.6, ease: "power3.out" });

  let x = 0;
  let dir = -1;
  let visible = true;
  let half = track.scrollWidth / 2;

  new ResizeObserver(() => (half = track.scrollWidth / 2)).observe(track);
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(root);

  gsap.ticker.add((_, deltaMs) => {
    if (!visible || !half) return;

    const v = lenis ? lenis.velocity : 0; // px/frame, sinal = direção do scroll
    if (v > 0.2) dir = -1;
    else if (v < -0.2) dir = 1;

    const boost = 1 + Math.min(Math.abs(v) * 0.35, 7);
    x += dir * BASE * boost * (deltaMs / 1000);
    if (x <= -half) x += half;
    if (x > 0) x -= half;

    gsap.set(track, { x });
    skewTo(clamp(-v * 0.35, -6, 6));
  });
}
