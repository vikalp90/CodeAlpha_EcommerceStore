// ---------- Config ----------
const API_BASE = 'http://localhost:5000/api';

// ---------- State ----------
let currentUser = JSON.parse(localStorage.getItem('nova_user')) || null; // { id, name, email }
let authMode = 'login'; // 'login' | 'register'
let products = [];
let activeCategory = 'All';
let searchTerm = '';

// ---------- DOM refs ----------
const productGrid = document.getElementById('productGrid');
const catalogCount = document.getElementById('catalogCount');
const searchInput = document.getElementById('searchInput');
const categoryChips = document.getElementById('categoryChips');

const detailOverlay = document.getElementById('detailOverlay');
const closeDetail = document.getElementById('closeDetail');
const detailContent = document.getElementById('detailContent');

const footerOrdersLink = document.getElementById('footerOrdersLink');

const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const closeCart = document.getElementById('closeCart');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const cartCountEl = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');

const authBtn = document.getElementById('authBtn');
const authOverlay = document.getElementById('authOverlay');
const closeAuth = document.getElementById('closeAuth');
const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const authSubmit = document.getElementById('authSubmit');
const authError = document.getElementById('authError');
const nameGroup = document.getElementById('nameGroup');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const authSwitchText = document.getElementById('authSwitchText');
const authSwitchBtn = document.getElementById('authSwitchBtn');

const checkoutOverlay = document.getElementById('checkoutOverlay');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');
const addressInput = document.getElementById('addressInput');
const checkoutError = document.getElementById('checkoutError');

const toast = document.getElementById('toast');

const ordersLink = document.getElementById('ordersLink');
const ordersOverlay = document.getElementById('ordersOverlay');
const closeOrders = document.getElementById('closeOrders');
const ordersList = document.getElementById('ordersList');

// ---------- Helpers ----------
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('active');
  setTimeout(() => toast.classList.remove('active'), 2500);
}

function formatPrice(n) {
  return '₹' + n.toLocaleString('en-IN');
}

function updateAuthUI() {
  authBtn.textContent = currentUser ? currentUser.name.split(' ')[0] : 'Login';
}

// ---------- Load Products ----------
async function loadProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    products = await res.json();
    renderCategoryChips();
    renderProducts();
  } catch (err) {
    catalogCount.textContent = 'Could not load products';
    console.error(err);
  }
}

function renderCategoryChips() {
  const categories = ['All', ...new Set(products.map(p => p.category))];
  categoryChips.innerHTML = categories.map(cat => `
    <button class="chip ${cat === activeCategory ? 'active' : ''}" data-cat="${cat}">${cat}</button>
  `).join('');

  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      activeCategory = chip.dataset.cat;
      renderCategoryChips();
      renderProducts();
    });
  });
}

function getFilteredProducts() {
  return products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

function renderProducts() {
  const filtered = getFilteredProducts();
  catalogCount.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    productGrid.innerHTML = '<p class="empty-state">No products match your search.</p>';
    return;
  }

  productGrid.innerHTML = filtered.map((p, index) => {
    let badge = '';
    if (index % 5 === 0) badge = '<span class="product-badge badge-bestseller">Bestseller</span>';
    else if (index % 7 === 3) badge = '<span class="product-badge badge-new">New</span>';

    return `
    <div class="product-card" data-id="${p._id}" style="animation-delay: ${index * 0.04}s">
      <div class="product-image">
        ${badge}
        <img src="${p.image || 'https://via.placeholder.com/300'}" alt="${p.name}">
      </div>
      <div class="product-body">
        <span class="product-category">${p.category}</span>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-spec">
          <span>Stock</span>
          <span>${p.stock} units</span>
        </div>
        <div class="product-footer">
          <span class="product-price">${formatPrice(p.price)}</span>
          <button class="add-btn" data-id="${p._id}">Add to cart</button>
        </div>
      </div>
    </div>
  `;
  }).join('');

  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(btn.dataset.id);
    });
  });

  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => openDetail(card.dataset.id));
  });
}

searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value;
  renderProducts();
});

