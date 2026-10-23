// Motor de Simulación Virtual de micro:bit v2 con soporte completo de sensores y actuadores
export class SimulatorEngine {
  constructor(board3D, audioEngine, serialMonitor) {
    this.board = board3D;
    this.audio = audioEngine;
    this.serial = serialMonitor;

    this.state = 'idle'; // 'idle' | 'running'
    this.currentLesson = null;
    this.intervalId = null;
    this.tickCount = 0;

    // Estado de hardware simulado
    this.hw = {
      matrix: Array.from({ length: 5 }, () => Array(5).fill(0)),
      buttonA: false,
      buttonB: false,
      logoTouched: false,
      saludo: '¡HOLA MICRO:BIT!',
      selectedIcon: 'HAPPY',
      counter: 0,
      flashlight: false,
      temperature: 24,
      alertThreshold: 28,
      lightLevel: 140,
      nightThreshold: 60,
      heading: 0,
      gesture: 'none',
      shakeSensitivity: 2,
      potValue: 512,
      servoAngle: 90,
      autoSweep: false,
      sweepDir: 1,
      sonarDistance: 45,
      alarmDistance: 20,
      alarmActive: false,
      selectedMelody: 'BA_DING',
      volume: 80,
      heartbeatInterval: 5,
      brightness: 9
    };

    // Estado de texto en desplazamiento (Text Scrolling)
    this.scrollState = {
      active: false,
      columns: [],
      colIndex: 0,
      repeat: true,
      lastTick: 0
    };

    // Fuentes tipográficas 5x5 para la matriz de micro:bit
    this.font5x5 = {
      'A': [[0,9,9,9,0],[9,0,0,0,9],[9,9,9,9,9],[9,0,0,0,9],[9,0,0,0,9]],
      'B': [[9,9,9,9,0],[9,0,0,0,9],[9,9,9,9,0],[9,0,0,0,9],[9,9,9,9,0]],
      'C': [[0,9,9,9,9],[9,0,0,0,0],[9,0,0,0,0],[9,0,0,0,0],[0,9,9,9,9]],
      'D': [[9,9,9,9,0],[9,0,0,0,9],[9,0,0,0,9],[9,0,0,0,9],[9,9,9,9,0]],
      'E': [[9,9,9,9,9],[9,0,0,0,0],[9,9,9,9,0],[9,0,0,0,0],[9,9,9,9,9]],
      'F': [[9,9,9,9,9],[9,0,0,0,0],[9,9,9,9,0],[9,0,0,0,0],[9,0,0,0,0]],
      'G': [[0,9,9,9,9],[9,0,0,0,0],[9,0,9,9,9],[9,0,0,0,9],[0,9,9,9,0]],
      'H': [[9,0,0,0,9],[9,0,0,0,9],[9,9,9,9,9],[9,0,0,0,9],[9,0,0,0,9]],
      'I': [[9,9,9],[0,9,0],[0,9,0],[0,9,0],[9,9,9]],
      'J': [[0,0,9,9,9],[0,0,0,9,0],[0,0,0,9,0],[9,0,0,9,0],[0,9,9,0,0]],
      'K': [[9,0,0,9],[9,0,9,0],[9,9,0,0],[9,0,9,0],[9,0,0,9]],
      'L': [[9,0,0,0,0],[9,0,0,0,0],[9,0,0,0,0],[9,0,0,0,0],[9,9,9,9,9]],
      'M': [[9,0,0,0,9],[9,9,0,9,9],[9,0,9,0,9],[9,0,0,0,9],[9,0,0,0,9]],
      'N': [[9,0,0,0,9],[9,9,0,0,9],[9,0,9,0,9],[9,0,0,9,9],[9,0,0,0,9]],
      'O': [[0,9,9,9,0],[9,0,0,0,9],[9,0,0,0,9],[9,0,0,0,9],[0,9,9,9,0]],
      'P': [[9,9,9,9,0],[9,0,0,0,9],[9,9,9,9,0],[9,0,0,0,0],[9,0,0,0,0]],
      'Q': [[0,9,9,9,0],[9,0,0,0,9],[9,0,9,0,9],[9,0,0,9,0],[0,9,9,0,9]],
      'R': [[9,9,9,9,0],[9,0,0,0,9],[9,9,9,9,0],[9,0,0,9,0],[9,0,0,0,9]],
      'S': [[0,9,9,9,9],[9,0,0,0,0],[0,9,9,9,0],[0,0,0,0,9],[9,9,9,9,0]],
      'T': [[9,9,9,9,9],[0,0,9,0,0],[0,0,9,0,0],[0,0,9,0,0],[0,0,9,0,0]],
      'U': [[9,0,0,0,9],[9,0,0,0,9],[9,0,0,0,9],[9,0,0,0,9],[0,9,9,9,0]],
      'V': [[9,0,0,0,9],[9,0,0,0,9],[9,0,0,0,9],[0,9,0,9,0],[0,0,9,0,0]],
      'W': [[9,0,0,0,9],[9,0,0,0,9],[9,0,9,0,9],[9,9,0,9,9],[9,0,0,0,9]],
      'X': [[9,0,0,0,9],[0,9,0,9,0],[0,0,9,0,0],[0,9,0,9,0],[9,0,0,0,9]],
      'Y': [[9,0,0,0,9],[0,9,0,9,0],[0,0,9,0,0],[0,0,9,0,0],[0,0,9,0,0]],
      'Z': [[9,9,9,9,9],[0,0,0,9,0],[0,0,9,0,0],[0,9,0,0,0],[9,9,9,9,9]],
      '0': [[0,9,9,9,0],[9,0,0,9,9],[9,0,9,0,9],[9,9,0,0,9],[0,9,9,9,0]],
      '1': [[0,0,9,0,0],[0,9,9,0,0],[0,0,9,0,0],[0,0,9,0,0],[0,9,9,9,0]],
      '2': [[0,9,9,9,0],[9,0,0,0,9],[0,0,9,9,0],[0,9,0,0,0],[9,9,9,9,9]],
      '3': [[9,9,9,9,0],[0,0,0,0,9],[0,0,9,9,0],[0,0,0,0,9],[9,9,9,9,0]],
      '4': [[9,0,0,9,0],[9,0,0,9,0],[9,9,9,9,9],[0,0,0,9,0],[0,0,0,9,0]],
      '5': [[9,9,9,9,9],[9,0,0,0,0],[9,9,9,9,0],[0,0,0,0,9],[9,9,9,9,0]],
      '6': [[0,9,9,9,0],[9,0,0,0,0],[9,9,9,9,0],[9,0,0,0,9],[0,9,9,9,0]],
      '7': [[9,9,9,9,9],[0,0,0,9,0],[0,0,9,0,0],[0,9,0,0,0],[0,9,0,0,0]],
      '8': [[0,9,9,9,0],[9,0,0,0,9],[0,9,9,9,0],[9,0,0,0,9],[0,9,9,9,0]],
      '9': [[0,9,9,9,0],[9,0,0,0,9],[0,9,9,9,9],[0,0,0,0,9],[0,9,9,9,0]],
      ' ': [[0,0],[0,0],[0,0],[0,0],[0,0]],
      '!': [[9],[9],[9],[0],[9]],
      '¡': [[9],[0],[9],[9],[9]],
      '?': [[9,9,9],[0,0,9],[0,9,9],[0,0,0],[0,9,0]],
      ':': [[0],[9],[0],[9],[0]],
      '.': [[0],[0],[0],[0],[9]],
      '-': [[0,0,0],[0,0,0],[9,9,9],[0,0,0],[0,0,0]],
      '+': [[0,0,0],[0,9,0],[9,9,9],[0,9,0],[0,0,0]]
    };

    // Biblioteca de iconos oficiales de micro:bit
    this.images = {
      HEART: [
        [0, 9, 0, 9, 0],
        [9, 9, 9, 9, 9],
        [9, 9, 9, 9, 9],
        [0, 9, 9, 9, 0],
        [0, 0, 9, 0, 0]
      ],
      HEART_SMALL: [
        [0, 0, 0, 0, 0],
        [0, 9, 0, 9, 0],
        [0, 9, 9, 9, 0],
        [0, 0, 9, 0, 0],
        [0, 0, 0, 0, 0]
      ],
      HAPPY: [
        [0, 0, 0, 0, 0],
        [0, 9, 0, 9, 0],
        [0, 0, 0, 0, 0],
        [9, 0, 0, 0, 9],
        [0, 9, 9, 9, 0]
      ],
      SMILE: [
        [0, 0, 0, 0, 0],
        [0, 9, 0, 9, 0],
        [0, 0, 0, 0, 0],
        [9, 9, 9, 9, 9],
        [0, 0, 0, 0, 0]
      ],
      SAD: [
        [0, 0, 0, 0, 0],
        [0, 9, 0, 9, 0],
        [0, 0, 0, 0, 0],
        [0, 9, 9, 9, 0],
        [9, 0, 0, 0, 9]
      ],
      ANGRY: [
        [9, 0, 0, 0, 9],
        [0, 9, 0, 9, 0],
        [0, 0, 0, 0, 0],
        [9, 9, 9, 9, 9],
        [9, 0, 9, 0, 9]
      ],
      ASLEEP: [
        [0, 0, 0, 0, 0],
        [9, 9, 0, 9, 9],
        [0, 0, 0, 0, 0],
        [0, 9, 9, 9, 0],
        [0, 0, 0, 0, 0]
      ],
      SURPRISED: [
        [0, 9, 0, 9, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 9, 0, 0],
        [0, 9, 0, 9, 0],
        [0, 0, 9, 0, 0]
      ],
      YES: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 9],
        [0, 0, 0, 9, 0],
        [9, 0, 9, 0, 0],
        [0, 9, 0, 0, 0]
      ],
      NO: [
        [9, 0, 0, 0, 9],
        [0, 9, 0, 9, 0],
        [0, 0, 9, 0, 0],
        [0, 9, 0, 9, 0],
        [9, 0, 0, 0, 9]
      ],
      ARROW_N: [
        [0, 0, 9, 0, 0],
        [0, 9, 9, 9, 0],
        [9, 0, 9, 0, 9],
        [0, 0, 9, 0, 0],
        [0, 0, 9, 0, 0]
      ],
      ARROW_E: [
        [0, 0, 9, 0, 0],
        [0, 0, 0, 9, 0],
        [9, 9, 9, 9, 9],
        [0, 0, 0, 9, 0],
        [0, 0, 9, 0, 0]
      ],
      ARROW_S: [
        [0, 0, 9, 0, 0],
        [0, 0, 9, 0, 0],
        [9, 0, 9, 0, 9],
        [0, 9, 9, 9, 0],
        [0, 0, 9, 0, 0]
      ],
      ARROW_W: [
        [0, 0, 9, 0, 0],
        [0, 9, 0, 0, 0],
        [9, 9, 9, 9, 9],
        [0, 9, 0, 0, 0],
        [0, 0, 9, 0, 0]
      ],
      DIAMOND: [
        [0, 0, 9, 0, 0],
        [0, 9, 0, 9, 0],
        [9, 0, 0, 0, 9],
        [0, 9, 0, 9, 0],
        [0, 0, 9, 0, 0]
      ],
      TARGET: [
        [0, 0, 9, 0, 0],
        [0, 9, 9, 9, 0],
        [9, 9, 0, 9, 9],
        [0, 9, 9, 9, 0],
        [0, 0, 9, 0, 0]
      ],
      PACMAN: [
        [0, 9, 9, 9, 9],
        [9, 9, 0, 9, 9],
        [9, 9, 9, 0, 0],
        [9, 9, 9, 9, 9],
        [0, 9, 9, 9, 9]
      ],
      MUSIC_QUAVER: [
        [0, 0, 9, 9, 0],
        [0, 0, 9, 0, 9],
        [0, 0, 9, 0, 9],
        [0, 9, 9, 0, 0],
        [0, 9, 9, 0, 0]
      ]
    };
  }

  setLesson(lesson) {
    this.stop();
    this.currentLesson = lesson;
    this.tickCount = 0;

    // Configurar accesorios y valores iniciales
    if (lesson.simConfig && lesson.simConfig.accessory) {
      this.board.setAccessory(lesson.simConfig.accessory);
    } else {
      this.board.setAccessory(null);
    }

    // Inicializar parámetros
    if (lesson.params) {
      lesson.params.forEach(p => {
        this.setParam(p.key, p.value);
      });
    }

    this.clearMatrix();
  }

  setParam(key, value) {
    switch (key) {
      case 'saludo':
        this.hw.saludo = String(value);
        if (this.state === 'running' && this.currentLesson?.id === 'conoce-la-placa') {
          this.initScroll(this.hw.saludo);
        }
        break;
      case 'icono':
        this.hw.selectedIcon = String(value);
        if (this.state === 'running' && !this.scrollState.active) {
          this.showImage(this.hw.selectedIcon);
        }
        break;
      case 'ritmo':
        this.hw.heartbeatInterval = value === 'RAPIDO' ? 3 : (value === 'LENTO' ? 8 : 5);
        break;
      case 'brillo':
        this.hw.brightness = Number(value);
        break;
      case 'valorInicial':
        this.hw.counter = Number(value);
        if (this.state === 'running') {
          this.showDigit(String(this.hw.counter % 10));
        }
        break;
      case 'modoLinterna':
        this.hw.flashlight = (value === 'true' || value === true || value === 'ON');
        break;
      case 'tempAmbiente':
        this.hw.temperature = Number(value);
        break;
      case 'umbralAlerta':
        this.hw.alertThreshold = Number(value);
        break;
      case 'nivelLuz':
        this.hw.lightLevel = Number(value);
        this.board.setLampIntensity(this.hw.lightLevel / 255);
        break;
      case 'umbralNoche':
        this.hw.nightThreshold = Number(value);
        break;
      case 'rumboGrados':
        this.hw.heading = Number(value);
        break;
      case 'sensibilidadAgitado':
        this.hw.shakeSensitivity = Number(value);
        break;
      case 'melodia':
        this.hw.selectedMelody = String(value);
        break;
      case 'volumen':
        this.hw.volume = Number(value);
        this.audio.setVolume(this.hw.volume);
        break;
      case 'giroPotenciometro':
        this.hw.potValue = Number(value);
        this.board.setPotValue(this.hw.potValue);
        break;
      case 'anguloServo':
        this.hw.servoAngle = Number(value);
        this.board.setServoAngle(this.hw.servoAngle);
        break;
      case 'barridoAutomatico':
        this.hw.autoSweep = (value === 'true' || value === true || value === 'ON');
        break;
      case 'distanciaObstaculo':
        this.hw.sonarDistance = Number(value);
        break;
      case 'distanciaAlarma':
        this.hw.alarmDistance = Number(value);
        break;
    }
  }

  initScroll(text) {
    const raw = String(text || '').toUpperCase();
    const cols = [];

    // 5 columnas vacías al inicio para entrada suave
    for (let i = 0; i < 5; i++) cols.push([0, 0, 0, 0, 0]);

    for (let i = 0; i < raw.length; i++) {
      const char = raw[i];
      const glyph = this.font5x5[char] || this.font5x5[' '];

      // Convertir glyph (filas) a columnas
      const glyphWidth = glyph[0].length;
      for (let c = 0; c < glyphWidth; c++) {
        const col = [];
        for (let r = 0; r < 5; r++) {
          col.push(glyph[r][c] || 0);
        }
        cols.push(col);
      }
      // 1 columna de espacio entre letras
      cols.push([0, 0, 0, 0, 0]);
    }

    // 5 columnas vacías al final
    for (let i = 0; i < 5; i++) cols.push([0, 0, 0, 0, 0]);

    this.scrollState = {
      active: true,
      columns: cols,
      colIndex: 0,
      repeat: true,
      lastTick: this.tickCount
    };
  }

  start() {
    if (this.state === 'running') return;
    this.state = 'running';
    this.tickCount = 0;

    this.serial.log(`[BOOT] micro:bit v2.21 iniciado (ARM Cortex-M4 @ 64MHz)`);
    this.serial.log(`[RUN] Ejecutando: ${this.currentLesson?.title}`);

    // Configurar comportamiento inicial según lección
    if (this.currentLesson?.id === 'conoce-la-placa') {
      this.initScroll(this.hw.saludo || '¡HOLA MICRO:BIT!');
    } else if (this.currentLesson?.id === 'sonidos-y-sintetizador') {
      this.audio.setVolume(this.hw.volume || 80);
      this.audio.playMelody(this.hw.selectedMelody || 'BA_DING');
    }

    // Ciclo de reloj del simulador (100 ms por tick = 10 Hz)
    this.intervalId = setInterval(() => this.tick(), 100);
    this.tick();
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.state = 'idle';
    this.scrollState.active = false;
    this.clearMatrix();
    this.serial.log(`[STOP] Simulación detenida`);
  }

  clearMatrix() {
    this.hw.matrix = Array.from({ length: 5 }, () => Array(5).fill(0));
    this.board.setMatrixPixels(this.hw.matrix);
  }

  showImage(name) {
    const pattern = this.images[name];
    if (pattern) {
      const b = this.hw.brightness || 9;
      this.hw.matrix = pattern.map(row => row.map(v => (v > 0 ? b : 0)));
      this.board.setMatrixPixels(this.hw.matrix);
    }
  }

  showDigit(digitChar) {
    const glyph = this.font5x5[digitChar];
    const grid = Array.from({ length: 5 }, () => Array(5).fill(0));
    if (glyph) {
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < glyph[y].length; x++) {
          grid[y][x] = glyph[y][x];
        }
      }
    }
    this.hw.matrix = grid;
    this.board.setMatrixPixels(this.hw.matrix);
  }

  // Simulación por cada tick (100ms)
  tick() {
    this.tickCount++;
    const lessonId = this.currentLesson?.id;

    // Manejo de desplazamiento de texto si está activo
    if (this.scrollState.active) {
      const cols = this.scrollState.columns;
      const idx = this.scrollState.colIndex;

      if (idx + 5 <= cols.length) {
        const grid = Array.from({ length: 5 }, () => Array(5).fill(0));
        for (let c = 0; c < 5; c++) {
          const colData = cols[idx + c];
          for (let r = 0; r < 5; r++) {
            grid[r][c] = colData[r];
          }
        }
        this.board.setMatrixPixels(grid);
        this.scrollState.colIndex++;
      } else {
        // Al terminar el desplazamiento, mostrar el icono seleccionado
        this.scrollState.active = false;
        this.showImage(this.hw.selectedIcon || 'HAPPY');
      }
      return;
    }

    switch (lessonId) {
      case 'conoce-la-placa': {
        this.showImage(this.hw.selectedIcon || 'HAPPY');
        if (this.tickCount % 20 === 0) {
          this.serial.log(`[micro:bit] Procesador activo: 64MHz | Batería: 3.2V`);
        }
        break;
      }

      case 'matriz-y-emoticonos': {
        // Latido rítmico configurable
        const interval = this.hw.heartbeatInterval || 5;
        const isBig = (Math.floor(this.tickCount / interval) % 2) === 0;
        this.showImage(isBig ? 'HEART' : 'HEART_SMALL');
        if (isBig && this.tickCount % interval === 0) {
          this.audio.playTone(180, 45, 'sine');
        }
        break;
      }

      case 'botones-a-y-b': {
        // Muestra el contador actual en el display
        this.showDigit(String(this.hw.counter % 10));
        break;
      }

      case 'logo-tactil-capacitivo': {
        if (this.hw.logoTouched || this.hw.flashlight) {
          this.hw.matrix = Array.from({ length: 5 }, () => Array(5).fill(9));
        } else {
          this.hw.matrix = Array.from({ length: 5 }, () => Array(5).fill(0));
        }
        this.board.setMatrixPixels(this.hw.matrix);
        break;
      }

      case 'termometro-digital': {
        const temp = this.hw.temperature;
        const alertThresh = this.hw.alertThreshold || 28;

        if (temp >= alertThresh) {
          const blink = (this.tickCount % 4) < 2;
          this.showImage(blink ? 'ANGRY' : 'NO');
          if (this.tickCount % 8 === 0) {
            this.audio.playTone(700, 80, 'square');
          }
        } else if (temp < 15) {
          this.showImage('SAD');
        } else {
          this.showImage('HAPPY');
        }

        if (this.tickCount % 10 === 0) {
          this.serial.log(`[TERMÓMETRO] ${temp} °C (Alerta: ${alertThresh} °C)`);
          this.serial.plot('Temperatura (°C)', temp);
        }
        break;
      }

      case 'sensor-de-luz': {
        const light = this.hw.lightLevel;
        const nightThresh = this.hw.nightThreshold || 60;

        if (light < nightThresh) {
          // Noche: encender farola ambiental y mostrar diamante en display
          this.showImage('DIAMOND');
          this.board.setLampIntensity(1.0);
        } else {
          this.clearMatrix();
          this.board.setLampIntensity(0.1);
        }

        if (this.tickCount % 10 === 0) {
          this.serial.log(`[FOTOCÉLULA] Luz ambiente: ${light} lux (Umbral noche: ${nightThresh})`);
          this.serial.plot('Nivel de Luz', light);
        }
        break;
      }

      case 'brujula-y-orientacion': {
        const h = this.hw.heading;
        if (h < 45 || h >= 315) {
          this.showImage('ARROW_N');
        } else if (h < 135) {
          this.showImage('ARROW_E');
        } else if (h < 225) {
          this.showImage('ARROW_S');
        } else {
          this.showImage('ARROW_W');
        }
        if (this.tickCount % 10 === 0) {
          this.serial.log(`[BRÚJULA] Rumbo magnético: ${h}°`);
        }
        break;
      }

      case 'acelerometro-y-dados': {
        // En reposo muestra el último dado o 6
        if (!this.hw.diceActive) {
          this.showDigit(String(this.hw.counter || 6));
        }
        break;
      }

      case 'sonidos-y-sintetizador': {
        this.showImage('MUSIC_QUAVER');
        break;
      }

      case 'pines-analogicos-potenciometro': {
        const val = this.hw.potValue;
        const rows = Math.min(5, Math.floor((val * 5) / 1024));
        const grid = Array.from({ length: 5 }, () => Array(5).fill(0));

        for (let y = 5 - rows; y < 5; y++) {
          for (let x = 0; x < 5; x++) {
            grid[y][x] = 9;
          }
        }
        this.hw.matrix = grid;
        this.board.setMatrixPixels(this.hw.matrix);

        if (this.tickCount % 8 === 0) {
          this.serial.log(`[P0 ADC] ${val} / 1023 (${((val * 3.3) / 1023).toFixed(2)}V)`);
          this.serial.plot('Potenciómetro', val);
        }
        break;
      }

      case 'servomotor-y-robotica': {
        // Barrido automático continuo si está activado
        if (this.hw.autoSweep) {
          this.hw.servoAngle += this.hw.sweepDir * 6;
          if (this.hw.servoAngle >= 180) {
            this.hw.servoAngle = 180;
            this.hw.sweepDir = -1;
          } else if (this.hw.servoAngle <= 0) {
            this.hw.servoAngle = 0;
            this.hw.sweepDir = 1;
          }
          this.board.setServoAngle(this.hw.servoAngle);
        }

        const angle = this.hw.servoAngle;
        if (angle < 45) {
          this.showImage('ARROW_W');
        } else if (angle > 135) {
          this.showImage('ARROW_E');
        } else {
          this.showImage('TARGET');
        }

        if (this.tickCount % 10 === 0) {
          this.serial.log(`[SERVO SG90] Ángulo actual: ${Math.round(angle)}°`);
        }
        break;
      }

      case 'proyecto-alarma-antirrobo': {
        const dist = this.hw.sonarDistance;
        const alertLimit = this.hw.alarmDistance || 20;
        const isAlarm = dist < alertLimit;

        if (isAlarm) {
          const blink = (this.tickCount % 4) < 2;
          this.showImage(blink ? 'NO' : 'ANGRY');
          if (this.tickCount % 4 === 0) {
            this.audio.playTone(880, 100, 'square');
          } else if (this.tickCount % 4 === 2) {
            this.audio.playTone(587, 100, 'square');
          }
        } else {
          this.showImage('HAPPY');
        }

        if (this.tickCount % 8 === 0) {
          if (isAlarm) {
            this.serial.log(`[¡ALERTA INTRUSO!] Obstáculo detectado a ${dist} cm (Límite: ${alertLimit} cm)`);
          } else {
            this.serial.log(`[RADAR] Perímetro despejado. Distancia: ${dist} cm`);
          }
          this.serial.plot('Distancia (cm)', dist);
        }
        break;
      }
    }
  }

  // Interacciones de usuario directas
  triggerButtonA(isPressed) {
    this.hw.buttonA = isPressed;
    this.board.pressButton('A', isPressed);

    if (isPressed) {
      this.audio.playClick();
      this.serial.log('[BOTÓN A] Pulsado');

      if (this.currentLesson?.id === 'botones-a-y-b') {
        this.hw.counter = (this.hw.counter || 0) + 1;
        this.showDigit(String(this.hw.counter % 10));
        this.serial.log(`[CONTADOR] Incrementado a: ${this.hw.counter}`);
      }
    }
  }

  triggerButtonB(isPressed) {
    this.hw.buttonB = isPressed;
    this.board.pressButton('B', isPressed);

    if (isPressed) {
      this.audio.playClick();
      this.serial.log('[BOTÓN B] Pulsado');

      if (this.currentLesson?.id === 'botones-a-y-b') {
        this.hw.counter = Math.max(0, (this.hw.counter || 0) - 1);
        this.showDigit(String(this.hw.counter % 10));
        this.serial.log(`[CONTADOR] Decrementado a: ${this.hw.counter}`);
      }
    }
  }

  triggerLogoTouch(isTouched) {
    this.hw.logoTouched = isTouched;
    this.board.touchLogo(isTouched);

    if (isTouched) {
      this.audio.playTone(987, 90, 'sine');
      this.serial.log('[LOGO TÁCTIL] Contacto capacitivo detectado');
    }
  }

  triggerShake() {
    this.audio.playTone(400, 80, 'triangle');
    this.serial.log('[ACELERÓMETRO] Gesto: ¡Agitado (Shake)!');

    if (this.currentLesson?.id === 'acelerometro-y-dados') {
      this.hw.diceActive = true;
      let rolls = 0;
      const rollInterval = setInterval(() => {
        rolls++;
        const tempNum = Math.floor(Math.random() * 6) + 1;
        this.showDigit(String(tempNum));
        this.audio.playTone(300 + rolls * 50, 40, 'square');

        if (rolls > 6) {
          clearInterval(rollInterval);
          const finalNum = Math.floor(Math.random() * 6) + 1;
          this.hw.counter = finalNum;
          this.hw.diceActive = false;
          this.showDigit(String(finalNum));
          this.serial.log(`[DADO MÁGICO] ¡Resultado de la tirada: ${finalNum}!`);
          this.audio.playMelody('BA_DING');
        }
      }, 70);
    }
  }
}
