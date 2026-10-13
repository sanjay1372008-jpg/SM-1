'use strict';

/* =====================================================================
   MAISON NOIR · script.js
   1. Config & helpers   2. Product data   3. Storage & state
   4. Rendering helpers  5. Collections (Shop / Men / Women)
   6. Home               7. Product details   8. Wishlist
   9. Cart & checkout demo   10. Search   11. Overlays & modal
   12. Theme   13. Forms   14. Motion   15. Router & init
   ===================================================================== */

/* ---------- 1. Config & helpers ---------- */
const CONFIG = {
  // Demo video. Swap for any public, muted, looping fashion clip (MP4).
  VIDEO_URL: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  FALLBACK_IMG: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 1000'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23e9e2d6'/><stop offset='1' stop-color='%23b9ab94'/></linearGradient></defs><rect width='800' height='1000' fill='url(%23g)'/><text x='400' y='500' text-anchor='middle' fill='%23605646' font-family='Georgia,serif' font-size='44' letter-spacing='6'>MAISON NOIR</text></svg>",
  FREE_SHIPPING_ABOVE: 5000,
  SHIPPING_FEE: 250,
  MAX_QTY: 10,
  DISCOUNT_CODES: {
    LUXE10: { label: '10% off your bag', rate: 0.10 },
    WELCOME15: { label: '15% off your bag', rate: 0.15 }
  }
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
const photo = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=80`;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 2. Product data (demo, fictional) ---------- */
const SIZES = {
  apparel: ['XS', 'S', 'M', 'L', 'XL'],
  shoe: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
  one: ['One Size']
};

const POOL = [
  'photo-1539109136881-3be0616acf4b',
  'photo-1490481651871-ab68de25d43d',
  'photo-1483985988355-763728e1935b',
  'photo-1496747611176-843222e1e57c',
  'photo-1515886657613-9f3515b0c78f',
  'photo-1617137968427-85924c800a22',
  'photo-1594938298603-c8148c4dae35',
  'photo-1520975661595-6453be3f7070',
  'photo-1434389677669-e08b4cac3105',
  'photo-1469334031218-e382a71b716b',
  'photo-1542291026-7eec264c27ff',
  'photo-1560243563-062bfc001d68'
];

const RAW = [
  { id: 'cashmere-overcoat', name: 'Cashmere Overcoat', gender: 'men', cat: 'Outerwear', price: 28500, sale: null, sizeType: 'apparel', colors: [['Charcoal', '#3b3b3b'], ['Camel', '#c19a6b']], desc: 'A double-faced cashmere overcoat with a softly structured shoulder and a full satin lining.', tag: 'New', trending: true, stock: 6 },
  { id: 'tailored-wool-blazer', name: 'Tailored Wool Blazer', gender: 'men', cat: 'Tailoring', price: 18900, sale: 15900, sizeType: 'apparel', colors: [['Navy', '#1f2a44'], ['Charcoal', '#3b3b3b']], desc: 'A half-canvassed wool blazer with a clean notch lapel and easy, natural shoulder.', tag: null, trending: true, stock: 12 },
  { id: 'silk-camp-collar-shirt', name: 'Silk Camp-Collar Shirt', gender: 'men', cat: 'Shirts', price: 7800, sale: null, sizeType: 'apparel', colors: [['Ivory', '#efe7d6'], ['Ink', '#222222']], desc: 'Lightweight mulberry silk with a relaxed camp collar, made for warm evenings.', tag: null, trending: false, stock: 9 },
  { id: 'relaxed-pleat-trousers', name: 'Relaxed Pleat Trousers', gender: 'men', cat: 'Trousers', price: 9400, sale: 7990, sizeType: 'apparel', colors: [['Stone', '#bfb5a2'], ['Olive', '#5b5d3a']], desc: 'Double-pleated trousers in a wool-blend with a soft, tapered leg.', tag: null, trending: false, stock: 10 },
  { id: 'merino-crew-knit', name: 'Merino Crew Knit', gender: 'men', cat: 'Knitwear', price: 6200, sale: null, sizeType: 'apparel', colors: [['Oatmeal', '#d8ccb4'], ['Forest', '#2f4a3a']], desc: 'Fine-gauge merino with ribbed cuffs and a clean, unfussy crew neck.', tag: null, trending: true, stock: 14 },
  { id: 'leather-derby-shoes', name: 'Leather Derby Shoes', gender: 'men', cat: 'Footwear', price: 16500, sale: null, sizeType: 'shoe', colors: [['Espresso', '#4a2e1d'], ['Black', '#151515']], desc: 'Full-grain calfskin derbies with a stacked leather heel and a Goodyear-welted sole.', tag: 'Bestseller', trending: true, stock: 5 },
  { id: 'waxed-cotton-field-jacket', name: 'Waxed Cotton Field Jacket', gender: 'men', cat: 'Outerwear', price: 14200, sale: null, sizeType: 'apparel', colors: [['Olive', '#5b5d3a'], ['Navy', '#1f2a44']], desc: 'Waxed cotton with corduroy collar and four utility pockets. Currently sold out (demo).', tag: null, trending: false, stock: 0 },
  { id: 'linen-resort-shirt', name: 'Linen Resort Shirt', gender: 'men', cat: 'Shirts', price: 5400, sale: 4500, sizeType: 'apparel', colors: [['Sky', '#a9c3d6'], ['White', '#fafafa']], desc: 'Breathable European linen in a open-collar cut for slow, sunlit days.', tag: null, trending: false, stock: 18 },
  { id: 'selvedge-denim-slim', name: 'Selvedge Denim Slim', gender: 'men', cat: 'Trousers', price: 8900, sale: null, sizeType: 'apparel', colors: [['Indigo', '#2c3e63'], ['Black', '#1b1b1b']], desc: '14oz selvedge denim with a slim taper and a comfortable mid-rise.', tag: 'New', trending: false, stock: 8 },
  { id: 'suede-chelsea-boots', name: 'Suede Chelsea Boots', gender: 'men', cat: 'Footwear', price: 17800, sale: 14900, sizeType: 'shoe', colors: [['Taupe', '#8b7762'], ['Black', '#151515']], desc: 'Soft suede Chelsea boots with an elasticated side panel and leather lining.', tag: null, trending: true, stock: 2 },
  { id: 'silk-slip-midi-dress', name: 'Silk Slip Midi Dress', gender: 'women', cat: 'Dresses', price: 19500, sale: null, sizeType: 'apparel', colors: [['Champagne', '#e8d9bf'], ['Black', '#111111']], desc: 'A bias-cut silk slip with delicate straps and a fluid midi hem.', tag: 'New', trending: true, stock: 7 },
  { id: 'sculpted-wool-coat', name: 'Sculpted Wool Coat', gender: 'women', cat: 'Outerwear', price: 34500, sale: 29900, sizeType: 'apparel', colors: [['Camel', '#c19a6b'], ['Burgundy', '#6b2b35']], desc: 'A sculpted, single-breasted wool coat with a defined waist and a precise collar.', tag: 'Bestseller', trending: true, stock: 4 },
  { id: 'ivory-cashmere-cardigan', name: 'Ivory Cashmere Cardigan', gender: 'women', cat: 'Knitwear', price: 11200, sale: null, sizeType: 'apparel', colors: [['Ivory', '#f4efe4'], ['Rose', '#d9a7a0']], desc: 'Pure cashmere cardigan with mother-of-pearl buttons and a softly cropped fit.', tag: null, trending: true, stock: 11 },
  { id: 'pleated-satin-skirt', name: 'Pleated Satin Skirt', gender: 'women', cat: 'Skirts', price: 8600, sale: null, sizeType: 'apparel', colors: [['Black', '#111111'], ['Emerald', '#1f5f4b']], desc: 'Sunray-pleated satin with a high waist that moves beautifully with every step.', tag: null, trending: false, stock: 9 },
  { id: 'tailored-column-trousers', name: 'Tailored Column Trousers', gender: 'women', cat: 'Trousers', price: 9800, sale: null, sizeType: 'apparel', colors: [['Charcoal', '#3b3b3b'], ['Ivory', '#efe7d6']], desc: 'Column-cut trousers with a high waist, front pleats and a long, elegant line.', tag: null, trending: false, stock: 10 },
  { id: 'embroidered-linen-blouse', name: 'Embroidered Linen Blouse', gender: 'women', cat: 'Shirts', price: 7200, sale: null, sizeType: 'apparel', colors: [['White', '#fafafa'], ['Sage', '#9aa58a']], desc: 'Linen blouse with a hand-embroidered placket and gently gathered sleeves.', tag: null, trending: false, stock: 13 },
  { id: 'leather-kitten-heel-mules', name: 'Leather Kitten-Heel Mules', gender: 'women', cat: 'Footwear', price: 13800, sale: null, sizeType: 'shoe', colors: [['Black', '#151515'], ['Nude', '#d9b8a0']], desc: 'Pointed leather mules with a sculpted 45mm kitten heel.', tag: null, trending: false, stock: 6 },
  { id: 'quilted-leather-crossbody', name: 'Quilted Leather Crossbody', gender: 'women', cat: 'Accessories', price: 22500, sale: null, sizeType: 'one', colors: [['Black', '#151515'], ['Tan', '#b07d4f']], desc: 'Diamond-quilted lambskin with a chain strap and a signature interior pocket.', tag: 'New', trending: true, stock: 5 },
  { id: 'cocoon-evening-gown', name: 'Cocoon Evening Gown', gender: 'women', cat: 'Dresses', price: 45000, sale: null, sizeType: 'apparel', colors: [['Midnight', '#1a1f3a'], ['Oxblood', '#5e1d25']], desc: 'A cocoon-shaped gown in crepe with a sculpted neckline and a hidden side zip.', tag: 'New', trending: false, stock: 3 },
  { id: 'oversized-trench', name: 'Oversized Trench', gender: 'unisex', cat: 'Outerwear', price: 21000, sale: null, sizeType: 'apparel', colors: [['Khaki', '#b9a783'], ['Black', '#151515']], desc: 'A relaxed double-breasted trench in water-resistant cotton gabardine.', tag: null, trending: true, stock: 8 },
  { id: 'organic-crew-tee', name: 'Organic Crew Tee', gender: 'unisex', cat: 'Shirts', price: 2900, sale: null, sizeType: 'apparel', colors: [['White', '#fafafa'], ['Black', '#151515']], desc: 'Heavyweight organic cotton with a reinforced neck and a boxy, easy fit.', tag: 'Bestseller', trending: false, stock: 30 },
  { id: 'monogram-silk-scarf', name: 'Monogram Silk Scarf', gender: 'unisex', cat: 'Accessories', price: 4800, sale: null, sizeType: 'one', colors: [['Ivory', '#f4efe4'], ['Ochre', '#c49a3a']], desc: 'Twill silk with a discreet woven monogram and hand-rolled edges.', tag: null, trending: false, stock: 15 },
  { id: 'pleated-wide-leg-pants', name: 'Pleated Wide-Leg Pants', gender: 'women', cat: 'Trousers', price: 8400, sale: 6900, sizeType: 'apparel', colors: [['Ivory', '#efe7d6'], ['Black', '#111111']], desc: 'Fluid wide-leg trousers with soft front pleats and a pull-on waistband.', tag: null, trending: false, stock: 12 },
  { id: 'titanium-minimal-watch', name: 'Titanium Minimal Watch', gender: 'unisex', cat: 'Accessories', price: 12500, sale: null, sizeType: 'one', colors: [['Silver', '#c9c9c9'], ['Gold', '#d4af37']], desc: 'A slim titanium case with a sapphire-style crystal and a Milanese mesh strap (demo spec).', tag: null, trending: false, stock: 7 }
];

const PRODUCTS = RAW.map((p, i) => ({
  ...p,
  images: [0, 4, 7].map((o) => photo(POOL[(i + o) % POOL.length]))
}));

/* ---------- 3. Storage & state ---------- */
const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (err) {
      return fallback;
    }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (err) { /* storage unavailable */ }
  }
};

function byId(id) { return PRODUCTS.find((p) => p.id === id) || null; }
function curr(p) { return p.sale ?? p.price; }
function genderLabel(g) { return ({ men: 'Men', women: 'Women', unisex: 'Unisex' })[g] || g; }

function stockStatus(n) {
  if (n === 0) return { cls: 'out', text: 'Out of stock' };
  if (n <= 3) return { cls: 'low', text: `Only ${n} left` };
  return { cls: 'in', text: 'In stock' };
}

const state = {
  cart: store.get('mn.cart', []),
  wishlist: store.get('mn.wishlist', []),
  discount: store.get('mn.discount', null)
};
state.cart = state.cart.filter((i) => byId(i.id)); // drop items for removed products

function saveCart() { store.set('mn.cart', state.cart); }
function saveWish() { store.set('mn.wishlist', state.wishlist); }

/* ---------- 4. Rendering helpers ---------- */
function productCard(p) {
  const wished = state.wishlist.includes(p.id);
  const onSale = p.sale !== null;
  return `
  <article class="product-card reveal">
    <a class="pc-media" href="#/product/${p.id}" aria-label="View ${esc(p.name)}">
      <img src="${p.images[0]}" alt="${esc(p.name)}, ${p.cat.toLowerCase()}" loading="lazy" />
      ${p.tag ? `<span class="pc-badge">${esc(p.tag)}</span>` : ''}
      ${onSale ? '<span class="pc-badge pc-sale">Sale</span>' : ''}
      ${p.stock === 0 ? '<span class="pc-badge pc-out">Sold out</span>' : ''}
    </a>
    <div class="pc-body">
      <div class="pc-info">
        <p class="pc-cat">${esc(p.cat)} · ${genderLabel(p.gender)}</p>
        <h3 class="pc-name"><a href="#/product/${p.id}">${esc(p.name)}</a></h3>
        <p class="price"><span class="price-now">${inr(curr(p))}</span>${onSale ? `<span class="price-was">${inr(p.price)}</span>` : ''}</p>
      </div>
      <button class="pc-wish${wished ? ' is-active' : ''}" type="button" data-action="wish" data-id="${p.id}"
        aria-pressed="${wished}" aria-label="${wished ? 'Remove' : 'Save'} ${esc(p.name)} ${wished ? 'from' : 'to'} wishlist">${wished ? '♥' : '♡'}</button>
    </div>
  </article>`;
}

function paintWish(btn) {
  const on = state.wishlist.includes(btn.dataset.id);
  btn.classList.toggle('is-active', on);
  btn.setAttribute('aria-pressed', String(on));
  btn.textContent = on ? '♥' : '♡';
}

function bump(el) {
  if (!el) return;
  el.classList.remove('bump');
  void el.offsetWidth;
  el.classList.add('bump');
}

function setMsg(el, text, type = '') {
  el.textContent = text;
  el.className = `form-msg ${type}`.trim();
}

function updateBadges() {
  const count = state.cart.reduce((n, i) => n + i.qty, 0);
  $('#cartCount').textContent = count;
  $('#wishCount').textContent = state.wishlist.length;
}

function toast(message, type = 'info') {
  const wrap = $('#toasts');
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  el.textContent = message;
  wrap.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 450);
  }, 2800);
}

/* ---------- 5. Collections (Shop / Men / Women) ---------- */
const COLLECTIONS = {
  shop: { gender: null, ready: false },
  men: { gender: 'men', ready: false },
  women: { gender: 'women', ready: false }
};
const filters = {};

function collectionBase(key) {
  const g = COLLECTIONS[key].gender;
  return PRODUCTS.filter((p) => !g || p.gender === g || p.gender === 'unisex');
}

function baseCategories(key) {
  return [...new Set(collectionBase(key).map((p) => p.cat))].sort();
}

function filterProducts(list, { q = '', cat = 'all', sort = 'featured', max = Infinity }) {
  const term = q.trim().toLowerCase();
  const out = list.filter((p) =>
    (cat === 'all' || p.cat === cat) &&
    curr(p) <= max &&
    (!term || `${p.name} ${p.cat} ${p.desc}`.toLowerCase().includes(term))
  );
  const sorters = {
    low: (a, b) => curr(a) - curr(b),
    high: (a, b) => curr(b) - curr(a),
    name: (a, b) => a.name.localeCompare(b.name),
    new: (a, b) => (b.tag === 'New') - (a.tag === 'New'),
    featured: (a, b) => (b.trending === true) - (a.trending === true)
  };
  return sorters[sort] ? out.sort(sorters[sort]) : out;
}

function initCollection(key) {
  const meta = COLLECTIONS[key];
  if (meta.ready) return;
  meta.ready = true;

  const base = collectionBase(key);
  const maxPrice = Math.ceil(Math.max(...base.map(curr)) / 500) * 500;
  const select = $(`#${key}Cat`);
  const range = $(`#${key}Price`);

  select.innerHTML = '<option value="all">All categories</option>' +
    baseCategories(key).map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
  range.max = maxPrice;
  filters[key] = { q: '', cat: 'all', sort: 'featured', max: maxPrice };

  $(`#${key}Search`).addEventListener('input', (e) => { filters[key].q = e.target.value; renderCollection(key); });
  select.addEventListener('change', (e) => { filters[key].cat = e.target.value; renderCollection(key); });
  $(`#${key}Sort`).addEventListener('change', (e) => { filters[key].sort = e.target.value; renderCollection(key); });
  range.addEventListener('input', (e) => {
    filters[key].max = +e.target.value;
    syncControls(key);
    renderCollection(key);
  });
  $(`#${key}Reset`).addEventListener('click', () => {
    filters[key] = { q: '', cat: 'all', sort: 'featured', max: maxPrice };
    syncControls(key);
    renderCollection(key);
  });
}

