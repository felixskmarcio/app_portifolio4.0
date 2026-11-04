import { gsap } from "gsap";
import { $, $$, navHeight, pad2 } from "./util.js";

const DESKTOP = "(min-width: 992px)";

/**
 * Trabalhos — galeria horizontal fixada (pin) no desktop; pilha vertical no mobile.
 *  · o vídeo só carrega/toca perto da tela (com movimento reduzido: só o 1º frame)
 *  · 8 · entrada em clip-path quando o card aparece (a transição é CSS: .in)
 *  · o card vira cor ao passar pelo centro da tela (.is-center) e atualiza o contador
 */
export function initWork({ reduced }) {
  const section = $("#work");
  const pin = $(".work__pin", section);
  const track = $("[data-work-track]", section);
  if (!section || !pin || !track) return;

  const cards = $$("[data-card]", track);
  const countEl = $("[data-work-count]", section);
  const bar = $("[data-work-bar]", section);
  const total = cards.length;

  // vídeos: só perto da tela
  const videoIO = new IntersectionObserver(
    (entries) => {
      for (const { target: v, isIntersecting } of entries) {
        if (isIntersecting) {
          if (!v.dataset.loaded) {
            v.dataset.loaded = "1";
            v.preload = "metadata";
            v.load();
          }
          if (!reduced) v.play().catch(() => {});
        } else {
          v.pause();
        }
      }
    },
    { rootMargin: "200px" },
  );
  $$("video[data-lazy-video]", track).forEach((v) => {
    v.muted = true; // autoplay exige muted também como propriedade
    videoIO.observe(v);
  });

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

    return () => {
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
