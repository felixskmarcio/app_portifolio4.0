import { finePointerMQ } from "./util.js";

/**
 * 6 · Cursor de tinta recolorido — laranja + azul, amarelo nos picos de
 * velocidade. É um canvas 2D leve (manchas radiais que esmaecem), não o
 * fluido WebGL do site antigo: cabe no orçamento de JS e só desenha enquanto
 * há tinta na tela. Opacidade ≤ .30 e `multiply` sobre claro / `screen` sobre
 * escuro vêm do CSS (.ink). Desligado em touch e com movimento reduzido.
 */
export function initInk({ reduced }) {
  if (reduced || !finePointerMQ.matches) return;

  const canvas = document.createElement("canvas");
  canvas.className = "ink";
  canvas.setAttribute("aria-hidden", "true");
  document.body.append(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const css = getComputedStyle(document.documentElement);
  const color = {
    orange: css.getPropertyValue("--sol-orange").trim(),
    blue: css.getPropertyValue("--sol-blue").trim(),
    yellow: css.getPropertyValue("--sol-yellow").trim(),
  };

  let w = 0;
  let h = 0;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);

  const blobs = [];
  let last = null;
  let travelled = 0;
  let useBlue = false;
  let raf = 0;
  let prev = 0;

  const spawn = (x, y, speed) => {
    const peak = speed > 42;
    blobs.push({
      x,
      y,
      r: 16 + Math.min(speed, 70) * 0.55,
      life: 0,
      max: 850 + Math.random() * 450,
      color: peak ? color.yellow : useBlue ? color.blue : color.orange,
    });
    if (blobs.length > 90) blobs.shift();
  };

  const tick = (t) => {
    const dt = Math.min(t - prev, 48);
    prev = t;
    ctx.clearRect(0, 0, w, h);

    for (let i = blobs.length - 1; i >= 0; i--) {
      const b = blobs[i];
      b.life += dt;
      const k = b.life / b.max;
      if (k >= 1) {
        blobs.splice(i, 1);
        continue;
      }
      const r = b.r * (1 + k * 0.6);
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
      g.addColorStop(0, b.color);
      g.addColorStop(1, `${b.color}00`);
      ctx.globalAlpha = (1 - k) * (1 - k);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    raf = blobs.length ? requestAnimationFrame(tick) : 0;
    if (!raf) ctx.clearRect(0, 0, w, h);
  };

  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "mouse") return;
      const p = { x: e.clientX, y: e.clientY };
      if (last) {
        const dx = p.x - last.x;
        const dy = p.y - last.y;
        const d = Math.hypot(dx, dy);
        const steps = Math.max(1, Math.ceil(d / 12));
        for (let i = 1; i <= steps; i++) spawn(last.x + (dx * i) / steps, last.y + (dy * i) / steps, d);
        travelled += d;
        if (travelled > 260) {
          useBlue = !useBlue;
          travelled = 0;
        }
      }
      last = p;
      if (!raf) {
        prev = performance.now();
        raf = requestAnimationFrame(tick);
      }
    },
    { passive: true },
  );
  document.addEventListener("pointerleave", () => (last = null));
}
