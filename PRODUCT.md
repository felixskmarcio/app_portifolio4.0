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

- Agendar call: **WhatsApp é o canal definitivo** (confirmado): `wa.me/558298274851` com mensagem pré-preenchida. Não há calendário.
- Outros canais: e-mail `felixskmarcio2@gmail.com` (com botão de copiar); redes Webflow, LinkedIn, Behance e Telegram.
- Domínio: `portifolio.felixbr.org`. Existem duas versões anteriores do portfólio, ainda no ar, listadas em Trabalhos (Vercel e GitHub Pages).

## Capabilities and Constraints

- Serviços, com o texto já escrito pelo dono (preservar): (1) Desenvolvimento Web & Frontend: React & Next.js, Vue & Vite, TypeScript, Integração com APIs, Landing Pages, PWAs & SPAs, Performance & SEO. (2) Automação & Agentes de IA: Workflows N8N, Agentes Langflow, Integração WhatsApp/CRM, Bots de atendimento, Integração com CRMs, Scraping & ETL, Dashboards em tempo real. (3) Vibe Coding & Consultoria: Cursor & Lovable, Bolt & Windsurf, Code Review, Treinamento de equipe.
- Só pt-BR.
- Orçamento do briefing do dono: JS ≤ 250 KB, CSS ≤ 100 KB, sem dependências novas além de GSAP e Lenis.
- O calendário do site antigo (`cal.com/muradov.design/intro/`) pertence ao autor do template Webflow e nunca deve ser usado.
- **Em aberto:** as fontes (Telegraf e Fraktion Mono) são servidas do CDN do Webflow do autor do template. Licença de uso e disponibilidade a longo prazo não confirmadas; o dono pediu para manter essas famílias. A imagem de compartilhamento (`og:image`) também aponta para esse CDN. Os avatares dos depoimentos do template, que vinham de lá, foram removidos em 2026-11-03.

## Brand Commitments

- Nome: Marcio Felix / FelixBR. Voz: português direto, primeira pessoa ("Sou Marcio Felix…", "Construo…"), sem enrolação.
- Restrições que o dono declarou como obrigatórias no briefing de 2026-11-03, registradas sem ampliar: logo FELIXBR com o desenho original, só recolorível; famílias tipográficas Telegraf e Fraktion Mono mantidas; paleta Solarized Light.

## Evidence on Hand

Confirmado ou presente:

- **Orto Clinic** (`clinic.felixbr.org`): projeto do dono, no ar. Demo em vídeo: `public/videos/orto-clinic-demo.webm` (1920×1080).
- Três portfólios próprios, confirmados pelo dono como projetos seus: `portifolio.felixbr.org` (Webflow + GSAP), `felixbr-portifolio-2.vercel.app`, `felixskmarcio.github.io/FelixBr.github.io-master/`. Capturas estáticas de 2026-11-03 em `public/work/`.
- Números exibidos, herdados do site anterior e não reverificados nesta sessão: "1+ Anos de experiência", "3+ Projetos Feitos", "5+ Ferramentas de IA Dominadas".

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
