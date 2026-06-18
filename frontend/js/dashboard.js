const state = {
  user: null,
  menu: [],
  categories: [],
  cart: [],
  activeSection: 'overview',
  charts: []
};

const roleSections = {
  Admin: ['overview', 'orders', 'reservations', 'menu', 'users', 'reviews', 'payments'],
  Manager: ['overview', 'orders', 'reservations', 'menu', 'staff', 'reviews'],
  Waiter: ['tables', 'orders', 'createOrder'],
  Chef: ['kitchen', 'orders'],
  Cashier: ['billing', 'payments'],
  Customer: ['menu', 'cart', 'orders', 'reservations', 'reviews', 'profile']
};

const sectionLabels = {
  overview: 'Overview',
  orders: 'Orders',
  reservations: 'Reservations',
  menu: 'Menu',
  users: 'Users',
  reviews: 'Reviews',
  payments: 'Payments',
  staff: 'Staff',
  tables: 'Tables',
  createOrder: 'Create Order',
  kitchen: 'Kitchen',
  billing: 'Billing',
  cart: `Cart (${state.cart.length})`,
  profile: 'Profile'
};

function rupees(value) {
  return `₹${Number(value || 0).toFixed(2)}`;
}

function toast(message) {
  const element = document.getElementById('toast');
  element.textContent = message;
  element.classList.add('show');
  setTimeout(() => element.classList.remove('show'), 2600);
}

function setTitle(user) {
  document.getElementById('sidebarName').textContent = user.name;
  document.getElementById('sidebarRole').textContent = user.role;
  document.getElementById('dashboardEyebrow').textContent = `${user.role} workspace`;
  document.getElementById('dashboardTitle').textContent = `${user.role} Dashboard`;
}

function renderNav() {
  const nav = document.getElementById('roleNav');

  nav.innerHTML = roleSections[state.user.role].map((section) => `
    <button
      class="${section === state.activeSection ? 'active' : ''}"
      data-section="${section}"
    >
      ${section === 'cart'
        ? `Cart (${state.cart.length})`
        : sectionLabels[section]}
    </button>
  `).join('');

  nav.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeSection = button.dataset.section;
      render();
    });
  });
}

function destroyCharts() {
  state.charts.forEach((chart) => chart.destroy());
  state.charts = [];
}

async function loadMenu() {
  const [categories, menu] = await Promise.all([
    RestaurantAPI.get('/api/menu/categories'),
    RestaurantAPI.get('/api/menu/items?availableOnly=true')
  ]);
  state.categories = categories;
  state.menu = menu;
}

async function render() {
  renderNav();
  destroyCharts();
  const content = document.getElementById('dashboardContent');
  content.innerHTML = '<div class="panel"><p class="muted">Loading workspace...</p></div>';
  try {
    if (state.activeSection === 'overview') return renderOverview(content);
    if (state.activeSection === 'menu') return renderMenu(content);
    if (state.activeSection === 'cart') return renderCart(content);
    if (state.activeSection === 'orders') return renderOrders(content);
    if (state.activeSection === 'reservations') return renderReservations(content);
    if (state.activeSection === 'reviews') return renderReviews(content);
    if (state.activeSection === 'users' || state.activeSection === 'staff') return renderUsers(content);
    if (state.activeSection === 'tables') return renderTables(content);
    if (state.activeSection === 'createOrder') return renderCreateOrder(content);
    if (state.activeSection === 'kitchen') return renderKitchen(content);
    if (state.activeSection === 'billing') return renderBilling(content);
    if (state.activeSection === 'payments') return renderPayments(content);
    if (state.activeSection === 'profile') return renderProfile(content);
  } catch (error) {
    content.innerHTML = `<div class="panel"><p class="form-message">${error.message}</p></div>`;
  }
}

