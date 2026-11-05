import { ScrollTrigger } from "gsap/ScrollTrigger";
import { $, $$ } from "./util.js";
import { scrollToHash } from "./scroll.js";

// <meta name="theme-color"> acompanha o fundo dominante da seção. As cores vêm dos tokens
// (tokens.css é a fonte da verdade); antes eram 4 hex copiados aqui e podiam divergir.
const token = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/**
 * 2 · Troca de tema por seção: a 50% da viewport, o `data-theme` do body passa
 * a ser o da seção sob o centro da tela. Isso alimenta o que é FIXO (botão do
 * WhatsApp, mistura do cursor de tinta, theme-color) e transiciona em 0.6s.
 * A mesma passagem marca o link ativo da navegação (aria-current).
 */
export function initSections() {
  const meta = $('meta[name="theme-color"]');
  const links = $$("[data-nav-link]");
  const THEME_COLOR = {
    light: token("--sol-base3"),
    mid: token("--sol-base2"),
    dark: token("--sol-base03"),
    accent: token("--sol-orange-ink"),
  };

  const setActive = (key) =>
    links.forEach((a) => {
      if (a.dataset.navLink === key) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });

  const activate = (sec) => {
    const theme = sec.dataset.theme;
    document.body.dataset.theme = theme;
    if (meta) meta.content = THEME_COLOR[theme] ?? THEME_COLOR.light;
    if (sec.dataset.nav) setActive(sec.dataset.nav);
  };

  $$("main > section[data-theme], footer.strip[data-theme]").forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: "top 50%",
      end: "bottom 50%",
      onToggle: (self) => self.isActive && activate(sec),
    });
  });

  const first = $("main > section[data-theme]");
  if (first) activate(first);
}

/** Menu mobile (tela cheia) + âncoras suaves com Lenis. */
export function initNav({ lenis }) {
  const toggle = $(".nav__toggle");
  const menu = $("#menu");
  const main = $("#main");
  const strip = $(".strip");
  const desktopMQ = window.matchMedia("(min-width: 62rem)");

  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    menu.classList.toggle("is-open", open);
    document.documentElement.classList.toggle("menu-open", open);
    // enquanto aberto, o conteúdo atrás não recebe foco nem leitor de tela
    main.inert = open;
    if (strip) strip.inert = open;
    if (open) {
      lenis?.stop();
      $("a", menu)?.focus({ preventScroll: true });
    } else {
      lenis?.start();
    }
  };

  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });
  desktopMQ.addEventListener("change", (e) => e.matches && setMenu(false));

  // âncoras internas
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.classList.contains("skip-link")) return;
    const hash = a.getAttribute("href");
    if (hash === "#") return;

    if (menu.classList.contains("is-open")) setMenu(false);
    if (scrollToHash(lenis, hash)) {
      e.preventDefault();
      history.pushState(null, "", hash);
      // o preventDefault tira o foco-de-navegação nativo: sem isto o próximo Tab continuava
      // do link clicado em vez de da seção de destino
      const target = document.getElementById(hash.slice(1));
      if (target) {
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    }
  });
}
