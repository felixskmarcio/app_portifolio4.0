import { $$ } from "./util.js";

/**
 * Pausa global do movimento automático (WCAG 2.2.2: o que se move sozinho por mais
 * de 5 s, em paralelo ao conteúdo, precisa de um controle para pausar).
 * Cobre: faixa de tecnologias (marquee), vídeos dos cards e os pontos do logo.
 * Animações de entrada (≤ ~2 s) e as ligadas ao scroll do usuário não entram.
 * `prefers-reduced-motion` continua mandando: com ele nada disso se move e o botão some.
 */
const root = document.documentElement;
const subscribers = new Set();

export const motion = {
  paused: false,
  /** chamada sempre que o estado muda (recebe `paused`) */
  onChange(fn) {
    subscribers.add(fn);
  },
};

export function initMotionToggle() {
  const buttons = $$("[data-motion-toggle]");
  if (!buttons.length) return;

  const apply = (paused) => {
    motion.paused = paused;
    root.classList.toggle("motion-paused", paused);
    const label = paused ? "Retomar animações" : "Pausar animações";
    buttons.forEach((b) => {
      b.setAttribute("aria-label", label);
      b.title = label;
    });
    subscribers.forEach((fn) => fn(paused));
  };

  buttons.forEach((b) => b.addEventListener("click", () => apply(!motion.paused)));
}
