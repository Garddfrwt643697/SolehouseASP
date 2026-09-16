let PRODUCTS = [];

function assignSeasons(products) {
    return products.map((p, i) => {
        // Детерминированно раскидываем сезоны по id
        const seasons = ['autumn', 'autumn', 'autumn', 'winter', 'summer', 'spring'];
        const season = seasons[p.id % seasons.length];
        return { ...p, season };
    });
}

async function loadProducts() {
    if (PRODUCTS.length > 0) return PRODUCTS;
    try {
        const res = await fetch('/data/products.json');
        const data = await res.json();
        PRODUCTS = assignSeasons(data.products || []);
        return PRODUCTS;
    } catch (e) {
        console.error('Ошибка загрузки товаров:', e);
        return [];
    }
}

// Корзина
function getCart() { return JSON.parse(localStorage.getItem('cart') || '[]'); }
function saveCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); updateCartCount(); }

function addToCart(id) {
    if (!isLoggedIn()) {
        showToast('🔒 Войдите, чтобы добавить в корзину');
        showAuthModal('login');
        return;
    }
    const cart = getCart();
    const existing = cart.find(i => i.id === id);
    if (existing) existing.qty++;
    else cart.push({ id, qty: 1 });
    saveCart(cart);
    showToast('✓ Товар добавлен в корзину');
}
function removeFromCart(id) {
    saveCart(getCart().filter(i => i.id !== id));
}
function updateCartCount() {
    const count = getCart().reduce((s, i) => s + i.qty, 0);
    document.querySelectorAll('#cartCount').forEach(el => el.textContent = count);
}

// Избранное
function getFavorites() { return JSON.parse(localStorage.getItem('favorites') || '[]'); }
function saveFavorites(favs) { localStorage.setItem('favorites', JSON.stringify(favs)); updateFavCount(); }

function toggleFavorite(id) {
    if (!isLoggedIn()) {
        showToast('🔒 Войдите, чтобы добавить в избранное');
        showAuthModal('login');
        return;
    }
    const favs = getFavorites();
    const index = favs.indexOf(id);
    if (index > -1) { favs.splice(index, 1); showToast('Удалено из избранного'); }
    else { favs.push(id); showToast('♥ Добавлено в избранное'); }
    saveFavorites(favs);
}
function updateFavCount() {
    document.querySelectorAll('#favCount').forEach(el => el.textContent = getFavorites().length);
}

// Toast
function showToast(text) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#111;color:#fff;padding:14px 28px;border-radius:999px;font-weight:600;z-index:9999;transition:opacity 0.3s;box-shadow:0 8px 24px rgba(0,0,0,0.3);';
        document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.style.opacity = '1';
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => toast.style.opacity = '0', 2000);
}

// Карточка товара
function productCard(p) {
    const favs = getFavorites();
    const isFav = favs.includes(p.id);
    const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

    return `
        <div class="card-hover rounded-2xl overflow-hidden bg-white border border-gray-200 relative flex flex-col">
            ${p.oldPrice ? `<span class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">-${discount}%</span>` : ''}
            <button onclick="event.preventDefault(); toggleFavorite(${p.id}); location.reload();" 
                    class="absolute top-3 right-3 z-10 text-2xl transition ${isFav ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 bg-white/80 backdrop-blur w-9 h-9 rounded-full flex items-center justify-center">
                ${isFav ? '♥' : '♡'}
            </button>
            <a href="product.html?id=${p.id}" class="block">
                <div class="aspect-square product-placeholder">
                    <img src="/img/barbershop.jpg" alt="${p.brand}" class="w-full h-full object-cover">
                </div>
            </a>
            <div class="p-4 flex flex-col flex-1">
                <p class="text-xs text-gray-500 font-semibold">${p.brand}</p>
                <a href="product.html?id=${p.id}" class="block">
                    <h3 class="font-bold text-sm mt-1 hover:text-amber-500 transition line-clamp-1">${p.name}</h3>
                </a>
                <div class="flex items-center gap-1 mt-2 text-xs text-gray-500">
                    <span class="text-amber-500">★</span> ${p.rating} · ${p.reviews}
                </div>
                <div class="mt-3 flex items-center gap-2">
                    <span class="text-lg font-black">${p.price.toLocaleString('ru-RU')} ₽</span>
                    ${p.oldPrice ? `<span class="text-sm text-gray-400 line-through">${p.oldPrice.toLocaleString('ru-RU')} ₽</span>` : ''}
                </div>
                <button onclick="addToCart(${p.id})" class="mt-auto pt-4 w-full py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-amber-500 transition text-sm">
                    Купить
                </button>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateFavCount();
});