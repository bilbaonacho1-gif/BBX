// BBX Soluciones Financieras SA — sin librerías.
const CONFIG = {
  whatsapp: "5491157502360", // +54 9 11 5750-2360
  slideMs: 7000,             // tiempo de cada diapositiva del carrusel
};

const $ = (id) => document.getElementById(id);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const root = document.documentElement;
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

const fmtMoney = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
const fmtInt = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

const header = $("header");
const hero = $("inicio");
const intro = $("intro");
const waFloat = document.querySelector(".wa-float");

/* =========================================================
   1) Apertura: primero el logo solo (las piezas se arman),
      después la pantalla se abre en diagonal y aparece la portada.
   ========================================================= */
let heroShown = false;
function showHero() {
  if (heroShown) return;
  heroShown = true;
  header.classList.add("is-in");
  waFloat.classList.add("is-in");
  hero.classList.add("is-revealed");
  countUp();
  carousel.start();
}

function openIntro() {
  if (!intro || intro.classList.contains("is-open")) return;
  intro.classList.add("is-open");
  try { sessionStorage.setItem("bbx-intro", "1"); } catch (e) {}
  setTimeout(showHero, 200);
  setTimeout(() => intro.remove(), 1400);
}

/* =========================================================
   2) Carrusel de la portada
   ========================================================= */
const carousel = (() => {
  const slides = $$(".slide", hero);
  const dots = $$(".dot", hero);
  let cur = 0, t0 = 0, elapsed = 0, paused = false, running = false, raf = 0;

  function go(i) {
    const next = (i + slides.length) % slides.length;
    if (next === cur) return;
    slides[cur].classList.remove("is-active");
    dots[cur].classList.remove("is-active");
    dots[cur].setAttribute("aria-selected", "false");
    dots[cur].style.setProperty("--p", 0);
    cur = next;
    // las imágenes diferidas se cargan antes de mostrarse
    const img = slides[cur].querySelector("img");
    if (img) img.loading = "eager";
    slides[cur].classList.add("is-active");
    dots[cur].classList.add("is-active");
    dots[cur].setAttribute("aria-selected", "true");
    elapsed = 0;
    t0 = performance.now();
  }

  function tick(now) {
    if (!paused) {
      const p = clamp((elapsed + now - t0) / CONFIG.slideMs);
      dots[cur].style.setProperty("--p", p.toFixed(4));
      if (p >= 1) go(cur + 1);
    }
    raf = requestAnimationFrame(tick);
  }

  function pause() {
    if (paused) return;
    paused = true;
    elapsed += performance.now() - t0;
  }
  function resume() {
    if (!paused) return;
    paused = false;
    t0 = performance.now();
  }

  dots.forEach((d, i) => d.addEventListener("click", () => go(i)));
  $("prev").addEventListener("click", () => go(cur - 1));
  $("next").addEventListener("click", () => go(cur + 1));

  // se pausa mientras el mouse o el foco están sobre el contenido
  $$(".slide__content, .hero__ui", hero).forEach((el) => {
    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", resume);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", resume);
  });
  document.addEventListener("visibilitychange", () => (document.hidden ? pause() : resume()));

  // deslizar con el dedo
  let x0 = null;
  hero.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") x0 = e.clientX; });
  hero.addEventListener("pointerup", (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1));
  });
  hero.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") go(cur + 1);
    if (e.key === "ArrowLeft") go(cur - 1);
  });

  return {
    start() {
      if (running || calm) return;
      running = true;
      t0 = performance.now();
      raf = requestAnimationFrame(tick);
    },
  };
})();

