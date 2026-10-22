export const lessons = [
  {
    id: 'conoce-la-placa',
    number: 1,
    title: 'Conoce la micro:bit v2',
    cardTitle: '1. Conoce la micro:bit',
    icon: 'microchip',
    shortDesc: 'Explora la anatomía física y los componentes de la pequeña supercomputadora escolar.',
    lede: 'La BBC micro:bit v2 es una computadora de bolsillo diseñada para que aprender a programar sea intuitivo, tangible y divertido. Conoce su procesador de 64 MHz, matriz de 25 LEDs, botones y sensores integrados.',
    features: [
      ['cpu', 'Procesador ARM Cortex-M4 a 64 MHz'],
      ['matrix', '25 LEDs rojos programables con brillo variable'],
      ['touch', 'Logo dorado con sensor táctil capacitivo'],
      ['audio', 'Micrófono y altavoz integrados en la versión 2']
    ],
    pinout: [
      ['0, 1, 2', 'Pines grandes para pinzas cocodrilo', 'GPIO, entradas analógicas y táctiles.', '#e09f3e'],
      ['3V', 'Alimentación positiva', 'Salida regulada de 3.3 voltios.', '#d64a3a'],
      ['GND', 'Tierra / Negativo', 'Retorno de corriente para todos los circuitos.', '#2f3547'],
      ['USB', 'Puerto micro-USB posterior', 'Programación y alimentación desde la PC.', '#4a8fe7']
    ],
    example: [
      'Al conectar la micro:bit, el programa comienza en la función principal de MicroPython.',
      '<code>display.scroll("HOLA")</code> desplaza el texto letra por letra por la matriz de 5x5.',
      '<code>display.show(Image.HAPPY)</code> muestra una carita sonriente fija en los 25 LEDs.',
      'Puedes rotar la placa en 3D haciendo clic y arrastrando con el ratón o con las teclas WASD.'
    ],
    specs: [
      ['Procesador', 'Nordic nRF52833 de 32 bits a 64 MHz'],
      ['Memoria', '512 KB Flash · 128 KB SRAM'],
      ['Pantalla', 'Matriz 5x5 (25 LEDs rojos con 10 niveles de brillo)'],
      ['Sensores en placa', 'Acelerómetro 3D, Brújula magnética, Temperatura, Luz, Micrófono y Toque'],
      ['Conectividad', 'Radio micro:bit propietaria y Bluetooth 5.0 BLE']
    ],
    simConfig: {
      type: 'scroll-text',
      text: '¡HOLA!',
      icon: 'HAPPY',
      accessory: null
    },
    params: [
      {
        key: 'saludo',
        label: 'Texto del mensaje',
        type: 'text',
        value: '¡HOLA MICRO:BIT!'
      },
      {
        key: 'icono',
        label: 'Icono a mostrar',
        type: 'select',
        value: 'HAPPY',
        options: [
          { value: 'HAPPY', label: 'Carita Feliz' },
          { value: 'HEART', label: 'Corazón' },
          { value: 'SMILE', label: 'Sonrisa' },
          { value: 'YES', label: 'Visto Bueno (Check)' },
          { value: 'PACMAN', label: 'Pacman' }
        ]
      }
    ],
    codeMicroPython: `# Lección 1: Conoce la micro:bit v2
from microbit import *

# Desplaza un saludo de bienvenida por la matriz 5x5
display.scroll("¡HOLA MICRO:BIT!")

# Muestra una carita feliz permanente
display.show(Image.HAPPY)

# El bucle principal mantiene la placa despierta
while True:
    sleep(100)`,
    codeMakeCode: `// Lección 1: Conoce la micro:bit v2 en MakeCode
basic.showString("¡HOLA MICRO:BIT!")
basic.showIcon(IconNames.Happy)

basic.forever(function () {
    basic.pause(100)
})`,
    callouts: [
      { anchor: 'part:matrix', title: 'Matriz 5x5', body: '25 LEDs rojos para dibujar iconos, animaciones y texto.', x: 0, y: -20, side: 'top' },
      { anchor: 'part:button-a', title: 'Botón A', body: 'Entrada táctil digital izquierda.', x: -75, y: -10, side: 'left' },
      { anchor: 'part:button-b', title: 'Botón B', body: 'Entrada táctil digital derecha.', x: 75, y: -10, side: 'right' },
      { anchor: 'part:logo', title: 'Logo Táctil', body: 'Sensor capacitivo de toque bañado en oro.', x: 0, y: 70, side: 'top' },
      { anchor: 'part:edge', title: 'Conector de Borde', body: 'Pines 0, 1, 2, 3V y GND para conectar pinzas cocodrilo.', x: 0, y: -90, side: 'bottom' }
    ]
  },
  {
    id: 'matriz-y-emoticonos',
    number: 2,
    title: 'Matriz 5x5 y Emoticonos',
    cardTitle: '2. Matriz LED y Caritas',
    icon: 'grid',
    shortDesc: 'Dibuja imágenes personalizadas, corazones palpitantes y controla el brillo de cada LED.',
    lede: 'La pantalla de la micro:bit no tiene píxeles convencionales: está formada por 25 diodos emisores de luz dispuestos en una cuadrícula de 5 columnas y 5 filas. Cada píxel puede tener un brillo del 0 (apagado) al 9 (máximo brillo).',
    features: [
      ['sparkles', 'Animación de corazón palpitante con Image.HEART e Image.HEART_SMALL'],
      ['slider', 'Brillo independiente por píxel de 0 a 9'],
      ['code', 'Crea tus propios mapas de píxeles con cadenas numéricas']
    ],
    pinout: [
      ['Coordenadas X', '0 (izquierda) a 4 (derecha)', 'Columna horizontal.', '#3d7be0'],
      ['Coordenadas Y', '0 (arriba) a 4 (abajo)', 'Fila vertical.', '#3fae6a'],
      ['Brillo', '0 = apagado, 9 = brillo al 100%', 'Modulación PWM integrada.', '#f0a53a']
    ],
    example: [
      '<code>display.show(Image.HEART)</code> enciende los LEDs formando la silueta de un corazón.',
      'Al alternar con <code>Image.HEART_SMALL</code> y pausar con <code>sleep(500)</code> se produce el efecto de latido.',
      'Con <code>display.set_pixel(2, 2, 9)</code> puedes encender exclusivamente el LED central a su máxima intensidad.'
    ],
    specs: [
      ['Resolución', '5 x 5 (25 píxeles)'],
      ['Color de emisión', 'Rojo de alto contraste (≈ 625 nm)'],
      ['Tasa de refresco', 'Multiplexado por hardware a > 100 Hz libre de parpadeos'],
      ['Imágenes incluidas', 'Más de 60 iconos: HEART, HAPPY, SAD, SURPRISED, ARROW_N, CLOCK1...']
    ],
    simConfig: {
      type: 'heartbeat',
      bpm: 75,
      accessory: null
    },
    params: [
      {
        key: 'ritmo',
        label: 'Ritmo del latido (ms)',
        type: 'range',
        min: 200,
        max: 1200,
        step: 50,
        value: 500,
        unit: 'ms'
      },
      {
        key: 'brillo',
        label: 'Brillo máximo del LED',
        type: 'range',
        min: 1,
        max: 9,
        step: 1,
        value: 9
      }
    ],
    codeMicroPython: `# Lección 2: Matriz LED y Corazón Palpitante
from microbit import *

# Bucle infinito para simular el latido cardíaco
while True:
    # Corazón grande brillante
    display.show(Image.HEART)
    sleep(500)
    
    # Corazón pequeño para simular la contracción
    display.show(Image.HEART_SMALL)
    sleep(500)`,
    codeMakeCode: `// Lección 2 en MakeCode: Corazón Palpitante
basic.forever(function () {
    basic.showIcon(IconNames.Heart)
    basic.pause(500)
    basic.showIcon(IconNames.SmallHeart)
    basic.pause(500)
})`,
    callouts: [
      { anchor: 'part:matrix', title: 'Matriz 5x5', body: 'Observa cómo los LEDs pulsan simulando un latido real.', x: 0, y: -20, side: 'top' },
      { anchor: 'part:matrix-center', title: 'Píxel Central (2, 2)', body: 'El centro geométrico de la pantalla de 25 píxeles.', x: 25, y: -20, side: 'right' }
    ]
  },
  {
    id: 'botones-a-y-b',
    number: 3,
    title: 'Botones A y B: Tu Primer Mando',
    cardTitle: '3. Botones A y B',
    icon: 'gamepad',
    shortDesc: 'Aprende entradas digitales y condicionales para crear un contador interactivo.',
    lede: 'Los botones A y B son la puerta de entrada a la interactividad física. Al presionarlos, envías una señal digital al microcontrolador para tomar decisiones con bloques if / else o cambiar estados en un juego.',
    features: [
      ['fingerprint', 'Pulsaciones individuales de A o B'],
      ['zap', 'Doble pulsación combinada (A + B)'],
      ['bar-chart', 'Contador con visualización numérica y gráfica']
    ],
    pinout: [
      ['Botón A', 'Conectado a Pin 5 con resistencia pull-up', 'Pulsado = 0V (nivel bajo).', '#e09f3e'],
      ['Botón B', 'Conectado a Pin 11 con resistencia pull-up', 'Pulsado = 0V (nivel bajo).', '#e09f3e']
    ],
    example: [
      '<code>button_a.is_pressed()</code> devuelve <code>True</code> mientras mantienes el botón presionado.',
      '<code>button_a.was_pressed()</code> devuelve <code>True</code> si fue presionado al menos una vez desde la última comprobación.',
      'Presionar A suma +1 al contador, B resta -1 y presionar A+B a la vez lo reinicia a cero.'
    ],
    specs: [
      ['Tipo de pulsador', 'Interruptor momentáneo metálico de contacto táctil'],
      ['Vida útil', 'Probado para más de 100.000 pulsaciones'],
      ['Antirrebote', 'Filtrado de ruido mecánico por software (debouncing)']
    ],
    simConfig: {
      type: 'counter',
      counter: 0,
      accessory: null
    },
    params: [
      {
        key: 'valorInicial',
        label: 'Valor inicial del contador',
        type: 'range',
        min: 0,
        max: 9,
        step: 1,
        value: 0
      }
    ],
    codeMicroPython: `# Lección 3: Contador Interactivo con Botones A y B
from microbit import *

contador = 0

while True:
    # Si presionamos ambos botones a la vez, reiniciamos
    if button_a.is_pressed() and button_b.is_pressed():
        contador = 0
        display.show(Image.ASLEEP)
        sleep(500)
    # Botón A suma uno
    elif button_a.was_pressed():
        contador += 1
        print("Contador:", contador)
    # Botón B resta uno
    elif button_b.was_pressed():
        contador = max(0, contador - 1)
        print("Contador:", contador)
        
    display.show(str(contador))
    sleep(100)`,
    codeMakeCode: `// Lección 3 en MakeCode: Contador con Botones
let contador = 0

input.onButtonPressed(Button.A, function () {
    contador += 1
    basic.showNumber(contador)
})

input.onButtonPressed(Button.B, function () {
    if (contador > 0) {
        contador -= 1
    }
    basic.showNumber(contador)
})

input.onButtonPressed(Button.AB, function () {
    contador = 0
    basic.showIcon(IconNames.Asleep)
})`,
    callouts: [
      { anchor: 'part:button-a', title: 'Presiona Botón A', body: 'Haz clic aquí para sumar +1 al contador.', x: -75, y: -10, side: 'left' },
      { anchor: 'part:button-b', title: 'Presiona Botón B', body: 'Haz clic aquí para restar -1 al contador.', x: 75, y: -10, side: 'right' }
    ]
  },
  {
    id: 'logo-tactil-capacitivo',
    number: 4,
    title: 'Logo Táctil Capacitivo',
    cardTitle: '4. Logo Táctil (v2)',
    icon: 'touchpad',
    shortDesc: 'Usa el logotipo dorado de micro:bit v2 como un botón táctil sin partes mecánicas.',
    lede: 'A diferencia de los botones que necesitan movimiento mecánico, el logo de oro de la micro:bit v2 aprovecha la capacitancia del cuerpo humano. Al tocarlo con la piel, altera el campo electrostático y activa eventos al instante.',
    features: [
      ['award', 'Sensor táctil capacitivo chapado en oro de inmersión'],
      ['toggle-left', 'Modo interruptor (encendido / apagado) con un toque'],
      ['bell', 'Sin desgaste mecánico por fricción']
    ],
    pinout: [
      ['Pin Logo', 'Integrado directamente en la placa v2', 'No consume ninguno de los pines de borde.', '#f3c951']
    ],
    example: [
      '<code>pin_logo.is_touched()</code> verifica en tiempo real si el dedo está en contacto con el logo.',
      'Podemos alternar entre una linterna brillante y modo reposo con cada toque.',
      'La lectura se imprime en la consola serie para comprobar la sensibilidad táctil.'
    ],
    specs: [
      ['Superficie', 'Cobre electrolítico con baño de oro ENIG resistente al óxido'],
      ['Sensibilidad', 'Detección por proximidad de piel húmeda o seca'],
      ['Compatibilidad', 'Exclusivo del modelo BBC micro:bit v2']
    ],
    simConfig: {
      type: 'touch-lamp',
      lampOn: false,
      accessory: null
    },
    params: [
      {
        key: 'modoLinterna',
        label: 'Estado inicial',
        type: 'toggle',
        value: false
      }
    ],
    codeMicroPython: `# Lección 4: Interruptor Mágico con el Logo Táctil
from microbit import *

luz_encendida = False

while True:
    # Verificamos si tocamos el logo dorado superior
    if pin_logo.is_touched():
        luz_encendida = not luz_encendida
        print("Toque detectado. Estado:", luz_encendida)
        
        if luz_encendida:
            # Encendemos todos los LEDs al máximo (brillo 9)
            display.show(Image("99999:99999:99999:99999:99999"))
        else:
            display.clear()
            
        # Esperamos medio segundo para evitar rebotes de toque
        sleep(500)
    sleep(50)`,
    codeMakeCode: `// Lección 4 en MakeCode: Interruptor con Logo
let luzEncendida = false

input.onLogoEvent(TouchButtonEvent.Touched, function () {
    luzEncendida = !luzEncendida
    if (luzEncendida) {
        basic.showLeds(\`
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            # # # # #
        \`)
    } else {
        basic.clearScreen()
    }
})`,
    callouts: [
      { anchor: 'part:logo', title: 'Toca el Logo Dorado', body: 'Haz clic aquí para encender o apagar la linterna.', x: 0, y: 70, side: 'top' }
    ]
  },
  {
    id: 'termometro-digital',
    number: 5,
    title: 'Termómetro Digital y Alertas',
    cardTitle: '5. Termómetro Digital',
    icon: 'thermometer',
    shortDesc: 'Mide la temperatura ambiental mediante el sensor térmico del silicio nRF52.',
    lede: 'El chip procesador incluye un diodo sensor de temperatura interno de alta precisión. Con él puedes monitorear la temperatura ambiente en grados Celsius, detectar golpes de calor y activar avisos visuales.',
    features: [
      ['activity', 'Lectura térmica en tiempo real con temperature()'],
      ['alert-triangle', 'Icono de fuego si supera el umbral de calor'],
      ['trending-up', 'Gráfica continua en el monitor serie']
    ],
    pinout: [
      ['Sensor Interno', 'Integrado dentro de la pastilla del nRF52833', 'Sin necesidad de cables externos.', '#e07a5f']
    ],
    example: [
      '<code>temperature()</code> devuelve un número entero que representa los grados Celsius (°C).',
      'Si la temperatura sube por encima de 28 °C, la placa muestra una calavera o fuego de alerta.',
      'Si es templada (entre 18 y 27 °C), muestra una carita feliz.'
    ],
    specs: [
      ['Rango de Medición', '-40 °C a +105 °C (ambiente seguro: -5 °C a +50 °C)'],
      ['Resolución', '0.25 °C por paso analógico'],
      ['Precisión', '± 1 °C'],
      ['Tiempo de conversión', '35 microsegundos']
    ],
    simConfig: {
      type: 'thermometer',
      temperature: 24,
      threshold: 28,
      accessory: null
    },
    params: [
      {
        key: 'tempAmbiente',
        label: 'Temperatura Simulada (°C)',
        type: 'range',
        min: -5,
        max: 50,
        step: 1,
        value: 24,
        unit: '°C'
      },
      {
        key: 'umbralAlerta',
        label: 'Umbral de Alerta de Calor (°C)',
        type: 'range',
        min: 20,
        max: 40,
        step: 1,
        value: 28,
        unit: '°C'
      }
    ],
    codeMicroPython: `# Lección 5: Termómetro Digital y Alertas de Calor
from microbit import *

UMBRAL_CALOR = 28

while True:
    temp_actual = temperature()
    print("Temperatura ambiente:", temp_actual, "°C")
    
    # Comprobamos si hace calor
    if temp_actual >= UMBRAL_CALOR:
        # Alerta: mostramos icono de advertencia
        display.show(Image.ANGRY)
    elif temp_actual < 15:
        # Frío
        display.show(Image.SAD)
    else:
        # Clima templado ideal
        display.show(Image.HAPPY)
        
    sleep(1000)`,
    codeMakeCode: `// Lección 5 en MakeCode: Termómetro Digital
let UMBRAL_CALOR = 28

basic.forever(function () {
    let temp = input.temperature()
    if (temp >= UMBRAL_CALOR) {
        basic.showIcon(IconNames.Angry)
    } else {
        basic.showIcon(IconNames.Happy)
    }
    basic.pause(1000)
})`,
    callouts: [
      { anchor: 'part:processor', title: 'Chip nRF52833', body: 'El sensor de temperatura mide el calor directamente en el silicio.', x: 0, y: 15, side: 'top' }
    ]
  },
  {
    id: 'sensor-de-luz',
    number: 6,
    title: 'Sensor de Luz y Lámpara Nocturna',
    cardTitle: '6. Sensor de Luz',
    icon: 'sun',
    shortDesc: 'Aprende cómo los LEDs pueden recibir luz y crea una luz automática nocturna.',
    lede: '¿Sabías que los diodos LED pueden funcionar al revés? Cuando la luz incide sobre ellos, generan una pequeña corriente fotovoltaica. La micro:bit aprovecha este fenómeno para medir la luminosidad ambiental sin añadir componentes extra.',
    features: [
      ['eye', 'Medición fotométrica con display.read_light_level()'],
      ['moon', 'Detección automática de oscuridad (noche)'],
      ['lightbulb', 'Encendido automático de lámpara de seguridad']
    ],
    pinout: [
      ['Matriz LED', 'Funciona alternativamente como emisor y receptor', 'Control óptico bidireccional.', '#f0a53a']
    ],
    example: [
      '<code>display.read_light_level()</code> devuelve un valor de 0 (oscuridad total) a 255 (plena luz solar).',
      'Si el nivel cae por debajo de 50, se asume que cayó la noche y se encienden los LEDs como farola.',
      '¡Desplaza el regulador de luz del panel para simular el paso del día a la noche!'
    ],
    specs: [
      ['Rango del Sensor', '0 (oscuridad absoluta) a 255 (luz solar directa)'],
      ['Principio físico', 'Descarga inversa capacitiva en las uniones P-N de los LEDs'],
      ['Sensibilidad espectral', 'Luz visible roja y ambiente (500 a 700 nm)']
    ],
    simConfig: {
      type: 'nightlight',
      lightLevel: 140,
      threshold: 60,
      accessory: 'light-source'
    },
    params: [
      {
        key: 'nivelLuz',
        label: 'Luz Ambiental (Lux)',
        type: 'range',
        min: 0,
        max: 255,
        step: 5,
        value: 140
      },
      {
        key: 'umbralNoche',
        label: 'Umbral de Oscuridad',
        type: 'range',
        min: 20,
        max: 120,
        step: 5,
        value: 60
      }
    ],
    codeMicroPython: `# Lección 6: Lámpara Automática de Noche
from microbit import *

UMBRAL_NOCHE = 60

while True:
    luz = display.read_light_level()
    print("Nivel de luz detectado:", luz)
    
    if luz < UMBRAL_NOCHE:
        # ¡Está oscuro! Encendemos la lámpara de emergencia
        display.show(Image.DIAMOND)
    else:
        # Es de día: apagamos la pantalla para ahorrar energía
        display.clear()
        
    sleep(200)`,
    codeMakeCode: `// Lección 6 en MakeCode: Luz de Noche Automática
let UMBRAL_NOCHE = 60

basic.forever(function () {
    let luz = input.lightLevel()
    if (luz < UMBRAL_NOCHE) {
        basic.showIcon(IconNames.Diamond)
    } else {
        basic.clearScreen()
    }
    basic.pause(200)
})`,
    callouts: [
      { anchor: 'part:matrix', title: 'Matriz Fotovoltaica', body: 'En modo sensor, los LEDs leen la luz ambiental que reciben.', x: 0, y: -20, side: 'top' },
      { anchor: 'part:light-source', title: 'Lámpara Virtual', body: 'Ajusta la luz ambiental para probar el encendido nocturno.', x: 120, y: -60, side: 'right' }
    ]
  },
  {
    id: 'brujula-y-orientacion',
    number: 7,
    title: 'Brújula Digital y Orientación',
    cardTitle: '7. Brújula y Rumbo',
    icon: 'compass',
    shortDesc: 'Usa el magnetómetro de 3 ejes para guiarte en el mapa con los puntos cardinales.',
    lede: 'El chip de brújula detecta el campo magnético de la Tierra. Al calcular el rumbo en grados (0° a 360°), la micro:bit sabe con precisión hacia dónde está apuntando tu mano: Norte, Sur, Este u Oeste.',
    features: [
      ['navigation', 'Lectura de rumbo náutico con compass.heading()'],
      ['map-pin', 'Flechas direccionales dinámicas en la matriz de LEDs'],
      ['compass', 'Rango angular de 0° a 360° con calibración magnética']
    ],
    pinout: [
      ['Chip Magnetómetro', 'LSM303AGR / FXOS8700CQ en bus I2C', 'Sensibilidad magnética en microteslas (µT).', '#52b788']
    ],
    example: [
      '<code>compass.heading()</code> devuelve un ángulo entre 0° y 360°, donde 0° es el Norte geográfico.',
      'Si el rumbo está entre 315° y 45°, mostramos la flecha hacia el Norte: <code>Image.ARROW_N</code>.',
      'Gira la aguja magnética en los controles para ver la reacción de la micro:bit en tiempo real.'
    ],
    specs: [
      ['Rango de Rumbo', '0° a 359° (con resolución angular de 1°)'],
      ['Precisión', '± 2° tras proceso de calibración'],
      ['Puntos Cardinales', 'Norte (0° / 360°), Este (90°), Sur (180°), Oeste (270°)']
    ],
    simConfig: {
      type: 'compass-sim',
      heading: 0,
      accessory: null
    },
    params: [
      {
        key: 'rumboGrados',
        label: 'Rumbo de la brújula (°)',
        type: 'range',
        min: 0,
        max: 359,
        step: 5,
        value: 0,
        unit: '°'
      }
    ],
    codeMicroPython: `# Lección 7: Brújula Náutica Digital
from microbit import *

while True:
    rumbo = compass.heading()
    print("Rumbo magnético:", rumbo, "grados")
    
    # Determinamos el punto cardinal
    if rumbo < 45 or rumbo >= 315:
        display.show(Image.ARROW_N)
    elif rumbo < 135:
        display.show(Image.ARROW_E)
    elif rumbo < 225:
        display.show(Image.ARROW_S)
    else:
        display.show(Image.ARROW_W)
        
    sleep(150)`,
    codeMakeCode: `// Lección 7 en MakeCode: Brújula Digital
basic.forever(function () {
    let rumbo = input.compassHeading()
    if (rumbo < 45 || rumbo >= 315) {
        basic.showArrow(ArrowNames.North)
    } else if (rumbo < 135) {
        basic.showArrow(ArrowNames.East)
    } else if (rumbo < 225) {
        basic.showArrow(ArrowNames.South)
    } else {
        basic.showArrow(ArrowNames.West)
    }
    basic.pause(150)
})`,
    callouts: [
      { anchor: 'part:compass-chip', title: 'Magnetómetro 3D', body: 'Detecta el polo norte magnético terrestre.', x: -35, y: 15, side: 'top' }
    ]
  },
  {
    id: 'acelerometro-y-dados',
    number: 8,
    title: 'Acelerómetro y Dado Mágico',
    cardTitle: '8. Acelerómetro y Agitar',
    icon: 'shuffle',
    shortDesc: 'Detecta movimiento físico, sacudidas y genera números aleatorios para juegos de mesa.',
    lede: 'El acelerómetro mide la inercia y la gravedad en tres dimensiones (X, Y, Z). Te permite detectar si la placa está boca arriba, en caída libre o si el usuario la agita fuertemente.',
    features: [
      ['activity', 'Detección de sacudida con is_gesture("shake")'],
      ['dices', 'Generador aleatorio de dado numérico (1 a 6)'],
      ['volume-2', 'Efecto de sonido al rodar el dado']
    ],
    pinout: [
      ['Eje X', 'Inclinación izquierda / derecha', 'Rango ±2048 mg.', '#3d7be0'],
      ['Eje Y', 'Inclinación adelante / atrás', 'Rango ±2048 mg.', '#3fae6a'],
      ['Eje Z', 'Orientación perpendicular (gravedad terrestre 1g)', 'Rango ±2048 mg.', '#f0a53a']
    ],
    example: [
      '<code>accelerometer.is_gesture("shake")</code> se activa al agitar la placa con la mano.',
      'Utilizamos la librería <code>random.randint(1, 6)</code> para simular el tiro de un dado de seis caras.',
      'Haz clic en el botón "¡Agitar micro:bit!" del simulador para lanzar los dados.'
    ],
    specs: [
      ['Gestos Reconocidos', 'shake, freefall, 3g, 6g, face up, face down, tilt left, tilt right'],
      ['Tasa de Muestreo', 'Hasta 800 lecturas por segundo']
    ],
    simConfig: {
      type: 'dice-roller',
      diceValue: 6,
      accessory: null
    },
    params: [
      {
        key: 'sensibilidadAgitado',
        label: 'Sensibilidad de Agitado',
        type: 'select',
        value: 'normal',
        options: [
          { value: 'suave', label: 'Suave' },
          { value: 'normal', label: 'Estándar' },
          { value: 'fuerte', label: 'Vigorosa' }
        ]
      }
    ],
    codeMicroPython: `# Lección 8: Dado Electrónico Mágico
from microbit import *
import random

display.show("DADO")
sleep(600)

while True:
    # Comprobamos si el usuario agitó la placa
    if accelerometer.is_gesture("shake"):
        # Animación de giro
        for i in range(3):
            display.show(Image.DIAMOND_SMALL)
            sleep(60)
            display.show(Image.DIAMOND)
            sleep(60)
            
        # Elegimos un número aleatorio del 1 al 6
        numero = random.randint(1, 6)
        print("¡Tirada del dado! Resultado:", numero)
        display.show(str(numero))
        
    sleep(100)`,
    codeMakeCode: `// Lección 8 en MakeCode: Dado al Agitar
input.onGesture(Gesture.Shake, function () {
    basic.showIcon(IconNames.SmallDiamond)
    basic.pause(80)
    basic.showIcon(IconNames.Diamond)
    basic.pause(80)
    let dado = randint(1, 6)
    basic.showNumber(dado)
})`,
    callouts: [
      { anchor: 'part:accel-chip', title: 'Sensor de Gravedad', body: 'Detecta caídas, inclinaciones y la sacudida de agitar.', x: -35, y: 15, side: 'top' }
    ]
  },
  {
    id: 'sonidos-y-sintetizador',
    number: 9,
    title: 'Sonidos, Melodías y Sintetizador',
    cardTitle: '9. Melodías y Altavoz',
    icon: 'music',
    shortDesc: 'Haz sonar el altavoz posterior con melodías célebres, pitidos de 8 bits y frecuencias audibles.',
    lede: 'La micro:bit v2 cuenta con un altavoz electroacústico integrado en el reverso. Mediante síntesis de audio de pulsos PWM, es capaz de interpretar partituras musicales completas y efectos estilo chiptune retro.',
    features: [
      ['volume-2', 'Generación de audio real sintetizado en tu navegador'],
      ['music', 'Melodías integradas: BA_DING, ODE, BIRTHDAY, CHASE...'],
      ['sliders', 'Control directo de frecuencia en hercios (Hz)']
    ],
    pinout: [
      ['Altavoz Interno', 'Conectado a etapa amplificadora clase D', 'Reproducción directa sin cables.', '#e8392e'],
      ['Pin 0', 'Salida de audio compartida', 'Compatible con auriculares externos si se desea.', '#e09f3e']
    ],
    example: [
      '<code>music.play(music.BA_DING)</code> ejecuta un sonido brillante de confirmación de éxito.',
      '<code>music.pitch(440, 500)</code> genera la nota LA musical (440 Hz) durante 500 milisegundos.',
      '¡Al presionar "Ejecutar Simulación", escucharás el sonido real en tus altavoces gracias al Web Audio API!'
    ],
    specs: [
      ['Transductor', 'Micro-altavoz electromagnético trasero'],
      ['Respuesta en Frecuencia', '200 Hz a 10.000 Hz'],
      ['Notas Musicales', 'C3 a B8 (8 octavas completas con sostenidos y silencios)']
    ],
    simConfig: {
      type: 'music-player',
      melody: 'BA_DING',
      accessory: null
    },
    params: [
      {
        key: 'melodia',
        label: 'Melodía a reproducir',
        type: 'select',
        value: 'BA_DING',
        options: [
          { value: 'BA_DING', label: 'Ba-Ding (Éxito)' },
          { value: 'ODE', label: 'Himno de la Alegría' },
          { value: 'BIRTHDAY', label: 'Cumpleaños Feliz' },
          { value: 'POWER_UP', label: 'Power Up (Retro)' },
          { value: 'JUMP_UP', label: 'Salto Mario Bros' }
        ]
      },
      {
        key: 'volumen',
        label: 'Volumen',
        type: 'range',
        min: 10,
        max: 100,
        step: 5,
        value: 80,
        unit: '%'
      }
    ],
    codeMicroPython: `# Lección 9: Sintetizador Musical y Efectos
from microbit import *
import music

# Saludo visual y musical de inicio
display.show(Image.MUSIC_QUAVER)
print("Reproduciendo melodía de bienvenida...")

# Ejecutamos el sonido característico Ba-Ding
music.play(music.BA_DING)

# Esperamos un momento y tocamos una escala
while True:
    if button_a.was_pressed():
        # Reproducir Himno a la Alegría
        music.play(music.ODE)
    elif button_b.was_pressed():
        # Tono personalizado a 523 Hz (DO5) durante 300 ms
        music.pitch(523, 300)
    sleep(100)`,
    codeMakeCode: `// Lección 9 en MakeCode: Melodías y Altavoz
basic.showIcon(IconNames.EigthNote)
music.play(music.builtinPlayableSoundEffect(soundExpression.happy), music.PlaybackMode.UntilDone)

input.onButtonPressed(Button.A, function () {
    music.play(music.stringPlayable("C D E F G A B C5 ", 120), music.PlaybackMode.UntilDone)
})

input.onButtonPressed(Button.B, function () {
    music.playTone(523, music.beat(BeatFraction.Half))
})`,
    callouts: [
      { anchor: 'part:speaker', title: 'Altavoz Integrado', body: 'En el reverso de la placa v2: ¡escucha las notas musicales!', x: 45, y: 35, side: 'right' }
    ]
  },
  {
    id: 'pines-analogicos-potenciometro',
    number: 10,
    title: 'Pines Analógicos y Potenciómetro',
    cardTitle: '10. Entradas Analógicas',
    icon: 'dial',
    shortDesc: 'Conecta componentes analógicos externos mediante el pin P0 y lee valores continuos de 0 a 1023.',
    lede: 'El mundo físico no es solo 0 y 1; tiene infinitos matices continuos. Los pines grandes P0, P1 y P2 cuentan con convertidores analógico-digitales (ADC) capaces de medir voltajes con precisión milimétrica.',
    features: [
      ['sliders', 'Lectura de voltaje continuo con pin0.read_analog()'],
      ['activity', 'Conversión ADC de 10 bits (resolución de 1024 niveles)'],
      ['bar-chart-2', 'Barra gráfica visual en la matriz de LEDs proporcional al giro']
    ],
    pinout: [
      ['Pin P0', 'Entrada analógica ADC', 'Conectada al terminal central del potenciómetro.', '#3d7be0'],
      ['Pin 3V', 'Alimentación positiva 3.3V', 'Conectada al extremo 1 del potenciómetro.', '#d64a3a'],
      ['Pin GND', 'Tierra 0V', 'Conectada al extremo 2 del potenciómetro.', '#2f3547']
    ],
    example: [
      '<code>pin0.read_analog()</code> lee la tensión en el pin 0 y devuelve un número entero de 0 a 1023.',
      'Al girar la perilla hacia 3.3V, el valor sube a 1023; hacia GND, baja a 0.',
      'Mapeamos el valor a la cantidad de filas de LEDs encendidas en la matriz 5x5.'
    ],
    specs: [
      ['Resolución ADC', '10 bits (valores enteros de 0 a 1023)'],
      ['Tensión de Entrada', '0.0 V a 3.3 V máximo'],
      ['Impedancia de entrada', 'Aproximadamente 10 MΩ para no alterar la señal']
    ],
    simConfig: {
      type: 'potentiometer-reader',
      potValue: 512,
      accessory: 'potentiometer'
    },
    params: [
      {
        key: 'giroPotenciometro',
        label: 'Giro del Potenciómetro',
        type: 'range',
        min: 0,
        max: 1023,
        step: 10,
        value: 512
      }
    ],
    codeMicroPython: `# Lección 10: Lectura de Potenciómetro Analógico
from microbit import *

while True:
    # Leemos la tensión en el pin 0 (0 a 1023)
    lectura = pin0.read_analog()
    print("Valor analógico P0:", lectura)
    
    # Calculamos cuántas columnas encender (de 0 a 5)
    nivel = int(lectura * 5 / 1024)
    
    # Dibujamos una barra gráfica en la pantalla
    display.clear()
    for y in range(5 - nivel, 5):
        for x in range(5):
            display.set_pixel(x, y, 9)
            
    sleep(80)`,
    codeMakeCode: `// Lección 10 en MakeCode: Potenciómetro Analógico
basic.forever(function () {
    let lectura = pins.analogReadPin(AnalogPin.P0)
    led.plotBarGraph(lectura, 1023)
    basic.pause(80)
})`,
    callouts: [
      { anchor: 'part:pin-0', title: 'Pin 0 (Entrada ADC)', body: 'Recibe la señal de voltaje variable del potenciómetro.', x: -90, y: -90, side: 'left' },
      { anchor: 'part:pot', title: 'Potenciómetro 10kΩ', body: 'Gira la perilla para ver cambiar el valor en tiempo real.', x: -140, y: -40, side: 'left' }
    ]
  },
  {
    id: 'servomotor-y-robotica',
    number: 11,
    title: 'Servomotor 9g y Movimiento Robótico',
    cardTitle: '11. Control de Servomotor',
    icon: 'cpu',
    shortDesc: 'Genera pulsos PWM para posicionar el brazo de un servomotor en ángulos exactos de 0° a 180°.',
    lede: 'La robótica cobra vida cuando el software mueve objetos mecánicos. Un servomotor no es un motor común: contiene un potenciómetro interno y un circuito de control que posiciona su eje con precisión milimétrica.',
    features: [
      ['refresh-cw', 'Movimiento angular de 0 a 180 grados'],
      ['zap', 'Señal PWM de 50 Hz con ancho de pulso de 0.5 a 2.5 milisegundos'],
      ['settings', 'Barrido continuo automático y control manual']
    ],
    pinout: [
      ['Cable Naranja', 'Señal de control PWM', 'Conectada a Pin P0 de la micro:bit.', '#f0a53a'],
      ['Cable Rojo', 'Alimentación positiva 3.3V / 5V', 'Conectada a Pin 3V.', '#d64a3a'],
      ['Cable Marrón', 'Tierra / GND', 'Conectada a Pin GND común.', '#2f3547']
    ],
    example: [
      'Los servos esperan un pulso cada 20 milisegundos (frecuencia de 50 Hz).',
      'Un pulso de 0.5 ms sitúa el eje a 0°; 1.5 ms lo centra a 90°; y 2.5 ms lo lleva al extremo de 180°.',
      '¡Observa el servomotor 3D animado a la izquierda de la placa girando con cada cambio!'
    ],
    specs: [
      ['Modelo', 'Micro Servo SG90 de 9 gramos con engranajes de nylon'],
      ['Torque de Par', '1.6 kg·cm'],
      ['Tiempo de respuesta', '0.1 segundos por cada 60 grados de rotación']
    ],
    simConfig: {
      type: 'servo-sweep',
      servoAngle: 90,
      accessory: 'servo-motor'
    },
    params: [
      {
        key: 'anguloServo',
        label: 'Ángulo del Servo (°)',
        type: 'range',
        min: 0,
        max: 180,
        step: 5,
        value: 90,
        unit: '°'
      },
      {
        key: 'barridoAutomatico',
        label: 'Barrido automático (Sweep)',
        type: 'toggle',
        value: false
      }
    ],
    codeMicroPython: `# Lección 11: Control de Servomotor SG90
from microbit import *

# Función para convertir grados (0-180) a pulsos PWM analógicos
def mover_servo(pin, angulo):
    # Rango de pulsos de ~25 a ~125 en la escala de 1024
    pulso = int(25 + (angulo / 180.0) * 100)
    pin.write_analog(pulso)

# Configuramos el periodo a 20 ms (50 Hz)
pin0.set_analog_period(20)

while True:
    # Si presionamos botón A, giramos a la izquierda (0°)
    if button_a.is_pressed():
        mover_servo(pin0, 0)
        display.show(Image.ARROW_W)
    # Si presionamos botón B, giramos a la derecha (180°)
    elif button_b.is_pressed():
        mover_servo(pin0, 180)
        display.show(Image.ARROW_E)
    # En reposo centramos a 90°
    else:
        mover_servo(pin0, 90)
        display.show(Image.TARGET)
    sleep(100)`,
    codeMakeCode: `// Lección 11 en MakeCode: Servomotor SG90
basic.forever(function () {
    if (input.buttonIsPressed(Button.A)) {
        pins.servoWritePin(AnalogPin.P0, 0)
        basic.showArrow(ArrowNames.West)
    } else if (input.buttonIsPressed(Button.B)) {
        pins.servoWritePin(AnalogPin.P0, 180)
        basic.showArrow(ArrowNames.East)
    } else {
        pins.servoWritePin(AnalogPin.P0, 90)
        basic.showIcon(IconNames.Target)
    }
    basic.pause(100)
})`,
    callouts: [
      { anchor: 'part:servo', title: 'Servomotor 9g', body: 'Mira cómo rota el brazo blanco según el ángulo programado.', x: 140, y: 20, side: 'right' },
      { anchor: 'part:pin-0', title: 'Señal PWM (P0)', body: 'Envía los pulsos de sincronización de 50 Hz.', x: -90, y: -90, side: 'left' }
    ]
  },
  {
    id: 'proyecto-alarma-antirrobo',
    number: 12,
    title: 'Proyecto Final: Alarma y Radar Antirrobo',
    cardTitle: '12. Alarma Inteligente',
    icon: 'shield-alert',
    shortDesc: 'Combina el sensor de distancia HC-SR04, la matriz 5x5 y la sirena acústica en un sistema real.',
    lede: '¡Llegó la hora de poner todo lo aprendido en acción! Construiremos un sistema de seguridad inteligente. Cuando un intruso se acerque a menos de 20 cm del sensor ultrasónico, la micro:bit hará sonar la alarma, encenderá luces rojas parpadeantes y registrará el evento.',
    features: [
      ['shield', 'Sistema de seguridad autónomo completo'],
      ['radio', 'Sensor de ecolocalización ultrasónica HC-SR04'],
      ['alert-circle', 'Sirena multitono con el altavoz integrado'],
      ['terminal', 'Registro de intrusión en el monitor serie']
    ],
    pinout: [
      ['Pin P1', 'Trigger (Disparo ultrasónico)', 'Pulso de 10 µs para emitir sonido.', '#e09f3e'],
      ['Pin P2', 'Echo (Recepción del eco)', 'Mide el tiempo de rebote de la onda.', '#3fae6a'],
      ['Pin 3V / 5V', 'Alimentación del sensor', 'Energía del módulo sonar.', '#d64a3a'],
      ['Pin GND', 'Tierra común', 'Referencia de voltaje.', '#2f3547']
    ],
    example: [
      'El sensor emite un ultrasonido de 40 kHz y escucha el rebote del objeto.',
      'Si el obstáculo está a menos de 20 cm, se activa el estado de ALERTA.',
      'En alerta: la matriz 5x5 destella la señal "STOP", el altavoz emite una sirena de dos tonos y la consola registra la distancia exacta.'
    ],
    specs: [
      ['Rango de Detección', '2 cm a 400 cm'],
      ['Frecuencia de Sirena', 'Tonos alternados de 880 Hz y 440 Hz'],
      ['Tiempo de Reacción', '< 50 milisegundos']
    ],
    simConfig: {
      type: 'sonar-alarm',
      distance: 45,
      alarmDistance: 20,
      alarmActive: false,
      accessory: 'ultrasonic'
    },
    params: [
      {
        key: 'distanciaObstaculo',
        label: 'Distancia del Intruso (cm)',
        type: 'range',
        min: 5,
        max: 80,
        step: 1,
        value: 45,
        unit: 'cm'
      },
      {
        key: 'distanciaAlarma',
        label: 'Distancia de Disparo de Alarma',
        type: 'range',
        min: 10,
        max: 40,
        step: 2,
        value: 20,
        unit: 'cm'
      }
    ],
    codeMicroPython: `# Lección 12: Sistema de Alarma y Radar Antirrobo
from microbit import *
import music

DISTANCIA_ALARMA = 20  # cm

print("Sistema de alarma armado y vigilando...")
display.show(Image.YES)

while True:
    # Simulamos la lectura de distancia en cm del sonar
    # En un sensor real: tiempo = machine.time_pulse_us(pin2, 1)
    # distancia = (tiempo * 0.0343) / 2
    distancia = 15  # Si detecta intruso cercano
    
    if distancia < DISTANCIA_ALARMA:
        print("¡INTRUSO DETECTADO! A:", distancia, "cm")
        # Señal visual de alerta
        display.show(Image.NO)
        # Sirena acústica policial
        music.pitch(880, 150)
        music.pitch(587, 150)
    else:
        display.show(Image.HAPPY)
        sleep(200)`,
    codeMakeCode: `// Lección 12 en MakeCode: Alarma con Sonar
let DISTANCIA_ALARMA = 20

basic.showIcon(IconNames.Yes)

basic.forever(function () {
    let distancia = sonar.ping(DigitalPin.P1, DigitalPin.P2, PingUnit.Centimeters)
    if (distancia > 0 && distancia < DISTANCIA_ALARMA) {
        basic.showIcon(IconNames.No)
        music.playTone(880, music.beat(BeatFraction.Quarter))
        music.playTone(587, music.beat(BeatFraction.Quarter))
    } else {
        basic.showIcon(IconNames.Happy)
        basic.pause(200)
    }
})`,
    callouts: [
      { anchor: 'part:ultrasonic', title: 'Sensor HC-SR04', body: 'Emite ondas de ultrasonido para vigilar el perímetro.', x: -140, y: 40, side: 'left' },
      { anchor: 'part:speaker', title: 'Sirena Acústica', body: 'Hace sonar la alarma si alguien traspasa el límite.', x: 45, y: 35, side: 'right' },
      { anchor: 'part:matrix', title: 'Aviso Visual', body: 'Destella en rojo indicando peligro de intrusión.', x: 0, y: -20, side: 'top' }
    ]
  }
];
