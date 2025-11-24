let currentLang = 'tr';
let menuData = [];
let activeCategory = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadMenuData();
    setupEventListeners();
    updateLanguage(currentLang);
});

async function loadMenuData() {
    try {
        const response = await fetch('menu-data.json');
        menuData = await response.json();
        renderCategories();
        renderMenu();
    } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error);
        document.getElementById('menu-container').innerHTML = '<p style="text-align:center; color:red;">Menü yüklenemedi.</p>';
    }
}

function setupEventListeners() {
    // Language Switcher
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = e.target.dataset.lang;
            if (lang !== currentLang) {
                currentLang = lang;
                updateLanguage(lang);

                // Update active state of buttons
                document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            }
        });
    });

    // Search
    document.getElementById('search-input').addEventListener('input', (e) => {
        renderMenu(e.target.value);
    });
}

function updateLanguage(lang) {
    const t = translations[lang];

    // Update static text
    document.getElementById('site-title').textContent = t.title;
    document.getElementById('site-subtitle').textContent = t.subtitle;
    document.getElementById('search-input').placeholder = t.searchPlaceholder;

    // Update RTL/LTR
    if (lang === 'ar') {
        document.body.classList.add('rtl');
    } else {
        document.body.classList.remove('rtl');
    }

    // Re-render categories to update names
    renderCategories();
    // Re-render menu to update category headers if we used them, or just to refresh
    renderMenu(document.getElementById('search-input').value);
}

function renderCategories() {
    const categoryList = document.getElementById('category-list');
    const t = translations[currentLang];

    // "All" button
    let html = `<li class="category-item ${activeCategory === 'all' ? 'active' : ''}" onclick="filterCategory('all')">${t.allCategories}</li>`;

    menuData.forEach(cat => {
        // Get translated category name or fallback to original
        const displayName = t.categories[cat.categoryName] || cat.categoryName;
        const isActive = activeCategory === cat.categoryName ? 'active' : '';

        html += `<li class="category-item ${isActive}" onclick="filterCategory('${cat.categoryName}')">${displayName}</li>`;
    });

    categoryList.innerHTML = html;
}

function filterCategory(categoryName) {
    activeCategory = categoryName;
    renderCategories(); // To update active class
    renderMenu(document.getElementById('search-input').value);
}

function renderMenu(searchTerm = '') {
    const container = document.getElementById('menu-container');
    const t = translations[currentLang];
    let html = '';

    const term = searchTerm.toLowerCase();

    menuData.forEach(cat => {
        // Filter by category
        if (activeCategory !== 'all' && cat.categoryName !== activeCategory) return;

        // Filter items by search term
        const filteredItems = cat.items.filter(item =>
            item.name.toLowerCase().includes(term)
        );

        if (filteredItems.length > 0) {
            filteredItems.forEach(item => {
                html += `
                    <div class="menu-card">
                        <div class="item-info">
                            <h3>${item.name}</h3>
                            <span class="item-desc">${t.categories[cat.categoryName] || cat.categoryName}</span>
                        </div>
                        <div class="item-price">
                            ${item.price} <span style="font-size:0.6em">${t.priceUnit}</span>
                            <span class="item-unit">${item.unit}</span>
                        </div>
                    </div>
                `;
            });
        }
    });

    if (html === '') {
        html = '<p style="text-align:center; width:100%; color: var(--text-dim);">Ürün bulunamadı.</p>';
    }

    container.innerHTML = html;
}

// Make filterCategory global so it can be called from HTML onclick
window.filterCategory = filterCategory;
