import { gsap } from "gsap";
import { $, clamp } from "./util.js";
import { motion } from "./motion.js";

/**
 * 5 · Marquee de sintaxe com inércia: velocidade e skewX (máx. 6°) seguem a
 * velocidade do Lenis e invertem no scroll reverso. Pausa fora da tela e quando o
 * visitante pausa o movimento (motion.js).
 *
 * Custo: a deriva constante roda no COMPOSITOR (Web Animations, translateX linear),
 * então parado no topo da página não há JavaScript por frame. O JS só mexe na
 * `playbackRate` e no skew enquanto o scroll (Lenis) tem velocidade. Medido num
 * celular com CPU 4× mais lenta, parado no topo: 568 ms/s de thread principal
 * (loop gsap.set + quickTo a cada frame, mais 60 layouts/s dos pontos do logo).
 * Em touch o Lenis não existe: o loop nem é registrado.
 */
export function initMarquee({ lenis, reduced }) {
  const root = $(".marquee");
  const track = $(".marquee__track");
  if (!root || !track || reduced) return;

  const BASE = 70; // px/s em repouso

  // O track usa `transform` na animação; a inclinação vai num invólucro próprio.
  const skewEl = document.createElement("div");
  skewEl.className = "marquee__skew";
  track.before(skewEl);
  skewEl.append(track);

  const half = () => track.scrollWidth / 2;
  const anim = track.animate([{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }], {
    duration: (half() / BASE) * 1000,
    iterations: Infinity,
    easing: "linear",
  });
  // Folga de ~500 voltas para os dois lados: com playbackRate negativo uma animação
  // infinita TERMINA ao chegar em currentTime 0, então começamos longe do zero.
  const startAt = () => anim.effect.getComputedTiming().duration * 500;
  anim.currentTime = startAt();

  // se a largura muda (fonte, resize), mantém a velocidade em px/s e a posição visual
  new ResizeObserver(() => {
    const d0 = anim.effect.getComputedTiming().duration;
    const phase = (anim.currentTime % d0) / d0;
    const d1 = (half() / BASE) * 1000;
    if (!d1 || Math.abs(d1 - d0) < 1) return;
    anim.effect.updateTiming({ duration: d1 });
    anim.currentTime = d1 * 500 + phase * d1;
  }).observe(track);

  let visible = true;
  const sync = () => (visible && !motion.paused ? anim.play() : anim.pause());
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    sync();
  }).observe(root);
  motion.onChange(sync);

  if (!lenis) return; // touch: sem inércia, só a deriva do compositor

  let dir = -1; // -1 = para a esquerda (translateX cresce em módulo); inverte no scroll reverso
  let skew = 0;
  let rate = 1;
  gsap.ticker.add((_, deltaMs) => {
    const v = lenis.velocity; // px/frame, sinal = direção do scroll
    const moving = Math.abs(v) > 0.01;
    const atBase = Math.abs(Math.abs(rate) - 1) < 0.01; // velocidade de repouso (em qualquer sentido)
    if (!moving && atBase && Math.abs(skew) < 0.01) return; // em repouso: nenhum trabalho

    if (v > 0.2) dir = -1;
    else if (v < -0.2) dir = 1;

    const next = -dir * (1 + Math.min(Math.abs(v) * 0.35, 7));
    if (Math.abs(next - rate) > 0.01) {
      anim.updatePlaybackRate(next);
      rate = next;
    }

    // inclinação suavizada (≈ 0,6 s, como o quickTo power3.out de antes)
    skew += (clamp(-v * 0.35, -6, 6) - skew) * Math.min(1, deltaMs / 180);
    skewEl.style.transform = Math.abs(skew) < 0.01 ? "" : `skewX(${skew.toFixed(3)}deg)`;
  });
}