async function renderOverview(content) {
  const analytics = await RestaurantAPI.get('/api/analytics');
  const s = analytics.summary;
  content.innerHTML = `
    <section class="metrics-grid">
      ${metric('Total Revenue', rupees(s.totalRevenue))}
      ${metric("Today's Revenue", rupees(s.todayRevenue))}
      ${metric('Total Orders', s.totalOrders)}
      ${metric('Active Orders', s.activeOrders)}
      ${metric('Reservations', s.reservations)}
      ${metric('Customers', s.customers)}
    </section>
    <section class="grid-2">
      <div class="panel"><h3>Daily Sales</h3><canvas id="dailyChart"></canvas></div>
      <div class="panel"><h3>Top Selling Dishes</h3><canvas id="topDishesChart"></canvas></div>
      <div class="panel"><h3>Weekly Sales</h3><canvas id="weeklyChart"></canvas></div>
      <div class="panel"><h3>Monthly Revenue</h3><canvas id="monthlyChart"></canvas></div>
    </section>
  `;
  makeBar('dailyChart', analytics.sales.daily, 'Daily sales');
  makeBar('topDishesChart', analytics.sales.topDishes, 'Top dishes');
  makeLine('weeklyChart', analytics.sales.weekly, 'Weekly sales');
  makeLine('monthlyChart', analytics.sales.monthly, 'Monthly revenue');
}

function metric(label, value) {
  return `<article class="metric-card"><span>${label}</span><strong>${value}</strong></article>`;
}