function setCategory(key, cat) {
  const valid = cat === 'all' || baseCategories(key).includes(cat);
  filters[key].cat = valid ? cat : 'all';
}

function syncControls(key) {
  const f = filters[key];
  const range = $(`#${key}Price`);
  $(`#${key}Search`).value = f.q;
  $(`#${key}Cat`).value = f.cat;
  $(`#${key}Sort`).value = f.sort;
  range.value = Math.min(f.max, +range.max);
  $(`#${key}PriceOut`).textContent = `· up to ${inr(+range.value)}`;
}

function renderCollection(key) {
  const list = filterProducts(collectionBase(key), filters[key]);
  const grid = $(`#${key}Grid`);
  grid.innerHTML = list.map(productCard).join('');
  grid.hidden = list.length === 0;
  $(`#${key}Empty`).hidden = list.length > 0;
  $(`#${key}Count`).textContent = `${list.length} ${list.length === 1 ? 'piece' : 'pieces'}`;
  observeReveals();
}

/* ---------- 6. Home ---------- */
function renderHome() {
  $('#trendingGrid').innerHTML = PRODUCTS.filter((p) => p.trending).slice(0, 8).map(productCard).join('');
  observeReveals();
}

/* ---------- 7. Product details ---------- */
let pdp = null;

function renderProduct(id) {
  const root = $('#productView');
  const p = byId(id);
  if (!p) {
    pdp = null;
    root.innerHTML = `<div class="empty-state"><h3>Piece not found</h3><p>This item is no longer in the demo collection.</p><a class="btn btn-primary" href="#/shop">Back to shop</a></div>`;
    return;
  }

  pdp = { id, size: null, color: p.colors[0][0], qty: 1 };
  const status = stockStatus(p.stock);
  const wished = state.wishlist.includes(p.id);
  const crumb = p.gender === 'women' ? 'women' : p.gender === 'men' ? 'men' : 'shop';
  const onSale = p.sale !== null;

  root.innerHTML = `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="#/home">Home</a> / <a href="#/${crumb}">${crumb === 'shop' ? 'Shop All' : genderLabel(p.gender) + "'s"}</a> / <span>${esc(p.name)}</span>
    </nav>
    <div class="pdp-grid">
      <div class="pdp-gallery">
        <div class="zoom-frame" id="zoomFrame">
          <img id="pdpMain" src="${p.images[0]}" alt="${esc(p.name)}, main view" />
        </div>
        <div class="thumbs" role="group" aria-label="Product views">
          ${p.images.map((src, i) => `
            <button class="thumb${i === 0 ? ' is-active' : ''}" type="button" data-action="pdp-img" data-index="${i}" aria-label="Show view ${i + 1}">
              <img src="${src}" alt="" loading="lazy" />
            </button>`).join('')}
        </div>
      </div>

      <div class="pdp-info reveal">
        <p class="eyebrow">${esc(p.cat)} · ${genderLabel(p.gender)}</p>
        <h1 class="pdp-title">${esc(p.name)}</h1>
        <p class="price pdp-price">
          <span class="price-now">${inr(curr(p))}</span>${onSale ? `<span class="price-was">${inr(p.price)}</span>` : ''}
        </p>
        <p class="stock ${status.cls}"><span class="dot" aria-hidden="true"></span>${status.text} <small>(demo indicator)</small></p>
        <p class="pdp-desc">${esc(p.desc)}</p>

        <div class="opt-group">
          <div class="opt-head"><span>Colour</span><strong id="pdpColorName">${esc(p.colors[0][0])}</strong></div>
          <div class="opts" role="group" aria-label="Colour">
            ${p.colors.map(([name, hex], i) => `
              <button class="swatch${i === 0 ? ' is-active' : ''}" type="button" style="--sw:${hex}"
                data-action="pdp-color" data-color="${esc(name)}" aria-label="${esc(name)}"
                aria-pressed="${i === 0}"></button>`).join('')}
          </div>
        </div>

        <div class="opt-group" id="sizeGroup">
          <div class="opt-head"><span>Size</span><button class="link-btn" type="button" data-action="size-guide">Size guide</button></div>
          <div class="opts" role="group" aria-label="Size">
            ${SIZES[p.sizeType].map((s) => `
              <button class="opt" type="button" data-action="pdp-size" data-size="${esc(s)}" aria-pressed="false">${esc(s)}</button>`).join('')}
          </div>
          <p class="form-msg" id="sizeMsg" aria-live="polite"></p>
        </div>

        <div class="pdp-actions">
          <div class="qty" role="group" aria-label="Quantity">
            <button type="button" data-action="pdp-qty" data-delta="-1" aria-label="Decrease quantity">−</button>
            <output id="pdpQty" aria-live="polite">1</output>
            <button type="button" data-action="pdp-qty" data-delta="1" aria-label="Increase quantity">+</button>
          </div>
          <button class="btn btn-primary" type="button" data-action="pdp-add" ${p.stock === 0 ? 'disabled' : ''}>
            ${p.stock === 0 ? 'Out of stock' : 'Add to bag'}
          </button>
          <button class="wish-lg${wished ? ' is-active' : ''}" type="button" data-action="wish" data-id="${p.id}"
            aria-pressed="${wished}" aria-label="${wished ? 'Remove from' : 'Save to'} wishlist">${wished ? '♥' : '♡'}</button>
        </div>

        <ul class="pdp-points">
          <li>Demo storefront: no real orders are placed.</li>
          <li>Sizes and stock are sample data for demonstration.</li>
        </ul>
      </div>
    </div>`;

  bindZoom($('#zoomFrame'));
  observeReveals();
}

