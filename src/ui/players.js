import { data, save, getWinMode, setWinMode, WIN_MODES } from '../state.js';
import { renderRoundInputs } from './rounds.js';
import { renderDashboard } from '../charts.js';
import { renderHistory } from './history.js';

const ACTIVE_CLASSES = ['bg-amber-500', 'text-slate-900', 'border-amber-500'];
const INACTIVE_CLASSES = ['bg-slate-800', 'text-slate-300', 'border-slate-600'];

export function renderWinModeToggle() {
  const ascBtn = document.getElementById('winModeAsc');
  const descBtn = document.getElementById('winModeDesc');
  const mode = getWinMode();

  [[ascBtn, WIN_MODES.ASC], [descBtn, WIN_MODES.DESC]].forEach(([btn, btnMode]) => {
    const isActive = mode === btnMode;
    btn.classList.remove(...ACTIVE_CLASSES, ...INACTIVE_CLASSES);
    btn.classList.add(...(isActive ? ACTIVE_CLASSES : INACTIVE_CLASSES));
  });
}

export function initWinModeToggle() {
  document.getElementById('winModeAsc').addEventListener('click', () => {
    setWinMode(WIN_MODES.ASC);
    renderWinModeToggle();
    renderDashboard();
  });
  document.getElementById('winModeDesc').addEventListener('click', () => {
    setWinMode(WIN_MODES.DESC);
    renderWinModeToggle();
    renderDashboard();
  });
  renderWinModeToggle();
}


export function renderPlayerInputs() {
  const container = document.getElementById('playerInputs');
  container.innerHTML = '';
  const names = data.players.length ? data.players : [''];

  names.forEach((name, index) => {
    const row = document.createElement('div');
    row.className = 'flex gap-2';
    row.innerHTML = `
      <input type="text" value="${name}" placeholder="Tên người chơi ${index + 1}"
        class="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-base"
      />
      <button type="button" class="bg-slate-700 rounded-lg px-3 text-base">✕</button>
    `;

    const input = row.querySelector('input');
    const button = row.querySelector('button');

    input.addEventListener('input', () => { data.players[index] = input.value; });
    button.addEventListener('click', () => removePlayerInput(index));

    container.appendChild(row);
  });
}

export function addPlayerInput() {
  data.players.push('');
  renderPlayerInputs();
}

export function removePlayerInput(index) {
  data.players.splice(index, 1);
  renderPlayerInputs();
}
