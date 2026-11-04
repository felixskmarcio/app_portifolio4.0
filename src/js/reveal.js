import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { $$ } from "./util.js";

/**
 * 3 · Revelação de títulos: SplitText por linha com máscara,
 * yPercent 110→0, stagger .08, easeOutQuart, quando entram na viewport.
 * Com movimento reduzido nada é escondido nem dividido (já visível).
 */
export function initReveal({ reduced }) {
  if (reduced) return;

  $$("[data-reveal]").forEach((el) => {
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
  });
}