/* Contadores de la franja de datos */
function countUp() {
  $$("[data-count]", hero).forEach((el) => {
    const end = +el.dataset.count;
    if (calm) { el.textContent = end; return; }
    const start = performance.now() + 900, dur = 1600;
    el.textContent = "0";
    const step = (now) => {
      const t = clamp((now - start) / dur);
      el.textContent = Math.round(end * easeOut(t));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

if (root.classList.contains("no-intro") || calm || !intro) {
  if (intro) intro.remove();
  requestAnimationFrame(showHero);
} else {
  const t = setTimeout(openIntro, 2700);
  // tocar la pantalla o una tecla saltea la apertura
  intro.addEventListener("click", () => { clearTimeout(t); openIntro(); });
  addEventListener("keydown", () => { clearTimeout(t); openIntro(); }, { once: true });
}

/* =========================================================
   3) Menú
   ========================================================= */
const navToggle = $("nav-toggle");
const nav = $("nav");
navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
  header.classList.add("is-solid");
});
nav.addEventListener("click", (e) => {
  if (e.target.closest("a")) {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

// enlace activo según la sección visible
const navLinks = $$('.nav a[href^="#"]:not(.btn)');
const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);

/* =========================================================
   4) Apariciones al bajar
   ========================================================= */
$$("[data-stagger]").forEach((group) => {
  $$(":scope > .reveal", group).forEach((el, i) => el.style.setProperty("--d", `${i * 0.12}s`));
});

// Las imágenes empiezan recortadas (sin área visible), así que se observa su sección
const revealEls = $$(".reveal, .media-reveal");
const watchTarget = (el) => (el.classList.contains("media-reveal") ? el.parentElement : el);
if (calm || !("IntersectionObserver" in window)) {
  revealEls.forEach((el) => el.classList.add("is-visible"));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target._reveal.forEach((el) => el.classList.add("is-visible"));
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  revealEls.forEach((el) => {
    const t = watchTarget(el);
    (t._reveal = t._reveal || []).push(el);
    io.observe(t);
  });
}

/* =========================================================
   5) Frase que se enciende palabra por palabra
   ========================================================= */
const phrase = document.querySelector("[data-words]");
let words = [];
if (phrase) {
  phrase.innerHTML = phrase.innerHTML.replace("el cruce", "el <em>cruce</em>");
  const wrapWords = (node) => [...node.childNodes].forEach((n) => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach((t) => {
        if (!t) return;
        if (/^\s+$/.test(t)) frag.appendChild(document.createTextNode(t));
        else {
          const s = document.createElement("span");
          s.className = "w";
          s.textContent = t;
          frag.appendChild(s);
        }
      });
      n.replaceWith(frag);
    } else wrapWords(n);
  });
  wrapWords(phrase);
  words = $$(".w", phrase);
  if (calm) words.forEach((w) => w.classList.add("is-lit"));
}

/* =========================================================
   6) Al bajar: encabezado sólido, parallax, palabras y sección activa
   ========================================================= */
const parallax = $$("[data-parallax]");
let ticking = false;
function onScroll() {
  ticking = false;
  const y = scrollY, H = innerHeight;
  header.classList.toggle("is-solid", y > 40 || nav.classList.contains("is-open"));

  if (!calm) {
    parallax.forEach((img) => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > H + 100) return;
      const off = (r.top + r.height / 2 - H / 2) * -(+img.dataset.parallax || 0);
      img.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
    });
    if (words.length) {
      const r = phrase.getBoundingClientRect();
      const p = clamp((H * 0.85 - r.top) / (r.height + H * 0.35));
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle("is-lit", i < n));
    }
  }

  let current = sections[0];
  sections.forEach((s) => { if (s.getBoundingClientRect().top < H * 0.4) current = s; });
  navLinks.forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === "#" + current.id));
}
const requestFrame = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
addEventListener("scroll", requestFrame, { passive: true });
addEventListener("resize", requestFrame);
onScroll();

/* =========================================================
   6b) Interacción: tarjetas con inclinación 3D, X flotantes,
       portada que sigue al mouse y demo de "Cómo funciona"
   ========================================================= */
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

// Tarjetas: toda la tarjeta lleva al enlace de su flecha
$$(".xcard").forEach((card) => {
  const link = card.querySelector(".xcard__go");
  card.addEventListener("click", (e) => { if (!e.target.closest("a")) link.click(); });
  if (calm || !finePointer) return;
  const tilt = card.querySelector(".xcard__tilt");
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    card.classList.add("is-tilting");
    tilt.style.setProperty("--ry", `${((x - 0.5) * 12).toFixed(2)}deg`);
    tilt.style.setProperty("--rx", `${((0.5 - y) * 10).toFixed(2)}deg`);
    tilt.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    tilt.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
  });
  card.addEventListener("pointerleave", () => {
    card.classList.remove("is-tilting");
    tilt.style.setProperty("--rx", "0deg");
    tilt.style.setProperty("--ry", "0deg");
  });
});

