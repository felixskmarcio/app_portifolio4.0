import { gsap } from "gsap";
import { $, $$, finePointerMQ, rafThrottle } from "./util.js";

/** 12 · Text roll: guarda o texto no data-text; o CSS faz o deslize de -100%. */
export function initRoll() {
  $$(".roll__t").forEach((el) => (el.dataset.text = el.textContent.trim()));
}

/**
 * 9 · Botões magnéticos: dentro de 80px da borda, o botão acompanha o mouse
 * em até 25% do deslocamento. (O wipe de preenchimento é CSS.)
 */
export function initMagnetic({ reduced }) {
  if (reduced || !finePointerMQ.matches) return;

  const RADIUS = 80;
  const PULL = 0.25;
  const items = $$("[data-magnetic]").map((el) => ({
    el,
    x: gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" }),
    y: gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" }),
    pulled: false,
  }));
  if (!items.length) return;

  window.addEventListener(
    "pointermove",
    rafThrottle((e) => {
      for (const it of items) {
        const r = it.el.getBoundingClientRect();
        // tira o deslocamento atual do cálculo, senão o botão "foge" do próprio mouse
        const ox = gsap.getProperty(it.el, "x");
        const oy = gsap.getProperty(it.el, "y");
        const cx = r.left + r.width / 2 - ox;
        const cy = r.top + r.height / 2 - oy;
        const near =
          e.clientX > r.left - ox - RADIUS &&
          e.clientX < r.right - ox + RADIUS &&
          e.clientY > r.top - oy - RADIUS &&
          e.clientY < r.bottom - oy + RADIUS;

        if (near) {
          it.x((e.clientX - cx) * PULL);
          it.y((e.clientY - cy) * PULL);
          it.pulled = true;
        } else if (it.pulled) {
          it.x(0);
          it.y(0);
          it.pulled = false;
        }
      }
    }),
    { passive: true },
  );
}

/** 7 · Bolha "VER" que segue o mouse sobre cards com link ativo. */
export function initCursorLabel({ reduced }) {
  const label = $(".cursor-label");
  const targets = $$("[data-cursor-label]");
  if (!label || !targets.length || reduced || !finePointerMQ.matches) return;

  const x = gsap.quickTo(label, "x", { duration: 0.35, ease: "power3.out" });
  const y = gsap.quickTo(label, "y", { duration: 0.35, ease: "power3.out" });

  targets.forEach((el) => {
    el.addEventListener("pointerenter", (e) => {
      if (e.pointerType !== "mouse") return;
      gsap.set(label, { x: e.clientX, y: e.clientY });
      gsap.to(label, { scale: 1, opacity: 1, duration: 0.35, ease: "easeOutQuart", overwrite: "auto" });
    });
    el.addEventListener("pointermove", (e) => {
      x(e.clientX);
      y(e.clientY);
    });
    el.addEventListener("pointerleave", () =>
      gsap.to(label, { scale: 0, opacity: 0, duration: 0.25, ease: "easeOutQuart", overwrite: "auto" }),
    );
  });
}

/** Copiar e-mail: troca o ícone copiar→check (como o original) e avisa leitores de tela. */
export function initCopy() {
  const status = $("[data-copy-status]");

  $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // fallback p/ contextos sem Clipboard API (http, iframes)
        const ta = Object.assign(document.createElement("textarea"), { value: text });
        ta.style.cssText = "position:fixed;opacity:0";
        document.body.append(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      btn.classList.add("is-copied");
      if (status) status.textContent = "Email copiado";
      setTimeout(() => {
        btn.classList.remove("is-copied");
        if (status) status.textContent = "";
      }, 2000);
    });
  });
}