function bindZoom(frame) {
  if (!frame || reduceMotion) return;
  frame.addEventListener('mousemove', (e) => {
    const r = frame.getBoundingClientRect();
    frame.style.setProperty('--ox', `${((e.clientX - r.left) / r.width) * 100}%`);
    frame.style.setProperty('--oy', `${((e.clientY - r.top) / r.height) * 100}%`);
    frame.classList.add('zoomed');
  });
  frame.addEventListener('mouseleave', () => frame.classList.remove('zoomed'));
}

function setPdpImage(i) {
  const p = byId(pdp && pdp.id);
  if (!p) return;
  $('#pdpMain').src = p.images[i];
  $$('.thumb').forEach((t, n) => t.classList.toggle('is-active', n === i));
}

function setPdpColor(name) {
  pdp.color = name;
  $('#pdpColorName').textContent = name;
  $$('.swatch').forEach((s) => {
    const on = s.dataset.color === name;
    s.classList.toggle('is-active', on);
    s.setAttribute('aria-pressed', String(on));
  });
}

function setPdpSize(size) {
  pdp.size = size;
  $$('[data-action="pdp-size"]').forEach((b) => {
    const on = b.dataset.size === size;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-pressed', String(on));
  });
  setMsg($('#sizeMsg'), '');
}

