export const componentsData = {
  'matriz-led': {
    id: 'matriz-led',
    name: 'Matriz LED 5x5',
    category: 'Actuador / Pantalla',
    badge: 'Salida Visual',
    shortDesc: '25 LEDs rojos individuales de alta luminosidad con control de brillo independiente (0 a 9).',
    description: 'La matriz de 5x5 LEDs es la pantalla principal de la micro:bit. Permite mostrar imágenes predefinidas (corazón, caritas, flechas), texto en desplazamiento continuo y gráficos de barras. Cada LED puede modularse con modulación por ancho de pulsos (PWM) para 10 niveles de intensidad luminosa.',
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
    name: 'Acelerómetro y Brújula MEMS',
    category: 'Sensor Inercial',
    badge: '3 Ejes + Magnetómetro',
    shortDesc: 'Sensor de movimiento y campo magnético terrestre (LSM303AGR).',
    description: 'Detecta la gravedad y la aceleración en los ejes X, Y y Z, permitiendo calcular la inclinación de la placa, detectar sacudidas (shake), caídas libres o giros. Además, su magnetómetro mide el norte magnético para funcionar como una brújula náutica digital.',
    specs: [
      ['Chip', 'STMicroelectronics LSM303AGR (o NXP FXOS8700CQ)'],
      ['Ejes Aceleración', 'X (horizontal), Y (vertical), Z (perpendicular a la placa)'],
      ['Rango Acelerómetro', '±2g / ±4g / ±8g con resolución de 12 bits'],
      ['Brújula', 'Magnetómetro triaxial de 0 a 360 grados'],
      ['MicroPython', 'accelerometer.get_values(), accelerometer.is_gesture("shake"), compass.heading()']
    ],
    pinout: [
      ['Comunicación', 'Bus interno I2C a 400 kHz (SCL / SDA)']
    ]
  },
  'conector-borde': {
    id: 'conector-borde',
    name: 'Conector de Borde (Edge Connector)',
    category: 'Conexión / Expansión',
    badge: '25 Pines Chapados en Oro',
    shortDesc: 'Terminales grandes compatibles con pinzas cocodrilo y pines finos para shields.',
    description: 'La parte inferior de la placa contiene 25 pistas de cobre chapadas en oro de inmersión. Las pistas grandes (0, 1, 2, 3V, GND) tienen orificios circulares para conectar fácilmente cables con pinzas de cocodrilo o conectores banana de 4 mm. Las pistas intermedias dan acceso a más de 19 canales GPIO, entradas analógicas, buses SPI e I2C.',
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
  'servo-motor': {
    id: 'servo-motor',
    name: 'Servomotor Micro 9g (SG90)',
    category: 'Actuador Robótico',
    badge: 'Accesorio Externo',
    shortDesc: 'Motor con caja de engranajes interna capaz de girar a un ángulo preciso (0° a 180°).',
    description: 'El servomotor SG90 es el actuador más utilizado en robótica escolar con micro:bit. A diferencia de un motor convencional que gira sin fin, el servo recibe una señal de pulsos modulados en ancho (PWM) cada 20 ms que le indica exactamente en qué ángulo detenerse.',
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
