document.addEventListener('DOMContentLoaded', () => {
  // Datos simulados de las mesas
  const tablesData = [
    { id: 'T-01', status: 'ocupada', guests: '4/4', waiter: 'María L.', time: '12:30', total: 48.50 },
    { id: 'T-02', status: 'disponible', guests: '0/2', waiter: '—', time: '—', total: 0 },
    { id: 'T-03', status: 'pendiente', guests: '2/4', waiter: 'Carlos R.', time: '11:45', total: 122.00 },
    { id: 'T-04', status: 'disponible', guests: '0/6', waiter: '—', time: '—', total: 0 },
    { id: 'T-05', status: 'ocupada', guests: '3/4', waiter: 'Ana P.', time: '13:00', total: 67.25 },
    { id: 'T-06', status: 'ocupada', guests: '6/8', waiter: 'Luis M.', time: '12:15', total: 189.00 },
    { id: 'T-07', status: 'disponible', guests: '0/4', waiter: '—', time: '—', total: 0 },
    { id: 'T-08', status: 'pendiente', guests: '4/4', waiter: 'María L.', time: '11:00', total: 94.75 },
    { id: 'T-09', status: 'inactiva', guests: '0/2', waiter: '—', time: '—', total: 0 }
  ];

  const gridContainer = document.getElementById('tablesGrid');
  const filterButtons = document.querySelectorAll('.pill-filter');

  // Nombres formateados para las etiquetas
  const statusLabels = {
    disponible: 'Disponible',
    ocupada: 'Ocupada',
    pendiente: 'Esperando Pago',
    inactiva: 'Inhabilitada'
  };

  // Función para renderizar las tarjetas
  function renderTables(filter = 'all') {
    gridContainer.innerHTML = '';

    const filteredData = filter === 'all' 
      ? tablesData 
      : tablesData.filter(table => table.status === filter);

    filteredData.forEach(table => {
      const card = document.createElement('article');
      card.className = `table-card ${table.status === 'inactiva' ? 'disabled' : ''}`;
      
      card.innerHTML = `
        <div class="table-card-header">
          <h3 class="table-title">${table.id}</h3>
          <span class="status-indicator status-${table.status}"></span>
        </div>

        <span class="table-badge ${table.status}">
          ${statusLabels[table.status]}
        </span>

        <div class="table-details">
          <div class="table-details-item">
            <i class="fa-solid fa-users"></i>
            <span>${table.guests} personas</span>
          </div>
          <div class="table-details-item">
            <i class="fa-solid fa-user"></i>
            <span>${table.waiter}</span>
          </div>
        </div>

        <div class="table-card-footer">
          <span>${table.time !== '—' ? `Desde ${table.time}` : '—'}</span>
          <span class="table-price">${table.total > 0 ? `$${table.total.toFixed(2)}` : ''}</span>
        </div>
      `;

      gridContainer.appendChild(card);
    });
  }

  // Manejo de clicks en los filtros
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const status = button.getAttribute('data-status');
      renderTables(status);
    });
  });

  // Inicializar render
  renderTables();
});