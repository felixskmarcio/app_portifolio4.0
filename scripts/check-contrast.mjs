// Verifica as razões de contraste (WCAG 2.x) contra os tokens REAIS de
// src/styles/tokens.css e varre o CSS atrás de cores proibidas pelo briefing.
// Uso: npm run check:contrast   (sai com código 1 se algo reprovar)
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stylesDir = join(root, "src", "styles");
const tokensCss = readFileSync(join(stylesDir, "tokens.css"), "utf8");

const tok = {};
for (const m of tokensCss.matchAll(/--sol-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)) tok[m[1]] = m[2];

const lin = (c) => {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (h) => {
  const [r, g, b] = rgb(h).map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
// mistura `fg` com alfa `a` sobre `bg` (receita de chip: tinta 16%)
const mix = (fg, a, bg) => {
  const f = rgb(fg), b = rgb(bg);
  return "#" + f.map((v, i) => Math.round(v * a + b[i] * (1 - a)).toString(16).padStart(2, "0")).join("");
};

const T = (n) => {
  if (!tok[n]) throw new Error(`token --sol-${n} não encontrado em tokens.css`);
  return tok[n];
};

// [descrição, fg, bg, mínimo]  — 4.5 texto normal · 3 texto grande / UI
const checks = [
  ["texto principal  base02 / base3", T("base02"), T("base3"), 4.5],
  ["título           base03 / base3", T("base03"), T("base3"), 4.5],
  ["secundário       base01 / base3", T("base01"), T("base3"), 4.5],
  ["secundário       ink-2  / base2", T("ink-2"), T("base2"), 4.5],
  ["texto sobre base2 base02 / base2", T("base02"), T("base2"), 4.5],
  ["título sobre base2 base03 / base2", T("base03"), T("base2"), 4.5],
  ["botão/CTA        base3  / orange-ink", T("base3"), T("orange-ink"), 4.5],
  ["bloco contato    base3  / orange-ink", T("base3"), T("orange-ink"), 4.5],
  ["escuro texto     base2  / base03", T("base2"), T("base03"), 4.5],
  ["escuro secundário base1 / base03", T("base1"), T("base03"), 4.5],
  ["escuro parágrafo dim    / base03", T("dim-dark"), T("base03"), 4.5],
  ["escuro parágrafo dim    / base02 (cartão)", T("dim-dark"), T("base02"), 4.5],
  ["escuro texto     base2  / base02 (cartão)", T("base2"), T("base02"), 4.5],
  ["seleção          base03 / select", T("base03"), T("select"), 4.5],
  ["foco claro       base02 / base3 (UI ≥3)", T("base02"), T("base3"), 3],
  ["foco claro       base02 / base2 (UI ≥3)", T("base02"), T("base2"), 3],
  ["foco escuro      base2  / base03 (UI ≥3)", T("base2"), T("base03"), 3],
  ["foco contato     base3  / orange-ink (UI ≥3)", T("base3"), T("orange-ink"), 3],
  ["sublinhado ativo orange-ink / base2 (UI ≥3)", T("orange-ink"), T("base2"), 3],
  ["progresso        yellow / base02 (UI ≥3)", T("yellow"), T("base02"), 3],
  // marquee: texto GRANDE (≥ 3rem) sobre base03 → mínimo 3
  ...["blue", "cyan", "magenta", "violet", "green", "yellow"].map((c) => [
    `marquee grande    ${c.padEnd(7)} / base03`, T(c), T("base03"), 3,
  ]),
];

// chips: tinta 16% da cor de sintaxe sobre o fundo + texto base02
for (const c of ["blue", "cyan", "magenta"]) {
  for (const bgName of ["base3", "base2"]) {
    const tint = mix(T(c), 0.16, T(bgName));
    checks.push([`chip ${c.padEnd(7)} (tinta 16% / ${bgName}) texto base02`, T("base02"), tint, 4.5]);
  }
}

let fail = 0;
console.log("\nContraste WCAG 2.x\n" + "─".repeat(66));
for (const [label, fg, bg, min] of checks) {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) fail++;
  console.log(`${ok ? "✔" : "✘"} ${r.toFixed(2).padStart(5)}:1  (mín ${min})  ${label}`);
}

// --- cores proibidas pelo briefing (seção 9) ---------------------------------
const banned = [
  ["#000 / #000000", /#000(?:000)?\b(?![0-9a-f])/gi],
  ["#fff / #ffffff", /#fff(?:fff)?\b(?![0-9a-f])/gi],
  ["#f8f7f4 (branco-osso antigo)", /#f8f7f4/gi],
  ["#582fcd (roxo antigo)", /#582fcd/gi],
  ["#657b83 (base00 reprova AA)", /#657b83/gi],
  ["#b49471 (foco do VS Code reprova 3:1)", /#b49471/gi],
];
console.log("\nCores proibidas no CSS\n" + "─".repeat(66));
for (const f of readdirSync(stylesDir).filter((n) => n.endsWith(".css"))) {
  const css = readFileSync(join(stylesDir, f), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  for (const [name, re] of banned) {
    const hits = css.match(re);
    if (hits) {
      fail++;
      console.log(`✘ ${f}: ${name} ×${hits.length}`);
    }
  }
}
if (!fail) console.log("✔ nenhuma");

console.log(fail ? `\n${fail} problema(s).` : "\nTudo dentro da tabela 5.2 do briefing.");
process.exit(fail ? 1 : 0);
