// Monitor Serie / Consola de Telemetría para micro:bit
export class SerialMonitor {
  constructor(consoleElement, options = {}) {
    this.container = consoleElement;
    this.linesContainer = this.container.querySelector('.console-lines');
    this.statusDot = this.container.querySelector('.console-dot');
    this.statusText = this.container.querySelector('.console-status');
    this.clearBtn = this.container.querySelector('.console-clear');

    this.maxLines = 150;
    this.history = [];

    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => this.clear());
    }
  }

  setStatus(status = 'idle') {
    if (!this.statusText || !this.statusDot) return;
    if (status === 'running') {
      this.statusDot.classList.add('is-active');
      this.statusText.textContent = 'En ejecución (115200 baud)';
    } else {
      this.statusDot.classList.remove('is-active');
      this.statusText.textContent = 'Detenido';
    }
  }

  log(message, type = 'info') {
    if (!this.linesContainer) return;

    const time = new Date().toTimeString().split(' ')[0];
    const lineEl = document.createElement('div');
    lineEl.className = `console-line type-${type}`;

    lineEl.innerHTML = `
      <span class="line-time">${time}</span>
      <span class="line-text">${this.escapeHtml(message)}</span>
    `;

    this.linesContainer.appendChild(lineEl);
    this.history.push({ time, message, type });

    // Limitar histórico para no saturar memoria
    if (this.linesContainer.children.length > this.maxLines) {
      this.linesContainer.removeChild(this.linesContainer.firstChild);
    }

    // Auto-scroll al final
    this.linesContainer.scrollTop = this.linesContainer.scrollHeight;
  }

  plot(label, value) {
    this.log(`${label}: ${value}`, 'telemetry');
  }

  clear() {
    if (this.linesContainer) {
      this.linesContainer.innerHTML = '';
    }
    this.history = [];
  }

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
