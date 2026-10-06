// BBX Soluciones Financieras — sin librerías.
// Datos de contacto: reemplazar por los reales.
const CONFIG = {
  whatsapp: "5491100000000", // código de país + área + número, sin espacios ni "+"
};

const $ = (id) => document.getElementById(id);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const root = document.documentElement;
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

const fmtMoney = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
const fmtInt = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

/* =========================================================
   1) Apertura: el logo se arma y la pantalla se abre en diagonal.
      Después entra el encabezado y se arma la portada.
   ========================================================= */
const intro = $("intro");
const header = $("header");
const hero = $("hero");
let heroShown = false;

function showHero() {
  if (heroShown) return;
  heroShown = true;
  header.classList.add("is-in");
  hero.classList.add("is-revealed");
  calcular({ from: 0, duration: 1400, delay: calm ? 0 : 900 });
}

function openIntro() {
  if (!intro || intro.classList.contains("is-open")) return;
  intro.classList.add("is-open");
  try { sessionStorage.setItem("bbx-intro", "1"); } catch (e) {}
  setTimeout(showHero, 250);
  setTimeout(() => intro.remove(), 1200);
}

if (root.classList.contains("no-intro") || calm || !intro) {
  if (intro) intro.remove();
  requestAnimationFrame(showHero);
} else {
  const t = setTimeout(openIntro, 2100);
  // tocar la pantalla o una tecla la saltea
  intro.addEventListener("click", () => { clearTimeout(t); openIntro(); });
  addEventListener("keydown", () => { clearTimeout(t); openIntro(); }, { once: true });
}

/* =========================================================
   2) Menú móvil
   ========================================================= */
const navToggle = $("nav-toggle");
const nav = $("nav");
navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});
nav.addEventListener("click", (e) => {
  if (e.target.closest("a")) {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

/* =========================================================
   3) Apariciones al bajar: cada bloque .reveal entra cuando se ve.
      Dentro de [data-stagger] los hijos entran uno detrás de otro.
   ========================================================= */
$$("[data-stagger]").forEach((group) => {
  $$(":scope > .reveal", group).forEach((el, i) => el.style.setProperty("--d", `${i * 0.11}s`));
});

const reveals = $$(".reveal");
if (calm || !("IntersectionObserver" in window)) {
  reveals.forEach((el) => el.classList.add("is-visible"));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  reveals.forEach((el) => io.observe(el));
}

/* =========================================================
   4) Frase que se enciende palabra por palabra al bajar
   ========================================================= */
const phrase = document.querySelector("[data-words]");
let words = [];
if (phrase) {
  // "cruce" va resaltado en azul
  phrase.innerHTML = phrase.innerHTML.replace("el cruce:", "el <em>cruce:</em>");
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

let ticking = false;
function onScroll() {
  ticking = false;
  if (!words.length || calm) return;
  const H = innerHeight;
  const r = phrase.getBoundingClientRect();
  const p = clamp((H * 0.85 - r.top) / (r.height + H * 0.35));
  const n = Math.round(p * words.length);
  words.forEach((w, i) => w.classList.toggle("is-lit", i < n));
}
const requestFrame = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
addEventListener("scroll", requestFrame, { passive: true });
addEventListener("resize", requestFrame);
onScroll();

/* =========================================================
   5) Cotizador: los resultados cuentan hasta el valor nuevo
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

function calcular(opts) {
  const monto = parseMoney(montoInput.value);
  const dias = daysUntil(fechaInput.value);
  const tasa = Math.max(0, parseFloat(tasaInput.value) || 0) / 100;

  // Descuento simple: importe × tasa mensual × (días / 30)
  const descuento = Math.min(monto, monto * tasa * (dias / 30));
  const neto = monto - descuento;

  tweenTo(outs.neto, Math.round(neto), opts);
  tweenTo(outs.dias, dias, opts);
  tweenTo(outs.desc, Math.round(descuento), opts);
}

montoInput.addEventListener("input", () => {
  const n = parseMoney(montoInput.value);
  montoInput.value = n ? fmtInt.format(n) : "";
  calcular();
});
fechaInput.addEventListener("input", () => calcular());
tasaInput.addEventListener("input", () => calcular());

const modeGroup = document.querySelector(".mode");
function setMode(mode) {
  const vender = mode === "vender";
  modeGroup.classList.toggle("is-invertir", !vender);
  $("mode-vender").classList.toggle("is-active", vender);
  $("mode-invertir").classList.toggle("is-active", !vender);
  $("mode-vender").setAttribute("aria-pressed", String(vender));
  $("mode-invertir").setAttribute("aria-pressed", String(!vender));
  $("cot-title").textContent = vender ? "¿Cuánto recibís por tu cheque?" : "¿Cuánto ganás invirtiendo en un cheque?";
  $("lbl-neto").textContent = vender ? "Recibís hoy" : "Invertís hoy";
  $("lbl-desc").textContent = vender ? "Descuento" : "Tu ganancia";
}
$("mode-vender").addEventListener("click", () => setMode("vender"));
$("mode-invertir").addEventListener("click", () => setMode("invertir"));

// Valores finales desde el principio; la portada los vuelve a contar desde cero al aparecer
calcular({ duration: 0 });

/* =========================================================
   6) Formulario de contacto → WhatsApp
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
  if ($("c-fecha").value) {
    const [y, m, d] = $("c-fecha").value.split("-");
    lineas.push(`Fecha de cobro: ${d}/${m}/${y}`);
  }
  const msg = $("c-mensaje").value.trim();
  if (msg) lineas.push(`Datos: ${msg}`);

  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(lineas.join("\n"))}`;
  const win = window.open(url, "_blank");
  if (win) win.opener = null;
  else window.location.href = url;
});

$("year").textContent = new Date().getFullYear();
