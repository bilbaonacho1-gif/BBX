# BBX Soluciones Financieras SA

Sitio web de BBX Soluciones Financieras SA: compra de cheques de pago diferido y ECHEQ.

Es un sitio estático (HTML, CSS y JavaScript, sin dependencias ni compilación).

## Estructura

```
index.html          Página principal (el logo está vectorizado adentro, en el bloque "sprite")
css/styles.css      Estilos y animaciones (paleta azul petróleo al principio, en :root)
js/main.js          Apertura, carrusel, apariciones, cotizador y formulario a WhatsApp
img/ciudad.jpg      Fondo: ciudad de noche desde una oficina (portada y Nosotros)
img/echeq.jpg       Fondo: red digital (portada, ECHEQ)
img/cheque.jpg      Fondo: cheque sobre un escritorio (portada y Por qué nosotros)
img/guilloche.jpg   Fondo: patrón de seguridad de cheque (apertura, servicios y cotizador)
img/logo-bbx.svg    Logo en SVG para usar en otros lados
img/favicon.svg     Ícono de la pestaña (la X)
```

Los fondos son ilustraciones generadas para el sitio. Para usar fotos propias, reemplazá
los archivos de `img/` por otros con el mismo nombre (ideal 1920 × 1080, JPG).

## Datos que se pueden cambiar

- `js/main.js` → `CONFIG.whatsapp` (número al que llega el formulario) y `CONFIG.slideMs`
  (tiempo de cada diapositiva del carrusel).
- `index.html` → textos, correo, teléfono y horario.
- `index.html` → tasa mensual de ejemplo del cotizador (`cot-tasa`, por defecto 3,5 %).

## Animaciones

- Apertura: el logo se arma pieza por pieza y la pantalla se abre en diagonal, como la X.
  Se ve una vez por visita. Tocar la pantalla o una tecla la saltea.
- Portada: carrusel de 3 diapositivas con zoom lento de fondo, títulos que suben línea por línea
  y barras de progreso. Se pausa con el mouse encima y se puede deslizar con el dedo.
- Al bajar: los bloques aparecen con desenfoque, las imágenes se descubren en diagonal y se mueven
  con parallax, los íconos se dibujan, los números cuentan y una frase se enciende palabra por palabra.
- Servicios: tarjetas grandes con foto y panel de vidrio que se inclinan en 3D siguiendo el mouse,
  con un brillo que acompaña al cursor y la flecha que se ilumina. Toda la tarjeta es clickeable.
- Cómo funciona: demo con un teléfono que muestra cada paso (mensaje con el cheque, cotización y
  transferencia recibida). Avanza sola mientras se ve y se puede elegir cada paso.
- X flotantes del logo en el fondo de varias secciones, que se mueven con el mouse y el scroll.
- El fondo de la portada acompaña un poco el movimiento del mouse.
- Con "reducir movimiento" activado en el dispositivo no se anima nada.

## Ver el sitio localmente

Abrí `index.html` en el navegador, o levantá un servidor:

```
python3 -m http.server 8000
```

y entrá a http://localhost:8000.

## Publicar

Al ser estático se puede publicar gratis en GitHub Pages (Settings → Pages → rama principal,
carpeta raíz), Netlify o Vercel.
