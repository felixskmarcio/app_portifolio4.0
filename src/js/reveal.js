import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { $$, yieldToMain } from "./util.js";

/**
 * 3 · Revelação de títulos: SplitText por linha com máscara,
 * yPercent 110→0, stagger .08, easeOutQuart, quando entram na viewport.
 * Com movimento reduzido nada é escondido nem dividido (já visível).
 * Um título por tarefa (o split mede o layout): ~11 ms cada, ~67 ms os seis juntos
 * num celular com CPU 4× mais lenta. A/B medido: com o yield por título o TBT fica menor
 * nos 4 cenários. A ordem de criação dos ScrollTriggers não muda.
 */
export async function initReveal({ reduced }) {
  if (reduced) return;

  for (const el of $$("[data-reveal]")) {
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "rv-line",
      autoSplit: true, // refaz o split se a fonte carregar / a largura mudar
      onSplit(self) {
        el.classList.add("is-split");
        return gsap.from(self.lines, {
          yPercent: 110,
          duration: 0.9,
          ease: "easeOutQuart",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      },
    });
    await yieldToMain();
  }
}
