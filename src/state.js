export let data = { players: [], rounds: [], settings: { winMode: 'asc' } };
const STORAGE_KEY = 'cardGameData';

// 'asc'  = điểm/số điểm càng THẤP càng thắng (mặc định, hợp bài kiểu "còn ít điểm là thắng")
// 'desc' = điểm càng CAO càng thắng
export const WIN_MODES = { ASC: 'asc', DESC: 'desc' };

export function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) data = JSON.parse(raw);
  if (!data.players) data.players = [];
  if (!data.rounds) data.rounds = [];
  if (!data.settings) data.settings = { winMode: WIN_MODES.ASC };
  if (!data.settings.winMode) data.settings.winMode = WIN_MODES.ASC;
}

export function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetAll() {
  data = { players: [], rounds: [], settings: { winMode: WIN_MODES.ASC } };
  save();
}

export function getWinMode() {
  return data.settings?.winMode || WIN_MODES.ASC;
}

export function setWinMode(mode) {
  if (mode !== WIN_MODES.ASC && mode !== WIN_MODES.DESC) return;
  data.settings.winMode = mode;
  save();
}

export function getTotals() {
  const totals = {};
  data.players.forEach(player => { totals[player] = 0; });
  data.rounds.forEach(round => {
    data.players.forEach(player => { totals[player] += round[player] || 0; });
  });
  return totals;
}

export function getRanking() {
  const totals = getTotals();
  const mode = getWinMode();
  const sorted = [...data.players].sort((a, b) => {
    return mode === WIN_MODES.DESC ? totals[b] - totals[a] : totals[a] - totals[b];
  });
  return sorted.map((player, index) => ({ player, total: totals[player], rank: index + 1 }));
}
