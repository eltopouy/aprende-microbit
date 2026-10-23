import confetti from 'canvas-confetti';
import { lessons } from './data/lessons.js';
import { componentsData } from './data/componentsData.js';
import { MicrobitBoard3D } from './components/MicrobitBoard3D.js';
import { Leaders } from './components/Leaders.js';
import { AudioEngine } from './components/AudioEngine.js';
import { SerialMonitor } from './components/SerialMonitor.js';
import { SimulatorEngine } from './components/SimulatorEngine.js';

class App {
  constructor() {
    this.currentLessonIdx = 0;
    this.currentTab = 'overview';
    this.currentLang = 'python';
    this.completedLessons = new Set(JSON.parse(localStorage.getItem('microbit_completed') || '[]'));
    this.soundEnabled = true;

    // Elementos del DOM
    this.canvas = document.getElementById('board-canvas');
    this.stage = document.getElementById('stage');
    this.leadersSvg = document.getElementById('leaders');
    this.tagsContainer = document.getElementById('tags');
    this.infoContent = document.getElementById('info-content');
    this.codeDisplay = document.getElementById('code-display');
    this.progressText = document.getElementById('progress-text');
    this.progressFill = document.getElementById('progress-fill');
    this.dynamicParams = document.getElementById('dynamic-params');
    this.runBtn = document.getElementById('btn-run');
    this.runIcon = document.getElementById('run-icon-play');
    this.copyBtn = document.getElementById('btn-copy-code');
    this.inspectorDrawer = document.getElementById('inspector-drawer');
    this.lessonList = document.getElementById('lesson-list');

    // Subsistemas
    this.audio = new AudioEngine();
    this.serial = new SerialMonitor(document.getElementById('console'));
    
    this.leaders = new Leaders(this.leadersSvg, this.tagsContainer, {
      onSelectPart: (partId) => this.showInspector(partId)
    });

    this.board = new MicrobitBoard3D(this.canvas, this.stage, {
      onSelectPart: (partId) => this.showInspector(partId),
      onButtonPress: (btn) => {
        if (btn === 'A') {
          this.sim.triggerButtonA(true);
          setTimeout(() => this.sim.triggerButtonA(false), 220);
        } else if (btn === 'B') {
          this.sim.triggerButtonB(true);
          setTimeout(() => this.sim.triggerButtonB(false), 220);
        }
      },
      onLogoTouch: () => {
        this.sim.triggerLogoTouch(true);
        setTimeout(() => this.sim.triggerLogoTouch(false), 300);
      },
      onCameraAngle: (azimuth) => {
        const needle = document.getElementById('compass-needle');
        if (needle) {
          needle.style.transform = `rotate(${azimuth}rad)`;
        }
      },
      onUpdateFrame: (positions) => this.leaders.update(positions)
    });

    this.sim = new SimulatorEngine(this.board, this.audio, this.serial);

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.startClock();
    this.renderLessonsCarousel();

    // Comprobar si hay hash en la URL (#leccion-1 a #leccion-12)
    const hashMatch = window.location.hash.match(/#leccion-(\d+)/);
    if (hashMatch) {
      const hashIdx = parseInt(hashMatch[1], 10) - 1;
      if (hashIdx >= 0 && hashIdx < lessons.length) {
        this.currentLessonIdx = hashIdx;
      }
    }

    this.loadLesson(this.currentLessonIdx);
    this.updateProgressUI();

    window.addEventListener('hashchange', () => {
      const match = window.location.hash.match(/#leccion-(\d+)/);
      if (match) {
        const idx = parseInt(match[1], 10) - 1;
        if (idx >= 0 && idx < lessons.length && idx !== this.currentLessonIdx) {
          this.loadLesson(idx, false);
        }
      }
    });
  }

  startClock() {
    const dateEl = document.getElementById('clock-date');
    const timeEl = document.getElementById('clock-time');

    const updateTime = () => {
      const now = new Date();
      const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
      if (dateEl) {
        dateEl.textContent = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
      }
      if (timeEl) {
        timeEl.textContent = now.toTimeString().split(' ')[0];
      }
    };

    updateTime();
    setInterval(updateTime, 1000);
  }

  setupEventListeners() {
    // 1. Selector de pestañas del panel de información
    document.querySelectorAll('.info-card .tabs button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.info-card .tabs button').forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        this.currentTab = btn.dataset.tab;
        this.renderTabContent();
      });
    });

    // 2. Selector de lenguaje (MicroPython / MakeCode)
    const btnPy = document.getElementById('btn-lang-python');
    const btnMc = document.getElementById('btn-lang-makecode');

    btnPy.addEventListener('click', () => {
      btnPy.classList.add('is-active');
      btnMc.classList.remove('is-active');
      this.currentLang = 'python';
      this.updateCodeDisplay();
    });

    btnMc.addEventListener('click', () => {
      btnMc.classList.add('is-active');
      btnPy.classList.remove('is-active');
      this.currentLang = 'makecode';
      this.updateCodeDisplay();
    });

    // 3. Botón de Ejecutar / Detener simulación
    this.runBtn.addEventListener('click', () => this.toggleRun());

    // 4. Botón de Copiar código
    this.copyBtn.addEventListener('click', () => this.copyCode());

    // 5. Botones de cámara 3D (Viewbar)
    document.getElementById('btn-view-left').addEventListener('click', () => this.board.rotateView('left', 20));
    document.getElementById('btn-view-right').addEventListener('click', () => this.board.rotateView('right', 20));
    document.getElementById('btn-view-zoom-in').addEventListener('click', () => this.board.zoom('in', 0.85));
    document.getElementById('btn-view-zoom-out').addEventListener('click', () => this.board.zoom('out', 0.85));
    document.getElementById('btn-view-reset').addEventListener('click', () => this.board.setView('reset'));

    // 6. Controles físicos interactivos
    const btnA = document.getElementById('btn-hw-a');
    const btnB = document.getElementById('btn-hw-b');
    const btnLogo = document.getElementById('btn-hw-logo');
    const btnShake = document.getElementById('btn-hw-shake');

    btnA.addEventListener('pointerdown', () => this.sim.triggerButtonA(true));
    btnA.addEventListener('pointerup', () => this.sim.triggerButtonA(false));
    btnA.addEventListener('pointerleave', () => this.sim.triggerButtonA(false));

    btnB.addEventListener('pointerdown', () => this.sim.triggerButtonB(true));
    btnB.addEventListener('pointerup', () => this.sim.triggerButtonB(false));
    btnB.addEventListener('pointerleave', () => this.sim.triggerButtonB(false));

    btnLogo.addEventListener('pointerdown', () => this.sim.triggerLogoTouch(true));
    btnLogo.addEventListener('pointerup', () => this.sim.triggerLogoTouch(false));
    btnLogo.addEventListener('pointerleave', () => this.sim.triggerLogoTouch(false));

    btnShake.addEventListener('click', () => this.sim.triggerShake());

    // 7. Modales y Sonido
    document.getElementById('nav-parts').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('modal-parts').classList.add('is-open');
    });
    document.getElementById('modal-parts-close').addEventListener('click', () => {
      document.getElementById('modal-parts').classList.remove('is-open');
    });

    const soundBtn = document.getElementById('nav-sound');
    soundBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.soundEnabled = !this.soundEnabled;
      this.audio.toggleSound(this.soundEnabled);
      soundBtn.style.opacity = this.soundEnabled ? '1' : '0.4';
    });

    document.getElementById('insp-close').addEventListener('click', () => {
      this.inspectorDrawer.classList.remove('is-visible');
    });

    // Atajos de teclado
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        this.toggleRun();
      } else if (e.key === 'q' || e.key === 'Q') {
        this.board.rotateView('left', 15);
      } else if (e.key === 'e' || e.key === 'E') {
        this.board.rotateView('right', 15);
      } else if (e.key === 'r' || e.key === 'R') {
        this.board.setView('reset');
      } else if (e.key === ']') {
        this.nextLesson();
      } else if (e.key === '[') {
        this.prevLesson();
      } else if (/^[1-9]$/.test(e.key)) {
        const targetIdx = Number(e.key) - 1;
        if (targetIdx < lessons.length) this.loadLesson(targetIdx);
      } else if (e.key === '0') {
        if (lessons.length >= 10) this.loadLesson(9);
      }
    });

    const wrap = document.querySelector('.lessons-wrap');
    if (wrap) {
      wrap.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          wrap.scrollLeft += e.deltaY * 1.5;
        }
      }, { passive: false });
    }

    this.renderPartsModal();
  }

  renderLessonsCarousel() {
    this.lessonList.innerHTML = lessons.map((l, i) => `
      <li class="lesson-item ${i === this.currentLessonIdx ? 'is-active' : ''}" data-index="${i}">
        <span class="lesson-thumb">${l.number}</span>
        <div class="lesson-meta">
          <span class="lesson-num">Lección ${l.number}</span>
          <span class="lesson-title">${l.title}</span>
        </div>
        ${this.completedLessons.has(l.id) ? '<span class="lesson-check">✓</span>' : ''}
      </li>
    `).join('');

    this.lessonList.querySelectorAll('.lesson-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = Number(item.dataset.index);
        this.loadLesson(idx);
      });
    });

    const activeEl = this.lessonList.querySelector(`.lesson-item[data-index="${this.currentLessonIdx}"]`);
    if (activeEl) {
      setTimeout(() => {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }, 50);
    }
  }

  loadLesson(idx, updateHash = true) {
    if (idx < 0 || idx >= lessons.length) return;
    this.currentLessonIdx = idx;
    const lesson = lessons[idx];

    // Cargar en simulador y tablero 3D
    this.sim.setLesson(lesson);
    this.leaders.setCallouts(lesson.callouts || []);

    // Actualizar código y panel de información
    this.renderTabContent();
    this.updateCodeDisplay();
    this.renderDynamicParams(lesson);

    // Actualizar progreso
    this.updateProgressUI();
    this.renderLessonsCarousel();

    // Actualizar Título y Hash
    document.title = `${lesson.title} — Aprende Micro:bit 3D`;
    if (updateHash) {
      window.history.replaceState(null, '', `#leccion-${idx + 1}`);
    }
  }

  renderTabContent() {
    const lesson = lessons[this.currentLessonIdx];
    let html = '';

    switch (this.currentTab) {
      case 'overview':
        html = `
          <h3>${lesson.title}</h3>
          <p class="info-lede">${lesson.lede}</p>
          <div class="info-features">
            ${lesson.features.map(f => `
              <div class="feature-item">
                <span class="feature-dot"></span>
                <span>${f[1]}</span>
              </div>
            `).join('')}
          </div>
          <button class="btn-hw" style="width: 100%; margin-top: 14px; background: #3fae9e; color: #fff; border: none; padding: 8px;" id="btn-next-lesson">
            ${this.currentLessonIdx < lessons.length - 1 ? 'Siguiente Lección →' : '¡Completar Curso! 🎓'}
          </button>
        `;
        break;

      case 'pinout':
        html = `
          <h3 style="font-size: 18px;">Pines y Conexiones</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th>Pin</th>
                <th>Función</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              ${lesson.pinout.map(p => `
                <tr>
                  <td><code>${p[0]}</code></td>
                  <td>${p[1]}</td>
                  <td>${p[2]}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
        break;

      case 'example':
        html = `
          <h3 style="font-size: 18px;">Paso a Paso</h3>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${lesson.example.map((ex, i) => `
              <div style="background: #f4eee2; padding: 8px 10px; border-radius: 4px; font-size: 12px;">
                <strong style="color: #3fae9e;">PASO ${i + 1}:</strong> ${ex}
              </div>
            `).join('')}
          </div>
        `;
        break;

      case 'specs':
        html = `
          <h3 style="font-size: 18px;">Especificaciones</h3>
          <table class="data-table">
            <tbody>
              ${lesson.specs.map(s => `
                <tr>
                  <td><strong>${s[0]}</strong></td>
                  <td>${s[1]}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
        break;
    }

    this.infoContent.innerHTML = html;

    const nextBtn = document.getElementById('btn-next-lesson');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.markLessonCompleted(this.currentLessonIdx);
        if (this.currentLessonIdx < lessons.length - 1) {
          this.loadLesson(this.currentLessonIdx + 1);
        } else {
          this.celebrate();
        }
      });
    }
  }

  updateCodeDisplay() {
    const lesson = lessons[this.currentLessonIdx];
    const rawCode = this.currentLang === 'python' ? lesson.codeMicroPython : lesson.codeMakeCode;
    this.codeDisplay.innerHTML = this.highlightSyntax(rawCode, this.currentLang);
  }

  highlightSyntax(code, lang) {
    const escapeHtml = (str) =>
      str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    const lines = code.split('\n');
    return lines.map((lineText, idx) => {
      let tokensHtml = '';

      if (lang === 'python') {
        const pyRegex = /(#.*$)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b(?:from|import|while|True|False|if|elif|else|for|in|def|return|and|or|not|with|as|try|except|pass|break|continue)\b)|(\b(?:display|show|scroll|sleep|clear|set_pixel|get_pixel|button_a|button_b|is_pressed|was_pressed|get_presses|pin_logo|is_touched|temperature|compass|heading|calibrate|accelerometer|get_x|get_y|get_z|get_values|current_gesture|was_gesture|music|play|pitch|stop|reset|pin0|pin1|pin2|pin3|pin8|pin12|pin16|read_analog|write_analog|read_digital|write_digital|Image|random|randint)\b)|(\b\d+(?:\.\d+)?\b)|([a-zA-Z_][a-zA-Z0-9_]*)|(\s+)|([^a-zA-Z0-9_"'#\s]+)/g;

        tokensHtml = lineText.replace(pyRegex, (m, comment, str, kw, fn, num, id, ws, sym) => {
          if (comment) return `<span class="com">${escapeHtml(comment)}</span>`;
          if (str) return `<span class="str">${escapeHtml(str)}</span>`;
          if (kw) return `<span class="kw">${escapeHtml(kw)}</span>`;
          if (fn) return `<span class="fn">${escapeHtml(fn)}</span>`;
          if (num) return `<span class="num">${escapeHtml(num)}</span>`;
          if (id) return escapeHtml(id);
          if (ws) return ws;
          if (sym) return escapeHtml(sym);
          return escapeHtml(m);
        });
      } else {
        const jsRegex = /(\/\/.*$|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b(?:let|const|var|function|if|else|return|true|false|for|while|new|class|void)\b)|(\b(?:basic|input|music|pins|led|sonar|radio|game|images|showString|showIcon|showNumber|pause|forever|onButtonPressed|onLogoEvent|onGesture|compassHeading|temperature|analogReadPin|analogWritePin|digitalReadPin|digitalWritePin|playTone|ringTone|rest)\b)|(\b\d+(?:\.\d+)?\b)|([a-zA-Z_][a-zA-Z0-9_]*)|(\s+)|([^a-zA-Z0-9_"'`\/\s]+|\/)/g;

        tokensHtml = lineText.replace(jsRegex, (m, comment, str, kw, fn, num, id, ws, sym) => {
          if (comment) return `<span class="com">${escapeHtml(comment)}</span>`;
          if (str) return `<span class="str">${escapeHtml(str)}</span>`;
          if (kw) return `<span class="kw">${escapeHtml(kw)}</span>`;
          if (fn) return `<span class="fn">${escapeHtml(fn)}</span>`;
          if (num) return `<span class="num">${escapeHtml(num)}</span>`;
          if (id) return escapeHtml(id);
          if (ws) return ws;
          if (sym) return escapeHtml(sym);
          return escapeHtml(m);
        });
      }

      return `<span class="line"><span class="ln">${idx + 1}</span>${tokensHtml}</span>`;
    }).join('\n');
  }

  renderDynamicParams(lesson) {
    this.dynamicParams.innerHTML = '';
    if (!lesson.params || !lesson.params.length) return;

    lesson.params.forEach(p => {
      const row = document.createElement('div');
      row.className = 'param-row';

      if (p.type === 'range') {
        row.innerHTML = `
          <label for="param-${p.key}">${p.label}: <b id="val-${p.key}">${p.value} ${p.unit || ''}</b></label>
          <input id="param-${p.key}" name="${p.key}" type="range" min="${p.min}" max="${p.max}" step="${p.step || 1}" value="${p.value}" data-key="${p.key}" aria-label="${p.label}" />
        `;

        const slider = row.querySelector('input');
        const badge = row.querySelector(`#val-${p.key}`);

        slider.addEventListener('input', (e) => {
          const val = e.target.value;
          badge.textContent = `${val} ${p.unit || ''}`;
          this.sim.setParam(p.key, val);
        });
      } else if (p.type === 'select') {
        row.innerHTML = `
          <label for="param-${p.key}">${p.label}</label>
          <select id="param-${p.key}" name="${p.key}" aria-label="${p.label}" style="background:#fff; border:1px solid #d8c6ac; padding:3px 6px; border-radius:4px; font-size:11px;">
            ${p.options.map(opt => `<option value="${opt.value}" ${opt.value === p.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
          </select>
        `;

        const select = row.querySelector('select');
        select.addEventListener('change', (e) => {
          this.sim.setParam(p.key, e.target.value);
        });
      }

      this.dynamicParams.appendChild(row);
    });
  }

  toggleRun() {
    if (this.sim.state === 'running') {
      this.sim.stop();
      this.runBtn.classList.remove('is-running');
      this.runIcon.innerHTML = '<path d="M7.5 4.8v14.4L19 12z" fill="currentColor"/>';
      this.serial.setStatus('idle');
    } else {
      this.sim.start();
      this.runBtn.classList.add('is-running');
      this.runIcon.innerHTML = '<rect x="6" y="6" width="12" height="12" fill="currentColor"/>';
      this.serial.setStatus('running');
    }
  }

  copyCode() {
    const lesson = lessons[this.currentLessonIdx];
    const code = this.currentLang === 'python' ? lesson.codeMicroPython : lesson.codeMakeCode;
    navigator.clipboard.writeText(code).then(() => {
      const origHtml = this.copyBtn.innerHTML;
      this.copyBtn.innerHTML = '✓';
      setTimeout(() => { this.copyBtn.innerHTML = origHtml; }, 1500);
    });
  }

  showInspector(partId) {
    const aliasMap = {
      'matrix': 'matriz-led',
      'matrix-center': 'matriz-led',
      'logo': 'logo-touch',
      'edge': 'conector-borde',
      'pin-0': 'conector-borde',
      'processor': 'procesador',
      'speaker': 'altavoz',
      'accel-chip': 'acelerometro',
      'compass-chip': 'brujula',
      'servo': 'servomotor',
      'ultrasonic': 'sensor-ultrasonico',
      'pot': 'potenciometro',
      'light-source': 'sensor-luz'
    };
    const key = aliasMap[partId] || partId;
    const data = componentsData[key];
    if (!data) return;

    document.getElementById('insp-category').textContent = data.category.toUpperCase();
    document.getElementById('insp-name').textContent = data.name;
    document.getElementById('insp-desc').textContent = data.description;

    const specsTable = document.getElementById('insp-specs');
    specsTable.innerHTML = `
      <tbody>
        ${data.specs.map(s => `<tr><td><strong>${s[0]}</strong></td><td>${s[1]}</td></tr>`).join('')}
      </tbody>
    `;

    this.inspectorDrawer.classList.add('is-visible');
  }

  renderPartsModal() {
    const grid = document.getElementById('parts-grid');
    grid.innerHTML = Object.values(componentsData).map(p => `
      <div class="lesson-card-item" data-part="${p.id}">
        <span class="lesson-number" style="color:#b45309;">${p.category}</span>
        <h4 class="lesson-name">${p.name}</h4>
        <p class="lesson-desc">${p.shortDesc}</p>
      </div>
    `).join('');

    grid.querySelectorAll('.lesson-card-item').forEach(card => {
      card.addEventListener('click', () => {
        const partId = card.dataset.part;
        document.getElementById('modal-parts').classList.remove('is-open');
        this.showInspector(partId);
      });
    });
  }

  markLessonCompleted(idx) {
    const lesson = lessons[idx];
    this.completedLessons.add(lesson.id);
    localStorage.setItem('microbit_completed', JSON.stringify([...this.completedLessons]));
    this.celebrate();
    this.updateProgressUI();
    this.renderLessonsCarousel();
  }

  celebrate() {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    this.audio.playSuccess();
  }

  updateProgressUI() {
    const completedCount = this.completedLessons.size || (this.currentLessonIdx + 1);
    const total = lessons.length;
    const percent = Math.min(100, Math.round((completedCount / total) * 100));

    this.progressText.textContent = `${completedCount}/${total}`;
    this.progressFill.style.width = `${percent}%`;
  }

  nextLesson() {
    if (this.currentLessonIdx < lessons.length - 1) {
      this.loadLesson(this.currentLessonIdx + 1);
    }
  }

  prevLesson() {
    if (this.currentLessonIdx > 0) {
      this.loadLesson(this.currentLessonIdx - 1);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.__microbitApp = new App();
});