// X flotantes y fondo de la portada: se mueven un poco con el mouse
if (!calm && finePointer) {
  const groups = $$(".floaters");
  const heroBgs = $$(".slide__bg", hero);
  let mx = 0, my = 0, pending = false;
  addEventListener("pointermove", (e) => {
    mx = e.clientX / innerWidth - 0.5;
    my = e.clientY / innerHeight - 0.5;
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      groups.forEach((g) => { g.style.setProperty("--px", mx.toFixed(3)); g.style.setProperty("--py", my.toFixed(3)); });
      if (scrollY < innerHeight) heroBgs.forEach((b) => { b.style.transform = `translate3d(${(-mx * 18).toFixed(1)}px, ${(-my * 12).toFixed(1)}px, 0)`; });
    });
  }, { passive: true });
}
// y con el scroll (cada una a su velocidad, según --d)
if (!calm) {
  const groups = $$(".floaters");
  const syncFloaters = () => groups.forEach((g) => {
    const r = g.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    g.style.setProperty("--sy", ((r.top + r.height / 2 - innerHeight / 2) * 0.25).toFixed(1));
  });
  addEventListener("scroll", () => requestAnimationFrame(syncFloaters), { passive: true });
  syncFloaters();
}

// Demo "Cómo funciona": pasos que avanzan solos mientras se ven, o al tocarlos
(() => {
  const steps = $$(".demo__step");
  const screens = $$(".screen");
  if (!steps.length) return;
  const STEP_MS = 5200;
  let cur = 0, t0 = performance.now(), visible = false, hold = false;

  function show(i) {
    steps[cur].classList.remove("is-active");
    steps[cur].setAttribute("aria-selected", "false");
    steps[cur].style.setProperty("--p", 0);
    screens[cur].classList.remove("is-active");
    screens[cur].hidden = true;
    cur = (i + steps.length) % steps.length;
    steps[cur].classList.add("is-active");
    steps[cur].setAttribute("aria-selected", "true");
    screens[cur].hidden = false;
    // reinicia las animaciones de la pantalla
    void screens[cur].offsetWidth;
    screens[cur].classList.add("is-active");
    t0 = performance.now();
  }

  steps.forEach((s, i) => {
    s.addEventListener("click", () => { show(i); });
    s.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); show(cur + 1); steps[cur].focus(); }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); show(cur - 1); steps[cur].focus(); }
    });
  });
  const demo = document.querySelector(".demo");
  demo.addEventListener("pointerenter", () => { hold = true; });
  demo.addEventListener("pointerleave", () => { hold = false; t0 = performance.now() - (+steps[cur].style.getPropertyValue("--p") || 0) * STEP_MS; });

  if (calm) return;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((es) => {
      visible = es[0].isIntersecting;
      if (visible) t0 = performance.now();
    }, { threshold: 0.4 }).observe(demo);
  }
  const tick = (now) => {
    if (visible && !hold && !document.hidden) {
      const p = clamp((now - t0) / STEP_MS);
      steps[cur].style.setProperty("--p", p.toFixed(4));
      if (p >= 1) show(cur + 1);
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();

/* =========================================================
   7) Cotizador: los resultados cuentan hasta el valor nuevo
   ========================================================= */
const montoInput = $("cot-monto");
const fechaInput = $("cot-fecha");
const tasaInput = $("cot-tasa");
const outs = {
  neto: { el: $("out-neto"), fmt: (v) => fmtMoney.format(v), value: 0 },
  dias: { el: $("out-dias"), fmt: (v) => fmtInt.format(v), value: 0 },
  desc: { el: $("out-desc"), fmt: (v) => fmtMoney.format(v), value: 0 },
};

function parseMoney(str) {
  const digits = String(str).replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}
function isoDate(d) {
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d - tz).toISOString().slice(0, 10);
}
function daysUntil(value) {
  if (!value) return 0;
  const [y, m, d] = value.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((target - today) / 86400000));
}

