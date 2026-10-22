// Gestor de líneas líderes SVG y etiquetas dinámicas 3D-a-2D (Callouts)
export class Leaders {
  constructor(svgElement, tagsContainer, options = {}) {
    this.svg = svgElement;
    this.container = tagsContainer;
    this.options = options;
    this.onSelectPart = options.onSelectPart || (() => {});

    this.callouts = [];
    this.tagElements = new Map();
    this.isVisible = true;
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

    this.callouts.forEach((item, idx) => {
      const tag = document.createElement('div');
      tag.className = 'callout-tag';
      tag.dataset.index = idx;
      tag.dataset.anchor = item.anchor;

      tag.innerHTML = `
        <div class="callout-card">
          <div class="callout-header">
            <span class="callout-dot"></span>
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

    let svgPaths = '';
    const containerRect = this.container.getBoundingClientRect();

    this.callouts.forEach(item => {
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

      // Posicionamiento de la tarjeta HUD
      const offsetX = item.x || 0;
      const offsetY = item.y || 0;
      const tagX = pos.x + offsetX;
      const tagY = pos.y + offsetY;

      tagEl.style.transform = `translate(${tagX}px, ${tagY}px)`;

      // Punto de partida: Centro del anclaje en 3D
      const x0 = pos.x;
      const y0 = pos.y;

      // Punto de llegada: Tarjeta callout
      const x1 = tagX;
      const y1 = tagY;

      // Dibujar línea conectora curva o con codo tecnológico
      const midX = (x0 + x1) / 2;
      const pathD = `M ${x0} ${y0} Q ${midX} ${y0} ${x1} ${y1}`;

      svgPaths += `
        <g class="leader-line">
          <circle cx="${x0}" cy="${y0}" r="3.5" class="leader-dot" />
          <path d="${pathD}" class="leader-path" />
          <circle cx="${x1}" cy="${y1}" r="2" class="leader-target" />
        </g>
      `;
    });

    this.svg.innerHTML = svgPaths;
  }
}
