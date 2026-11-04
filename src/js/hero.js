import { gsap } from "gsap";
import { $, $$, clamp, rafThrottle } from "./util.js";

/**
 * H1 ocupando a largura inteira. "DESENVOLVEDOR" tem 13 letras, então o
 * "16–18vw" do briefing não cabe: medimos a linha mais larga a 100px e
 * escalamos até encher o container. (O clamp() do CSS é o fallback sem JS.)
 */
export function fitHero() {
  const h1 = $(".hero__title");
  if (!h1) return;

  let lastWidth = 0;
  const fit = () => {
    const available = h1.getBoundingClientRect().width;
    if (!available || Math.abs(available - lastWidth) < 1) return;
    lastWidth = available;

    h1.style.setProperty("--h1-size", "100px");
    const widest = Math.max(...$$(".hero__line", h1).map((l) => l.getBoundingClientRect().width));
    if (!widest) return;
    const size = clamp((available / widest) * 100 * 0.995, 28, 260);
    h1.style.setProperty("--h1-size", `${size.toFixed(2)}px`);
  };

  fit();
  new ResizeObserver(rafThrottle(fit)).observe(h1);
  document.fonts.ready.then(() => {
    lastWidth = 0;
    fit();
  });
}

/**
 * 3 + 4 · Entrada do hero: linhas do H1 sobem de dentro da máscara
 * (yPercent 110→0, stagger .1, easeOutQuart) e as 6 linhas de metadados
 * embaralham até o texto final (ScrambleText, chars 01/\<>_{}, 1.2s).
 */
export function heroIntro({ reduced }) {
  if (reduced) return;

  const tl = gsap.timeline({ defaults: { ease: "easeOutQuart" } });
  // o CSS deixa .hero__line-in em visibility:hidden até aqui; o estado inicial
  // (110% abaixo da máscara) é definido pelo próprio GSAP, no `from`.
  tl.fromTo(
    ".hero__line-in",
    { yPercent: 110, visibility: "visible" },
    { yPercent: 0, duration: 1, stagger: 0.1 },
    0,
  );

  $$(".hero__meta span").forEach((el, i) => {
    const text = el.textContent;
    tl.to(
      el,
      {
        duration: 1.2,
        ease: "none",
        scrambleText: { text, chars: "01/\\<>_{}", speed: 0.6, revealDelay: 0.15 },
      },
      0.35 + i * 0.06,
    );
  });
}

/** 15 · Logo FELIXBR em outline gira levemente com o scroll (no lugar do Spline). */
export function heroScroll({ reduced }) {
  const mark = $(".hero__mark");
  if (!mark || reduced) return;
  gsap.to(mark, {
    rotation: -2.5,
    yPercent: 8,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
}
