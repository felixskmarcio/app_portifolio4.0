import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { navHeight } from "./util.js";

const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

/**
 * Scroll suave com Lenis, sincronizado ao ScrollTrigger.
 * Em touch (pointer: coarse) e com movimento reduzido, devolve null:
 * o scroll nativo é melhor ali (e convive com o scroll-snap do CSS).
 */
export function initScroll({ reduced, coarse }) {
  if (reduced || coarse) return null;

  const lenis = new Lenis({ duration: 1.15, easing: easeOutQuart, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

/** Posição de scroll (px) que corresponde a uma âncora #id. */
function targetY(id) {
  if (!id || id === "top") return 0;

  // #work é uma seção fixada (pin): depois do pin a posição "natural" do elemento muda.
  // O ScrollTrigger sabe onde o pin COMEÇA — use isso.
  const st = ScrollTrigger.getById(id);
  if (st && st.vars.pin) return st.start;

  const el = document.getElementById(id);
  if (!el) return null;
  const top = el.getBoundingClientRect().top + window.scrollY;
  return Math.max(0, Math.round(top - navHeight()));
}

export function scrollToHash(lenis, hash, { immediate = false } = {}) {
  const y = targetY(hash.replace(/^#/, ""));
  if (y == null) return false;

  if (lenis) {
    lenis.scrollTo(y, { duration: immediate ? 0 : 1.4, easing: easeOutQuart, immediate, force: true });
  } else {
    window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" });
  }
  return true;
}
