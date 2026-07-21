import { Chart, registerables } from 'chart.js';
import { getTotals, getRanking, getWinMode, data, WIN_MODES } from './state.js';

Chart.register(...registerables);

export let lineChartObj = null;
export let barChartObj = null;

export function renderDashboard() {
  const totals = getTotals();
  const table = document.getElementById('totalsTable');

  if (!data.rounds.length) {
    table.innerHTML = '<p class="text-slate-400 text-center text-base py-4">Chưa có dữ liệu</p>';
  } else {
    const ranking = getRanking();
    const modeLabel = getWinMode() === WIN_MODES.DESC ? 'Điểm cao thắng' : 'Điểm thấp thắng';
    table.innerHTML = `
      <p class="text-xs text-slate-400 mb-2">${modeLabel}</p>
      <div class="space-y-1.5">
        ${ranking.map(({ player, total, rank }) => `
          <div class="flex items-center justify-between px-3 py-2 rounded-lg ${rank === 1 ? 'bg-amber-500/15 border border-amber-500/40' : 'bg-slate-800/60 border border-slate-700'}">
            <span class="flex items-center gap-2 truncate">
              ${rank === 1 ? '<span title="Đang dẫn đầu">🏆</span>' : `<span class="text-slate-500 text-sm">#${rank}</span>`}
              <span class="truncate ${rank === 1 ? 'font-semibold text-amber-300' : 'text-slate-200'}">${player}</span>
            </span>
            <span class="font-semibold ${rank === 1 ? 'text-amber-300' : 'text-slate-200'}">${total}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  const labels = data.rounds.map((_, index) => 'Vòng ' + (index + 1));
  const colors = ['#fbbf24', '#34d399', '#60a5fa', '#f87171', '#a78bfa', '#fb923c', '#22d3ee', '#f472b6'];
  const isReverseMode = getWinMode() === WIN_MODES.ASC;
  const lineData = data.players.map(player => {
    let cumulative = 0;
    return data.rounds.map(round => {
      cumulative += round[player] || 0;
      return isReverseMode ? -cumulative : cumulative;
    });
  });
  const barData = data.players.map(player =>
    isReverseMode ? -totals[player] : totals[player]
  );
  const totalScore = Object.values(totals).reduce((sum, value) => sum + value, 0);

  const lineDatasets = data.players.map((player, index) => {
    let cumulative = 0;
    return {
      label: player,
      data: lineData[index],
      borderColor: colors[index % colors.length],
      backgroundColor: 'transparent',
      tension: 0.3
    };
  });

  if (lineChartObj) lineChartObj.destroy();
  lineChartObj = new Chart(document.getElementById('lineChart'), {
    type: 'line',
    data: { labels, datasets: lineDatasets },
    options: {
      plugins: {
        title: {
          display: true,
          text: `Tổng điểm lũy kế theo vòng (Tổng: ${totalScore})`,
          color: '#e2e8f0'
        },
        legend: { labels: { color: '#cbd5e1', boxWidth: 12, font: { size: 10 } } }
      },
      scales: {
        x: { ticks: { color: '#94a3b8' } },
        y: {
          ticks: {
            color: '#94a3b8',
            callback: value => Math.abs(value)
          },
          beginAtZero: true
        }
      }
    }
  });

  if (barChartObj) barChartObj.destroy();
  barChartObj = new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
      labels: data.players,
      datasets: [{
        label: 'Tổng điểm',
        data: barData,
        backgroundColor: data.players.map((_, index) => colors[index % colors.length])
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: `Tổng điểm hiện tại mỗi người (Tổng: ${totalScore})`,
          color: '#e2e8f0'
        },
        legend: { display: false }
      },
      scales: {
        x: { ticks: { color: '#94a3b8' } },
        y: {
          ticks: {
            color: '#94a3b8',
            callback: value => Math.abs(value)
          },
          beginAtZero: true
        }
      }
    }
  });
}