function makeBar(id, rows, label) {
  const chart = new Chart(document.getElementById(id), {
    type: 'bar',
    data: {
      labels: rows.map((row) => String(row.label)),
      datasets: [{ label, data: rows.map((row) => Number(row.value)), backgroundColor: '#0e7c66' }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
  state.charts.push(chart);
}

function makeLine(id, rows, label) {
  const chart = new Chart(document.getElementById(id), {
    type: 'line',
    data: {
      labels: rows.map((row) => String(row.label)),
      datasets: [{ label, data: rows.map((row) => Number(row.value)), borderColor: '#d7472f', tension: 0.35 }]
    },
    options: { responsive: true }
  });
  state.charts.push(chart);
}

async function renderMenu(content) {
  if (!state.menu.length) await loadMenu();
  const managerTools = ['Admin', 'Manager'].includes(state.user.role) ? `
    <div class="panel">
      <div class="panel-head"><h3>Add Menu Item</h3></div>
      <form id="menuForm" class="grid-3">
        <input name="name" placeholder="Dish name" required>
        <select name="categoryId">${state.categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join('')}</select>
        <input name="price" type="number" step="0.01" placeholder="Price" required>
        <input name="imageUrl" placeholder="Image URL">
        <select name="spiceLevel"><option>Mild</option><option>Medium</option><option>Hot</option></select>
        <select name="isVeg"><option value="true">Veg</option><option value="false">Non-Veg</option></select>
        <textarea name="description" placeholder="Description" required></textarea>
        <button class="btn btn-primary" type="submit">Save Dish</button>
      </form>
    </div>` : '';
  content.innerHTML = `
    ${managerTools}
    <section class="card-grid">
      ${state.menu.map((item) => foodCard(item)).join('')}
    </section>
  `;
  content.querySelectorAll('[data-add-cart]').forEach((button) => {
    button.addEventListener('click', () => {
      const item = state.menu.find((dish) => dish.id === Number(button.dataset.addCart));
      addToCart(item);
    });
  });
  const menuForm = document.getElementById('menuForm');
  if (menuForm) {
    menuForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(menuForm).entries());
      await RestaurantAPI.post('/api/menu/items', {
        ...data,
        categoryId: Number(data.categoryId),
        price: Number(data.price),
        isVeg: data.isVeg === 'true'
      });
      state.menu = [];
      toast('Menu item saved');
      renderMenu(content);
    });
  }
}

function foodCard(item) {
  const canCart = ['Customer', 'Waiter'].includes(state.user.role);
  return `
    <article class="food-card">
      <img src="${item.image_url}" alt="${item.name}">
      <div class="food-card-body">
        <span class="tag">${item.category}</span>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="price-line"><span>${rupees(item.price)}</span><span>${item.is_veg ? 'Veg' : 'Non-Veg'}</span></div>
        ${canCart ? `<button class="mini-btn primary" data-add-cart="${item.id}" type="button">Add</button>` : ''}
      </div>
    </article>
  `;
}

function addToCart(item) {
  const existing = state.cart.find((cartItem) => cartItem.menuItemId === item.id);
  if (existing) existing.quantity += 1;
  else state.cart.push({ menuItemId: item.id, name: item.name, price: item.price, quantity: 1 });
  toast(`${item.name} added to cart`);
}

function renderCart(content) {
  const total = state.cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  content.innerHTML = `
    <section class="grid-2">
      <div class="panel">
        <div class="panel-head"><h3>Your Cart</h3><strong>${rupees(total)}</strong></div>
        <div class="cart-list">
  ${state.cart.length
    ? state.cart.map((item) => `
      <div class="cart-item">

        <div class="cart-details">
          <strong>${item.name}</strong>

          <span class="muted">
            ${item.quantity} x ${rupees(item.price)}
          </span>
        </div>

        <button
          class="cart-remove-btn"
          data-remove-cart="${item.menuItemId}"
          type="button"
        >
          🗑
        </button>

      </div>
    `).join('')
    : '<p class="muted">Add dishes from the menu.</p>'
  }
</div>
      </div>
      <form id="orderForm" class="panel form-stack">
        <h3>Place Order</h3>
        <select name="orderType"><option>Dine In</option><option>Takeaway</option><option>Delivery</option></select>
        <input name="tableId" type="number" min="1" placeholder="Table ID for dine in">
        <textarea name="notes" placeholder="Order notes"></textarea>
        <button class="btn btn-primary" type="submit">Place Order</button>
      </form>
    </section>
  `;
  document.getElementById('orderForm').addEventListener('submit', submitOrder);

content.querySelectorAll('[data-remove-cart]').forEach((button) => {
  button.addEventListener('click', () => {
    const id = Number(button.dataset.removeCart);

    state.cart = state.cart.filter(
      (item) => item.menuItemId !== id
    );

    render();
  });
});
}

async function submitOrder(event) {
  event.preventDefault();
  if (!state.cart.length) return toast('Cart is empty');
  const data = Object.fromEntries(new FormData(event.target).entries());
  await RestaurantAPI.post('/api/orders', {
    orderType: data.orderType,
    tableId: data.tableId ? Number(data.tableId) : null,
    notes: data.notes,
    items: state.cart.map((item) => ({ menuItemId: item.menuItemId, quantity: item.quantity }))
  });
  state.cart = [];
  toast('Order placed and sent to kitchen');
  state.activeSection = 'orders';
  render();
}

async function renderOrders(content) {
  const orders = await RestaurantAPI.get('/api/orders');
  content.innerHTML = `
    <section class="panel">
      <div class="panel-head"><h3>Orders</h3><span class="tag">${orders.length} records</span></div>
      <div class="stack-list">${orders.map(orderCard).join('')}</div>
    </section>
  `;
  attachOrderButtons(content);
}

function orderCard(order) {
  const buttons = orderButtons(order);
  return `
    <article class="order-card">
      <div class="panel-head">
        <div><h3>Order #${order.id}</h3><p>${order.order_type} · ${order.table_number || 'No table'} · ${order.customer_name || 'Walk-in'}</p></div>
        <span class="tag">${order.status}</span>
      </div>
      <p>${order.items.map((item) => `${item.quantity} x ${item.name}`).join(', ')}</p>
      <div class="price-line"><strong>${rupees(order.total)}</strong><div class="action-row">${buttons}</div></div>
    </article>
  `;
}

function orderButtons(order) {
  const role = state.user.role;
  if (['Chef'].includes(role)) {
    return ['Accepted', 'Preparing', 'Ready'].map((status) => `<button class="mini-btn primary" data-order="${order.id}" data-status="${status}">${status}</button>`).join('');
  }
  if (['Admin', 'Manager', 'Waiter'].includes(role)) {
    return ['Accepted', 'Preparing', 'Ready', 'Completed', 'Cancelled'].map((status) => `<button class="mini-btn" data-order="${order.id}" data-status="${status}">${status}</button>`).join('');
  }
  if (role === 'Cashier') {
    return `<button class="mini-btn primary" data-bill="${order.id}" data-total="${order.total}">Bill</button><button class="mini-btn" data-print="${order.id}">Invoice</button>`;
  }
  return '';
}

function attachOrderButtons(content) {
  content.querySelectorAll('[data-order]').forEach((button) => {
    button.addEventListener('click', async () => {
      await RestaurantAPI.put(`/api/orders/${button.dataset.order}/status`, { status: button.dataset.status });
      toast('Order updated');
      render();
    });
  });
  content.querySelectorAll('[data-bill]').forEach((button) => {
    button.addEventListener('click', async () => {
      await RestaurantAPI.post('/api/payments', {
        orderId: Number(button.dataset.bill),
        amount: Number(button.dataset.total),
        method: 'Cash'
      });
      toast('Payment processed');
      render();
    });
  });
  content.querySelectorAll('[data-print]').forEach((button) => {
    button.addEventListener('click', async () => {
      const invoice = await RestaurantAPI.get(`/api/payments/invoice/${button.dataset.print}`);
      printInvoice(invoice);
    });
  });
}

function printInvoice(invoice) {
  const order = invoice.order;
  const lines = order.items.map((item) => `
    <tr><td>${item.name}</td><td>${item.quantity}</td><td>${rupees(item.unit_price)}</td><td>${rupees(item.line_total)}</td></tr>
  `).join('');
  const popup = window.open('', '_blank', 'width=720,height=820');
  popup.document.write(`
    <html><head><title>Invoice #${order.id}</title>
    <style>body{font-family:Arial,sans-serif;padding:28px;color:#17202a}table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid #ddd;padding:10px;text-align:left}.total{text-align:right;font-size:22px;font-weight:700}</style>
    </head><body>
      <h1>RestaurantERP Pro</h1>
      <p>Invoice for Order #${order.id}</p>
      <p>${order.customer_name || 'Walk-in'} · ${order.order_type} · ${order.status}</p>
      <table><thead><tr><th>Item</th><th>Qty</th><th>Rate</th><th>Total</th></tr></thead><tbody>${lines}</tbody></table>
      <p class="total">Grand Total: ${rupees(order.total)}</p>
      <script>window.print();</script>
    </body></html>
  `);
  popup.document.close();
}

async function renderKitchen(content) {
  const orders = await RestaurantAPI.get('/api/orders?activeOnly=true');
  content.innerHTML = `
    <section class="panel">
      <div class="panel-head"><h3>Kitchen Display System</h3><span class="tag">Live queue</span></div>
      <div class="stack-list">${orders.map(orderCard).join('')}</div>
    </section>
  `;
  attachOrderButtons(content);
}

async function renderReservations(content) {
  const reservations = await RestaurantAPI.get('/api/reservations');
  const customerForm = state.user.role === 'Customer' ? `
    <form id="reservationForm" class="panel grid-3">
      <input name="date" type="date" required>
      <input name="time" type="time" required>
      <input name="guests" type="number" min="1" max="30" placeholder="Guests" required>
      <textarea name="specialRequest" placeholder="Special request"></textarea>
      <button class="btn btn-primary" type="submit">Request Reservation</button>
    </form>` : '';
  content.innerHTML = `
    ${customerForm}
    <section class="panel">
      <div class="panel-head"><h3>Reservations</h3><span class="tag">${reservations.length} bookings</span></div>
      <div class="table-wrap"><table><thead><tr><th>Customer</th><th>Date</th><th>Time</th><th>Guests</th><th>Status</th><th>Action</th></tr></thead><tbody>
        ${reservations.map((r) => `<tr><td>${r.customer_name}</td><td>${r.reservation_date}</td><td>${r.reservation_time}</td><td>${r.guests}</td><td>${r.status}</td><td>${reservationActions(r)}</td></tr>`).join('')}
      </tbody></table></div>
    </section>
  `;
  const form = document.getElementById('reservationForm');
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      await RestaurantAPI.post('/api/reservations', { ...data, guests: Number(data.guests) });
      toast('Reservation submitted');
      render();
    });
  }
  content.querySelectorAll('[data-reservation]').forEach((button) => {
    button.addEventListener('click', async () => {
      await RestaurantAPI.put(`/api/reservations/${button.dataset.reservation}/status`, { status: button.dataset.status });
      toast('Reservation updated');
      render();
    });
  });
}

