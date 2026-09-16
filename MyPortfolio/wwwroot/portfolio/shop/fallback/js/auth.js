// Гео
function getGeo() {
    return localStorage.getItem('geo') || null;
}
function setGeo(city) {
    localStorage.setItem('geo', city);
}

// Пользователь
function getUser() {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
}
function setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}
function logout() {
    localStorage.removeItem('user');
    location.reload();
}
function isLoggedIn() {
    return getUser() !== null;
}

// Модалка гео
function showGeoModal() {
    if (getGeo()) return;
    const modal = document.createElement('div');
    modal.id = 'geoModal';
    modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div class="text-center mb-6">
                <div class="text-5xl mb-3">📍</div>
                <h2 class="text-2xl font-black">Откуда вы?</h2>
                <p class="text-gray-500 mt-2 text-sm">Покажем цены и доставку для вашего города</p>
            </div>
            <div class="space-y-3">
                <button onclick="selectGeo('Москва')" class="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-amber-500 transition">Москва</button>
                <button onclick="selectGeo('Санкт-Петербург')" class="w-full py-4 bg-gray-100 font-bold rounded-xl hover:bg-gray-200 transition">Санкт-Петербург</button>
                <button onclick="selectGeo('Другой город')" class="w-full py-4 bg-gray-100 font-bold rounded-xl hover:bg-gray-200 transition">Другой город</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}
function selectGeo(city) {
    setGeo(city);
    document.getElementById('geoModal').remove();
    updateGeoDisplay();
}
function updateGeoDisplay() {
    const geo = getGeo();
    document.querySelectorAll('#geoDisplay').forEach(el => {
        el.textContent = geo ? `📍 ${geo}` : '📍 Выбрать город';
    });
}

// Модалка входа
function showAuthModal(tab = 'login') {
    const existing = document.getElementById('authModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'authModal';
    modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
            <div class="flex border-b">
                <button onclick="switchAuthTab('login')" id="tabLogin" class="flex-1 py-4 font-bold transition">Вход</button>
                <button onclick="switchAuthTab('register')" id="tabRegister" class="flex-1 py-4 font-bold transition">Регистрация</button>
                <button onclick="closeAuthModal()" class="px-4 text-gray-400 hover:text-gray-900">✕</button>
            </div>
            <div id="authContent" class="p-8"></div>
        </div>
    `;
    document.body.appendChild(modal);
    switchAuthTab(tab);
}
function closeAuthModal() {
    const m = document.getElementById('authModal');
    if (m) m.remove();
}
function switchAuthTab(tab) {
    const login = document.getElementById('tabLogin');
    const register = document.getElementById('tabRegister');
    const content = document.getElementById('authContent');

    if (tab === 'login') {
        login.className = 'flex-1 py-4 font-bold transition bg-gray-900 text-white';
        register.className = 'flex-1 py-4 font-bold transition text-gray-500 hover:text-gray-900';
        content.innerHTML = `
            <h3 class="text-xl font-black mb-1">Быстрый вход</h3>
            <p class="text-sm text-gray-500 mb-6">Введите телефон — пришлём код</p>
            <input type="tel" id="loginPhone" placeholder="+7 (___) ___-__-__" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 outline-none mb-3">
            <button onclick="sendCode()" class="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-amber-500 transition">Получить код</button>
            <div id="codeBlock" class="hidden mt-4">
                <input type="text" id="loginCode" placeholder="Код из SMS (1234)" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 outline-none mb-3">
                <button onclick="verifyCode()" class="w-full py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition">Войти</button>
                <p class="text-xs text-gray-400 text-center mt-2">Демо-код: 1234</p>
            </div>
        `;
    } else {
        register.className = 'flex-1 py-4 font-bold transition bg-gray-900 text-white';
        login.className = 'flex-1 py-4 font-bold transition text-gray-500 hover:text-gray-900';
        content.innerHTML = `
            <h3 class="text-xl font-black mb-1">Регистрация</h3>
            <p class="text-sm text-gray-500 mb-6">Заполните данные</p>
            <div class="space-y-3">
                <input type="text" id="regName" placeholder="Имя" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 outline-none">
                <input type="text" id="regSurname" placeholder="Фамилия" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 outline-none">
                <input type="tel" id="regPhone" placeholder="Телефон" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 outline-none">
                <input type="email" id="regEmail" placeholder="Email" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 outline-none">
                <label class="flex items-start gap-2 text-xs text-gray-500">
                    <input type="checkbox" id="regAgree" class="mt-0.5">
                    <span>Согласен с обработкой персональных данных</span>
                </label>
            </div>
            <button onclick="register()" class="w-full mt-4 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-amber-500 transition">Зарегистрироваться</button>
        `;
    }
}
function sendCode() {
    const phone = document.getElementById('loginPhone').value;
    if (!phone || phone.length < 10) {
        showToast('Введите корректный телефон');
        return;
    }
    document.getElementById('codeBlock').classList.remove('hidden');
    showToast('Код отправлен (демо: 1234)');
}
function verifyCode() {
    const code = document.getElementById('loginCode').value;
    if (code !== '1234') {
        showToast('Неверный код. Попробуйте 1234');
        return;
    }
    const phone = document.getElementById('loginPhone').value;
    setUser({ name: 'Гость', surname: '', phone, email: '' });
    closeAuthModal();
    showToast('✓ Добро пожаловать!');
    setTimeout(() => location.reload(), 500);
}
function register() {
    const name = document.getElementById('regName').value.trim();
    const surname = document.getElementById('regSurname').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const agree = document.getElementById('regAgree').checked;

    if (!name || !phone) { showToast('Заполните имя и телефон'); return; }
    if (!agree) { showToast('Согласитесь с обработкой данных'); return; }

    setUser({ name, surname, phone, email });
    closeAuthModal();
    showToast(`✓ Добро пожаловать, ${name}!`);
    setTimeout(() => location.reload(), 500);
}

// Обновление шапки
function updateHeader() {
    const user = getUser();
    document.querySelectorAll('#authButton').forEach(el => {
        if (user) {
            el.innerHTML = `
                <a href="profile.html" class="flex items-center gap-2 font-semibold hover:text-amber-500 transition">
                    <span class="w-9 h-9 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm">${user.name[0].toUpperCase()}</span>
                    <span class="hidden md:inline">${user.name}</span>
                </a>
            `;
        } else {
            el.innerHTML = `<button onclick="showAuthModal('login')" class="px-5 py-2.5 bg-gray-900 text-white font-bold rounded-full hover:bg-amber-500 transition text-sm">Войти</button>`;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    showGeoModal();
    updateGeoDisplay();
    updateHeader();
});