function changePdpQty(delta) {
  const p = byId(pdp.id);
  const max = Math.min(CONFIG.MAX_QTY, Math.max(1, p.stock));
  const next = clamp(pdp.qty + delta, 1, max);
  if (next === pdp.qty && delta > 0) toast(`Maximum ${max} per order (demo).`, 'info');
  pdp.qty = next;
  $('#pdpQty').textContent = next;
}

function addFromPdp() {
  if (!pdp) return;
  if (!pdp.size) {
    setMsg($('#sizeMsg'), 'Please select a size to continue.', 'error');
    const group = $('#sizeGroup');
    group.classList.remove('shake');
    void group.offsetWidth;
    group.classList.add('shake');
    return;
  }
  const added = addToCart(pdp.id, pdp.size, pdp.color, pdp.qty);
  if (added) {
    pdp.qty = 1;
    $('#pdpQty').textContent = 1;
  }
}

function openSizeGuide() {
  openModal('Size guide', `
    <p>Sizes are indicative for this demo. Fit varies by silhouette, so choose the size that matches your best-fitting garment.</p>
    <p class="muted">Shoes use UK sizing. Accessories are one size.</p>`);
}

/* ---------- 8. Wishlist ---------- */
function toggleWish(id) {
  const p = byId(id);
  if (!p) return;
  const on = state.wishlist.includes(id);
  state.wishlist = on ? state.wishlist.filter((x) => x !== id) : [...state.wishlist, id];
  saveWish();
  updateBadges();
  $$(`[data-action="wish"][data-id="${id}"]`).forEach(paintWish);
  toast(on ? `${p.name} removed from wishlist.` : `${p.name} saved to wishlist.`, on ? 'info' : 'success');
}

