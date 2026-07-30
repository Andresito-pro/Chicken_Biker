/* ==========================================================================
   Chicken Biker POS — dashboard.js
   Interacción general: sidebar / menú hamburguesa, saludo dinámico, reloj,
   toggle de caja, y renderizado de datos de ejemplo (pedidos, mesas, pagos).
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSidebarToggle();
  initGreeting();
  initCashToggle();
  initPillToggle();
  renderOrders(SAMPLE_DATA.orders);
  renderTables(SAMPLE_DATA.tables);
  renderPayments(SAMPLE_DATA.payments);
});

/* ---------------------------------------------------------------------- */
/*  Sidebar / menú hamburguesa                                            */
/* ---------------------------------------------------------------------- */
function initSidebarToggle() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const btn = document.getElementById('hamburgerBtn');

  const openSidebar = () => {
    sidebar.classList.add('open');
    overlay.classList.add('visible');
  };
  const closeSidebar = () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
  };

  btn.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  overlay.addEventListener('click', closeSidebar);

  // Marcar item activo al hacer clic (navegación simulada, sin recarga)
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      closeSidebar();
    });
  });
}

/* ---------------------------------------------------------------------- */
/*  Saludo dinámico + fecha actual                                        */
/* ---------------------------------------------------------------------- */
function initGreeting() {
  const hour = new Date().getHours();
  const userName = 'Andrés';
  let saludo = 'Buenos días';
  if (hour >= 12 && hour < 19) saludo = 'Buenas tardes';
  else if (hour >= 19 || hour < 5) saludo = 'Buenas noches';

  document.getElementById('greetingText').textContent = `${saludo}, ${userName}`;

  const dateEl = document.getElementById('currentDate');
  const formatted = new Date().toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long'
  });
  dateEl.innerHTML = `<i class="fa-regular fa-calendar"></i> ${capitalize(formatted)}`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ---------------------------------------------------------------------- */
/*  Toggle de caja (abrir / cerrar turno)                                 */
/* ---------------------------------------------------------------------- */
function initCashToggle() {
  const btn = document.getElementById('cashToggleBtn');
  btn.addEventListener('click', () => {
    const isOpen = btn.dataset.open === 'true';
    btn.dataset.open = String(!isOpen);
    btn.querySelector('.cash-label').textContent = isOpen ? 'Abrir Caja' : 'Caja Abierta';
  });
}

/* ---------------------------------------------------------------------- */
/*  Pills "Hoy / Ayer" del gráfico de ventas por hora                     */
/* ---------------------------------------------------------------------- */
function initPillToggle() {
  document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const group = pill.closest('.card-header-actions');
      group.querySelectorAll('.pill').forEach(p => p.classList.remove('pill-active'));
      pill.classList.add('pill-active');
      if (window.updateSalesHourChart) {
        window.updateSalesHourChart(pill.textContent.trim());
      }
    });
  });
}

