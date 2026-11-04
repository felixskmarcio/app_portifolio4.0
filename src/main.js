import "lenis/dist/lenis.css";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/chrome.css";
import "./styles/sections.css";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { CustomEase } from "gsap/CustomEase";

import { reduceMQ, coarseMQ } from "./js/util.js";
import { runPreloader } from "./js/preloader.js";
import { initScroll, scrollToHash } from "./js/scroll.js";
import { fitHero, heroIntro, heroScroll } from "./js/hero.js";
import { initMarquee } from "./js/marquee.js";
import { initReveal } from "./js/reveal.js";
import { initWork } from "./js/work.js";
import { initCounts, initTestimonials } from "./js/about.js";
import { initAccordion } from "./js/services.js";
import { initSections, initNav } from "./js/nav.js";
import { initRoll, initMagnetic, initCursorLabel, initCopy } from "./js/ui.js";
import { initInk } from "./js/ink.js";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, CustomEase);
// as mesmas easings do projeto atual
CustomEase.create("easeOutQuart", "0.25,1,0.5,1");
CustomEase.create("easeOutQuint", "0.22,1,0.36,1");
ScrollTrigger.config({ ignoreMobileResize: true });
if (import.meta.env.DEV) window.__gsap = gsap; // só para depurar no console em dev

async function boot() {
  const reduced = reduceMQ.matches;
  const coarse = coarseMQ.matches;

  // o preloader começa já; o resto monta por baixo dele
  const pre = runPreloader({ reduced });

  if (document.readyState === "loading") {
    await new Promise((r) => document.addEventListener("DOMContentLoaded", r, { once: true }));
  }
  await document.fonts.ready;

  fitHero();
  initRoll();

  const lenis = initScroll({ reduced, coarse });
  lenis?.stop(); // parado até o preloader sair

  // ORDEM IMPORTA: ScrollTriggers na ordem em que aparecem na página,
  // com o pin do #work antes de tudo o que vem depois dele.
  heroScroll({ reduced });
  initMarquee({ lenis, reduced });
  initWork({ reduced });
  initReveal({ reduced });
  initCounts({ reduced });
  initTestimonials({ reduced });
  initAccordion({ reduced });
  initSections();
  initNav({ lenis });

  initMagnetic({ reduced });
  initCursorLabel({ reduced });
  initCopy();
  initInk({ reduced });

  ScrollTrigger.refresh();

  await pre.revealed;
  heroIntro({ reduced });

  await pre.done;
  lenis?.start();
  document.documentElement.classList.add("is-ready");

  // abriu com #hash na URL
  if (location.hash && location.hash !== "#") scrollToHash(lenis, location.hash, { immediate: true });

  // vídeos/imagens tardios não mudam o layout (aspect-ratio reservado), mas
  // fontes e o pin merecem um último recálculo depois do load
  if (document.readyState !== "complete") window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
}

boot().catch((err) => {
  // se algo quebrar, a página precisa continuar legível
  console.error("[portfolio] falha ao iniciar:", err);
  document.querySelector(".preloader")?.remove();
  document.documentElement.classList.remove("js-motion");
});
