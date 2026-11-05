export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
export const finePointerMQ = window.matchMedia("(hover: hover) and (pointer: fine)");
export const coarseMQ = window.matchMedia("(pointer: coarse)");

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
export const pad2 = (n) => String(n).padStart(2, "0");

/** Altura da barra fixa de navegação, em px (--nav-h = 3.5rem). */
export const navHeight = () => {
  const nav = $(".nav");
  return nav ? nav.getBoundingClientRect().height : 56;
};

/**
 * Devolve o controle à thread principal: entradas do usuário e frames passam na
 * frente do resto do trabalho. Serve para quebrar o boot em tarefas curtas (<50 ms)
 * em vez de uma única de ~250 ms num celular médio (TBT / INP).
 */
export const yieldToMain = () =>
  globalThis.scheduler?.yield ? globalThis.scheduler.yield() : new Promise((r) => setTimeout(r, 0));

/** rAF-debounce: agrupa chamadas repetidas no mesmo frame. */
export function rafThrottle(fn) {
  let raf = 0;
  return (...args) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      fn(...args);
    });
  };
}
