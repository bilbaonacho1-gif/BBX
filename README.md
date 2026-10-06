# BBX Soluciones Financieras

Sitio web de BBX Soluciones Financieras: compra y venta de cheques y ECHEQ.

Es un sitio estático (HTML, CSS y JavaScript, sin dependencias ni compilación).

## Estructura

```
index.html       Página principal
css/styles.css   Estilos (tema claro y oscuro)
js/main.js       Cotizador de cheques, menú móvil y formulario a WhatsApp
img/favicon.svg  Ícono del sitio
```

## Antes de publicar

Reemplazá los datos de ejemplo por los reales:

- `js/main.js` → `CONFIG.whatsapp`: número de WhatsApp (ej. `5491123456789`).
- `index.html` → sección **Contacto**: número de WhatsApp visible, correo y horario.
- `index.html` → tasa mensual de ejemplo del cotizador (`cot-tasa`, por defecto 3,5 %).

## Ver el sitio localmente

Abrí `index.html` en el navegador, o levantá un servidor:

```
python3 -m http.server 8000
```

y entrá a http://localhost:8000.

## Publicar

Al ser estático se puede publicar gratis en GitHub Pages (Settings → Pages → rama principal, carpeta raíz), Netlify o Vercel.