const today = new Date();
fechaInput.min = isoDate(today);
const defaultDate = new Date(today);
defaultDate.setDate(defaultDate.getDate() + 60);
fechaInput.value = isoDate(defaultDate);

function tweenTo(out, to, { from = out.value, duration = 600, delay = 0 } = {}) {
  cancelAnimationFrame(out.raf);
  clearTimeout(out.timer);
  out.value = to;
  if (calm || duration === 0) { out.el.textContent = out.fmt(to); return; }
  out.el.textContent = out.fmt(from);
  out.timer = setTimeout(() => {
    const t0 = performance.now();
    const step = (now) => {
      const t = clamp((now - t0) / duration);
      out.el.textContent = out.fmt(Math.round(from + (to - from) * easeOut(t)));
      if (t < 1) out.raf = requestAnimationFrame(step);
    };
    out.raf = requestAnimationFrame(step);
  }, delay);
}

function resultado() {
  const monto = parseMoney(montoInput.value);
  const dias = daysUntil(fechaInput.value);
  const tasa = Math.max(0, parseFloat(tasaInput.value) || 0) / 100;
  // Descuento simple: importe × tasa mensual × (días / 30)
  const descuento = Math.min(monto, monto * tasa * (dias / 30));
  return { monto, dias, descuento, neto: monto - descuento };
}

function calcular(opts) {
  const r = resultado();
  tweenTo(outs.neto, Math.round(r.neto), opts);
  tweenTo(outs.dias, r.dias, opts);
  tweenTo(outs.desc, Math.round(r.descuento), opts);
}

montoInput.addEventListener("input", () => {
  const n = parseMoney(montoInput.value);
  montoInput.value = n ? fmtInt.format(n) : "";
  calcular();
});
fechaInput.addEventListener("input", () => calcular());
tasaInput.addEventListener("input", () => calcular());


// Los resultados cuentan desde cero cuando el cotizador aparece en pantalla
calcular({ duration: 0 });
const chequeCard = document.querySelector(".cheque");
if (!calm && "IntersectionObserver" in window) {
  const seen = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      calcular({ from: 0, duration: 1400, delay: 500 });
      seen.disconnect();
    }
  }, { threshold: 0.35 });
  seen.observe(chequeCard);
}

// "Pedir cotización real" pasa los datos del cotizador al formulario
$("cot-cta").addEventListener("click", () => {
  const r = resultado();
  $("c-servicio").value = "Vender un cheque";
  if (r.monto) $("c-importe").value = "$ " + fmtInt.format(r.monto);
  if (fechaInput.value) {
    const [y, m, d] = fechaInput.value.split("-");
    if (!$("c-mensaje").value) $("c-mensaje").value = `Fecha de cobro: ${d}/${m}/${y}`;
  }
});

/* =========================================================
   8) Formulario de contacto → WhatsApp
   ========================================================= */
$$("[data-servicio]").forEach((link) => {
  link.addEventListener("click", () => { $("c-servicio").value = link.dataset.servicio; });
});

const form = $("contact-form");
const errorBox = $("form-error");
const importeInput = $("c-importe");

importeInput.addEventListener("input", () => {
  const n = parseMoney(importeInput.value);
  importeInput.value = n ? "$ " + fmtInt.format(n) : "";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = $("c-nombre").value.trim();
  const tel = $("c-tel").value.trim();

  if (!nombre || !tel) {
    errorBox.textContent = "Completá tu nombre y teléfono para que podamos responderte.";
    errorBox.hidden = false;
    (!nombre ? $("c-nombre") : $("c-tel")).focus();
    return;
  }
  errorBox.hidden = true;

  const lineas = [
    `Hola BBX, quiero: ${$("c-servicio").value}.`,
    `Nombre: ${nombre}`,
    `Teléfono: ${tel}`,
  ];
  if (importeInput.value) lineas.push(`Importe: ${importeInput.value}`);
  const msg = $("c-mensaje").value.trim();
  if (msg) lineas.push(msg);

  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(lineas.join("\n"))}`;
  const win = window.open(url, "_blank");
  if (win) win.opener = null;
  else window.location.href = url;
});

$("year").textContent = new Date().getFullYear();