function removeWish(id) {
  state.wishlist = state.wishlist.filter((x) => x !== id);
  saveWish();
  updateBadges();
  renderWishlist();
}

function moveWishToBag(id) {
  const p = byId(id);
  if (!p) return;
  const sel = document.getElementById(`wsz-${id}`);
  const size = sel ? sel.value : null;
  if (addToCart(p.id, size, p.colors[0][0], 1)) {
    state.wishlist = state.wishlist.filter((x) => x !== id);
    saveWish();
    updateBadges();
    renderWishlist();
  }
}

function renderWishlist() {
  const items = state.wishlist.map(byId).filter(Boolean);
  $('#wishSummary').textContent = `${items.length} saved ${items.length === 1 ? 'piece' : 'pieces'}`;
  const grid = $('#wishGrid');
  grid.innerHTML = items.map((p) => `
    <article class="product-card reveal">
      <a class="pc-media" href="#/product/${p.id}" aria-label="View ${esc(p.name)}">
        <img src="${p.images[0]}" alt="${esc(p.name)}, ${p.cat.toLowerCase()}" loading="lazy" />
        ${p.stock === 0 ? '<span class="pc-badge pc-out">Sold out</span>' : ''}
      </a>
      <div class="pc-body">
        <div class="pc-info">
          <p class="pc-cat">${esc(p.cat)}</p>
          <h3 class="pc-name"><a href="#/product/${p.id}">${esc(p.name)}</a></h3>
          <p class="price"><span class="price-now">${inr(curr(p))}</span></p>
        </div>
      </div>
      <div class="wish-actions">
        <label class="sr-only" for="wsz-${p.id}">Size for ${esc(p.name)}</label>
        <select id="wsz-${p.id}">
          ${SIZES[p.sizeType].map((s) => `<option>${esc(s)}</option>`).join('')}
        </select>
        <button class="btn btn-primary btn-block" type="button" data-action="wish-move" data-id="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>
          ${p.stock === 0 ? 'Out of stock' : 'Move to bag'}
        </button>
        <button class="link-btn" type="button" data-action="wish-remove" data-id="${p.id}">Remove</button>
      </div>
    </article>`).join('');
  grid.hidden = items.length === 0;
  $('#wishEmpty').hidden = items.length > 0;
  observeReveals();
}