function reservationActions(reservation) {
  if (!['Admin', 'Manager'].includes(state.user.role)) return '';
  return `<div class="action-row">
    <button class="mini-btn primary" data-reservation="${reservation.id}" data-status="Approved">Approve</button>
    <button class="mini-btn danger" data-reservation="${reservation.id}" data-status="Rejected">Reject</button>
  </div>`;
}

async function renderTables(content) {
  const tables = await RestaurantAPI.get('/api/tables');
  content.innerHTML = `
    <section class="grid-3">
      ${tables.map((table) => `
        <article class="table-card">
          <span class="tag">${table.status}</span>
          <h3>${table.table_number}</h3>
          <p>Capacity: ${table.capacity}</p>
          <div class="action-row">
            ${['Available', 'Reserved', 'Occupied', 'Cleaning'].map((status) => `<button class="mini-btn" data-table="${table.id}" data-status="${status}">${status}</button>`).join('')}
          </div>
        </article>
      `).join('')}
    </section>
  `;
  content.querySelectorAll('[data-table]').forEach((button) => {
    button.addEventListener('click', async () => {
      await RestaurantAPI.put(`/api/tables/${button.dataset.table}`, { status: button.dataset.status });
      toast('Table updated');
      render();
    });
  });
}

async function renderCreateOrder(content) {
  if (!state.menu.length) await loadMenu();
  const total = state.cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  content.innerHTML = `
    <section class="grid-2">
      <div class="panel">
        <div class="panel-head"><h3>Create Customer Order</h3><span class="tag">Waiter POS</span></div>
        <div class="card-grid">${state.menu.slice(0, 12).map((item) => foodCard(item)).join('')}</div>
      </div>
      <div class="panel">
        <div class="panel-head"><h3>Order Cart</h3><strong>${rupees(total)}</strong></div>
        <div class="cart-list">${state.cart.length ? state.cart.map((item) => `<div class="cart-item"><div><strong>${item.name}</strong><span class="muted">${item.quantity} x ${rupees(item.price)}</span></div></div>`).join('') : '<p class="muted">Add dishes for the table.</p>'}</div>
        <form id="waiterOrderForm" class="form-stack">
          <select name="orderType"><option>Dine In</option><option>Takeaway</option></select>
          <input name="tableId" type="number" min="1" placeholder="Table ID" required>
          <textarea name="notes" placeholder="Kitchen note"></textarea>
          <button class="btn btn-primary" type="submit">Send to Kitchen</button>
        </form>
      </div>
    </section>
  `;
  content.querySelectorAll('[data-add-cart]').forEach((button) => {
    button.addEventListener('click', () => {
      const item = state.menu.find((dish) => dish.id === Number(button.dataset.addCart));
      addToCart(item);
      renderCreateOrder(content);
    });
  });
  document.getElementById('waiterOrderForm').addEventListener('submit', submitOrder);
}

