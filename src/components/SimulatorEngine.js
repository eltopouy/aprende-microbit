// Motor de Simulación Virtual de micro:bit v2
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
      temperature: 24,
      lightLevel: 140,
      heading: 0,
      gesture: 'none',
      potValue: 512,
      servoAngle: 90,
      sonarDistance: 45,
      alarmActive: false
    };

    // Biblioteca de imágenes predefinidas de micro:bit
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
      DIAMOND_SMALL: [
        [0, 0, 0, 0, 0],
        [0, 0, 9, 0, 0],
        [0, 9, 0, 9, 0],
        [0, 0, 9, 0, 0],
        [0, 0, 0, 0, 0]
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

    // Glifos numéricos para display.show(str(numero))
    this.digits = {
      '0': [[9,9,9],[9,0,9],[9,0,9],[9,0,9],[9,9,9]],
      '1': [[0,9,0],[9,9,0],[0,9,0],[0,9,0],[9,9,9]],
      '2': [[9,9,9],[0,0,9],[9,9,9],[9,0,0],[9,9,9]],
      '3': [[9,9,9],[0,0,9],[9,9,9],[0,0,9],[9,9,9]],
      '4': [[9,0,9],[9,0,9],[9,9,9],[0,0,9],[0,0,9]],
      '5': [[9,9,9],[9,0,0],[9,9,9],[0,0,9],[9,9,9]],
      '6': [[9,9,9],[9,0,0],[9,9,9],[9,0,9],[9,9,9]],
      '7': [[9,9,9],[0,0,9],[0,9,0],[0,9,0],[0,9,0]],
      '8': [[9,9,9],[9,0,9],[9,9,9],[9,0,9],[9,9,9]],
      '9': [[9,9,9],[9,0,9],[9,9,9],[0,0,9],[9,9,9]]
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
      case 'tempAmbiente':
        this.hw.temperature = Number(value);
        break;
      case 'nivelLuz':
        this.hw.lightLevel = Number(value);
        this.board.setLampIntensity(this.hw.lightLevel / 255);
        break;
      case 'rumboGrados':
        this.hw.heading = Number(value);
        break;
      case 'giroPotenciometro':
        this.hw.potValue = Number(value);
        this.board.setPotValue(this.hw.potValue);
        break;
      case 'anguloServo':
        this.hw.servoAngle = Number(value);
        this.board.setServoAngle(this.hw.servoAngle);
        break;
      case 'distanciaObstaculo':
        this.hw.sonarDistance = Number(value);
        break;
    }
  }

  start() {
    if (this.state === 'running') return;
    this.state = 'running';
    this.tickCount = 0;

    this.serial.log(`[BOOT] micro:bit v2.21 iniciado (ARM Cortex-M4 @ 64MHz)`);
    this.serial.log(`[RUN] Ejecutando: ${this.currentLesson?.title}`);

    // Si es lección de sonido, reproducir acorde inicial
    if (this.currentLesson?.id === 'sonidos-y-sintetizador') {
      this.audio.playMelody('BA_DING');
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
      this.hw.matrix = pattern.map(row => [...row]);
      this.board.setMatrixPixels(this.hw.matrix);
    }
  }

  showDigit(digitChar) {
    const glyph = this.digits[digitChar];
    const grid = Array.from({ length: 5 }, () => Array(5).fill(0));
    if (glyph) {
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 3; x++) {
          grid[y][x + 1] = glyph[y][x];
        }
      }
    }
    this.hw.matrix = grid;
    this.board.setMatrixPixels(this.hw.matrix);
  }

  // Simulación por cada tick según la lección activa
  tick() {
    this.tickCount++;
    const lessonId = this.currentLesson?.id;

    switch (lessonId) {
      case 'conoce-la-placa': {
        this.showImage('HAPPY');
        if (this.tickCount % 20 === 0) {
          this.serial.log(`[micro:bit] Procesador activo: 64MHz | Batería: 3.2V`);
        }
        break;
      }

      case 'matriz-y-emoticonos': {
        // Latido del corazón
        const isBig = (Math.floor(this.tickCount / 5) % 2) === 0;
        this.showImage(isBig ? 'HEART' : 'HEART_SMALL');
        if (isBig && this.tickCount % 5 === 0) {
          this.audio.playTone(180, 40, 'sine');
        }
        break;
      }

      case 'botones-a-y-b': {
        // El estado se actualiza por interacción con triggerButton
        break;
      }

      case 'logo-tactil-capacitivo': {
        if (this.hw.logoTouched) {
          this.hw.matrix = Array.from({ length: 5 }, () => Array(5).fill(9));
        } else {
          this.hw.matrix = Array.from({ length: 5 }, () => Array(5).fill(0));
        }
        this.board.setMatrixPixels(this.hw.matrix);
        break;
      }

      case 'termometro-digital': {
        const temp = this.hw.temperature;
        if (temp >= 28) {
          this.showImage('ANGRY');
        } else if (temp < 15) {
          this.showImage('SAD');
        } else {
          this.showImage('HAPPY');
        }
        if (this.tickCount % 10 === 0) {
          this.serial.log(`[TERMÓMETRO] ${temp} °C`);
          this.serial.plot('Temperatura (°C)', temp);
        }
        break;
      }

      case 'sensor-de-luz': {
        const light = this.hw.lightLevel;
        if (light < 60) {
          // Noche: encender farola
          this.showImage('DIAMOND');
        } else {
          this.clearMatrix();
        }
        if (this.tickCount % 10 === 0) {
          this.serial.log(`[FOTOCÉLULA] Luz ambiente: ${light} lux`);
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
          this.serial.log(`[BRÚJULA] Rumbo: ${h}°`);
        }
        break;
      }

      case 'acelerometro-y-dados': {
        // Si no hay tirada activa, mantener número
        break;
      }

      case 'sonidos-y-sintetizador': {
        this.showImage('MUSIC_QUAVER');
        break;
      }

      case 'pines-analogicos-potenciometro': {
        const val = this.hw.potValue;
        const rows = Math.min(5, Math.floor(val * 5 / 1024));
        const grid = Array.from({ length: 5 }, () => Array(5).fill(0));

        for (let y = 5 - rows; y < 5; y++) {
          for (let x = 0; x < 5; x++) {
            grid[y][x] = 9;
          }
        }
        this.hw.matrix = grid;
        this.board.setMatrixPixels(this.hw.matrix);

        if (this.tickCount % 8 === 0) {
          this.serial.log(`[P0 ADC] ${val} / 1023 (${(val * 3.3 / 1023).toFixed(2)}V)`);
          this.serial.plot('Potenciómetro', val);
        }
        break;
      }

      case 'servomotor-y-robotica': {
        const angle = this.hw.servoAngle;
        this.board.setServoAngle(angle);
        if (angle < 45) {
          this.showImage('ARROW_W');
        } else if (angle > 135) {
          this.showImage('ARROW_E');
        } else {
          this.showImage('TARGET');
        }
        if (this.tickCount % 10 === 0) {
          this.serial.log(`[SERVO SG90] Ángulo actual: ${angle}°`);
        }
        break;
      }

      case 'proyecto-alarma-antirrobo': {
        const dist = this.hw.sonarDistance;
        const isAlarm = dist < 20;

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
            this.serial.log(`[ALERTA INTRUSO] ¡Obstáculo a solo ${dist} cm!`);
          } else {
            this.serial.log(`[RADAR] Perímetro seguro. Distancia: ${dist} cm`);
          }
          this.serial.plot('Distancia (cm)', dist);
        }
        break;
      }
    }
  }

  // Métodos de interacción de usuario directa
  triggerButtonA(isPressed) {
    this.hw.buttonA = isPressed;
    this.board.pressButton('A', isPressed);

    if (isPressed) {
      this.audio.playClick();
      this.serial.log('[BOTÓN A] Pulsado');

      if (this.currentLesson?.id === 'botones-a-y-b') {
        this.hw.counter = (this.hw.counter || 0) + 1;
        this.showDigit(String(this.hw.counter % 10));
        this.serial.log(`[CONTADOR] Valor: ${this.hw.counter}`);
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
        this.serial.log(`[CONTADOR] Valor: ${this.hw.counter}`);
      }
    }
  }

  triggerLogoTouch(isTouched) {
    this.hw.logoTouched = isTouched;
    this.board.touchLogo(isTouched);

    if (isTouched) {
      this.audio.playTone(987, 80, 'sine');
      this.serial.log('[LOGO TÁCTIL] Contacto capacitivo detectado');
    }
  }

  triggerShake() {
    this.audio.playTone(400, 80, 'triangle');
    this.serial.log('[ACELERÓMETRO] Gesto: ¡Agitado (Shake)!');

    if (this.currentLesson?.id === 'acelerometro-y-dados') {
      // Animación de dado rodando
      let rolls = 0;
      const rollInterval = setInterval(() => {
        rolls++;
        const tempNum = Math.floor(Math.random() * 6) + 1;
        this.showDigit(String(tempNum));
        this.audio.playTone(300 + rolls * 50, 40, 'square');

        if (rolls > 6) {
          clearInterval(rollInterval);
          const finalNum = Math.floor(Math.random() * 6) + 1;
          this.showDigit(String(finalNum));
          this.serial.log(`[DADO MÁGICO] ¡Resultado tirada: ${finalNum}!`);
          this.audio.playMelody('BA_DING');
        }
      }, 70);
    }
  }
}
