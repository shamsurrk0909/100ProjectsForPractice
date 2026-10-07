// Day 19 — Product Filter List
// Demonstrates Array.filter(), DOM rendering, and simple UI wiring.

// --- Sample product data (replace with your own or API fetch) ---
const PRODUCTS = [
  { id: 1, name: 'Classic Leather Wallet', description: 'Handmade full-grain leather wallet.', category: 'Accessories', price: 1299, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop', inStock: true },
  { id: 2, name: 'Running Sneakers', description: 'Lightweight trainers for daily runs.', category: 'Footwear', price: 3499, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop', inStock: true },
  { id: 3, name: 'Vintage Watch', description: 'Classic mechanical watch with leather strap.', category: 'Accessories', price: 8999, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop', inStock: false },
  { id: 4, name: 'Denim Jacket', description: 'Comfortable, durable denim jacket.', category: 'Clothing', price: 2999, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop', inStock: true },
  { id: 5, name: 'Smartphone XS', description: 'High performance smartphone with great camera.', category: 'Electronics', price: 24999, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop', inStock: true },
  { id: 6, name: 'Bluetooth Headphones', description: 'Noise-cancelling wireless headphones.', category: 'Electronics', price: 4999, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop', inStock: false },
  { id: 7, name: 'Casual T-Shirt', description: 'Soft cotton t-shirt.', category: 'Clothing', price: 799, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop', inStock: true },
  { id: 8, name: 'Trail Backpack', description: 'Rugged backpack for hiking and travel.', category: 'Accessories', price: 4199, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop', inStock: true }
];

// --- DOM refs ---
const searchEl = document.getElementById('search');
const categoryEl = document.getElementById('category');
const minPriceEl = document.getElementById('minPrice');
const maxPriceEl = document.getElementById('maxPrice');
const inStockEl = document.getElementById('inStock');
const sortEl = document.getElementById('sort');
const productsEl = document.getElementById('products');
const resultCountEl = document.getElementById('resultCount');
const clearBtn = document.getElementById('clearFilters');

const tpl = document.getElementById('productTpl');

// --- State ---
let products = PRODUCTS.slice(); // working copy (could be from API)
let filters = {
  q: '',
  category: '',
  minPrice: null,
  maxPrice: null,
  inStockOnly: false,
  sort: 'default'
};

// --- Helpers ---
function formatCurrency(n) {
  return '₹' + Number(n).toLocaleString(undefined, { minimumFractionDigits: 0 });
}

// Debounce helper
function debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

// Populate category options from products
function populateCategories() {
  const cats = Array.from(new Set(products.map(p => p.category))).sort();
  categoryEl.innerHTML = '<option value="">All categories</option>';
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    categoryEl.appendChild(opt);
  });
}

// Render products array (cards)
function renderProducts(list) {
  productsEl.innerHTML = '';
  if (!list.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'No products found for these filters.';
    productsEl.appendChild(empty);
    resultCountEl.textContent = 'Showing 0 products';
    return;
  }

  const frag = document.createDocumentFragment();
  list.forEach(p => {
    const node = tpl.content.cloneNode(true);
    const article = node.querySelector('.product-card');
    article.querySelector('.p-img').src = p.image;
    article.querySelector('.p-img').alt = p.name;
    article.querySelector('.p-title').textContent = p.name;
    article.querySelector('.p-desc').textContent = p.description;
    article.querySelector('.p-price').textContent = formatCurrency(p.price);
    article.querySelector('.p-stock').textContent = p.inStock ? 'In stock' : 'Out of stock';
    frag.appendChild(node);
  });
  productsEl.appendChild(frag);
  resultCountEl.textContent = `Showing ${list.length} product${list.length>1?'s':''}`;
}

// Main filter function using Array.filter()
function applyFilters() {
  const q = (filters.q || '').trim().toLowerCase();
  const cat = filters.category;
  const minP = filters.minPrice != null ? Number(filters.minPrice) : null;
  const maxP = filters.maxPrice != null ? Number(filters.maxPrice) : null;
  const inStockOnly = !!filters.inStockOnly;

  let res = products.filter(p => {
    // text search (name + description)
    if (q) {
      const hay = (p.name + ' ' + (p.description || '')).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    // category
    if (cat && p.category !== cat) return false;
    // min price
    if (minP != null && !Number.isNaN(minP) && p.price < minP) return false;
    // max price
    if (maxP != null && !Number.isNaN(maxP) && p.price > maxP) return false;
    // stock
    if (inStockOnly && !p.inStock) return false;

    return true;
  });

  // sorting
  switch (filters.sort) {
    case 'price-asc':
      res = res.sort((a,b) => a.price - b.price);
      break;
    case 'price-desc':
      res = res.sort((a,b) => b.price - a.price);
      break;
    case 'name-asc':
      res = res.sort((a,b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      res = res.sort((a,b) => b.name.localeCompare(a.name));
      break;
    default:
      // keep original order
      break;
  }

  renderProducts(res);
}

// --- Event wiring ---
const onSearchInput = debounce((e) => {
  filters.q = e.target.value;
  applyFilters();
}, 300);

searchEl.addEventListener('input', onSearchInput);

categoryEl.addEventListener('change', (e) => {
  filters.category = e.target.value;
  applyFilters();
});

minPriceEl.addEventListener('input', (e) => {
  const v = e.target.value;
  filters.minPrice = v === '' ? null : Number(v);
  applyFilters();
});
maxPriceEl.addEventListener('input', (e) => {
  const v = e.target.value;
  filters.maxPrice = v === '' ? null : Number(v);
  applyFilters();
});

inStockEl.addEventListener('change', (e) => {
  filters.inStockOnly = e.target.checked;
  applyFilters();
});

sortEl.addEventListener('change', (e) => {
  filters.sort = e.target.value;
  applyFilters();
});

clearBtn.addEventListener('click', (e) => {
  // reset filters & UI controls
  filters = { q: '', category: '', minPrice: null, maxPrice: null, inStockOnly: false, sort: 'default' };
  searchEl.value = '';
  categoryEl.value = '';
  minPriceEl.value = '';
  maxPriceEl.value = '';
  inStockEl.checked = false;
  sortEl.value = 'default';
  applyFilters();
});

// --- Initialize ---
(function init(){
  // In real app you might fetch products via API; here we use sample PRODUCTS
  // Populate categories, render initial product list
  populateCategories();
  applyFilters();
})();