// ---------- Product Detail Modal ----------
function openDetail(productId) {
  const p = products.find(prod => prod._id === productId);
  if (!p) return;

  detailContent.innerHTML = `
    <div class="detail-image">
      <img src="${p.image || 'https://via.placeholder.com/500'}" alt="${p.name}">
    </div>
    <span class="detail-category">${p.category}</span>
    <h2 class="detail-name">${p.name}</h2>
    <p class="detail-desc">${p.description}</p>
    <div class="detail-specs">
      <div><span class="spec-label">Stock</span><span>${p.stock} units</span></div>
      <div><span class="spec-label">Category</span><span>${p.category}</span></div>
    </div>
    <div class="detail-footer">
      <span class="detail-price">${formatPrice(p.price)}</span>
      <button class="btn-primary" id="detailAddBtn" data-id="${p._id}">Add to cart</button>
    </div>
  `;

  document.getElementById('detailAddBtn').addEventListener('click', () => {
    addToCart(p._id);
  });

  detailOverlay.classList.add('active');
}

closeDetail.addEventListener('click', () => detailOverlay.classList.remove('active'));

// ---------- Auth ----------
function openAuth(mode) {
  authMode = mode;
  authError.textContent = '';
  authForm.reset();
  if (mode === 'login') {
    authTitle.textContent = 'Login';
    authSubmit.textContent = 'Login';
    nameGroup.style.display = 'none';
    authSwitchText.textContent = 'New here?';
    authSwitchBtn.textContent = 'Create an account';
  } else {
    authTitle.textContent = 'Create account';
    authSubmit.textContent = 'Create account';
    nameGroup.style.display = 'block';
    authSwitchText.textContent = 'Already have an account?';
    authSwitchBtn.textContent = 'Login instead';
  }
  authOverlay.classList.add('active');
}

authBtn.addEventListener('click', () => {
  if (currentUser) {
    // Simple logout
    if (confirm('Log out of NOVA?')) {
      currentUser = null;
      localStorage.removeItem('nova_user');
      updateAuthUI();
      showToast('Logged out');
    }
  } else {
    openAuth('login');
  }
});

closeAuth.addEventListener('click', () => authOverlay.classList.remove('active'));
authSwitchBtn.addEventListener('click', () => openAuth(authMode === 'login' ? 'register' : 'login'));

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  authError.textContent = '';

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  try {
    if (authMode === 'register') {
      const name = nameInput.value.trim();
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      showToast('Account created. Please log in.');
      openAuth('login');
    } else {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      // NOTE: login response currently returns user without _id.
      // We fetch the id by checking localStorage fallback (see server note below).
      currentUser = {
        id: data.user.id || data.userId || data.user._id,
        name: data.user.name,
        email: data.user.email
      };
      localStorage.setItem('nova_user', JSON.stringify(currentUser));
      localStorage.setItem('nova_token', data.token);

      updateAuthUI();
      authOverlay.classList.remove('active');
      showToast(`Welcome back, ${currentUser.name.split(' ')[0]}`);
    }
  } catch (err) {
    authError.textContent = err.message;
  }
});

// ---------- Cart ----------
function requireLogin() {
  if (!currentUser) {
    showToast('Please login first');
    openAuth('login');
    return false;
  }
  return true;
}

