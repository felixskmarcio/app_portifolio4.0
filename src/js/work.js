import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { $, $$, navHeight, pad2 } from "./util.js";
import { motion } from "./motion.js";

const DESKTOP = "(min-width: 62rem)";

/**
 * Trabalhos — galeria horizontal fixada (pin) no desktop; pilha vertical no mobile.
 *  · o vídeo só carrega/toca perto da tela (com movimento reduzido: só o 1º frame)
 *  · 8 · entrada em clip-path quando o card aparece (a transição é CSS: .in)
 *  · o card vira cor ao passar pelo centro da tela (.is-center) e atualiza o contador
 */
export function initWork({ lenis, reduced }) {
  const section = $("#work");
  const pin = $(".work__pin", section);
  const track = $("[data-work-track]", section);
  if (!section || !pin || !track) return;

  const cards = $$("[data-card]", track);
  const countEl = $("[data-work-count]", section);
  const bar = $("[data-work-bar]", section);
  const total = cards.length;

  // Vídeos: só perto da tela E só quando movimento e dados permitem. Com movimento
  // reduzido, Save-Data, conexão lenta ou pausa global, o card fica no pôster e o
  // arquivo nem é baixado (antes: ~7 MB mesmo no celular).
  const lightConnection = () => {
    const c = navigator.connection;
    return !c || !(c.saveData || /^(slow-2g|2g|3g)$/.test(c.effectiveType ?? ""));
  };
  const videos = $$("video[data-lazy-video]", track);
  const near = new Set();
  const syncVideo = (v) => {
    if (near.has(v) && !reduced && !motion.paused && lightConnection()) {
      if (!v.dataset.loaded) {
        v.dataset.loaded = "1";
        v.preload = "metadata";
        v.load();
      }
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  };
  const videoIO = new IntersectionObserver(
    (entries) => {
      for (const { target: v, isIntersecting } of entries) {
        if (isIntersecting) near.add(v);
        else near.delete(v);
        syncVideo(v);
      }
    },
    { rootMargin: "200px" },
  );
  videos.forEach((v) => {
    v.muted = true; // autoplay exige muted também como propriedade
    videoIO.observe(v);
  });
  motion.onChange(() => videos.forEach(syncVideo));

  // entrada: marca .in quando o card aparece
  const inIO = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        inIO.unobserve(e.target);
      }),
    { threshold: 0.12 },
  );
  cards.forEach((c) => inIO.observe(c));

  const setCount = (i) => countEl && (countEl.textContent = `${pad2(i + 1)}/${pad2(total)}`);

  // card "centralizado" → cor (e contador, quando não há pin). A faixa central é
  // horizontal no desktop e vertical no mobile, então o observer é recriado ao trocar.
  const desktopMQ = window.matchMedia(DESKTOP);
  const centered = new Set();
  const countByNearest = () => {
    if (section.classList.contains("is-pinned") || !centered.size) return; // com pin, o contador vem do progresso
    const vertical = !desktopMQ.matches;
    const mid = (vertical ? window.innerHeight : window.innerWidth) / 2;
    let best = 0;
    let bestDist = Infinity;
    centered.forEach((c) => {
      const r = c.getBoundingClientRect();
      const dist = Math.abs((vertical ? r.top + r.height / 2 : r.left + r.width / 2) - mid);
      if (dist < bestDist) [bestDist, best] = [dist, cards.indexOf(c)];
    });
    setCount(best);
  };
  let centerIO;
  const observeCenter = () => {
    centerIO?.disconnect();
    centered.clear();
    centerIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          e.target.classList.toggle("is-center", e.isIntersecting);
          if (e.isIntersecting) centered.add(e.target);
          else centered.delete(e.target);
        });
        countByNearest();
      },
      { rootMargin: desktopMQ.matches ? "0px -34% 0px -34%" : "-38% 0px -38% 0px" },
    );
    cards.forEach((c) => centerIO.observe(c));
  };
  observeCenter();
  desktopMQ.addEventListener("change", observeCenter);

  const mm = gsap.matchMedia();

  // Desktop + movimento permitido: pin + scroll horizontal ligado ao scroll vertical
  mm.add(`${DESKTOP} and (prefers-reduced-motion: no-preference)`, () => {
    section.classList.add("is-pinned");
    const dist = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);

    gsap.to(track, {
      x: () => -dist(),
      ease: "none",
      scrollTrigger: {
        id: "work",
        trigger: pin,
        start: () => `top top+=${navHeight()}`,
        end: () => `+=${dist()}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          bar?.style.setProperty("--p", self.progress.toFixed(4));
          setCount(Math.round(self.progress * (total - 1)));
        },
      },
    });

    // Teclado: com o trilho transladado, o Tab chega a cards fora da tela. Em vez de
    // deixar o navegador rolar o .work__pin (o que desalinha cabeçalho e contador),
    // levamos a PÁGINA ao ponto do pin em que aquele card aparece. O progresso
    // i/(n-1) é o mesmo que o contador usa e deixa o card inteiro à vista.
    // Só foco de teclado (:focus-visible): clique com o mouse não move a página.
    const onFocusIn = (e) => {
      if (!e.target.matches(":focus-visible")) return;
      const card = e.target.closest("[data-card]");
      const i = cards.indexOf(card);
      const st = ScrollTrigger.getById("work");
      if (i < 0 || !st || total < 2) return;
      const r = card.getBoundingClientRect();
      if (r.left >= 0 && r.right <= document.documentElement.clientWidth) return; // já está à vista
      const y = st.start + (i / (total - 1)) * (st.end - st.start);
      if (lenis) lenis.scrollTo(y, { duration: 0.7, force: true });
      else window.scrollTo({ top: y });
    };
    // cinto e suspensório para navegadores sem `overflow: clip`
    const resetPin = () => {
      if (pin.scrollLeft || pin.scrollTop) pin.scrollTo(0, 0);
    };
    track.addEventListener("focusin", onFocusIn);
    pin.addEventListener("scroll", resetPin, { passive: true });

    return () => {
      track.removeEventListener("focusin", onFocusIn);
      pin.removeEventListener("scroll", resetPin);
      section.classList.remove("is-pinned");
      gsap.set(track, { clearProps: "transform" });
    };
  });

  // Desktop + movimento reduzido: sem pin, trilho rolável (precisa ser focável)
  mm.add(`${DESKTOP} and (prefers-reduced-motion: reduce)`, () => {
    track.tabIndex = 0;
    const onScroll = () => {
      const max = track.scrollWidth - track.clientWidth;
      bar?.style.setProperty("--p", max > 0 ? (track.scrollLeft / max).toFixed(4) : 0);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeAttribute("tabindex");
      track.removeEventListener("scroll", onScroll);
    };
  });
}
