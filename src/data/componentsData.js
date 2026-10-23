// Catálogo de Componentes de Hardware para BBC micro:bit v2
// Incluye especificaciones técnicas, pinout e ilustraciones vectoriales SVG

export const componentsData = {
  'matriz-led': {
    id: 'matriz-led',
    name: 'Matriz LED 5x5',
    category: 'Actuador / Pantalla',
    badge: 'Salida Visual',
    shortDesc: '25 LEDs rojos individuales de alta luminosidad con control de brillo independiente (0 a 9).',
    description: 'La matriz de 5x5 LEDs es la pantalla principal de la micro:bit. Permite mostrar imágenes predefinidas (corazón, caritas, flechas), texto en desplazamiento continuo y gráficos de barras. Cada LED puede modularse con modulación por ancho de pulsos (PWM) para 10 niveles de intensidad luminosa.',
    svg: `<svg viewBox="0 0 100 100" class="component-svg">
      <rect x="5" y="5" width="90" height="90" rx="8" fill="#14171f" stroke="#333a4d" stroke-width="2"/>
      <g fill="#ff3b30">
        <circle cx="20" cy="20" r="4"/><circle cx="35" cy="20" r="4"/><circle cx="50" cy="20" r="4"/><circle cx="65" cy="20" r="4"/><circle cx="80" cy="20" r="4"/>
        <circle cx="20" cy="35" r="4"/><circle cx="35" cy="35" r="4"/><circle cx="50" cy="35" r="4"/><circle cx="65" cy="35" r="4"/><circle cx="80" cy="35" r="4"/>
        <circle cx="20" cy="50" r="4"/><circle cx="35" cy="50" r="4"/><circle cx="50" cy="50" r="4"/><circle cx="65" cy="50" r="4"/><circle cx="80" cy="50" r="4"/>
        <circle cx="20" cy="65" r="4"/><circle cx="35" cy="65" r="4"/><circle cx="50" cy="65" r="4"/><circle cx="65" cy="65" r="4"/><circle cx="80" cy="65" r="4"/>
        <circle cx="20" cy="80" r="4"/><circle cx="35" cy="80" r="4"/><circle cx="50" cy="80" r="4"/><circle cx="65" cy="80" r="4"/><circle cx="80" cy="80" r="4"/>
      </g>
      <circle cx="50" cy="50" r="4" fill="#ff7970" stroke="#fff" stroke-width="1.5"/>
    </svg>`,
    specs: [
      ['Tipo', 'Matriz de 5x5 diodos LED rojos (25 pixeles)'],
      ['Brillo', '10 niveles configurables (0 = apagado, 9 = brillo máximo)'],
      ['Doble Función', 'Emite luz y actúa como sensor fotovoltaico inverso de luz ambiental'],
      ['Control MicroPython', 'display.set_pixel(x, y, brillo), display.show(), display.scroll()'],
      ['Control MakeCode', 'basic.showIcon(), basic.showString(), led.plot(x, y)']
    ],
    pinout: [
      ['Filas', 'Multiplexadas internamente por hardware nRF52833'],
      ['Columnas', 'Controladas por transistores MOSFET integrados'],
      ['Resolución', '5 x 5 píxeles (coordenadas x: 0..4, y: 0..4)'],
      ['Alimentación', '3.0 V vía regulador de placa']
    ]
  },
  'boton-a': {
    id: 'boton-a',
    name: 'Botón Pulsador A',
    category: 'Sensor / Entrada',
    badge: 'Entrada Digital',
    shortDesc: 'Pulsador táctil con resistencia pull-up interna conectado al microcontrolador.',
    description: 'Ubicado en el lado izquierdo frontal. Al pulsarlo cierra el circuito a masa (nivel bajo 0V). El software cuenta con antirrebote automático (debouncing) y permite consultar si está presionado en el instante, si fue presionado recientemente o contar el número de pulsaciones.',
    svg: `<svg viewBox="0 0 100 100" class="component-svg">
      <rect x="18" y="18" width="64" height="64" rx="6" fill="#cbd5e1" stroke="#64748b" stroke-width="3"/>
      <circle cx="50" cy="50" r="22" fill="#1e2430" stroke="#0f172a" stroke-width="2"/>
      <text x="50" y="58" font-size="24" font-weight="900" fill="#ffffff" text-anchor="middle" font-family="system-ui">A</text>
      <line x1="8" y1="32" x2="18" y2="32" stroke="#94a3b8" stroke-width="4"/>
      <line x1="8" y1="68" x2="18" y2="68" stroke="#94a3b8" stroke-width="4"/>
      <line x1="82" y1="32" x2="92" y2="32" stroke="#94a3b8" stroke-width="4"/>
      <line x1="82" y1="68" x2="92" y2="68" stroke="#94a3b8" stroke-width="4"/>
    </svg>`,
    specs: [
      ['Tipo', 'Micro-pulsador táctil momentáneo normalmente abierto (NO)'],
      ['Lógica', 'Pull-up interno activo (1 en reposo, 0 al presionar)'],
      ['Pin Interno', 'P0.14 en nRF52833 (mapeado como Pin 5)'],
      ['MicroPython', 'button_a.is_pressed(), button_a.was_pressed(), button_a.get_presses()'],
      ['MakeCode', 'input.onButtonPressed(Button.A, () => { ... })']
    ],
    pinout: [
      ['Terminal 1', 'Conectado a GPIO P0.14 del procesador con pull-up'],
      ['Terminal 2', 'Conectado a GND (Tierra de referencia)']
    ]
  },
  'boton-b': {
    id: 'boton-b',
    name: 'Botón Pulsador B',
    category: 'Sensor / Entrada',
    badge: 'Entrada Digital',
    shortDesc: 'Segundo pulsador táctil frontal para navegación e interacción del usuario.',
    description: 'Ubicado en el lado derecho frontal. Funciona idénticamente al Botón A. Se puede utilizar de forma independiente o en combinación simultánea (A + B) para confirmar selecciones, iniciar juegos o activar menús secretos.',
    svg: `<svg viewBox="0 0 100 100" class="component-svg">
      <rect x="18" y="18" width="64" height="64" rx="6" fill="#cbd5e1" stroke="#64748b" stroke-width="3"/>
      <circle cx="50" cy="50" r="22" fill="#1e2430" stroke="#0f172a" stroke-width="2"/>
      <text x="50" y="58" font-size="24" font-weight="900" fill="#ffffff" text-anchor="middle" font-family="system-ui">B</text>
      <line x1="8" y1="32" x2="18" y2="32" stroke="#94a3b8" stroke-width="4"/>
      <line x1="8" y1="68" x2="18" y2="68" stroke="#94a3b8" stroke-width="4"/>
      <line x1="82" y1="32" x2="92" y2="32" stroke="#94a3b8" stroke-width="4"/>
      <line x1="82" y1="68" x2="92" y2="68" stroke="#94a3b8" stroke-width="4"/>
    </svg>`,
    specs: [
      ['Tipo', 'Micro-pulsador táctil momentáneo'],
      ['Pin Interno', 'P0.23 en nRF52833 (mapeado como Pin 11)'],
      ['Combinaciones', 'A solo, B solo, o ambos simultáneos (A + B)'],
      ['MicroPython', 'button_b.is_pressed(), button_b.was_pressed()'],
      ['MakeCode', 'input.onButtonPressed(Button.AB, () => { ... })']
    ],
    pinout: [
      ['Terminal 1', 'Conectado a GPIO P0.23 con pull-up'],
      ['Terminal 2', 'Conectado a GND']
    ]
  },
  'logo-touch': {
    id: 'logo-touch',
    name: 'Logo Táctil Capacitivo (v2)',
    category: 'Sensor / Entrada',
    badge: 'Exclusivo micro:bit v2',
    shortDesc: 'Sensor capacitivo de toque grabado en oro en el frente superior de la placa.',
    description: 'El icónico logo de micro:bit con acabado dorado no es solo decorativo: en la versión 2 es un electrodo táctil capacitivo. Detecta la capacitancia natural del dedo humano sin necesidad de presionar un botón mecánico.',
    svg: `<svg viewBox="0 0 100 100" class="component-svg">
      <rect x="10" y="10" width="80" height="80" rx="12" fill="#181a20" stroke="#333a4d" stroke-width="2"/>
      <path d="M25 40 Q50 20 75 40 Q85 55 75 70 Q50 90 25 70 Q15 55 25 40 Z" fill="#f5b731" stroke="#eab308" stroke-width="2"/>
      <circle cx="40" cy="52" r="7" fill="#181a20"/>
      <circle cx="60" cy="52" r="7" fill="#181a20"/>
      <path d="M42 62 Q50 68 58 62" stroke="#181a20" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>`,
    specs: [
      ['Tecnología', 'Detección capacitiva de superficie táctil'],
      ['Respuesta', '< 15 ms al contacto con la piel humana'],
      ['Soporte', 'Toque simple, mantener presionado y soltar'],
      ['MicroPython', 'pin_logo.is_touched()'],
      ['MakeCode', 'input.onLogoEvent(TouchButtonEvent.Touched, () => { ... })']
    ],
    pinout: [
      ['Electrodo', 'Acabado en oro de inmersión químico (ENIG)'],
      ['Canal', 'Entrada táctil analógica capacitiva de hardware v2']
    ]
  },
  'microfono': {
    id: 'microfono',
    name: 'Micrófono MEMS y LED Acústico (v2)',
    category: 'Sensor Acústico',
    badge: 'Exclusivo micro:bit v2',
    shortDesc: 'Micrófono analógico MEMS de alta sensibilidad con LED indicador de sonido.',
    description: 'Permite a la micro:bit reaccionar a sonidos del ambiente, como palmadas, voces, música o aplausos. Incluye un pequeño LED rojo al lado del orificio que se enciende cuando el micrófono está alimentado y activo, garantizando privacidad y claridad visual.',
    svg: `<svg viewBox="0 0 100 100" class="component-svg">
      <rect x="20" y="25" width="60" height="50" rx="6" fill="#cbd5e1" stroke="#64748b" stroke-width="3"/>
      <circle cx="42" cy="50" r="8" fill="#111827"/>
      <circle cx="66" cy="50" r="4.5" fill="#ef4444" stroke="#dc2626" stroke-width="1.5"/>
      <path d="M54 36 C58 38 62 42 62 48" stroke="#94a3b8" stroke-width="2" fill="none" stroke-linecap="round"/>
      <text x="50" y="90" font-size="11" font-weight="700" fill="#64748b" text-anchor="middle">MEMS MIC</text>
    </svg>`,
    specs: [
      ['Sensor', 'Knowles SPU0410LR5H-QB MEMS micrófono analógico'],
      ['Rango', 'Sensibilidad acústica de 40 dB a 100 dB SPL'],
      ['Umbrales', 'Nivel de sonido bajo (Quiet) y nivel alto (Loud)'],
      ['MicroPython', 'microphone.current_event(), microphone.sound_level()'],
      ['MakeCode', 'input.onSound(DetectedSound.Loud, () => { ... })']
    ],
    pinout: [
      ['VCC / RUN', 'Pin dedicado de habilitación de energía con LED de actividad'],
      ['Señal', 'Salida analógica preamplificada hacia ADC de 12 bits']
    ]
  },
  'altavoz': {
    id: 'altavoz',
    name: 'Altavoz Integrado (v2)',
    category: 'Actuador Acústico',
    badge: 'Exclusivo micro:bit v2',
    shortDesc: 'Zumbador magnético posterior para reproducir melodías, tonos y efectos.',
    description: 'En el reverso de la micro:bit v2 se encuentra un altavoz electroacústico integrado. Elimina la necesidad de conectar auriculares o buzzers externos con pinzas de cocodrilo para escuchar melodías, pitidos de confirmación o voces sintetizadas.',
    svg: `<svg viewBox="0 0 100 100" class="component-svg">
      <circle cx="50" cy="50" r="38" fill="#cbd5e1" stroke="#64748b" stroke-width="3"/>
      <circle cx="50" cy="50" r="26" fill="#94a3b8"/>
      <circle cx="50" cy="50" r="12" fill="#1e293b"/>
      <circle cx="50" cy="50" r="4" fill="#0f172a"/>
      <path d="M72 32 Q82 50 72 68" stroke="#2563eb" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M80 24 Q94 50 80 76" stroke="#2563eb" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>`,
    specs: [
      ['Tipo', 'Transductor magnético de micro-altavoz'],
      ['Frecuencia', '200 Hz a 10.000 Hz con control PWM'],
      ['Potencia', 'Hasta 80 dB SPL a 10 cm'],
      ['MicroPython', 'music.play(music.BA_DING), music.pitch(440, 200)'],
      ['MakeCode', 'music.playTone(Note.C5, music.beat(BeatFraction.Whole))']
    ],
    pinout: [
      ['Control', 'Canal PWM con amplificador clase D de bajo consumo'],
      ['Desconexión', 'Permite apagar el altavoz de placa para usar el pin P0 externo']
    ]
  },
  'procesador': {
    id: 'procesador',
    name: 'Procesador Principal nRF52833',
    category: 'Cerebro / Microcontrolador',
    badge: 'ARM Cortex-M4',
    shortDesc: 'Microcontrolador SoC a 64 MHz con punto flotante (FPU), 512KB Flash y 128KB RAM.',
    description: 'El corazón de la micro:bit v2 es el chip Nordic Semiconductor nRF52833. Cuenta con un núcleo ARM Cortex-M4 de 32 bits a 64 MHz, suficiente memoria para ejecutar MicroPython completo, algoritmos de Machine Learning livianos (TinyML) y gestionar la radio Bluetooth 5.0.',
    svg: `<svg viewBox="0 0 100 100" class="component-svg">
      <rect x="20" y="20" width="60" height="60" rx="4" fill="#181a20" stroke="#333a4d" stroke-width="2"/>
      <circle cx="28" cy="28" r="3" fill="#cbd5e1"/>
      <text x="50" y="48" font-size="11" font-weight="900" fill="#f8fafc" text-anchor="middle" font-family="monospace">NORDIC</text>
      <text x="50" y="60" font-size="9" font-weight="700" fill="#38bdf8" text-anchor="middle" font-family="monospace">nRF52833</text>
      <g stroke="#94a3b8" stroke-width="2">
        <line x1="12" y1="30" x2="20" y2="30"/><line x1="12" y1="40" x2="20" y2="40"/><line x1="12" y1="50" x2="20" y2="50"/><line x1="12" y1="60" x2="20" y2="60"/><line x1="12" y1="70" x2="20" y2="70"/>
        <line x1="80" y1="30" x2="88" y2="30"/><line x1="80" y1="40" x2="88" y2="40"/><line x1="80" y1="50" x2="88" y2="50"/><line x1="80" y1="60" x2="88" y2="60"/><line x1="80" y1="70" x2="88" y2="70"/>
        <line x1="30" y1="12" x2="30" y2="20"/><line x1="40" y1="12" x2="40" y2="20"/><line x1="50" y1="12" x2="50" y2="20"/><line x1="60" y1="12" x2="60" y2="20"/><line x1="70" y1="12" x2="70" y2="20"/>
        <line x1="30" y1="80" x2="30" y2="88"/><line x1="40" y1="80" x2="40" y2="88"/><line x1="50" y1="80" x2="50" y2="88"/><line x1="60" y1="80" x2="60" y2="88"/><line x1="70" y1="80" x2="70" y2="88"/>
      </g>
    </svg>`,
    specs: [
      ['Arquitectura', 'ARM Cortex-M4 de 32 bits con FPU (Unidad de Punto Flotante)'],
      ['Velocidad', '64 MHz'],
      ['Memoria Flash', '512 KB (Almacena el intérprete y tus programas)'],
      ['Memoria RAM', '128 KB SRAM'],
      ['Comunicaciones', 'Bluetooth 5.0 Low Energy, Radio 2.4 GHz, I2C, SPI, UART, PWM']
    ],
    pinout: [
      ['Encapsulado', 'QFN40 de alta densidad montado en superficie'],
      ['Voltaje de Núcleo', 'Regulado internamente a 1.8 V – 3.3 V']
    ]
  },
  'acelerometro': {
    id: 'acelerometro',
    name: 'Acelerómetro MEMS (LSM303)',
    category: 'Sensor Inercial',
    badge: '3 Ejes (X, Y, Z)',
    shortDesc: 'Sensor inercial que mide la gravedad, aceleración y detecta el gesto de agitar (shake).',
    description: 'Detecta la gravedad y la aceleración en los ejes X, Y y Z, permitiendo calcular la inclinación de la placa, detectar sacudidas (shake), caídas libres o giros.',
    svg: `<svg viewBox="0 0 100 100" class="component-svg">
      <rect x="25" y="25" width="50" height="50" rx="4" fill="#1e2430" stroke="#475569" stroke-width="2"/>
      <circle cx="50" cy="50" r="16" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3 3"/>
      <!-- Ejes X, Y, Z -->
      <line x1="50" y1="50" x2="74" y2="50" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
      <polygon points="76,50 70,46 70,54" fill="#ef4444"/>
      <line x1="50" y1="50" x2="50" y2="26" stroke="#22c55e" stroke-width="3" stroke-linecap="round"/>
      <polygon points="50,24 46,30 54,30" fill="#22c55e"/>
      <line x1="50" y1="50" x2="34" y2="66" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
      <polygon points="32,68 38,64 34,60" fill="#3b82f6"/>
      <text x="78" y="45" font-size="9" font-weight="900" fill="#ef4444">X</text>
      <text x="56" y="22" font-size="9" font-weight="900" fill="#22c55e">Y</text>
      <text x="24" y="74" font-size="9" font-weight="900" fill="#3b82f6">Z</text>
    </svg>`,
    specs: [
      ['Chip', 'STMicroelectronics LSM303AGR'],
      ['Ejes Aceleración', 'X (horizontal), Y (vertical), Z (perpendicular a la placa)'],
      ['Rango Acelerómetro', '±2g / ±4g / ±8g con resolución de 12 bits'],
      ['MicroPython', 'accelerometer.get_values(), accelerometer.is_gesture("shake")'],
      ['MakeCode', 'input.onGesture(Gesture.Shake, () => { ... })']
    ],
    pinout: [
      ['Comunicación', 'Bus interno I2C a 400 kHz (SCL / SDA)']
    ]
  },
  'brujula': {
    id: 'brujula',
    name: 'Brújula Digital (Magnetómetro)',
    category: 'Sensor Magnético',
    badge: 'Orientación 360°',
    shortDesc: 'Magnetómetro triaxial de alta precisión que mide el campo magnético del Norte Terrestre.',
    description: 'Mide la orientación angular con respecto al Norte Magnético de la Tierra. El microcontrolador calibra el sensor dibujando un círculo en la matriz y retorna el rumbo exacto de 0 a 359 grados.',
    svg: `<svg viewBox="0 0 100 100" class="component-svg">
      <circle cx="50" cy="50" r="40" fill="#f8fafc" stroke="#64748b" stroke-width="3"/>
      <circle cx="50" cy="50" r="32" fill="none" stroke="#cbd5e1" stroke-width="1.5"/>
      <polygon points="50,18 44,50 56,50" fill="#ef4444"/>
      <polygon points="50,82 44,50 56,50" fill="#3b82f6"/>
      <circle cx="50" cy="50" r="4" fill="#1e293b"/>
      <text x="50" y="14" font-size="11" font-weight="900" fill="#ef4444" text-anchor="middle">N</text>
      <text x="50" y="96" font-size="11" font-weight="900" fill="#3b82f6" text-anchor="middle">S</text>
      <text x="92" y="54" font-size="10" font-weight="900" fill="#64748b" text-anchor="middle">E</text>
      <text x="8" y="54" font-size="10" font-weight="900" fill="#64748b" text-anchor="middle">O</text>
    </svg>`,
    specs: [
      ['Rango de Rumbo', '0° a 359° (con precisión de 1 grado)'],
      ['Puntos Cardinales', 'Norte: 0°/360°, Este: 90°, Sur: 180°, Oeste: 270°'],
      ['Calibración', 'Automática interactiva con microPython'],
      ['MicroPython', 'compass.heading(), compass.calibrate()'],
      ['MakeCode', 'input.compassHeading()']
    ],
    pinout: [
      ['Bus', 'I2C en canales compartidos con el acelerómetro']
    ]
  },
  'sensor-luz': {
    id: 'sensor-luz',
    name: 'Sensor de Luz Ambiental',
    category: 'Sensor Óptico',
    badge: 'Fotodiodo Reverso',
    shortDesc: 'Mide la intensidad luminosa ambiental usando los LEDs rojos en polarización inversa.',
    description: 'Una ingeniosa característica de la micro:bit: la matriz de LEDs rojos no solo emite luz, sino que durante fracciones de microsegundo se polariza en sentido inverso para actuar como fotodiodos y medir la luz del entorno de 0 a 255.',
    svg: `<svg viewBox="0 0 100 100" class="component-svg">
      <circle cx="50" cy="50" r="18" fill="#f59e0b"/>
      <g stroke="#f59e0b" stroke-width="3" stroke-linecap="round">
        <line x1="50" y1="16" x2="50" y2="24"/>
        <line x1="50" y1="76" x2="50" y2="84"/>
        <line x1="16" y1="50" x2="24" y2="50"/>
        <line x1="76" y1="50" x2="84" y2="50"/>
        <line x1="26" y1="26" x2="32" y2="32"/>
        <line x1="68" y1="68" x2="74" y2="74"/>
        <line x1="26" y1="74" x2="32" y2="68"/>
        <line x1="68" y1="32" x2="74" y2="26"/>
      </g>
    </svg>`,
    specs: [
      ['Rango', '0 (oscuridad total) a 255 (luz solar directa)'],
      ['Tecnología', 'Efecto fotoeléctrico en la matriz de LEDs'],
      ['MicroPython', 'display.read_light_level()'],
      ['MakeCode', 'input.lightLevel()']
    ],
    pinout: [
      ['Hardware', 'Integrado directamente en la matriz 5x5']
    ]
  },
  'sensor-temperatura': {
    id: 'sensor-temperatura',
    name: 'Sensor de Temperatura Interno',
    category: 'Sensor Térmico',
    badge: 'Termómetro de Silicio',
    shortDesc: 'Mide la temperatura del microprocesador en grados Celsius.',
    description: 'El procesador nRF52833 cuenta con un diodo sensor de temperatura de silicio integrado en el chip de silicio que permite medir la temperatura ambiente con excelente resolución.',
    svg: `<svg viewBox="0 0 100 100" class="component-svg">
      <rect x="42" y="12" width="16" height="56" rx="8" fill="#f1f5f9" stroke="#64748b" stroke-width="3"/>
      <circle cx="50" cy="74" r="16" fill="#ef4444" stroke="#64748b" stroke-width="3"/>
      <rect x="46" y="36" width="8" height="34" fill="#ef4444"/>
      <line x1="64" y1="24" x2="72" y2="24" stroke="#64748b" stroke-width="2"/>
      <line x1="64" y1="36" x2="72" y2="36" stroke="#64748b" stroke-width="2"/>
      <line x1="64" y1="48" x2="72" y2="48" stroke="#64748b" stroke-width="2"/>
      <text x="24" y="78" font-size="12" font-weight="900" fill="#ef4444">°C</text>
    </svg>`,
    specs: [
      ['Rango de Temperatura', '-40 °C a +105 °C'],
      ['Resolución', '0.25 °C con conversor ADC térmico'],
      ['MicroPython', 'temperature()'],
      ['MakeCode', 'input.temperature()']
    ],
    pinout: [
      ['Canal', 'Sensor analógico de temperatura interno en el núcleo SoC']
    ]
  },
  'conector-borde': {
    id: 'conector-borde',
    name: 'Conector de Borde (Edge Connector)',
    category: 'Conexión / Expansión',
    badge: '25 Pines Chapados en Oro',
    shortDesc: 'Terminales grandes compatibles con pinzas cocodrilo y pines finos para shields.',
    description: 'La parte inferior de la placa contiene 25 pistas de cobre chapadas en oro de inmersión. Las pistas grandes (0, 1, 2, 3V, GND) tienen orificios circulares para conectar fácilmente cables con pinzas de cocodrilo o conectores banana de 4 mm. Las pistas intermedias dan acceso a más de 19 canales GPIO, entradas analógicas, buses SPI e I2C.',
    svg: `<svg viewBox="0 0 100 100" class="component-svg">
      <rect x="5" y="25" width="90" height="50" rx="4" fill="#181a20" stroke="#333a4d" stroke-width="2"/>
      <!-- 5 Pines Grandes de Oro con agujeros -->
      <rect x="10" y="32" width="12" height="38" rx="2" fill="#f5b731"/>
      <circle cx="16" cy="42" r="3.5" fill="#181a20"/>
      <rect x="27" y="32" width="12" height="38" rx="2" fill="#f5b731"/>
      <circle cx="33" cy="42" r="3.5" fill="#181a20"/>
      <rect x="44" y="32" width="12" height="38" rx="2" fill="#f5b731"/>
      <circle cx="50" cy="42" r="3.5" fill="#181a20"/>
      <rect x="61" y="32" width="12" height="38" rx="2" fill="#f5b731"/>
      <circle cx="67" cy="42" r="3.5" fill="#181a20"/>
      <rect x="78" y="32" width="12" height="38" rx="2" fill="#f5b731"/>
      <circle cx="84" cy="42" r="3.5" fill="#181a20"/>
    </svg>`,
    specs: [
      ['Anillos Grandes', 'Pin 0, Pin 1, Pin 2 (GPIO/ADC/Touch), 3V (alimentación), GND (tierra)'],
      ['Pines Delgados', 'Pines 3 al 20 para placas de expansión, robótica y sensores complejos'],
      ['Voltaje de Salida', '3.3 V estabilizados (hasta 200 mA de corriente total disponible)'],
      ['Nivel Lógico', 'Digital 3.3 V (¡precaución! no aplicar 5V directo)'],
      ['MicroPython', 'pin0.read_analog(), pin1.write_digital(1), pin2.set_pull()']
    ],
    pinout: [
      ['Pin 0', 'Entrada/Salida GPIO, ADC analógico, DAC PWM, Toque capacitivo'],
      ['Pin 1', 'Entrada/Salida GPIO, ADC analógico, DAC PWM, Toque capacitivo'],
      ['Pin 2', 'Entrada/Salida GPIO, ADC analógico, DAC PWM, Toque capacitivo'],
      ['3V', 'Salida de 3.3 Voltios para alimentar sensores y LEDs'],
      ['GND', 'Tierra común / Polo negativo de todos los circuitos']
    ]
  },
  'servomotor': {
    id: 'servomotor',
    name: 'Servomotor Micro 9g (SG90)',
    category: 'Actuador Robótico',
    badge: 'Accesorio Externo',
    shortDesc: 'Motor con caja de engranajes interna capaz de girar a un ángulo preciso (0° a 180°).',
    description: 'El servomotor SG90 es el actuador más utilizado en robótica escolar con micro:bit. A diferencia de un motor convencional que gira sin fin, el servo recibe una señal de pulsos modulados en ancho (PWM) cada 20 ms que le indica exactamente en qué ángulo detenerse.',
    svg: `<svg viewBox="0 0 100 100" class="component-svg">
      <rect x="25" y="30" width="50" height="48" rx="4" fill="#1d70b8" stroke="#134a7a" stroke-width="2"/>
      <circle cx="40" cy="30" r="14" fill="#134a7a"/>
      <rect x="36" y="8" width="28" height="10" rx="3" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" transform="rotate(-15 40 15)"/>
      <circle cx="40" cy="15" r="3" fill="#475569"/>
      <!-- Cables marrón, rojo, naranja -->
      <path d="M50 78 Q50 92 35 95" stroke="#92400e" stroke-width="3" fill="none"/>
      <path d="M54 78 Q54 92 50 95" stroke="#ef4444" stroke-width="3" fill="none"/>
      <path d="M58 78 Q58 92 65 95" stroke="#f59e0b" stroke-width="3" fill="none"/>
    </svg>`,
    specs: [
      ['Rango de Giro', '0° a 180° continuos'],
      ['Torque', '1.6 kg·cm a 4.8 V'],
      ['Velocidad', '0.12 s / 60 grados'],
      ['Señal PWM', 'Pulso de 0.5 ms (0°) a 2.5 ms (180°) con frecuencia de 50 Hz'],
      ['Cables', 'Marrón: GND · Rojo: 3V / 5V · Naranja/Amarillo: Señal PWM a Pin 0']
    ],
    pinout: [
      ['Pin Señal (Naranja)', 'Conectado al Pin P0 de la micro:bit con pulsos analógicos'],
      ['VCC (Rojo)', 'Conectado al Pin 3V (o batería externa para 5V)'],
      ['GND (Marrón)', 'Conectado a masa GND compartida']
    ]
  },
  'sensor-ultrasonico': {
    id: 'sensor-ultrasonico',
    name: 'Sensor Ultrasónico HC-SR04',
    category: 'Sensor de Distancia',
    badge: 'Accesorio Externo',
    shortDesc: 'Emisor y receptor de ecolocalización ultrasónica para medir distancias de 2 cm a 4 metros.',
    description: 'Funciona exactamente como el sonar de los murciélagos y delfines: emite una ráfaga inaudible de sonido a 40.000 Hz por el transductor TRIGGER y escucha el rebote en el transductor ECHO. Midiendo el tiempo transcurrido y conociendo la velocidad del sonido (343 m/s), calcula la distancia exacta al obstáculo.',
    svg: `<svg viewBox="0 0 100 100" class="component-svg">
      <rect x="10" y="28" width="80" height="44" rx="4" fill="#1e40af" stroke="#1d4ed8" stroke-width="2"/>
      <!-- Cilindros transmisor y receptor -->
      <circle cx="32" cy="50" r="16" fill="#cbd5e1" stroke="#94a3b8" stroke-width="3"/>
      <circle cx="32" cy="50" r="9" fill="#1e293b"/>
      <circle cx="68" cy="50" r="16" fill="#cbd5e1" stroke="#94a3b8" stroke-width="3"/>
      <circle cx="68" cy="50" r="9" fill="#1e293b"/>
      <text x="32" y="78" font-size="7" font-weight="900" fill="#ffffff" text-anchor="middle">TRIG</text>
      <text x="68" y="78" font-size="7" font-weight="900" fill="#ffffff" text-anchor="middle">ECHO</text>
    </svg>`,
    specs: [
      ['Rango de Medición', '2 cm a 400 cm (4 metros)'],
      ['Precisión', '± 3 mm'],
      ['Ángulo de Medición', '15 grados cónicos'],
      ['Frecuencia Acústica', '40 kHz'],
      ['Fórmula', 'Distancia (cm) = (Tiempo de eco en microsegundos × 0.0343) / 2']
    ],
    pinout: [
      ['VCC', 'Alimentación (5V o versión 3V compatible HC-SR04P)'],
      ['Trig (Disparo)', 'Pin P1: pulso de inicio de 10 microsegundos'],
      ['Echo (Rebote)', 'Pin P2: pulso de retorno con duración proporcional a la distancia'],
      ['GND', 'Tierra común']
    ]
  },
  'potenciometro': {
    id: 'potenciometro',
    name: 'Potenciómetro Analógico 10kΩ',
    category: 'Sensor / Mando',
    badge: 'Accesorio Externo',
    shortDesc: 'Resistencia variable giratoria que produce una tensión proporcional al giro (0 a 1023).',
    description: 'Un potenciómetro actúa como un divisor de voltaje mecánico. Al girar su eje, el cursor interno se desplaza por una pista resistiva de carbón. El pin analógico de la micro:bit lee ese voltaje y el conversor analógico-digital (ADC) lo transforma en un número entre 0 (0 voltios) y 1023 (3.3 voltios).',
    svg: `<svg viewBox="0 0 100 100" class="component-svg">
      <rect x="25" y="32" width="50" height="42" rx="4" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
      <circle cx="50" cy="50" r="18" fill="#1e2430" stroke="#cbd5e1" stroke-width="2.5"/>
      <line x1="50" y1="50" x2="62" y2="38" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
      <!-- Terminales -->
      <line x1="34" y1="74" x2="34" y2="88" stroke="#94a3b8" stroke-width="4"/>
      <line x1="50" y1="74" x2="50" y2="88" stroke="#94a3b8" stroke-width="4"/>
      <line x1="66" y1="74" x2="66" y2="88" stroke="#94a3b8" stroke-width="4"/>
    </svg>`,
    specs: [
      ['Resistencia Total', '10 kΩ lineal (B10K)'],
      ['Rango de Giro', '270 a 300 grados'],
      ['Conversor ADC', '10 bits de resolución en micro:bit (valores 0 a 1023)'],
      ['MicroPython', 'pin0.read_analog()'],
      ['MakeCode', 'pins.analogReadPin(AnalogPin.P0)']
    ],
    pinout: [
      ['Terminal 1 (Extremo)', 'Conectado a 3V'],
      ['Terminal 2 (Cursor central)', 'Conectado a Pin P0 (Entrada analógica)'],
      ['Terminal 3 (Extremo)', 'Conectado a GND']
    ]
  }
};
