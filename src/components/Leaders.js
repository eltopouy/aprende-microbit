// Gestor de líneas líderes SVG y etiquetas perimetrales dinámicas (Callouts)
export class Leaders {
  constructor(svgElement, tagsContainer, options = {}) {
    this.svg = svgElement;
    this.container = tagsContainer;
    this.options = options;
    this.onSelectPart = options.onSelectPart || (() => {});

    this.callouts = [];
    this.tagElements = new Map();
    this.isVisible = true;

    // Cuadrantes perimetrales en los 4 bordes del escenario
    this.presetSlots = {
      'part:logo': { xPct: 0.38, yPct: 0.08, side: 'bottom' },
      'part:matrix': { xPct: 0.06, yPct: 0.16, side: 'right' },
      'part:matrix-center': { xPct: 0.06, yPct: 0.16, side: 'right' },
      'part:button-a': { xPct: 0.06, yPct: 0.52, side: 'right' },
      'part:button-b': { xPct: 0.72, yPct: 0.22, side: 'left' },
      'part:edge': { xPct: 0.38, yPct: 0.82, side: 'top' },
      'part:pin-0': { xPct: 0.06, yPct: 0.76, side: 'right' },
      'part:processor': { xPct: 0.38, yPct: 0.08, side: 'bottom' },
      'part:speaker': { xPct: 0.72, yPct: 0.48, side: 'left' },
      'part:accel-chip': { xPct: 0.06, yPct: 0.36, side: 'right' },
      'part:compass-chip': { xPct: 0.06, yPct: 0.36, side: 'right' },
      'part:servo': { xPct: 0.72, yPct: 0.52, side: 'left' },
      'part:ultrasonic': { xPct: 0.06, yPct: 0.40, side: 'right' },
      'part:pot': { xPct: 0.06, yPct: 0.65, side: 'right' },
      'part:light-source': { xPct: 0.72, yPct: 0.35, side: 'left' }
    };

    // Cuadrantes de reserva por si hay anclajes no estándar
    this.fallbackSlots = [
      { xPct: 0.06, yPct: 0.18 },
      { xPct: 0.72, yPct: 0.18 },
      { xPct: 0.06, yPct: 0.55 },
      { xPct: 0.72, yPct: 0.55 },
      { xPct: 0.38, yPct: 0.82 },
      { xPct: 0.38, yPct: 0.08 }
    ];
  }

  setCallouts(calloutList = []) {
    this.callouts = calloutList;
    this.renderTags();
  }

  setVisible(visible) {
    this.isVisible = visible;
    this.svg.style.display = visible ? 'block' : 'none';
    this.container.style.display = visible ? 'block' : 'none';
  }

  renderTags() {
    this.container.innerHTML = '';
    this.tagElements.clear();

    const icons = {
      'Matriz 5x5': '▦',
      'Botón A': '🅐',
      'Botón B': '🅑',
      'Logo Táctil': '◈',
      'Conector de Borde': '⊞',
      'Chip nRF52833': '⎈',
      'Altavoz': '🔊',
      'Servomotor': '⚙',
      'Sensor HC-SR04': '📡',
      'Potenciómetro': '🎛',
      'Lámpara': '💡'
    };

    this.callouts.forEach((item, idx) => {
      const tag = document.createElement('div');
      tag.className = 'callout-tag';
      tag.dataset.index = idx;
      tag.dataset.anchor = item.anchor;

      const iconChar = icons[item.title] || '❖';

      tag.innerHTML = `
        <div class="callout-card">
          <div class="callout-header">
            <span class="callout-icon-box">${iconChar}</span>
            <strong class="callout-title">${item.title}</strong>
          </div>
          <p class="callout-body">${item.body}</p>
        </div>
      `;

      tag.addEventListener('click', () => {
        const partId = item.anchor.replace('part:', '');
        this.onSelectPart(partId);
      });

      this.container.appendChild(tag);
      this.tagElements.set(item.anchor, tag);
    });
  }

  update(screenPositions) {
    if (!this.isVisible || !this.callouts.length) {
      this.svg.innerHTML = '';
      return;
    }

    const stageWidth = this.container.clientWidth;
    const stageHeight = this.container.clientHeight;
    if (!stageWidth || !stageHeight) return;

    let svgPaths = '';

    this.callouts.forEach((item, idx) => {
      const pos = screenPositions[item.anchor];
      const tagEl = this.tagElements.get(item.anchor);
      if (!pos || !tagEl) return;

      if (!pos.visible) {
        tagEl.style.opacity = '0';
        tagEl.style.pointerEvents = 'none';
        return;
      }

      tagEl.style.opacity = '1';
      tagEl.style.pointerEvents = 'auto';

      // Posicionamiento según el anclaje específico
      const slot = this.presetSlots[item.anchor] || this.fallbackSlots[idx % this.fallbackSlots.length];
      const tagX = Math.round(stageWidth * slot.xPct);
      const tagY = Math.round(stageHeight * slot.yPct);

      tagEl.style.transform = `translate(${tagX}px, ${tagY}px)`;

      // Coordenadas de conexión
      const cardW = 190;
      const cardH = 68;

      const anchorX = pos.x;
      const anchorY = pos.y;
      
      let cardConnX = tagX;
      let cardConnY = tagY + cardH / 2;

      if (anchorX > tagX + cardW) {
        cardConnX = tagX + cardW;
      } else if (anchorX < tagX) {
        cardConnX = tagX;
      } else {
        cardConnX = tagX + cardW / 2;
        cardConnY = (anchorY < tagY) ? tagY : tagY + cardH;
      }

      // Trayectoria de codo técnico (Línea ortogonal limpia)
      const midX = (anchorX + cardConnX) / 2;
      const pathD = `M ${anchorX} ${anchorY} Q ${midX} ${anchorY} ${cardConnX} ${cardConnY}`;

      svgPaths += `
        <g class="leader-line">
          <circle cx="${anchorX}" cy="${anchorY}" r="4" class="leader-dot" />
          <path d="${pathD}" class="leader-path" />
          <circle cx="${cardConnX}" cy="${cardConnY}" r="2.5" class="leader-target" />
        </g>
      `;
    });

    this.svg.innerHTML = svgPaths;
  }
}
