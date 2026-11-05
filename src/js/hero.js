import { gsap } from "gsap";
import { $, $$, clamp, rafThrottle } from "./util.js";

/**
 * H1 ocupando a largura inteira. "DESENVOLVEDOR" tem 13 letras, então o
 * "16–18vw" do briefing não cabe. O CSS já dimensiona o H1 pela largura do
 * container (cqw, calibrado com a razão medida da Telegraf: 8,025 em), então o
 * 1º paint já nasce no tamanho certo. Aqui a medição real só REFINA o valor:
 * roda depois que a fonte carregou (com a fonte reserva a medida mente) e só
 * grava quando a diferença passa de 0,8%. Sem isso o H1 pulava ~4px no celular
 * e empurrava hero, marquee e galeria.
 */
export function fitHero() {
  const h1 = $(".hero__title");
  if (!h1) return;

  let lastWidth = 0;
  const fit = () => {
    if (document.fonts.status !== "loaded") return;
    const available = h1.getBoundingClientRect().width;
    if (!available || Math.abs(available - lastWidth) < 1) return;
    lastWidth = available;

    const hadInline = h1.style.getPropertyValue("--h1-size") !== "";
    const current = parseFloat(getComputedStyle(h1).fontSize);
    // medir a 100px e restaurar na mesma tarefa: nenhum paint no meio
    h1.style.setProperty("--h1-size", "100px");
    const widest = Math.max(...$$(".hero__line", h1).map((l) => l.getBoundingClientRect().width));
    if (!widest) {
      if (!hadInline) h1.style.removeProperty("--h1-size");
      return;
    }
    const size = clamp((available / widest) * 100 * 0.995, 28, 260);
    if (!hadInline && Math.abs(size - current) / size < 0.008) h1.style.removeProperty("--h1-size");
    else h1.style.setProperty("--h1-size", `${size.toFixed(2)}px`);
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

  // O scramble troca os caracteres a cada frame, e nas colunas estreitas do celular
  // o texto embaralhado quebra em outro número de linhas (a coluna do meio alternava
  // 42px ↔ 60px, ~50 vezes: CLS e empurrão em tudo abaixo). Trava a altura FINAL de
  // cada coluna durante a animação (todas as leituras antes de qualquer escrita).
  const cols = $$(".hero__meta .meta-col");
  const heights = cols.map((c) => c.getBoundingClientRect().height);
  cols.forEach((c, i) => {
    c.style.height = `${heights[i]}px`;
    c.style.overflow = "hidden";
  });
  const unlock = () =>
    cols.forEach((c) => {
      c.style.height = "";
      c.style.overflow = "";
    });

  const tl = gsap.timeline({ defaults: { ease: "easeOutQuart" }, onComplete: unlock });
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
