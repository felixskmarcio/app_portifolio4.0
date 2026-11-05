# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Site em pt-BR de Marcio Felix (FelixBR), no Brasil. Quem decide a partir dele, confirmado pelo dono em 2026-11-03: donos de negócio e clínicas que precisam de site, landing page ou automação; times e empresas de tecnologia que querem treinamento em vibe coding; agências e devs que subcontratam front-end; recrutadores e vagas. O dono não definiu ordem de prioridade entre os quatro.

Situação e tarefa (do briefing do dono): o visitante é um cliente em potencial que, em cerca de 5 segundos, precisa entender quem é o Felix e o nível do trabalho, percorrer os projetos e agendar uma call de 15 minutos.

## Product Purpose

Portfólio pessoal de página única de Marcio Felix: Developer Frontend, Vibe Coding Coach e entusiasta de IA. Seções por âncora: Trabalhos, Sobre, Serviços, Contato. Existe para converter uma visita em uma call de 15 minutos ("Agendar call"). Sucesso = calls agendadas por visitantes que já entenderam quem ele é e o que entrega.

## Positioning

Afirmações que o dono confirmou como suas (2026-11-03):

- Entrega em dias, com IA (vibe coding), não em meses: landing pages, sistemas e automações com prazo real.
- Front-end e automação no mesmo profissional: React, Next.js, Vue e também N8N, Langflow e agentes de IA.
- Ensina o que pratica: é coach de vibe coding.
- Curadoria do que realmente vai para produção: a IA acelera, mas há revisão humana.

"Em dias, não meses" é a promessa do dono; não há no repositório nenhuma evidência de prazo entregue. Não acrescentar números ou prazos específicos que ele não tenha dado.

## Operating Context

O site é a porta de entrada; a conversão acontece fora dele.

- Agendar call: **WhatsApp é o canal definitivo** (confirmado): `wa.me/5582998274851` com mensagem pré-preenchida (número do currículo, (82) 99827-4851). Em 2026-11-04 o dono testou os dois números e **só este abre a conversa dele**; o `558298274851` que o site usava até então não chegava até ele. Não há calendário.
- Outros canais: e-mail `felixskmarcio2@gmail.com` (com botão de copiar); redes Webflow, LinkedIn, Behance e Telegram.
- Domínio: `portifolio.felixbr.org`. Existem duas versões anteriores do portfólio, ainda no ar, listadas em Trabalhos (Vercel e GitHub Pages).

## Capabilities and Constraints

- Serviços, com o texto já escrito pelo dono (preservar): (1) Desenvolvimento Web & Frontend: React & Next.js, Vue & Vite, TypeScript, Integração com APIs, Landing Pages, PWAs & SPAs, Performance & SEO. (2) Automação & Agentes de IA: Workflows N8N, Agentes Langflow, Integração WhatsApp/CRM, Bots de atendimento, Integração com CRMs, Scraping & ETL, Dashboards em tempo real. (3) Vibe Coding & Consultoria: Cursor & Lovable, Bolt & Windsurf, Code Review, Treinamento de equipe.
- Só pt-BR.
- Orçamento do briefing do dono: JS ≤ 250 KB, CSS ≤ 100 KB, sem dependências novas além de GSAP e Lenis.
- O calendário do site antigo (`cal.com/muradov.design/intro/`) pertence ao autor do template Webflow e nunca deve ser usado.
- **Em aberto:** as fontes (Telegraf e Fraktion Mono) são servidas do CDN do Webflow do autor do template. Licença de uso e disponibilidade a longo prazo não confirmadas; o dono pediu para manter essas famílias. Os avatares dos depoimentos do template, que vinham de lá, foram removidos em 2026-11-03. A imagem de compartilhamento (`og:image`), o favicon e o ícone de iOS também vinham desse CDN e eram a identidade do autor do template ("MURADOV", "M"); em 2026-11-04 foram trocados por arquivos próprios em `public/` (`og.png`, `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`; fonte do og em `scripts/brand/og.html`, só com texto já presente na página e o logo FELIXBR original recolorido). A `og:image` usa URL absoluta em `portifolio.felixbr.org`: só passa a resolver quando este build for publicado nesse domínio. **(TBC)** com o dono: aprovar a arte e o favicon (o "F" do logo, só escalado).

## Brand Commitments

- Nome: Marcio Felix / FelixBR. Nos dados formais (JSON-LD e copyright do rodapé) o nome é **Marcio Eduardo Felix** (decisão do dono em 2026-11-04); o texto corrido do site continua "Marcio Felix". Voz: português direto, primeira pessoa ("Sou Marcio Felix…", "Construo…"), sem enrolação.
- Restrições que o dono declarou como obrigatórias no briefing de 2026-11-03, registradas sem ampliar: logo FELIXBR com o desenho original, só recolorível; famílias tipográficas Telegraf e Fraktion Mono mantidas; paleta Solarized Light.

## Evidence on Hand

Confirmado ou presente:

- **Orto Clinic** (`clinic.felixbr.org`): projeto do dono, no ar. Demo em vídeo: `public/videos/orto-clinic-demo.webm` (1280×720, 37 s, 2,3 MB) com pôster `orto-clinic-poster.webp`. Em 2026-11-04 foi reencodado (VP9, ~350 kbps) a partir da matriz 1920×1080 (7 MB), guardada em `media-src/orto-clinic-demo.master.webm` fora do build; cortaram-se só os primeiros 3,5 s, que eram tela preta (o loader do site demonstrado), sem tirar conteúdo.
- Três portfólios próprios, confirmados pelo dono como projetos seus: `portifolio.felixbr.org` (Webflow + GSAP), `felixbr-portifolio-2.vercel.app`, `felixskmarcio.github.io/FelixBr.github.io-master/`. Capturas estáticas de 2026-11-03 em `public/work/`.
- **Currículo v2.1** (PDF de 2026-09-03, em `public/curriculo-marcio-felix.pdf`, baixável no Contato): documento do próprio dono e fonte de experiência, formação, certificações e stack. Em 2026-11-03 a seção Sobre ganhou uma "ficha" com esses dados, o GitHub entrou no rodapé e a stack do marquee ganhou TypeScript, Python e Docker.
- Números exibidos em Sobre (2026-11-03): "4+ Anos em sistemas e processos de TI" e "9+ Ferramentas de IA Dominadas" vêm do currículo (4+ anos de análise de sistemas/ERP/processos, não de front-end; nove ferramentas de IA listadas); "3+ Projetos Feitos" é herdado do site anterior; em 2026-11-04 o dono pediu para manter.
- A empresa onde o dono é supervisor de análise de sistemas aparece como "Empresa de telecom", sem o nome (inferido como escolha segura, **(TBC)** com o dono).

**Divergências entre currículo e site: decididas pelo dono em 2026-11-04** (o que estiver aqui como "corrigir no PDF" ainda precisa ser feito por ele, o PDF é dele):

- WhatsApp: vale `5582998274851` (o do currículo). Corrigido nos 4 botões do site. Ver Operating Context.
- E-mail: vale `felixskmarcio2@gmail.com` (o do site). **O currículo ainda traz `felixskmarcio@gmail.com`: regerar o PDF.**
- LinkedIn: vale `/in/marcio-eduardo-felixbr-0010a530/` (o do rodapé). O JSON-LD foi corrigido para ele. **Os links do currículo apontam para `linkedin.com/in/felixskmarcio`: regerar o PDF.**
- Bolt, Windsurf e Node.js: o dono usa as três; só não estão no currículo. Mantidas no site.
- JSON-LD do `ProfessionalService`: removidos `priceRange` ("$$", inventado: não há preços) e o idioma inglês (o currículo só tem português). Se ele atende em inglês, é só voltar `"English"`.
- Selo do Contato: virou "100% remoto · Brasil". Saiu o "Disponível", que prometia disponibilidade que ninguém confirmou (e envelhece).
- Ainda aberto: o currículo descreve o "portifolio-4 (este site)" com dark mode e PWA; este redesign é Solarized Light, sem PWA.

**Ausências que trabalho futuro não deve preencher:**

- **Não há depoimentos confirmados.** Os quatro que estavam na página (Gana M. · Goodz Club, Thomas V. · PAckvolwes, Kamado D. · Integral, Cristophe C. · Bazaranet) provavelmente vieram do template (o domínio, o calendário e as fontes do export são de `muradov.design`); o dono respondeu "não são meus / não sei" e pediu a seção pronta para receber os reais. Em 2026-11-03 eles foram **removidos**: a seção continua no código, oculta enquanto não houver nenhum depoimento, com um modelo comentado em `index.html` (`.testi__track`). Só publicar o que o cliente escreveu e autorizou; nunca preencher com texto de exemplo.
- Os projetos Neutral, Verbatim, JMK Engineers e GOODZ Club eram conteúdo de demonstração do template e foram removidos a pedido do dono.
- Sem estudos de caso com métricas, logos de clientes, imprensa, preços (as pílulas `$$$` do site antigo foram descartadas) nem calendário.

## Product Principles

1. **Só o que é verdadeiro e dele.** Projetos, depoimentos, números e clientes só aparecem se o dono confirmou; na dúvida, fica de fora.
2. **A call de 15 minutos é a conversão.** Cada seção encurta o caminho até "Agendar call", sem pressão.
3. **Específico, não inflado.** Português direto, na primeira pessoa; promessas ligadas a entregas concretas.
4. **O site prova o ofício.** Desempenho, acessibilidade e acabamento são parte da evidência de que ele é desenvolvedor front-end.
5. **Uma página, vários públicos.** Donos de negócio, times, agências e recrutadores se orientam pelos mesmos Trabalhos e Serviços, sem versões separadas.

## Accessibility & Inclusion

Requisitos do briefing do dono: Lighthouse de acessibilidade ≥ 95, contraste WCAG AA, foco visível, alvos de toque ≥ 44 px, `aria-label` em links só de ícone, e `prefers-reduced-motion` respeitado em todo efeito. Idioma `pt-BR`.
