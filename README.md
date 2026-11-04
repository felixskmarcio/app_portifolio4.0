---
date: 2026-11-03
description: Portfólio de Marcio Felix (FelixBR) redesenhado em Solarized Light, direção A "Ficha Técnica" — Vite + GSAP + Lenis, pt-BR, página única.
tags: [project, portfolio, frontend]
---

# app_portifolio — FelixBR · Solarized Light (Direção A "Ficha Técnica")

Redesenho do portfólio atual (`../Portifiloio`) seguindo o briefing "Solarized Light": **mesmo conteúdo, idioma e fontes**, outra cor e outro formato. Documento técnico em papel creme, régua visível, números de seção, laranja só para ação.

## Rodar

```bash
npm install
npm run dev            # http://127.0.0.1:5173
npm run build          # dist/ + confere o orçamento (JS ≤ 250 KB, CSS ≤ 100 KB)
npm run check:contrast # razões WCAG contra os tokens reais + varredura de cores proibidas
npm run check          # contraste + build + orçamento
```

## Estrutura

```
index.html            conteúdo estático (pt-BR) + sprite SVG (logo e ícones)
src/main.js           orquestra a ordem dos ScrollTriggers
src/styles/           tokens → base → chrome (nav, preloader…) → sections
src/js/               um módulo por efeito (preloader, scroll, hero, marquee, work, …)
public/videos/        vídeo do Orto Clinic
public/work/          capturas (JPG 1440×810) dos outros 3 projetos de Trabalhos
scripts/              check-contrast.mjs · check-budget.mjs
```

Cor: `src/styles/tokens.css` é a fonte da verdade. Cada seção declara `data-theme="light|mid|dark|accent"` e redefine as variáveis (`--bg --fg --fg-2 --line --focus`); o `<body>` troca de tema por scroll só para o que é fixo (botão do WhatsApp, mistura do cursor, `theme-color`).

## Onde o resultado difere do briefing (e por quê)

| Briefing | Aqui |
| --- | --- |
| H1 "~16–18vw" | `DESENVOLVEDOR` tem 13 letras: não cabe a 16vw. O JS mede a linha mais larga e escala para preencher 99,5% da largura (≈11vw). |
| Cursor de fluido WebGL | Canvas 2D leve (manchas laranja/azul, amarelo nos picos). O `SplashCursor.js` do projeto antigo era um ripple de clique, não WebGL. |
| Cena 3D Spline | Substituída pelo logo FELIXBR em outline que gira com o scroll (fallback previsto no briefing). |
| Textura de papel com `multiply` | Alfa simples (5%): visual equivalente sem forçar blend de tela inteira a cada frame de scroll. |
| "Mostrar Mais" | Substituído pelo acordeão (como o briefing manda). As pílulas de preço (`$$$`) do site antigo não estão na tabela do briefing e ficaram de fora. |
| Splide/Swiper | Carrossel de depoimentos nativo (scroll-snap + arrastar). Sem dependência extra: só `gsap` e `lenis`. |
| Cards da galeria 4:5 (altos) | Cards 16:9: o vídeo (1920×1080) e as capturas dos sites são paisagem; em 4:5 perderiam mais da metade da imagem. A galeria horizontal fixada continua (desktop); no mobile vira pilha vertical. |

## Antes de publicar

- **"Agendar call"** aponta para o WhatsApp, o canal definitivo confirmado (mesma conversa do botão flutuante, com mensagem pré-preenchida). O link do site antigo (`cal.com/muradov.design/intro/`) é o calendário do autor do template e **não foi copiado**.
- **Depoimentos:** os 4 do template foram removidos (não eram do Marcio). A seção continua no código e **fica oculta enquanto vazia**. Para publicar um real, copie o modelo comentado dentro de `<ul class="testi__track">` em `index.html` para fora do comentário e preencha (foto opcional, em `public/depoimentos/`). Só com o cliente tendo escrito e autorizado.
- **Trabalhos** tem 4 projetos: Orto Clinic (vídeo) e três sites seus (capturas estáticas em `public/work/`, tiradas em 2026-11-03: refaça se os sites mudarem). Os nomes vêm do `<title>` de cada página e as etiquetas só dizem o que foi verificado (hospedagem e stack lidas do próprio site); renomeie à vontade em `index.html`.
- O card **FelixBR** aponta para `portifolio.felixbr.org`, que é o domínio deste mesmo portfólio: quando este redesign for publicado lá, o card passa a apontar para si mesmo.
- Textos do rodapé traduzidos (única exceção permitida): "Vamos ver se somos um bom match numa call de 15 min" / "Agendar uma call".

## Verificado (build de produção, Edge)

Lighthouse: acessibilidade 100 · best practices 100 · SEO 100 · performance 97 (desktop) / 89 (mobile, varia ±3 entre rodadas) · CLS ≈ 0. Bundle: JS 167,8 KB · CSS 27,7 KB. Testado em 1280×720 → 1920×1080 e 390×844 (touch), com e sem `prefers-reduced-motion`.