/* ---------- 9. Cart & checkout demo ---------- */
function addToCart(id, size, color, qty = 1) {
  const p = byId(id);
  if (!p) return false;
  if (p.stock === 0) { toast('This piece is currently out of stock (demo).', 'error'); return false; }

  const existing = state.cart.find((i) => i.id === id && i.size === size && i.color === color);
  const have = existing ? existing.qty : 0;
  const allowed = Math.min(CONFIG.MAX_QTY, p.stock) - have;
  if (allowed <= 0) { toast(`Only ${p.stock} available in stock (demo).`, 'error'); return false; }

  const add = Math.min(qty, allowed);
  if (existing) existing.qty += add;
  else state.cart.push({ id, size, color, qty: add });

  saveCart();
  updateBadges();
  bump($('#cartCount'));
  toast(`${p.name} added to your bag.`, 'success');
  return true;
}

function changeCartQty(index, delta) {
  const item = state.cart[index];
  if (!item) return;
  const p = byId(item.id);
  const max = Math.min(CONFIG.MAX_QTY, p.stock);
  const next = clamp(item.qty + delta, 1, Math.max(1, max));
  if (next === item.qty && delta > 0) { toast(`Maximum ${max} available (demo).`, 'error'); return; }
  item.qty = next;
  saveCart();
  updateBadges();
  renderCart();
}

function removeCartItem(index) {
  const [removed] = state.cart.splice(index, 1);
  if (!removed) return;
  saveCart();
  updateBadges();
  renderCart();
  toast(`${byId(removed.id).name} removed from your bag.`, 'info');
}

function totals() {
  const subtotal = state.cart.reduce((s, i) => s + curr(byId(i.id)) * i.qty, 0);
  const rate = state.discount ? CONFIG.DISCOUNT_CODES[state.discount].rate : 0;
  const discount = Math.round(subtotal * rate);
  const afterDiscount = subtotal - discount;
  const shipping = afterDiscount === 0 || afterDiscount >= CONFIG.FREE_SHIPPING_ABOVE ? 0 : CONFIG.SHIPPING_FEE;
  return { subtotal, discount, shipping, total: afterDiscount + shipping };
}

function renderCart() {
  const hasItems = state.cart.length > 0;
  $('#cartEmpty').hidden = hasItems;
  $('#cartLayout').hidden = !hasItems;
  if (!hasItems) return;

  $('#cartList').innerHTML = state.cart.map((it, i) => {
    const p = byId(it.id);
    const meta = [it.size && `Size ${it.size}`, it.color].filter(Boolean).map(esc).join(' · ');
    return `
    <li class="cart-item">
      <a href="#/product/${p.id}"><img src="${p.images[0]}" alt="${esc(p.name)}" loading="lazy" /></a>
      <div class="cart-info">
        <h3 class="cart-name"><a href="#/product/${p.id}">${esc(p.name)}</a></h3>
        <p class="cart-meta">${meta}</p>
        <p class="price"><span class="price-now">${inr(curr(p))}</span></p>
        <div class="qty" role="group" aria-label="Quantity for ${esc(p.name)}">
          <button type="button" data-action="cart-qty" data-index="${i}" data-delta="-1" aria-label="Decrease quantity">−</button>
          <output>${it.qty}</output>
          <button type="button" data-action="cart-qty" data-index="${i}" data-delta="1" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <div class="cart-right">
        <p class="price-now">${inr(curr(p) * it.qty)}</p>
        <button class="link-btn" type="button" data-action="cart-remove" data-index="${i}">Remove</button>
      </div>
    </li>`;
  }).join('');

  const t = totals();
  $('#sumSubtotal').textContent = inr(t.subtotal);
  $('#sumDiscountRow').hidden = t.discount === 0;
  $('#sumDiscountLabel').textContent = state.discount ? `Discount (${state.discount})` : 'Discount';
  $('#sumDiscount').textContent = `− ${inr(t.discount)}`;
  $('#sumShipping').textContent = t.shipping === 0 ? 'Complimentary' : inr(t.shipping);
  $('#sumTotal').textContent = inr(t.total);
  $('#discountRemove').hidden = !state.discount;
  observeReveals();
}

