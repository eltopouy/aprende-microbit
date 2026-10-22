# Aprende Micro:bit 3D — Plataforma Educativa Interactiva en Español

Una aplicación web educativa interactiva en 3D para enseñar y aprender programación con **BBC micro:bit v2**, inspirada en la arquitectura y estética técnica de [Learn Arduino](https://learn-arduino-red.vercel.app/).

Desarrollada por **Servicio TI Uruguay** ([www.servicioti.com.uy](https://www.servicioti.com.uy)) para estudiantes y docentes de educación tecnológica, robótica y Plan Ceibal.

---

## 🌟 Características Principales

1. **Placa 3D Interactiva en Tiempo Real (Three.js WebGL)**:
   - Modelo fidedigno de la **BBC micro:bit v2**: matriz de 25 LEDs rojos con modulación de brillo (0 a 9) y efecto bloom, pulsadores táctiles A y B, logo capacitivo bañado en oro, micrófono MEMS con LED de actividad acústica, y conector de borde chapado en oro con pines grandes 0, 1, 2, 3V y GND.
   - En el reverso: procesador ARM Cortex-M4 nRF52833, acelerómetro y brújula magnética LSM303, altavoz electroacústico posterior, conector micro-USB y botón de reset.
   - Controles de cámara fluidos: rotación orbital con ratón o teclado (Q / E / WASD), zoom con rueda o botones (+ / -), y botón de orientación y reseteo (R).

2. **Líneas Líderes SVG Dinámicas y Callouts HUD**:
   - Etiquetas explicativas vinculadas a los componentes de la placa mediante curvas Bezier en SVG que siguen en tiempo real las coordenadas 3D al rotar la cámara.
   - **Inspector de Componentes**: Haz clic en cualquier parte de la micro:bit (matriz, botones, altavoz, chips, pines) para ver sus especificaciones eléctricas, pinout y comandos de programación.

3. **12 Lecciones Guiadas Progresivas en Español**:
   - **Lección 1: Conoce la micro:bit v2** — Anatomía y primer "Hola Mundo".
   - **Lección 2: Matriz LED 5x5 y Emoticonos** — Latido cardíaco animado y píxeles individuales.
   - **Lección 3: Botones A y B** — Entradas digitales, condicionales y contador interactivo.
   - **Lección 4: Logo Táctil Capacitivo** — Interruptor inteligente con el logo dorado.
   - **Lección 5: Termómetro Digital** — Monitoreo térmico ambiental y alertas de calor/frío.
   - **Lección 6: Sensor de Luz Oculto** — Detección fotovoltaica en los LEDs y lámpara nocturna automática.
   - **Lección 7: Brújula y Orientación** — Magnetómetro 3D y navegación por los puntos cardinales (N, S, E, O).
   - **Lección 8: Acelerómetro y Dado Mágico** — Detección del gesto "Agitar" (Shake) y azar numérico.
   - **Lección 9: Melodías y Sintetizador de Sonido** — Música real reproducida por el altavoz v2.
   - **Lección 10: Entradas Analógicas y Potenciómetro** — Conexión en Pin P0 y lectura ADC de 0 a 1023.
   - **Lección 11: Control de Servomotor SG90 9g** — Pulsos PWM para mover brazos robóticos de 0° a 180°.
   - **Lección 12: Proyecto Final: Alarma Antirrobo Inteligente** — Radar ultrasónico HC-SR04, sirena y matriz visual.

4. **Doble Vista de Código**:
   - Código completo en **MicroPython** (estándar en Ceibal y educación secundaria).
   - Código equivalente en **MakeCode JavaScript / Bloques**.
   - Resaltado de sintaxis y botón de copiado rápido con un solo clic.

5. **Simulador de Hardware & Sintetizador Web Audio API**:
   - **Sonido Real**: El sintetizador Web Audio API genera tonos y melodías de micro:bit directamente en los altavoces de tu dispositivo al ejecutar las lecciones.
   - **Controles Físicos**: Botones A y B interactivos, logo táctil, botón "¡Agitar (Shake)!" y deslizadores dinámicos según la lección (Temperatura, Luz, Ángulo de servo, Distancia ultrasónica, Potenciómetro).
   - **Consola Serie (Serial Monitor)**: Muestra en tiempo real las salidas `print()` de la placa y telemetría continua.

---

## 🚀 Despliegue en GitHub Pages

El repositorio incluye un flujo de trabajo automático con GitHub Actions (`.github/workflows/deploy.yml`) y una carpeta compilada en `docs/` con `.nojekyll`.

### Pasos para activar GitHub Pages:
1. Ve a tu repositorio en GitHub: `https://github.com/eltopouy/aprende-microbit`
2. Entra en **Settings** > **Pages**.
3. En **Build and deployment > Source**:
   - Selecciona **GitHub Actions** (se compilará y actualizará solo en cada push).
   - O selecciona **Deploy from a branch** > Rama `main` > Carpeta `/docs`.
4. En pocos segundos tendrás tu aplicación publicada en:
   ```
   https://eltopouy.github.io/aprende-microbit/
   ```

---

## 🌐 Integración en Blogger (`www.servicioti.com.uy`)

Puedes incrustar la aplicación directamente dentro de una página o entrada de tu blog en Blogger:

1. Ingresa a tu panel de administración de [Blogger](https://www.blogger.com/).
2. En el menú lateral izquierdo, haz clic en **Páginas** > **+ Nueva página**.
3. Título de la página: `Aprende Micro:bit 3D - Simulador Educativo`.
4. En el extremo superior izquierdo de la barra de edición, haz clic en el icono del lápiz y cámbialo a **Vista HTML**.
5. Abre el archivo [blogger-embed.html](blogger-embed.html) de este repositorio, copia todo su contenido y pégalo en el editor HTML de Blogger.
6. Haz clic en **Publicar**.
7. ¡Tus estudiantes ya podrán usar la aplicación directamente desde `www.servicioti.com.uy` con soporte de pantalla completa y sonido interactivo!

### (Opcional) Dominio Personalizado `microbit.servicioti.com.uy`
Si deseas que la app esté accesible directamente en `microbit.servicioti.com.uy`:
1. En tu panel de DNS (proveedor de dominio de servicioti.com.uy), crea un registro **CNAME**:
   - **Nombre / Host**: `microbit`
   - **Destino / Valor**: `eltopouy.github.io.`
2. En los ajustes de GitHub Pages (Settings > Pages > Custom domain), ingresa `microbit.servicioti.com.uy` y marca **Enforce HTTPS**.

---

## 💻 Desarrollo Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/eltopouy/aprende-microbit.git
cd aprende-microbit

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo en vivo
npm run dev

# 4. Compilar para producción
npm run build
```

---

## 📜 Licencia
Desarrollado con licencia MIT bajo iniciativa de [Servicio TI](https://www.servicioti.com.uy).
