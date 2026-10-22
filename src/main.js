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
    this.calloutsContainer = document.getElementById('callouts');
    this.infoContent = document.getElementById('info-content');
    this.codeDisplay = document.getElementById('code-display');
    this.progressText = document.getElementById('progress-text');
    this.progressFill = document.getElementById('progress-fill');
    this.dynamicParams = document.getElementById('dynamic-params');
    this.runBtn = document.getElementById('btn-run');
    this.runText = document.getElementById('run-text');
    this.runIcon = document.getElementById('run-icon-play');
    this.copyBtn = document.getElementById('btn-copy-code');
    this.inspectorDrawer = document.getElementById('inspector-drawer');

    // Inicializar subsistemas
    this.audio = new AudioEngine();
    this.serial = new SerialMonitor(document.querySelector('.console-header').parentElement);
    this.leaders = new Leaders(this.leadersSvg, this.calloutsContainer, {
      onSelectPart: (partId) => this.showInspector(partId)
    });

    this.board = new MicrobitBoard3D(this.canvas, this.stage, {
      onSelectPart: (partId) => this.showInspector(partId),
      onUpdateFrame: (positions) => this.leaders.update(positions)
    });

    this.sim = new SimulatorEngine(this.board, this.audio, this.serial);

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadLesson(this.currentLessonIdx);
    this.updateProgressUI();
  }

  setupEventListeners() {
    // 1. Selector de pestañas del panel de información
    document.querySelectorAll('.info-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.info-tabs .tab-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
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

    // 6. Controles interactivos de hardware
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

    // 7. Modales de navegación (Lecciones y Partes)
    document.getElementById('nav-lessons').addEventListener('click', (e) => {
      e.preventDefault();
      this.openModal('modal-lessons');
    });
    document.getElementById('modal-lessons-close').addEventListener('click', () => this.closeModal('modal-lessons'));

    document.getElementById('nav-parts').addEventListener('click', (e) => {
      e.preventDefault();
      this.openModal('modal-parts');
    });
    document.getElementById('modal-parts-close').addEventListener('click', () => this.closeModal('modal-parts'));

    // Sonido mute / unmute
    const soundBtn = document.getElementById('nav-sound');
    soundBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.soundEnabled = !this.soundEnabled;
      this.audio.toggleSound(this.soundEnabled);
      soundBtn.style.opacity = this.soundEnabled ? '1' : '0.4';
    });

    // Inspector close
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
      }
    });

    // Renderizar contenidos de los modales
    this.renderLessonsModal();
    this.renderPartsModal();
  }

  loadLesson(idx) {
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
  }

  renderTabContent() {
    const lesson = lessons[this.currentLessonIdx];
    let html = '';

    switch (this.currentTab) {
      case 'overview':
        html = `
          <span class="info-lesson-badge">LECCIÓN ${lesson.number} DE ${lessons.length}</span>
          <h2 class="info-title">${lesson.title}</h2>
          <p class="info-lede">${lesson.lede}</p>
          <div class="info-features">
            ${lesson.features.map(f => `
              <div class="feature-item">
                <span class="feature-dot"></span>
                <span>${f[1]}</span>
              </div>
            `).join('')}
          </div>
          <div style="margin-top: 20px; display: flex; gap: 10px;">
            <button class="btn-hardware" style="flex: 1; background: #e63946; border: none;" id="btn-next-lesson">
              ${this.currentLessonIdx < lessons.length - 1 ? 'Siguiente Lección →' : '¡Completar Curso! 🎓'}
            </button>
          </div>
        `;
        break;

      case 'pinout':
        html = `
          <h3 class="info-title">Conexiones y Pines</h3>
          <p class="info-lede">Mapa de pines y señales involucradas en esta práctica.</p>
          <table class="data-table">
            <thead>
              <tr>
                <th>Pin / Terminal</th>
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
          <h3 class="info-title">Paso a Paso</h3>
          <p class="info-lede">Comprende cómo funciona el programa línea por línea:</p>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${lesson.example.map((ex, i) => `
              <div style="background: var(--bg-card-subtle); border: 1px solid var(--border-cad); padding: 10px 14px; border-radius: 6px;">
                <strong style="color: #e63946; font-size: 11px;">PASO ${i + 1}</strong>
                <p style="font-size: 13px; color: #374151; margin-top: 4px;">${ex}</p>
              </div>
            `).join('')}
          </div>
        `;
        break;

      case 'specs':
        html = `
          <h3 class="info-title">Especificaciones Técnicas</h3>
          <p class="info-lede">Parámetros eléctricos y de hardware de la BBC micro:bit v2.</p>
          <table class="data-table">
            <thead>
              <tr>
                <th>Parámetro</th>
                <th>Valor / Descripción</th>
              </tr>
            </thead>
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
    if (lang === 'python') {
      return code
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/(#.*$)/gm, '<span class="token-comment">$1</span>')
        .replace(/\b(from|import|while|True|False|if|elif|else|for|in|def|return|and|or|not)\b/g, '<span class="token-keyword">$1</span>')
        .replace(/(["'].*?["'])/g, '<span class="token-string">$1</span>')
        .replace(/\b([0-9]+)\b/g, '<span class="token-number">$1</span>')
        .replace(/\b(display|sleep|button_a|button_b|pin_logo|temperature|compass|accelerometer|music|pin0|pin1|pin2)\b/g, '<span class="token-function">$1</span>');
    } else {
      return code
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/(\/\/.*$)/gm, '<span class="token-comment">$1</span>')
        .replace(/\b(let|const|function|if|else|return|true|false)\b/g, '<span class="token-keyword">$1</span>')
        .replace(/(["`].*?["`])/g, '<span class="token-string">$1</span>')
        .replace(/\b([0-9]+)\b/g, '<span class="token-number">$1</span>')
        .replace(/\b(basic|input|music|pins|led|sonar)\b/g, '<span class="token-function">$1</span>');
    }
  }

  renderDynamicParams(lesson) {
    this.dynamicParams.innerHTML = '';
    if (!lesson.params || !lesson.params.length) return;

    lesson.params.forEach(p => {
      const group = document.createElement('div');
      group.className = 'param-group';

      if (p.type === 'range') {
        group.innerHTML = `
          <div class="param-label-row">
            <span>${p.label}</span>
            <span class="param-value-badge" id="val-${p.key}">${p.value} ${p.unit || ''}</span>
          </div>
          <input type="range" min="${p.min}" max="${p.max}" step="${p.step || 1}" value="${p.value}" data-key="${p.key}" />
        `;

        const slider = group.querySelector('input');
        const badge = group.querySelector(`#val-${p.key}`);

        slider.addEventListener('input', (e) => {
          const val = e.target.value;
          badge.textContent = `${val} ${p.unit || ''}`;
          this.sim.setParam(p.key, val);
        });
      } else if (p.type === 'select') {
        group.innerHTML = `
          <div class="param-label-row"><span>${p.label}</span></div>
          <select style="background:#212631; color:#fff; border:1px solid #333a48; padding:6px 10px; border-radius:6px; font-size:12px; width:100%;">
            ${p.options.map(opt => `<option value="${opt.value}" ${opt.value === p.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
          </select>
        `;

        const select = group.querySelector('select');
        select.addEventListener('change', (e) => {
          this.sim.setParam(p.key, e.target.value);
        });
      }

      this.dynamicParams.appendChild(group);
    });
  }

  toggleRun() {
    if (this.sim.state === 'running') {
      this.sim.stop();
      this.runBtn.classList.remove('is-running');
      this.runText.textContent = 'Ejecutar';
      this.runIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
      this.serial.setStatus('idle');
    } else {
      this.sim.start();
      this.runBtn.classList.add('is-running');
      this.runText.textContent = 'Detener';
      this.runIcon.innerHTML = '<rect x="6" y="6" width="12" height="12"/>';
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
    const data = componentsData[partId];
    if (!data) return;

    document.getElementById('insp-category').textContent = data.category;
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

  renderLessonsModal() {
    const grid = document.getElementById('lessons-grid');
    grid.innerHTML = lessons.map((l, i) => `
      <div class="lesson-card-item ${i === this.currentLessonIdx ? 'is-active' : ''}" data-index="${i}">
        <span class="lesson-number">Lección ${l.number} ${this.completedLessons.has(l.id) ? '✓' : ''}</span>
        <h4 class="lesson-name">${l.title}</h4>
        <p class="lesson-desc">${l.shortDesc}</p>
      </div>
    `).join('');

    grid.querySelectorAll('.lesson-card-item').forEach(card => {
      card.addEventListener('click', () => {
        const idx = Number(card.dataset.index);
        this.loadLesson(idx);
        this.closeModal('modal-lessons');
      });
    });
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
        this.closeModal('modal-parts');
        this.showInspector(partId);
      });
    });
  }

  openModal(id) {
    document.getElementById(id).classList.add('is-open');
  }

  closeModal(id) {
    document.getElementById(id).classList.remove('is-open');
  }

  markLessonCompleted(idx) {
    const lesson = lessons[idx];
    this.completedLessons.add(lesson.id);
    localStorage.setItem('microbit_completed', JSON.stringify([...this.completedLessons]));
    this.celebrate();
    this.updateProgressUI();
    this.renderLessonsModal();
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

    this.progressText.textContent = `${completedCount} / ${total}`;
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

// Inicializar la aplicación al cargar el DOM
window.addEventListener('DOMContentLoaded', () => {
  window.__microbitApp = new App();
});
