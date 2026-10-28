# BBX Soluciones Financieras SA

Sitio web de BBX Soluciones Financieras SA: compra de cheques de pago diferido y ECHEQ.

Es un sitio estático (HTML, CSS y JavaScript, sin dependencias ni compilación).

## Estructura

```
index.html          Página principal (el logo está vectorizado adentro, en el bloque "sprite")
css/styles.css      Estilos y animaciones (colores al principio, en :root)
js/main.js          Idioma ES/EN, apertura, apariciones, cotizador y formulario a WhatsApp
img/ciudad.jpg      Fondo: ciudad de noche desde una oficina (portada y Nosotros)
img/echeq.jpg       Fondo: red digital (portada, ECHEQ)
img/cheque.jpg      Fondo: cheque sobre un escritorio (portada y Por qué nosotros)
img/guilloche.jpg   Fondo: patrón de seguridad de cheque (apertura, servicios y cotizador)
img/logo-bbx.svg    Logo en SVG para usar en otros lados
img/favicon.svg     Ícono de la pestaña (la X)
```

Los fondos son ilustraciones generadas para el sitio. Para usar fotos propias, reemplazá
los archivos de `img/` por otros con el mismo nombre (ideal 1920 × 1080, JPG).

## Colores e idioma

- Paleta azul petróleo + negro + blanco (#071A24, #0E3442, #1C6070, #D9E0E2, #FFFFFF).
  El logo conserva su azul. La sección de Servicios es clara; el resto, oscuro.
- Idioma español/inglés con el selector ES ▾. El español está en `index.html` y el inglés en el
  diccionario `EN` al principio de `js/main.js`: cada texto tiene una clave `data-i18n`.
- El sitio recuerda el idioma elegido.

## Datos que se pueden cambiar

- `js/main.js` → `CONFIG.whatsapp` (número al que llega el formulario).
- `index.html` → textos, correo, teléfono y horario.
- `index.html` → tasa mensual de ejemplo del cotizador (`cot-tasa`, por defecto 3,5 %).

## Animaciones

- Apertura: el logo se arma pieza por pieza y la pantalla se abre en diagonal, como la X.
  Se ve cada vez que se carga la página. Tocar la pantalla o una tecla la saltea.
- Portada: zoom lento de fondo, título que sube línea por línea y datos que cuentan desde cero.
- Al bajar: los bloques aparecen con desenfoque, las imágenes se descubren en diagonal y se mueven
  con parallax, los íconos se dibujan, los números cuentan y una frase se enciende palabra por palabra.
- En el celular las tarjetas de Servicios se deslizan de costado y el botón de WhatsApp aparece
  después de la portada.
- Servicios: tarjetas grandes con foto y panel de vidrio que se inclinan en 3D siguiendo el mouse,
  con un brillo que acompaña al cursor y la flecha que se ilumina. Toda la tarjeta es clickeable.
- Cómo funciona: demo con un teléfono que muestra cada paso (mensaje con el cheque, cotización y
  transferencia recibida). Avanza sola mientras se ve y se puede elegir cada paso.
- Respuestas rápidas: tres columnas (Cotizá, Operá, Cobrá) con preguntas. Las de simulación cargan
  el cotizador con ese importe y plazo; las demás abren la pregunta frecuente correspondiente.
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