function applyDiscount() {
  const input = $('#discountInput');
  const msg = $('#discountMsg');
  const code = input.value.trim().toUpperCase();
  if (!code) { setMsg(msg, 'Enter a code to apply.', 'error'); return; }
  if (!CONFIG.DISCOUNT_CODES[code]) {
    setMsg(msg, 'That code is not recognised. Try LUXE10 or WELCOME15 (demo).', 'error');
    return;
  }
  state.discount = code;
  store.set('mn.discount', code);
  setMsg(msg, `${code} applied: ${CONFIG.DISCOUNT_CODES[code].label}.`, 'success');
  renderCart();
  toast(`Discount ${code} applied.`, 'success');
}

function removeDiscount() {
  state.discount = null;
  store.set('mn.discount', null);
  setMsg($('#discountMsg'), '');
  renderCart();
  toast('Discount removed.', 'info');
}

function openCheckout() {
  if (!state.cart.length) { toast('Your bag is empty.', 'error'); return; }
  const t = totals();
  const lines = state.cart.map((it) => {
    const p = byId(it.id);
    return `<li><span>${esc(p.name)} × ${it.qty}</span><span>${inr(curr(p) * it.qty)}</span></li>`;
  }).join('');
  openModal('Demo checkout', `
    <p class="notice">This is a <strong>demo checkout</strong>. No payment is taken and no order is placed.</p>
    <ul class="modal-list">${lines}</ul>
    <div class="summary-row total"><span>Estimated total</span><span>${inr(t.total)}</span></div>
    <div class="modal-actions">
      <button class="btn btn-outline" type="button" data-action="modal-close">Cancel</button>
      <button class="btn btn-primary" type="button" data-action="demo-confirm">Confirm demo order</button>
    </div>`);
}

function confirmDemoOrder() {
  const ref = 'DEMO-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  state.cart = [];
  state.discount = null;
  saveCart();
  store.set('mn.discount', null);
  updateBadges();
  renderCart();
  openModal('Demo order complete', `
    <p>Reference: <code>${ref}</code></p>
    <p class="muted">Nothing was charged. This is a front-end demonstration only.</p>
    <div class="modal-actions"><a class="btn btn-primary" href="#/shop" data-action="modal-close">Continue shopping</a></div>`);
}

/* ---------- 10. Search overlay ---------- */
function renderSearch(q) {
  const term = q.trim().toLowerCase();
  const list = term
    ? PRODUCTS.filter((p) => `${p.name} ${p.cat} ${p.gender}`.toLowerCase().includes(term)).slice(0, 6)
    : PRODUCTS.filter((p) => p.trending).slice(0, 4);
  const results = $('#searchResults');
  if (!list.length) {
    results.innerHTML = `<li class="search-label">No pieces match "${esc(q.trim())}". Try “coat” or “silk”.</li>`;
    return;
  }
  const label = term ? `Results for “${esc(q.trim())}”` : 'Trending now';
  results.innerHTML = `<li class="search-label">${label}</li>` + list.map((p) => `
    <li>
      <a href="#/product/${p.id}">
        <img src="${p.images[0]}" alt="" loading="lazy" />
        <span><strong>${esc(p.name)}</strong><small>${esc(p.cat)} · ${inr(curr(p))}</small></span>
      </a>
    </li>`).join('');
}

function openSearch() {
  const ov = $('#searchOverlay');
  const input = $('#searchInput');
  ov.classList.add('open');
  ov.setAttribute('aria-hidden', 'false');
  input.value = '';
  renderSearch('');
  setTimeout(() => input.focus(), 80);
}

function closeSearch() {
  const ov = $('#searchOverlay');
  if (!ov.classList.contains('open')) return;
  ov.classList.remove('open');
  ov.setAttribute('aria-hidden', 'true');
}

/* ---------- 11. Overlays & modal ---------- */
function toggleMenu() {
  const menu = $('#mobileMenu');
  const open = !menu.classList.contains('open');
  menu.classList.toggle('open', open);
  menu.setAttribute('aria-hidden', String(!open));
  $('#menuToggle').setAttribute('aria-expanded', String(open));
  $('#menuToggle').setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  $('#menuToggle').textContent = open ? '✕' : '☰';
}

function closeMenu() {
  const menu = $('#mobileMenu');
  if (!menu.classList.contains('open')) return;
  toggleMenu();
}

function openModal(title, html) {
  $('#modalBody').innerHTML = `<h3 id="modalTitle">${title}</h3>${html}`;
  const modal = $('#modal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  const first = $('#modalBody').querySelector('button, a');
  if (first) setTimeout(() => first.focus(), 60);
}

function closeModal() {
  const modal = $('#modal');
  if (!modal.classList.contains('open')) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function closeOverlays() {
  closeSearch();
  closeMenu();
  closeModal();
}

/* ---------- 12. Theme ---------- */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = $('#themeToggle');
  const dark = theme === 'dark';
  btn.textContent = dark ? '☀' : '☾';
  btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.body.classList.add('theme-switching');
  const btn = $('#themeToggle');
  btn.classList.remove('spin');
  void btn.offsetWidth;
  btn.classList.add('spin');
  applyTheme(next);
  store.set('mn.theme', next);
  setTimeout(() => {
    document.body.classList.remove('theme-switching');
    btn.classList.remove('spin');
  }, 700);
}

function initTheme() {
  const saved = store.get('mn.theme', null);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));
}