async function addToCart(productId) {
  if (!requireLogin()) return;

  try {
    const res = await fetch(`${API_BASE}/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id, productId, quantity: 1 })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Could not add to cart');

    showToast('Added to cart');
    renderCartFromServer(data.cart);
  } catch (err) {
    showToast(err.message);
  }
}

async function loadCart() {
  if (!currentUser) return;
  try {
    const res = await fetch(`${API_BASE}/cart/${currentUser.id}`);
    if (res.status === 404) {
      renderCartFromServer({ items: [] });
      return;
    }
    const data = await res.json();
    renderCartFromServer(data);
  } catch (err) {
    console.error(err);
  }
}

function renderCartFromServer(cart) {
  const items = cart.items || [];
  cartCountEl.textContent = items.reduce((sum, i) => sum + i.quantity, 0);

  if (items.length === 0) {
    cartItemsEl.innerHTML = '<p class="empty-state">Your cart is empty.</p>';
    cartTotalEl.textContent = formatPrice(0);
    return;
  }

  let total = 0;
  cartItemsEl.innerHTML = items.map(item => {
    const p = item.product;
    const lineTotal = p.price * item.quantity;
    total += lineTotal;
    return `
      <div class="cart-item">
        <img src="${p.image || 'https://via.placeholder.com/60'}" alt="${p.name}">
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-meta">
            <span>${formatPrice(p.price)} × ${item.quantity}</span>
            <button class="remove-btn" data-id="${p._id}">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  cartTotalEl.textContent = formatPrice(total);

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
  });
}

async function removeFromCart(productId) {
  try {
    const res = await fetch(`${API_BASE}/cart/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id, productId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Could not remove item');
    renderCartFromServer(data.cart);
    showToast('Removed from cart');
  } catch (err) {
    showToast(err.message);
  }
}

cartBtn.addEventListener('click', () => {
  if (!requireLogin()) return;
  loadCart();
  cartDrawer.classList.add('active');
  drawerOverlay.classList.add('active');
});

function closeCartDrawer() {
  cartDrawer.classList.remove('active');
  drawerOverlay.classList.remove('active');
}
closeCart.addEventListener('click', closeCartDrawer);
drawerOverlay.addEventListener('click', () => {
  closeCartDrawer();
  authOverlay.classList.remove('active');
  checkoutOverlay.classList.remove('active');
});

// ---------- Checkout ----------
checkoutBtn.addEventListener('click', () => {
  if (!requireLogin()) return;
  checkoutError.textContent = '';
  checkoutOverlay.classList.add('active');
});

closeCheckout.addEventListener('click', () => checkoutOverlay.classList.remove('active'));

checkoutForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  checkoutError.textContent = '';

  try {
    const res = await fetch(`${API_BASE}/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser.id,
        shippingAddress: addressInput.value.trim()
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Order failed');

    checkoutOverlay.classList.remove('active');
    closeCartDrawer();
    checkoutForm.reset();
    showToast('Order placed! Check your Orders page.');
    renderCartFromServer({ items: [] });
  } catch (err) {
    checkoutError.textContent = err.message;
  }
});

// ---------- Orders ----------
async function loadOrders() {
  try {
    const res = await fetch(`${API_BASE}/orders/user/${currentUser.id}`);
    const orders = await res.json();
    renderOrders(orders);
  } catch (err) {
    ordersList.innerHTML = '<p class="empty-state">Could not load orders.</p>';
  }
}

function renderOrders(orders) {
  if (!orders || orders.length === 0) {
    ordersList.innerHTML = '<p class="empty-state">No orders yet.</p>';
    return;
  }

  // Most recent first
  const sorted = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  ordersList.innerHTML = sorted.map(order => `
    <div class="order-card">
      <div class="order-card-head">
        <span class="order-id">#${order._id.slice(-8)}</span>
        <span class="order-status">${order.status}</span>
      </div>
      ${order.items.map(item => `
        <div class="order-line">
          <span>${item.product ? item.product.name : 'Product'} × ${item.quantity}</span>
          <span>${formatPrice(item.price * item.quantity)}</span>
        </div>
      `).join('')}
      <div class="order-total">
        <span>Total</span>
        <span>${formatPrice(order.totalAmount)}</span>
      </div>
    </div>
  `).join('');
}

ordersLink.addEventListener('click', (e) => {
  e.preventDefault();
  if (!requireLogin()) return;
  ordersList.innerHTML = '<p class="empty-state">Loading...</p>';
  ordersOverlay.classList.add('active');
  loadOrders();
});

footerOrdersLink.addEventListener('click', (e) => {
  e.preventDefault();
  ordersLink.click();
});

closeOrders.addEventListener('click', () => ordersOverlay.classList.remove('active'));

// ---------- Init ----------
updateAuthUI();
loadProducts();
