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
src/styles/           tokens → base → chrome (nav, preloader…) → sections → contexts (alto contraste e impressão)
src/js/               um módulo por efeito (preloader, scroll, hero, marquee, work, …)
public/videos/        vídeo do Orto Clinic (1280×720 · 37 s · 2,3 MB) + pôster WebP
public/curriculo-marcio-felix.pdf   currículo v2.1, baixável no Contato (relativo: funciona em subpasta)
public/work/          capturas (JPG 1440×810) dos outros 3 projetos de Trabalhos
public/og.png · favicon.svg · favicon-32.png · apple-touch-icon.png   identidade própria (não vêm de CDN de terceiros)
media-src/            matriz do vídeo em 1920×1080 (fora do build: não é publicada)
scripts/              check-contrast.mjs · check-budget.mjs
scripts/brand/og.html fonte da imagem de compartilhamento (public/og.png)
```

Breakpoints: todos em **rem** (`62rem` = 992px, `47.9375rem` = 767px, `29.9375rem` = 479px…), tanto no CSS quanto em `matchMedia`. Na fonte padrão de 16px nada muda; quem aumenta o tamanho de fonte padrão do navegador passa para o layout mobile mais cedo (a 150%, o desktop só começa em ~1488px). Três decisões usam *container queries*, porque dependem do espaço que o componente tem, não da janela: o CTA do nav some se não couber junto com logo e menu (`17,9rem`), o cabeçalho do acordeão empilha abaixo de `20,4rem`, e o H1 se dimensiona em `cqw`. O menu mobile rola e, em telas baixas (`max-height: 32rem`, celular na horizontal), vira duas colunas. A galeria de Trabalhos começa na borda do container centrado (`--gutter`) e o cartão chega a 80rem em telas grandes.

Cor: `src/styles/tokens.css` é a fonte da verdade. Cada seção declara `data-theme="light|mid|dark|accent"` e redefine as variáveis (`--bg --fg --fg-2 --line --focus`); o `<body>` troca de tema por scroll só para o que é fixo (botão do WhatsApp, mistura do cursor, `theme-color`).

## Onde o resultado difere do briefing (e por quê)

| Briefing | Aqui |
| --- | --- |
| H1 "~16–18vw" | `DESENVOLVEDOR` tem 13 letras: não cabe a 16vw. O CSS dimensiona o H1 pela largura do container (`cqw`, razão medida da Telegraf: 8,025 em) para preencher 99,5% (≈11vw) já no 1º paint; o JS só refina se a medição real divergir mais de 0,8%. |
| Cursor de fluido WebGL | Canvas 2D leve (manchas laranja/azul, amarelo nos picos). O `SplashCursor.js` do projeto antigo era um ripple de clique, não WebGL. |
| Cena 3D Spline | Substituída pelo logo FELIXBR em outline que gira com o scroll (fallback previsto no briefing). |
| Textura de papel com `multiply` | Alfa simples (5%): visual equivalente sem forçar blend de tela inteira a cada frame de scroll. |
| "Mostrar Mais" | Substituído pelo acordeão (como o briefing manda). As pílulas de preço (`$$$`) do site antigo não estão na tabela do briefing e ficaram de fora. |
| Splide/Swiper | Carrossel de depoimentos nativo (scroll-snap + arrastar). Sem dependência extra: só `gsap` e `lenis`. |
| Cards da galeria 4:5 (altos) | Cards 16:9: o vídeo (1280×720; matriz 1920×1080 em `media-src/`) e as capturas dos sites são paisagem; em 4:5 perderiam mais da metade da imagem. A galeria horizontal fixada continua (desktop); no mobile vira pilha vertical. |

## Antes de publicar

- **"Agendar call"** aponta para o WhatsApp, o canal definitivo confirmado (mesma conversa do botão flutuante, com mensagem pré-preenchida). O link do site antigo (`cal.com/muradov.design/intro/`) é o calendário do autor do template e **não foi copiado**.
- **Depoimentos:** os 4 do template foram removidos (não eram do Marcio). A seção continua no código e **fica oculta enquanto vazia**. Para publicar um real, copie o modelo comentado dentro de `<ul class="testi__track">` em `index.html` para fora do comentário e preencha (foto opcional, em `public/depoimentos/`). Só com o cliente tendo escrito e autorizado.
- **Trabalhos** tem 4 projetos: Orto Clinic (vídeo) e três sites seus (capturas estáticas em `public/work/`, tiradas em 2026-11-03: refaça se os sites mudarem). Os nomes vêm do `<title>` de cada página e as etiquetas só dizem o que foi verificado (hospedagem e stack lidas do próprio site); renomeie à vontade em `index.html`.
- O card **FelixBR** aponta para `portifolio.felixbr.org`, que é o domínio deste mesmo portfólio: quando este redesign for publicado lá, o card passa a apontar para si mesmo.
- **Currículo:** o PDF em `public/` ainda traz o e-mail `felixskmarcio@gmail.com` e o LinkedIn `/in/felixskmarcio`, que o dono disse **não** serem os certos (os do site são `felixskmarcio2@gmail.com` e `/in/marcio-eduardo-felixbr-0010a530/`; o telefone do PDF está certo e é o que o WhatsApp do site usa). **Regere o PDF com esses dois dados antes de publicar.** A seção Sobre tem a "ficha" (experiência, formação, certificações) com dados do currículo v2.1; "Empresa de telecom" está sem o nome da empresa de propósito (o currículo nomeia a empresa).
- Textos do rodapé traduzidos (única exceção permitida): "Vamos ver se somos um bom match numa call de 15 min" / "Agendar uma call".

## Verificado (build de produção, Edge)

Lighthouse (2026-11-03, **antes** da otimização de 2026-11-04; refaça): acessibilidade 100 · best practices 100 · SEO 100 · performance 97 (desktop) / 89 (mobile, varia ±3 entre rodadas). Testado em 1280×720 → 1920×1080 e 390×844 (touch), com e sem `prefers-reduced-motion`.

Bundle (2026-11-04): JS 171,0 KB (gzip 63,8) · CSS 36,1 KB (`npm run build` confere o orçamento de 250/100 KB).

Adaptação (2026-11-04), Chrome headless, 22 contextos: celular em pé (320 a 430), na horizontal (568×320 a 932×430), tablet (768 a 1180, inclusive 1024×768 com touch), desktop (1024×600 a 2560×1440) e fonte padrão do navegador a 150% e 200% (preferência real do Chrome, não `html { font-size }`). Em cada um: nenhum elemento fora da tela, nenhum texto cortado, alvos de toque ≥ 44px, menu alcançável, galeria navegável por teclado. Não testado: Safari/iOS, Firefox, aparelho real, gesto de toque real.

Alto contraste e impressão (2026-11-04), em `src/styles/contexts.css`: o modo de alto contraste (`forced-colors`) apaga fundos, então o sublinhado da seção ativa, as barras de progresso, os pontos dos chips e o quadrado do "Disponível" ganharam substitutos (testado com o tema de contraste preto do Chrome). Na impressão, tintas da marca sobre papel em todas as seções (as escuras e o laranja do contato dependiam de FUNDO, que a impressora descarta: o e-mail e o currículo saíam quase invisíveis), sem nav/botão flutuante repetidos em cada página, galeria em grade de 2 colunas com o endereço de cada projeto, serviços todos abertos, redes como lista de endereços e números/títulos já no estado final mesmo sem rolar a página (`beforeprint` em `main.js`). Conferido em A4 pelo visualizador de PDF do Chrome, imprimindo logo após carregar e depois de rolar tudo. Não testado: impressora física, Firefox/Safari, o tema de contraste branco do Windows.

### Desempenho: medido antes e depois (2026-11-04)

Chrome headless (CDP), build de produção em `vite preview`, 3 rodadas por cenário, mediana. "Celular" = 390×844, CPU 4× mais lenta, rede 1,6 Mb/s e 150 ms de RTT, sem cache. Não é Lighthouse e não substitui um teste em aparelho real.

| | Antes | Depois |
| --- | --- | --- |
| H1 visível, 1ª visita, desktop | 2,48 s | 1,40 s |
| H1 visível, 1ª visita, celular | 3,96 s | 2,93 s |
| CLS (4 cenários) | 0,008 a 0,106 | 0 a 0,007 (com as fontes chegando 2,5 s atrasadas: 0,0015) |
| TBT, celular | 814 a 1016 ms | 683 a 816 ms |
| Parado no topo, celular: layouts/s · script | 61 · 99 ms/s | 0 · ~20 ms/s |
| Vídeo do Orto Clinic | 7,05 MB, sem pôster, também no celular | 2,29 MB, pôster de 14 KB, nada baixado com Save-Data, conexão lenta ou movimento reduzido |

Sobra: ~150 ms/s de recálculo de estilo no celular enquanto a faixa e os 5 pontos do logo se movem (o botão de pausa zera); e um bloco de ~500 ms (avaliação do bundle + 1º layout) na CPU 4×. Para o 1º, medir em GPU real; para o 2º, dividir o bundle (GSAP SplitText/ScrambleText/Lenis) é o próximo passo.