/* ---------- 13. Forms ---------- */
function initForms() {
  const contact = $('#contactForm');
  if (contact) {
    contact.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = contact.querySelector('.form-msg');
      const val = (n) => contact.querySelector(`[name="${n}"]`).value.trim();
      if (!val('name')) return setMsg(msg, 'Please enter your name.', 'error');
      if (!isEmail(val('email'))) return setMsg(msg, 'Please enter a valid email address.', 'error');
      if (val('message').length < 10) return setMsg(msg, 'Please share a few more details (10 characters or more).', 'error');
      contact.reset();
      setMsg(msg, 'Thank you. This demo form does not send messages. A live store would route your enquiry to support.', 'success');
    });
  }

  $$('.newsletter-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const msg = form.querySelector('.form-msg');
      if (!isEmail(input.value.trim())) return setMsg(msg, 'Please enter a valid email address.', 'error');
      form.reset();
      setMsg(msg, 'Subscribed (demo). No email has been sent.', 'success');
    });
  });
}

/* ---------- 14. Motion ---------- */
let revealObserver = null;

function observeReveals() {
  const pending = $$('.reveal:not(.in)');
  if (!pending.length) return;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    pending.forEach((el) => el.classList.add('in'));
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          revealObserver.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  }
  pending.forEach((el) => revealObserver.observe(el));
}

function initMotion() {
  let ticking = false;
  const hero = $('.hero-media');
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      $('#siteHeader').classList.toggle('scrolled', y > 20);
      if (hero && !reduceMotion) {
        hero.style.transform = `translate3d(0, ${Math.min(y, 900) * 0.22}px, 0) scale(1.08)`;
      }
      ticking = false;
    });
  }, { passive: true });
}

function initVideo() {
  const video = $('#heroVideo');
  if (!video) return;
  video.addEventListener('error', () => $('.hero').classList.add('video-failed'));
  video.src = CONFIG.VIDEO_URL;
  if (reduceMotion) {
    video.removeAttribute('autoplay');
    video.pause();
    return;
  }
  const playing = video.play();
  if (playing && typeof playing.catch === 'function') {
    playing.catch(() => { /* autoplay blocked: poster/fallback remains */ });
  }
}

/* ---------- 15. Router & init ---------- */
const PAGES = ['home', 'shop', 'men', 'women', 'product', 'wishlist', 'cart', 'about'];
const TITLES = {
  home: 'Home', shop: 'Shop All', men: "Men's Collection", women: "Women's Collection",
  product: 'Product', wishlist: 'Wishlist', cart: 'Bag & Checkout', about: 'About & Contact'
};

function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path = '', query = ''] = raw.split('?');
  const [page = 'home', id = null] = path.split('/');
  return {
    page: PAGES.includes(page) ? page : 'home',
    id: id ? decodeURIComponent(id) : null,
    params: new URLSearchParams(query)
  };
}

function navigate() {
  const { page, id, params } = parseRoute();

  $$('.page').forEach((s) => s.classList.toggle('active', s.id === `page-${page}`));

  switch (page) {
    case 'home':
      renderHome();
      break;
    case 'shop':
    case 'men':
    case 'women':
      initCollection(page);
      if (params.has('cat')) setCategory(page, params.get('cat'));
      syncControls(page);
      renderCollection(page);
      break;
    case 'product':
      renderProduct(id);
      break;
    case 'wishlist':
      renderWishlist();
      break;
    case 'cart':
      renderCart();
      break;
    default:
      break;
  }

  $$('[data-route]').forEach((a) => a.classList.toggle('is-current', a.dataset.route === page));
  document.title = `${TITLES[page]} · MAISON NOIR`;
  closeOverlays();
  window.scrollTo(0, 0);
  observeReveals();
}

function bindGlobalEvents() {
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const { action, id, index, delta, size, color } = el.dataset;
    switch (action) {
      case 'menu-toggle': toggleMenu(); break;
      case 'search-open': openSearch(); break;
      case 'search-close': closeSearch(); break;
      case 'theme-toggle': toggleTheme(); break;
      case 'wish': toggleWish(id); break;
      case 'wish-move': moveWishToBag(id); break;
      case 'wish-remove': removeWish(id); break;
      case 'cart-qty': changeCartQty(+index, +delta); break;
      case 'cart-remove': removeCartItem(+index); break;
      case 'apply-discount': applyDiscount(); break;
      case 'remove-discount': removeDiscount(); break;
      case 'checkout': openCheckout(); break;
      case 'demo-confirm': confirmDemoOrder(); break;
      case 'modal-close': closeModal(); break;
      case 'pdp-img': setPdpImage(+index); break;
      case 'pdp-color': setPdpColor(color); break;
      case 'pdp-size': setPdpSize(size); break;
      case 'pdp-qty': changePdpQty(+delta); break;
      case 'pdp-add': addFromPdp(); break;
      case 'size-guide': openSizeGuide(); break;
      default: break;
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeOverlays();
  });

  $('#searchInput').addEventListener('input', (e) => renderSearch(e.target.value));
  $('#searchOverlay').addEventListener('click', (e) => { if (e.target.id === 'searchOverlay') closeSearch(); });
  $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal(); });

  // Fallback for images that fail to load: swap in an elegant placeholder once.
  document.addEventListener('error', (e) => {
    const t = e.target;
    if (t && t.tagName === 'IMG' && t.dataset.fb !== '1') {
      t.dataset.fb = '1';
      t.src = CONFIG.FALLBACK_IMG;
    }
  }, true);
}

function init() {
  initTheme();
  updateBadges();
  initVideo();
  initMotion();
  initForms();
  bindGlobalEvents();
  window.addEventListener('hashchange', navigate);
  navigate();
}

init();
