import { gsap } from "gsap";
import { $, $$ } from "./util.js";

const nextFrame = () => new Promise((r) => requestAnimationFrame(r));
const loaded = () =>
  document.readyState === "complete"
    ? Promise.resolve()
    : new Promise((r) => window.addEventListener("load", r, { once: true }));

/**
 * 1 · Preloader — roda 1× por sessão (sessionStorage.visited).
 * Logo em stroke-draw (laranja) → preenchimento de baixo p/ cima (base03),
 * contador 00→100 e saída em wipe clip-path.
 *
 * Devolve { revealed, done }:
 *  - revealed: o wipe já descobriu o hero (hora de animar o título)
 *  - done: overlay removido
 */
export function runPreloader({ reduced }) {
  const el = $(".preloader");
  const instant = { revealed: Promise.resolve(), done: Promise.resolve() };
  if (!el) return instant;
  if (document.documentElement.classList.contains("is-returning")) {
    el.remove();
    return instant;
  }

  try {
    sessionStorage.setItem("visited", "1");
  } catch {
    /* modo privado: tudo bem, só toca de novo */
  }

  const strokes = $$(".pre-stroke", el);
  const mask = $(".pre-mask-rect", el);
  const count = $(".preloader__count", el);

  let resolveRevealed;
  let resolveDone;
  const revealed = new Promise((r) => (resolveRevealed = r));
  const done = new Promise((r) => (resolveDone = r));

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    el.remove();
    resolveRevealed();
    resolveDone();
  };
  // Rede de segurança: nunca prender o visitante atrás do overlay
  const failsafe = setTimeout(finish, 8000);

  // Fallback de movimento reduzido: logo estático completo, sem contador
  if (reduced) {
    gsap.set(strokes, { strokeDashoffset: 0 });
    gsap.set(mask, { y: 0 });
    count.hidden = true;
    Promise.all([loaded(), document.fonts.ready]).then(() => {
      setTimeout(() => {
        clearTimeout(failsafe);
        finish();
      }, 450);
    });
    return { revealed, done };
  }

  const progress = { v: 0 };
  const tl = gsap.timeline();
  tl.to(strokes, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut", stagger: 0.12 }, 0)
    .to(mask, { y: 0, duration: 1, ease: "power2.inOut" }, 0.9)
    .to(
      progress,
      {
        v: 100,
        duration: 2,
        ease: "power1.inOut",
        onUpdate: () => (count.textContent = String(Math.round(progress.v)).padStart(2, "0")),
      },
      0,
    );

  (async () => {
    await tl; // animação mínima completa…
    await Promise.race([
      Promise.all([loaded(), document.fonts.ready]), // …e a página realmente carregada
      new Promise((r) => setTimeout(r, 3000)),
    ]);
    count.textContent = "100";
    await nextFrame();

    clearTimeout(failsafe);
    gsap.to(el, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 0.9,
      ease: "easeOutQuint",
      onStart: () => setTimeout(resolveRevealed, 380),
      onComplete: finish,
    });
  })();

  return { revealed, done };
}
