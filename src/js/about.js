import { gsap } from "gsap";
import { $, $$, clamp } from "./util.js";

/** 10 · Count-up dos stats: 0→n em 1.4s, tabular-nums (CSS), sufixo "+" fixo no HTML. */
export function initCounts({ reduced }) {
  if (reduced) return;
  $$("[data-count]").forEach((el) => {
    const end = Number(el.dataset.count);
    const state = { v: 0 };
    el.textContent = "0";
    gsap.to(state, {
      v: end,
      duration: 1.4,
      ease: "power2.out",
      onUpdate: () => (el.textContent = String(Math.round(state.v))),
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });
}

/**
 * Depoimentos: carrossel arrastável (mouse), swipe nativo (touch), setas do
 * teclado e botões, com barra de progresso em #B58900.
 */
export function initTestimonials({ reduced }) {
  const track = $("[data-testi-track]");
  if (!track) return;
  const bar = $("[data-testi-bar]");
  const prev = $("[data-testi-prev]");
  const next = $("[data-testi-next]");
  const slides = $$(".quote", track);
  if (!slides.length) return; // seção vazia (oculta pelo CSS): nada a ligar
  const behavior = reduced ? "auto" : "smooth";

  const update = () => {
    const max = track.scrollWidth - track.clientWidth;
    const visible = track.clientWidth / track.scrollWidth;
    const p = max > 0 ? track.scrollLeft / max : 1;
    bar?.style.setProperty("--p", (visible + p * (1 - visible)).toFixed(4));
    if (prev) prev.disabled = track.scrollLeft <= 2;
    if (next) next.disabled = track.scrollLeft >= max - 2;
  };
  track.addEventListener("scroll", update, { passive: true });
  new ResizeObserver(update).observe(track);
  update();

  const step = () => {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return slides[0].getBoundingClientRect().width + gap;
  };
  prev?.addEventListener("click", () => track.scrollBy({ left: -step(), behavior }));
  next?.addEventListener("click", () => track.scrollBy({ left: step(), behavior }));
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") track.scrollBy({ left: step(), behavior });
    else if (e.key === "ArrowLeft") track.scrollBy({ left: -step(), behavior });
    else return;
    e.preventDefault();
  });

  // arrastar com o mouse (touch usa o scroll nativo + scroll-snap)
  let down = false;
  let startX = 0;
  let startLeft = 0;
  let moved = 0;

  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    down = true;
    moved = 0;
    startX = e.clientX;
    startLeft = track.scrollLeft;
  });
  window.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    if (moved > 4) {
      track.classList.add("is-dragging");
      track.scrollLeft = startLeft - dx;
    }
  });
  const release = () => {
    if (!down) return;
    down = false;
    if (!track.classList.contains("is-dragging")) return;
    track.classList.remove("is-dragging");
    // assenta no slide mais próximo
    const trackLeft = track.getBoundingClientRect().left;
    const best = slides
      .map((s) => track.scrollLeft + (s.getBoundingClientRect().left - trackLeft))
      .reduce((a, b) => (Math.abs(b - track.scrollLeft) < Math.abs(a - track.scrollLeft) ? b : a));
    track.scrollTo({ left: clamp(best, 0, track.scrollWidth), behavior });
  };
  window.addEventListener("pointerup", release);
  window.addEventListener("pointercancel", release);
  track.addEventListener(
    "click",
    (e) => {
      if (moved > 4) {
        e.preventDefault();
        e.stopPropagation();
      }
      moved = 0;
    },
    true,
  );
}