async function renderBilling(content) {
  const orders = await RestaurantAPI.get('/api/orders?activeOnly=true');
  content.innerHTML = `
    <section class="panel">
      <div class="panel-head"><h3>Billing Queue</h3><span class="tag">Cashier</span></div>
      <div class="stack-list">${orders.map(orderCard).join('')}</div>
    </section>
  `;
  attachOrderButtons(content);
}

async function renderPayments(content) {
  const payments = await RestaurantAPI.get('/api/payments');
  content.innerHTML = `
    <section class="panel">
      <div class="panel-head"><h3>Payments</h3><span class="tag">${payments.length} payments</span></div>
      <div class="table-wrap"><table><thead><tr><th>ID</th><th>Order</th><th>Method</th><th>Amount</th><th>Status</th><th>Paid At</th></tr></thead><tbody>
        ${payments.map((p) => `<tr><td>#${p.id}</td><td>#${p.order_id}</td><td>${p.method}</td><td>${rupees(p.amount)}</td><td>${p.status}</td><td>${p.paid_at}</td></tr>`).join('')}
      </tbody></table></div>
    </section>
  `;
}

async function renderReviews(content) {
  const reviews = await RestaurantAPI.get('/api/reviews');
  const form = state.user.role === 'Customer' ? `
    <form id="reviewForm" class="panel grid-3">
      <input name="foodRating" type="number" min="1" max="5" placeholder="Food rating" required>
      <input name="serviceRating" type="number" min="1" max="5" placeholder="Service rating" required>
      <textarea name="comment" placeholder="Write your review" required></textarea>
      <button class="btn btn-primary" type="submit">Submit Review</button>
    </form>` : '';
  content.innerHTML = `
    ${form}
    <section class="panel">
      <div class="panel-head"><h3>Reviews</h3><span class="tag">${reviews.length} reviews</span></div>
      <div class="stack-list">${reviews.map((review) => `
        <div class="stack-item">
          <div><strong>${review.customer_name}</strong><span class="muted">${review.comment}</span></div>
          <div class="action-row"><span class="tag">${review.status}</span>${reviewActions(review)}</div>
        </div>`).join('')}</div>
    </section>
  `;
  const reviewForm = document.getElementById('reviewForm');
  if (reviewForm) {
    reviewForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(reviewForm).entries());
      await RestaurantAPI.post('/api/reviews', {
        foodRating: Number(data.foodRating),
        serviceRating: Number(data.serviceRating),
        comment: data.comment
      });
      toast('Review submitted');
      render();
    });
  }
  content.querySelectorAll('[data-review]').forEach((button) => {
    button.addEventListener('click', async () => {
      await RestaurantAPI.put(`/api/reviews/${button.dataset.review}/status`, { status: button.dataset.status });
      toast('Review updated');
      render();
    });
  });
}

function reviewActions(review) {
  if (!['Admin', 'Manager'].includes(state.user.role)) return '';
  return `
    <button class="mini-btn primary" data-review="${review.id}" data-status="Approved">Approve</button>
    <button class="mini-btn danger" data-review="${review.id}" data-status="Rejected">Reject</button>
  `;
}

async function renderUsers(content) {
  const role = state.activeSection === 'staff' ? '' : '';
  const users = await RestaurantAPI.get(`/api/users${role}`);
  content.innerHTML = `
    <form id="userForm" class="panel grid-3">
      <input name="name" placeholder="Full name" required>
      <input name="email" type="email" placeholder="Email" required>
      <input name="password" type="password" placeholder="Password" required>
      <select name="role">
        ${['Admin', 'Manager', 'Waiter', 'Chef', 'Cashier', 'Customer'].map((roleName) => `<option>${roleName}</option>`).join('')}
      </select>
      <input name="phone" placeholder="Phone">
      <input name="address" placeholder="Address">
      <button class="btn btn-primary" type="submit">Create User</button>
    </form>
    <section class="panel">
      <div class="panel-head"><h3>${state.activeSection === 'staff' ? 'Staff' : 'Users'}</h3><span class="tag">${users.length} records</span></div>
      <div class="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Status</th></tr></thead><tbody>
        ${users.filter((u) => state.activeSection !== 'staff' || u.role !== 'Customer').map((u) => `<tr><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td><td>${u.phone || ''}</td><td>${u.status}</td></tr>`).join('')}
      </tbody></table></div>
    </section>
  `;
  document.getElementById('userForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    await RestaurantAPI.post('/api/users', data);
    toast('User created');
    render();
  });
}

function renderProfile(content) {
  content.innerHTML = `
    <form id="profileForm" class="panel form-stack">
      <h3>Profile</h3>
      <input name="name" value="${state.user.name}" required>
      <input name="phone" value="${state.user.phone || ''}" placeholder="Phone">
      <textarea name="address" placeholder="Address">${state.user.address || ''}</textarea>
      <button class="btn btn-primary" type="submit">Save Profile</button>
    </form>
  `;
  document.getElementById('profileForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    state.user = await RestaurantAPI.put('/api/auth/profile', data);
    RestaurantAPI.setSession(RestaurantAPI.getToken(), state.user, Boolean(localStorage.getItem('restaurantErpToken')));
    setTitle(state.user);
    toast('Profile updated');
  });
}

function connectSocket() {
  const socket = io({ auth: { token: RestaurantAPI.getToken() } });
  socket.on('connect', () => {
    document.getElementById('socketStatus').textContent = 'Live';
    socket.emit('join:role', state.user.role);
  });
  socket.on('disconnect', () => {
    document.getElementById('socketStatus').textContent = 'Offline';
  });
  socket.on('order:update', () => {
    toast('Order update received');
    if (['orders', 'kitchen', 'billing'].includes(state.activeSection)) render();
  });
  socket.on('reservation:update', () => {
    toast('Reservation update received');
    if (state.activeSection === 'reservations') render();
  });
}

async function init() {
  state.user = await Auth.requireUser();
  if (!state.user) return;
  state.activeSection = roleSections[state.user.role][0];
  setTitle(state.user);
  document.getElementById('logoutBtn').addEventListener('click', Auth.logout);
  connectSocket();
  await render();
}

init();
