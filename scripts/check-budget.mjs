// Orçamento de performance do briefing: JS ≤ 250 KB, CSS ≤ 100 KB.
// Mede os arquivos MINIFICADOS de dist/assets (tamanho em disco) e mostra o gzip.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist", "assets");
if (!existsSync(dist)) {
  console.error("dist/assets não existe — rode `vite build` antes.");
  process.exit(1);
}

const KB = 1024;
const budget = { js: 250 * KB, css: 100 * KB };
const totals = { js: { raw: 0, gz: 0 }, css: { raw: 0, gz: 0 } };

for (const f of readdirSync(dist)) {
  const ext = f.endsWith(".js") ? "js" : f.endsWith(".css") ? "css" : null;
  if (!ext) continue;
  const buf = readFileSync(join(dist, f));
  const gz = gzipSync(buf).length;
  totals[ext].raw += buf.length;
  totals[ext].gz += gz;
  console.log(`  ${f.padEnd(34)} ${(buf.length / KB).toFixed(1).padStart(7)} KB   gzip ${(gz / KB).toFixed(1).padStart(6)} KB`);
}

let fail = false;
console.log("");
for (const k of ["js", "css"]) {
  const { raw, gz } = totals[k];
  const ok = raw <= budget[k];
  if (!ok) fail = true;
  console.log(
    `${ok ? "✔" : "✘"} ${k.toUpperCase().padEnd(3)} ${(raw / KB).toFixed(1)} KB (gzip ${(gz / KB).toFixed(1)} KB) · orçamento ${budget[k] / KB} KB`,
  );
}
process.exit(fail ? 1 : 0);
