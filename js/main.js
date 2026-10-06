// Datos de contacto: reemplazar por los reales.
const CONFIG = {
  whatsapp: "5491100000000", // código de país + área + número, sin espacios ni "+"
};

const fmtMoney = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
const fmtInt = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

const $ = (id) => document.getElementById(id);

// ---- Menú móvil ----
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

// ---- Cotizador ----
const montoInput = $("cot-monto");
const fechaInput = $("cot-fecha");
const tasaInput = $("cot-tasa");
let mode = "vender";

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

function calcular() {
  const monto = parseMoney(montoInput.value);
  const dias = daysUntil(fechaInput.value);
  const tasa = Math.max(0, parseFloat(tasaInput.value) || 0) / 100;

  // Descuento simple: importe × tasa mensual × (días / 30)
  const descuento = Math.min(monto, monto * tasa * (dias / 30));
  const neto = monto - descuento;

  $("out-neto").textContent = fmtMoney.format(neto);
  $("out-dias").textContent = fmtInt.format(dias);
  $("out-desc").textContent = fmtMoney.format(descuento);
}

montoInput.addEventListener("input", () => {
  const n = parseMoney(montoInput.value);
  montoInput.value = n ? fmtInt.format(n) : "";
  calcular();
});
fechaInput.addEventListener("input", calcular);
tasaInput.addEventListener("input", calcular);

function setMode(next) {
  mode = next;
  const vender = mode === "vender";
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

calcular();

// ---- Enlaces que preseleccionan el servicio ----
document.querySelectorAll("[data-servicio]").forEach((link) => {
  link.addEventListener("click", () => {
    $("c-servicio").value = link.dataset.servicio;
  });
});

// ---- Formulario de contacto → WhatsApp ----
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
  if (win) {
    win.opener = null;
  } else {
    window.location.href = url;
  }
});

$("year").textContent = new Date().getFullYear();
