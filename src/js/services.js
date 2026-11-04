import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { $, $$ } from "./util.js";

/**
 * 11 · Acordeão de serviços: altura auto via GSAP, ícone + → × (rotate 45°),
 * fundo base2, aria-expanded correto. Só um aberto por vez.
 * Painéis fechados ficam `inert` (nada de foco em conteúdo invisível).
 */
export function initAccordion({ reduced }) {
  const items = $$("[data-acc] .acc__item");
  if (!items.length) return;

  let refreshTimer;
  const refreshLater = () => {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 60);
  };

  const parts = (item) => ({ btn: $(".acc__btn", item), panel: $(".acc__panel", item) });

  const setOpen = (item, open, animate = true) => {
    const { btn, panel } = parts(item);
    if (btn.getAttribute("aria-expanded") === String(open)) return;
    btn.setAttribute("aria-expanded", String(open));
    item.classList.toggle("is-open", open);
    panel.inert = !open;
    gsap.killTweensOf(panel);
    gsap.to(panel, {
      height: open ? "auto" : 0,
      duration: reduced || !animate ? 0 : 0.6,
      ease: "easeOutQuart",
      onComplete: refreshLater,
    });
  };

  // estado inicial
  items.forEach((item) => {
    const { btn, panel } = parts(item);
    const open = btn.getAttribute("aria-expanded") === "true";
    panel.inert = !open;
    gsap.set(panel, { height: open ? "auto" : 0 });
  });

  items.forEach((item) => {
    parts(item).btn.addEventListener("click", () => {
      const willOpen = parts(item).btn.getAttribute("aria-expanded") !== "true";
      items.forEach((other) => other !== item && setOpen(other, false));
      setOpen(item, willOpen);
    });
  });
}
