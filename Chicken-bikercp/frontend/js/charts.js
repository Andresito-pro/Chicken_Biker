/* ==========================================================================
   Chicken Biker POS — charts.js
   Todas las gráficas usan exclusivamente la identidad visual de marca
   (rojo, naranja, crema, café oscuro). Sin azules.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.color = '#7A6459';

  initSalesHourChart();
  initSalesCompareChart();
  initTablesDonutChart();
});

/* ---------------------------------------------------------------------- */
/*  1. BAR + LINE combinado — Ventas por hora                             */
/* ---------------------------------------------------------------------- */
let salesHourChartInstance;

const HOURLY_DATA = {
  'Hoy':  { labels: ['11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm','10pm'],
            values: [180000, 420000, 610000, 540000, 260000, 190000, 240000, 480000, 690000, 720000, 510000, 260000] },
  'Ayer': { labels: ['11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm','10pm'],
            values: [150000, 380000, 560000, 470000, 230000, 170000, 210000, 430000, 610000, 640000, 470000, 230000] },
};

function initSalesHourChart() {
  const ctx = document.getElementById('salesHourChart').getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(245,124,0,0.28)');
  gradient.addColorStop(1, 'rgba(245,124,0,0.0)');

  salesHourChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: HOURLY_DATA['Hoy'].labels,
      datasets: [{
        label: 'Ventas',
        data: HOURLY_DATA['Hoy'].values,
        borderColor: '#C62828',
        backgroundColor: gradient,
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#F57C00',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        tension: 0.42,
        fill: true,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1C1210',
          titleColor: '#FFF7EC',
          bodyColor: '#FFF7EC',
          padding: 12,
          cornerRadius: 12,
          displayColors: false,
          callbacks: {
            label: (item) => ' ' + new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(item.raw)
          }
        }
      },
      scales: {
        x: { grid: { display: false }, border: { display: false } },
        y: {
          grid: { color: 'rgba(122,100,89,0.08)' },
          border: { display: false },
          ticks: {
            callback: (v) => '$' + (v / 1000) + 'k'
          }
        }
      }
    }
  });
}

function updateSalesHourChart(rangeLabel) {
  if (!salesHourChartInstance || !HOURLY_DATA[rangeLabel]) return;
  salesHourChartInstance.data.labels = HOURLY_DATA[rangeLabel].labels;
  salesHourChartInstance.data.datasets[0].data = HOURLY_DATA[rangeLabel].values;
  salesHourChartInstance.update();
}
window.updateSalesHourChart = updateSalesHourChart;

/* ---------------------------------------------------------------------- */
/*  2. BAR — Comparación de ventas (últimos 7 días)                       */
/* ---------------------------------------------------------------------- */
function initSalesCompareChart() {
  const ctx = document.getElementById('salesCompareChart').getContext('2d');

  const barGradient = ctx.createLinearGradient(0, 0, 0, 190);
  barGradient.addColorStop(0, '#F57C00');
  barGradient.addColorStop(1, '#C62828');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'],
      datasets: [{
        data: [2980000, 3120000, 2870000, 3340000, 4010000, 4820000, 4286500],
        backgroundColor: barGradient,
        borderRadius: 8,
        maxBarThickness: 22,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1C1210',
          padding: 10,
          cornerRadius: 10,
          displayColors: false,
          callbacks: {
            label: (item) => ' ' + new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(item.raw)
          }
        }
      },
      scales: {
        x: { grid: { display: false }, border: { display: false } },
        y: { display: false }
      }
    }
  });
}

/* ---------------------------------------------------------------------- */
/*  3. DOUGHNUT — Mesas ocupadas                                          */
/* ---------------------------------------------------------------------- */
function initTablesDonutChart() {
  const ctx = document.getElementById('tablesDonutChart').getContext('2d');

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Ocupadas', 'Disponibles'],
      datasets: [{
        data: [14, 6],
        backgroundColor: ['#C62828', '#FFEEDC'],
        borderWidth: 0,
        hoverOffset: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '74%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1C1210',
          padding: 10,
          cornerRadius: 10,
          displayColors: false,
        }
      }
    }
  });
}