/* ---------------------------------------------------------------------- */
/*  Datos de ejemplo realistas — restaurante Chicken Biker                */
/* ---------------------------------------------------------------------- */
const SAMPLE_DATA = {
  orders: [
    { id: '#1042', table: 'Mesa 05', waiter: 'Camila R.', status: 'preparando', total: 68500 },
    { id: '#1041', table: 'Mesa 12', waiter: 'Julián T.', status: 'listo', total: 54200 },
    { id: '#1040', table: 'Domicilio', waiter: 'Andrea M.', status: 'entregado', total: 92300 },
    { id: '#1039', table: 'Mesa 02', waiter: 'Camila R.', status: 'pagado', total: 41800 },
    { id: '#1038', table: 'Mesa 08', waiter: 'Julián T.', status: 'pagado', total: 76900 },
    { id: '#1037', table: 'Para llevar', waiter: 'Andrea M.', status: 'entregado', total: 33500 },
    { id: '#1036', table: 'Mesa 15', waiter: 'Camila R.', status: 'preparando', total: 58700 },
  ],
  tables: [
    { num: '05', client: 'Familia Torres', people: 4, value: 68500, time: '18 min' },
    { num: '12', client: 'Laura Gómez', people: 2, value: 54200, time: '32 min' },
    { num: '02', client: 'Carlos Peña', people: 3, value: 41800, time: '9 min' },
    { num: '08', client: 'Grupo oficina', people: 6, value: 132400, time: '45 min' },
  ],
  payments: [
    { receipt: '#R-3381', table: 'Mesa 02', time: '1:42 p.m.', total: 41800, method: 'Tarjeta', icon: 'fa-credit-card' },
    { receipt: '#R-3380', table: 'Mesa 08', time: '1:35 p.m.', total: 76900, method: 'Efectivo', icon: 'fa-money-bill-wave' },
    { receipt: '#R-3379', table: 'Domicilio', time: '1:20 p.m.', total: 92300, method: 'Nequi', icon: 'fa-mobile-screen-button' },
    { receipt: '#R-3378', table: 'Para llevar', time: '1:05 p.m.', total: 33500, method: 'Efectivo', icon: 'fa-money-bill-wave' },
  ]
};

const CURRENCY = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

const STATUS_LABELS = {
  preparando: { label: 'Preparando', icon: 'fa-fire' },
  listo:      { label: 'Listo',      icon: 'fa-bell-concierge' },
  entregado:  { label: 'Entregado',  icon: 'fa-truck-fast' },
  pagado:     { label: 'Pagado',     icon: 'fa-circle-check' },
};

/* ---------------------------------------------------------------------- */
/*  Render: tabla de pedidos recientes                                    */
/* ---------------------------------------------------------------------- */
function renderOrders(orders) {
  const tbody = document.querySelector('#ordersTable tbody');
  tbody.innerHTML = orders.map(o => {
    const s = STATUS_LABELS[o.status];
    const initials = o.waiter.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    return `
      <tr>
        <td data-label="Pedido"><span class="order-id">${o.id}</span></td>
        <td data-label="Mesa">${o.table}</td>
        <td data-label="Mesero">
          <span class="order-waiter"><span class="waiter-dot">${initials}</span>${o.waiter}</span>
        </td>
        <td data-label="Estado">
          <span class="status-badge status-${o.status}"><i class="fa-solid ${s.icon}"></i>${s.label}</span>
        </td>
        <td data-label="Total" class="align-right"><strong>${CURRENCY.format(o.total)}</strong></td>
      </tr>`;
  }).join('');
}

/* ---------------------------------------------------------------------- */
/*  Render: mesas abiertas                                                */
/* ---------------------------------------------------------------------- */
function renderTables(tables) {
  const wrap = document.getElementById('tablesList');
  wrap.innerHTML = tables.map(t => `
    <div class="table-item">
      <div class="table-num">${t.num}</div>
      <div class="table-info">
        <strong>${t.client}</strong>
        <span><i class="fa-solid fa-user"></i> ${t.people} personas</span>
      </div>
      <div class="table-meta">
        <strong>${CURRENCY.format(t.value)}</strong>
        <span>${t.time}</span>
      </div>
    </div>
  `).join('');
}

/* ---------------------------------------------------------------------- */
/*  Render: pagos recientes                                               */
/* ---------------------------------------------------------------------- */
function renderPayments(payments) {
  const wrap = document.getElementById('paymentsList');
  wrap.innerHTML = payments.map(p => `
    <div class="payment-item">
      <div class="payment-icon"><i class="fa-solid ${p.icon}"></i></div>
      <div class="payment-info">
        <strong>${p.receipt} · ${p.table}</strong>
        <span>${p.time} · ${p.method}</span>
      </div>
      <div class="payment-amount">
        <strong>${CURRENCY.format(p.total)}</strong>
      </div>
    </div>
  `).join('');
}
