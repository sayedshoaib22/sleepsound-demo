// --- STATE MANAGEMENT ---
let customSizeTimeout = null;
let searchTimeout = null;

const state = {
    cart: [],
    isCartOpen: false,
    user: null,
    selectedCategory: null,
    currentProduct: null,
    authModalOpen: false,
    searchQuery: "",

    // UI State
    activeDropdown: null,
    mobileMenuOpen: false,
    currentSlide: 0,
    sidebarOpen: false,
    activeSubFilter: null,
    categoryModalOpen: false,
    categoryModalData: null,
    sizeConverterOpen: false,

    // Product Details Local State
    details: {
        size: 'Single',
        measurement: 'Inches',
        dimensions: '72x30',
        height: '4',
        customLength: '72',
        customWidth: '30',
        zoom: false,
        currentPrice: 0
    }
};

// --- INITIALIZATION ---
function initApp() {
    // 1. Load Cart from LocalStorage
    const savedCart = localStorage.getItem('sleepSoundCart');
    if (savedCart) {
        try {
            state.cart = JSON.parse(savedCart);
        } catch (e) {
            console.error("Failed to parse cart", e);
            state.cart = [];
        }
    }

    // 2. Initial Render
    render();
}

// Helper to persist cart
function saveCart() {
    localStorage.setItem('sleepSoundCart', JSON.stringify(state.cart));
}

// Debounced update for custom size inputs
function updateCustomSize(key, value) {
    if (customSizeTimeout) {
        clearTimeout(customSizeTimeout);
    }
    // Update state immediately for inputs
    state.details[key] = value;
    // Debounce the price calculation and render
    customSizeTimeout = setTimeout(() => {
        app.calculatePrice();
        render();
        customSizeTimeout = null;
    }, 500);
}

// --- CONTROLLERS / ACTIONS ---

const app = {
    // Navigation
    goHome: () => {
        state.selectedCategory = null;
        state.currentProduct = null;
        state.sidebarOpen = false;
        state.activeSubFilter = null;
        state.searchQuery = ""; // Clear search on home click
        window.scrollTo({ top: 0, behavior: 'smooth' });
        render();
    },
    selectCategory: (category) => {
        state.activeDropdown = null;
        if (CATEGORY_MODAL_DATA[category]) {
            state.categoryModalOpen = true;
            state.categoryModalData = CATEGORY_MODAL_DATA[category];
        } else {
            state.selectedCategory = category;
            state.currentProduct = null;
            state.mobileMenuOpen = false;
            state.sidebarOpen = false;
            state.activeSubFilter = null;
            state.categoryModalOpen = false;
            state.searchQuery = ""; // Reset search when picking category
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        render();
    },
    closeCategoryModal: () => {
        state.categoryModalOpen = false;
        state.categoryModalData = null;
        render();
    },
    selectSubCategory: (category) => {
        state.selectedCategory = category;
        state.currentProduct = null;
        state.categoryModalOpen = false;
        state.categoryModalData = null;
        state.activeDropdown = null;
        state.mobileMenuOpen = false;
        state.sidebarOpen = false;
        state.activeSubFilter = null;
        state.searchQuery = "";
        window.scrollTo({ top: 0, behavior: 'smooth' });
        render();
    },
    selectProduct: (product) => {
        state.currentProduct = product;
        // Reset details state
        state.details = {
            size: 'Single',
            measurement: 'Inches',
            dimensions: '72x30',
            height: '4',
            customLength: '72',
            customWidth: '30',
            zoom: false,
            currentPrice: product.price
        };
        window.scrollTo({ top: 0, behavior: 'smooth' });
        render();
    },

    // Search
    handleSearch: (value) => {
        state.searchQuery = value;
        // Debounce rendering for performance
        if (searchTimeout) clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            // If we are on product detail page, go back to list
            if(state.currentProduct) {
                state.currentProduct = null;
            }
            render();
        }, 150); // 150ms delay
    },

    // UI Interactions
    toggleCart: (isOpen) => {
        state.isCartOpen = isOpen;
        render();
    },
    toggleAuth: (isOpen) => {
        state.authModalOpen = isOpen;
        render();
    },
    toggleMobileMenu: () => {
        state.mobileMenuOpen = !state.mobileMenuOpen;
        render();
    },
    setDropdown: (category) => {
        if (state.activeDropdown === category) {
            state.activeDropdown = null;
        } else {
            state.activeDropdown = category;
        }
        render();
    },
    closeDropdown: () => {
        state.activeDropdown = null;
        render();
    },
    setSidebarOpen: (isOpen) => {
        state.sidebarOpen = isOpen;
        render();
    },
    setSubFilter: (filter) => {
        state.activeSubFilter = state.activeSubFilter === filter ? null : filter;
        render();
    },
    setSlide: (index) => {
        state.currentSlide = index;
        render();
    },
    toggleSizeConverter: (isOpen) => {
        state.sizeConverterOpen = isOpen;
        render();
    },

    // Auth
    login: (e) => {
        e.preventDefault();
        state.user = { id: '1', name: 'Demo User', email: 'demo@example.com' };
        state.authModalOpen = false;
        render();
    },
    logout: () => {
        state.user = null;
        render();
    },

    // Cart Logic
    addToCart: (product, options = {}) => {
        // Create unique ID based on options to separate variants
        const variantId = product.id + '-' + JSON.stringify(options);
        
        const existing = state.cart.find(item =>
            item.id === product.id &&
            JSON.stringify(item.selectedDimensions) === JSON.stringify(options.selectedDimensions)
        );

        if (existing) {
            existing.quantity += 1;
        } else {
            state.cart.push({ ...product, quantity: 1, ...options });
        }
        saveCart(); // Persist
        state.isCartOpen = true;
        render();
    },
    removeFromCart: (index) => {
        // Remove by index to be safe with variants
        state.cart.splice(index, 1);
        saveCart();
        render();
    },
    updateQuantity: (index, delta) => {
        const item = state.cart[index];
        if (item) {
            item.quantity = Math.max(1, item.quantity + delta);
            saveCart();
        }
        render();
    },

    // Product Details Logic
    updateDetail: (key, value) => {
        state.details[key] = value;
        app.calculatePrice();
        render();
    },

    calculatePrice: () => {
        const product = state.currentProduct;
        if (!product) return;

        let finalPrice = product.price;
        const { size, dimensions, measurement, height, customLength, customWidth } = state.details;

        const sizeMultipliers = {
            'Single': 1.0, 'Double': 1.3, 'Queen': 1.5, 'King': 1.8
        };
        finalPrice *= (sizeMultipliers[size] || 1.0);

        let l, w;
        if (dimensions === 'custom') {
            l = parseFloat(customLength) || 72;
            w = parseFloat(customWidth) || 30;
        } else {
            const parts = dimensions.split('x');
            l = parseFloat(parts[0]) || 72;
            w = parseFloat(parts[1]) || 30;
        }

        // Logic to adjust price based on surface area
        if (measurement === 'Centimeter') {
            l /= 2.54;
            w /= 2.54;
        } else if (measurement === 'Feet') {
            l *= 12;
            w *= 12;
        }

        const baseArea = 72 * 30;
        const selectedArea = l * w;
        // Simple linear price scaling for demo
        finalPrice *= (selectedArea / baseArea);

        // Height adjustment
        const h = parseFloat(height) || 4;
        finalPrice += (h - 4) * 500; // 500rs per extra inch

        // Custom cut fee
        if (dimensions === 'custom') {
            finalPrice += 500; 
        }

        state.details.currentPrice = Math.round(finalPrice);
    },

    addToCartCurrent: () => {
        const { size, dimensions, height, measurement, customLength, customWidth, currentPrice } = state.details;
        app.addToCart({ ...state.currentProduct, price: currentPrice }, {
            selectedSize: size,
            selectedDimensions: dimensions === 'custom' ? `${customLength}x${customWidth}` : dimensions,
            selectedHeight: height,
            selectedMeasurement: measurement
        });
    }
};

// --- RENDER HELPERS ---

function renderHeader() {
    const cartCount = state.cart.reduce((a, b) => a + b.quantity, 0);

    return `
    <header class="sticky top-0 z-50 bg-white shadow-sm font-sans">
        <!-- Top Bar -->
        <div class="border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 md:px-6">
                <div class="flex items-center justify-between h-16">
                    <!-- Modern Minimal Logo -->
                    <div class="flex items-center cursor-pointer group" onclick="app.goHome()">
                        <div class="w-10 h-10 mr-2 group-hover:scale-110 transition-transform duration-300">
                            ${ICONS.logoMoon}
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xl font-bold text-gray-900 tracking-tight leading-none group-hover:text-[#FF6B35] transition-colors">SLEEP SOUND</span>
                            <span class="text-[10px] text-gray-500 font-medium tracking-widest uppercase">Premium Comfort</span>
                        </div>
                    </div>

                    <!-- Search Bar - Desktop -->
                    <div class="hidden md:flex flex-1 max-w-xl mx-8">
                        <div class="relative w-full">
                            <input type="text" 
                                value="${state.searchQuery}"
                                oninput="app.handleSearch(this.value)"
                                placeholder="Search products, categories..." 
                                class="w-full bg-gray-50 text-gray-900 rounded-full pl-5 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white border border-gray-200 transition-all shadow-sm" />
                            <button class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF6B35]">
                                ${ICONS.search}
                            </button>
                        </div>
                    </div>

                    <!-- Icons / Actions -->
                    <div class="flex items-center space-x-4 md:space-x-6">
                        <button onclick="app.toggleSizeConverter(true)" class="hidden md:flex items-center text-sm font-medium text-gray-600 hover:text-[#FF6B35] transition-colors">
                            Size Guide
                        </button>

                        ${state.user ? `
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-medium text-gray-700">Hi, ${state.user.name.split(' ')[0]}</span>
                                <button onclick="app.logout()" class="text-xs text-red-500 hover:underline">Logout</button>
                            </div>
                        ` : `
                            <button onclick="app.toggleAuth(true)" class="text-sm text-gray-700 hover:text-[#FF6B35] font-medium transition-colors">Login</button>
                        `}

                        <button onclick="app.toggleCart(true)" class="relative flex items-center text-gray-700 hover:text-[#FF6B35] transition-colors p-1">
                            ${ICONS.cart}
                            ${cartCount > 0 ? `<span class="absolute -top-1 -right-1 bg-[#FF6B35] text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-sm border border-white animate-fade-in">${cartCount}</span>` : ''}
                        </button>

                        <button onclick="app.toggleMobileMenu()" class="md:hidden text-gray-700">
                            ${ICONS.menu}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mega Menu -->
        <div class="bg-white border-b border-gray-100 hidden md:block relative">
            <div class="max-w-7xl mx-auto px-4 md:px-6">
                <nav class="flex items-center space-x-1">
                    <button onclick="app.goHome()" class="px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#FF6B35] hover:bg-orange-50 rounded transition-colors">All</button>
                    ${NAV_ITEMS.map(item => `
                        <div class="relative group">
                            <button onclick="app.setDropdown('${item.category}')" class="px-4 py-3 text-sm font-medium rounded transition-colors flex items-center gap-1 ${state.activeDropdown === item.category ? 'text-[#FF6B35] bg-orange-50' : 'text-gray-700 hover:text-[#FF6B35] hover:bg-orange-50'}">
                                ${item.label}
                                <span class="transform transition-transform ${state.activeDropdown === item.category ? 'rotate-180' : 'group-hover:rotate-180'}">${ICONS.chevronDown}</span>
                            </button>
                            
                            ${state.activeDropdown === item.category ? `
                                <div class="absolute top-full left-0 bg-white shadow-xl border border-gray-200 rounded-b-lg z-50 w-[800px] animate-fade-in" style="top: calc(100% - 1px);">
                                    <div class="p-6 grid grid-cols-12 gap-6">
                                        <div class="col-span-8 grid grid-cols-3 gap-6">
                                            ${item.subItems.map(sub => `
                                                <div>
                                                    <h4 class="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider border-b border-gray-100 pb-2">${sub.label}</h4>
                                                    <ul class="space-y-2">
                                                        ${sub.items.map(link => `
                                                            <li><button onclick="app.selectCategory('${item.category}')" class="text-sm text-gray-600 hover:text-[#FF6B35] text-left w-full hover:translate-x-1 transition-transform">${link}</button></li>
                                                        `).join('')}
                                                    </ul>
                                                </div>
                                            `).join('')}
                                        </div>
                                        <div class="col-span-4">
                                            ${item.image ? `
                                                <div class="rounded-lg overflow-hidden h-full bg-gray-50 group cursor-pointer shadow-inner relative" onclick="app.selectCategory('${item.category}')">
                                                    <img src="${item.image}" alt="${item.category}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                                                    <div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                                                        <span class="bg-white/90 backdrop-blur-sm px-4 py-2 rounded text-xs font-bold uppercase tracking-widest shadow-lg">Shop ${item.category}</span>
                                                    </div>
                                                </div>
                                            ` : ''}
                                        </div>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                    <button class="px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors ml-auto">Offers</button>
                </nav>
            </div>
        </div>

        <!-- Mobile Search -->
        <div class="md:hidden border-b border-gray-100 p-4 bg-white">
            <div class="relative w-full">
                <input type="text" 
                    value="${state.searchQuery}"
                    oninput="app.handleSearch(this.value)"
                    placeholder="Search..." 
                    class="w-full bg-gray-50 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF6B35]" />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">${ICONS.search}</span>
            </div>
        </div>

        <!-- Mobile Menu -->
        ${state.mobileMenuOpen ? `
            <div class="md:hidden bg-white border-b border-gray-200 max-h-[80vh] overflow-y-auto animate-fade-in absolute w-full z-40 shadow-lg">
                <nav class="p-4 space-y-2">
                    <button onclick="app.goHome(); app.toggleMobileMenu()" class="block w-full text-left px-4 py-3 text-gray-700 font-medium hover:bg-orange-50 rounded">Home</button>
                    ${NAV_ITEMS.map(item => `
                        <div class="space-y-1">
                            <button onclick="app.selectCategory('${item.category}'); app.toggleMobileMenu()" class="block w-full text-left px-4 py-3 text-gray-700 font-medium hover:bg-orange-50 rounded flex justify-between items-center">
                                ${item.label}
                                <span class="text-gray-400">›</span>
                            </button>
                        </div>
                    `).join('')}
                    <button onclick="app.toggleSizeConverter(true); app.toggleMobileMenu()" class="block w-full text-left px-4 py-3 text-gray-700 font-medium hover:bg-orange-50 rounded">Size Guide</button>
                </nav>
            </div>
        ` : ''}
    </header>
    `;
}

function renderHero() {
    return `
    <section class="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-gray-900 group">
        ${SLIDES.map((slide, index) => `
            <div class="absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === state.currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}">
                <img src="${slide.image}" alt="${slide.title}" class="w-full h-full object-cover opacity-70 transform ${index === state.currentSlide ? 'scale-100' : 'scale-110'} transition-transform duration-[10000ms]" />
                <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                <div class="absolute inset-0 flex items-center">
                    <div class="max-w-7xl mx-auto px-4 md:px-6 w-full">
                        <div class="max-w-2xl animate-fade-in">
                            ${slide.offer ? `<div class="inline-block bg-[#FF6B35] text-white px-4 py-1.5 rounded-full text-sm font-bold mb-6 shadow-lg">${slide.offer}</div>` : ''}
                            <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-md tracking-tight">${slide.title}</h1>
                            <p class="text-lg md:text-xl text-gray-200 mb-8 max-w-lg leading-relaxed font-light">${slide.subtitle}</p>
                            <button onclick="app.selectCategory('${slide.category}')" class="bg-[#FF6B35] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#e55a2b] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 active:scale-95">
                                ${slide.cta}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('')}
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
            ${SLIDES.map((_, index) => `
                <button onclick="app.setSlide(${index})" class="h-1.5 rounded-full transition-all duration-300 ${index === state.currentSlide ? 'bg-[#FF6B35] w-8' : 'bg-white/30 w-4 hover:bg-white'}"></button>
            `).join('')}
        </div>
    </section>
    `;
}

function renderCategoryCards() {
    const categories = [
        { name: 'Mattress', category: 'Mattress', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=400' },
        { name: 'Bedroom', category: 'Bedroom', image: 'https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&q=80&w=400' },
        { name: 'Living', category: 'Living', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400' },
        { name: 'Dining', category: 'Dining', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=400' },
        { name: 'Study', category: 'Office', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=400' },
        { name: 'Decor', category: 'Decor', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400' }
    ];
    return `
    <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 md:px-6">
            <h2 class="text-2xl md:text-3xl font-bold mb-10 text-center text-gray-900 tracking-tight">Shop By Category</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8">
                ${categories.map(cat => `
                    <div onclick="${cat.category === 'Decor' ? '' : `app.selectCategory('${cat.category}')`}" class="group cursor-pointer">
                        <div class="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300 mb-4 border border-gray-100">
                            <img src="${cat.image}" alt="${cat.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                        </div>
                        <h3 class="text-sm md:text-base font-semibold text-gray-900 text-center group-hover:text-[#FF6B35] transition-colors">${cat.name}</h3>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    `;
}

function renderProductList() {
    const currentNav = NAV_ITEMS.find(n => n.category === state.selectedCategory);
    const searchLower = state.searchQuery.toLowerCase();

    // Enhanced Filter Logic with Search
    const filteredProducts = PRODUCTS.filter(p => {
        // 1. Search Filter
        if (searchLower) {
            const matchName = p.name.toLowerCase().includes(searchLower);
            const matchCat = p.category.toLowerCase().includes(searchLower);
            const matchSub = p.subCategory && p.subCategory.toLowerCase().includes(searchLower);
            
            if (!matchName && !matchCat && !matchSub) return false;
        }

        // 2. Category Filter
        if (state.selectedCategory && p.category !== state.selectedCategory) return false;

        // 3. Sub-Category Filter
        if (state.activeSubFilter && p.subCategory !== state.activeSubFilter) return false;

        return true;
    });

    return `
    <section id="products" class="bg-gray-50 py-12 md:py-16 min-h-screen">
        <div class="max-w-7xl mx-auto px-4 md:px-6">
            <!-- Header & Mobile Filter Toggle -->
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <h2 class="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                        ${state.searchQuery ? `Search Results for "${state.searchQuery}"` : (state.selectedCategory ? `${state.selectedCategory} Collection` : 'Our Bestsellers')}
                    </h2>
                    <p class="text-gray-500">${filteredProducts.length} Products Found</p>
                </div>
                ${state.selectedCategory ? `
                    <button onclick="app.setSidebarOpen(!state.sidebarOpen)" class="md:hidden flex items-center justify-center gap-2 bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm text-sm font-medium">
                        ${ICONS.filter} Filters
                    </button>
                ` : ''}
            </div>

            <div class="flex flex-col md:flex-row gap-8">
                <!-- Sidebar Filters -->
                ${state.selectedCategory ? `
                    <aside class="md:w-64 flex-shrink-0 ${state.sidebarOpen ? 'block' : 'hidden md:block'} animate-fade-in">
                        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <div class="flex justify-between items-center mb-6">
                                <h3 class="font-bold text-gray-900">Filters</h3>
                                <button onclick="app.selectCategory('')" class="text-xs text-[#FF6B35] hover:underline font-medium">Clear All</button>
                            </div>
                            ${currentNav ? `
                                <div class="space-y-6">
                                    ${currentNav.subItems.map(group => `
                                        <div>
                                            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">${group.label}</h4>
                                            <ul class="space-y-2">
                                                ${group.items.map(item => `
                                                    <li>
                                                        <button onclick="app.setSubFilter('${item}')" class="text-sm text-left w-full flex items-center gap-2 transition-all group">
                                                            <div class="w-4 h-4 rounded border flex items-center justify-center transition-colors ${state.activeSubFilter === item ? 'bg-[#FF6B35] border-[#FF6B35]' : 'border-gray-300 group-hover:border-[#FF6B35]'}">
                                                                ${state.activeSubFilter === item ? ICONS.check : ''}
                                                            </div>
                                                            <span class="${state.activeSubFilter === item ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}">${item}</span>
                                                        </button>
                                                    </li>
                                                `).join('')}
                                            </ul>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </aside>
                ` : ''}

                <!-- Product Grid -->
                <div class="flex-1">
                    ${filteredProducts.length === 0 ? `
                        <div class="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
                            ${ICONS.emptyCart.replace('w-24 h-24', 'w-16 h-16 mx-auto mb-4')}
                            <p class="text-gray-900 text-lg font-medium">No products found.</p>
                            <p class="text-gray-500 mb-6">Try adjusting your search or filters.</p>
                            <button onclick="app.goHome()" class="text-[#FF6B35] hover:underline font-medium">Clear all filters</button>
                        </div>
                    ` : `
                        <div class="grid grid-cols-1 sm:grid-cols-2 ${state.selectedCategory ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6">
                            ${filteredProducts.map(product => {
                                const discount = product.originalPrice ? Math.round((1 - product.price / parseInt(product.originalPrice.replace(/[₹,]/g, ''))) * 100) : 0;
                                return `
                                <div class="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full transform hover:-translate-y-1" onclick="app.selectProduct(PRODUCTS.find(p => p.id === ${product.id}))">
                                    <div class="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                                        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                                        ${product.badge ? `<div class="absolute top-3 left-3 bg-[#FF6B35] text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-sm">${product.badge}</div>` : ''}
                                        
                                        <!-- Quick Action Overlay -->
                                        <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center">
                                            <button onclick="event.stopPropagation(); app.addToCart(PRODUCTS.find(p => p.id === ${product.id}))" class="bg-white text-gray-900 font-bold py-2 px-6 rounded-full hover:bg-[#FF6B35] hover:text-white transition-colors shadow-lg text-sm">
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                    <div class="p-5 flex-1 flex flex-col">
                                        <div class="text-xs text-[#FF6B35] mb-1 font-bold uppercase tracking-wider">${product.subCategory || product.category}</div>
                                        <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 text-lg group-hover:text-[#FF6B35] transition-colors">${product.name}</h3>
                                        <p class="text-sm text-gray-500 mb-4 line-clamp-2 flex-1 leading-relaxed">${product.description}</p>
                                        <div class="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                                            <div class="flex flex-col">
                                                <span class="text-xl font-bold text-gray-900">${product.displayPrice}</span>
                                                ${product.originalPrice ? `<span class="text-xs text-gray-400 line-through">${product.originalPrice}</span>` : ''}
                                            </div>
                                            ${product.originalPrice ? `<div class="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded border border-green-100">Save ${discount}%</div>` : ''}
                                        </div>
                                    </div>
                                </div>
                                `;
                            }).join('')}
                        </div>
                    `}
                </div>
            </div>
        </div>
    </section>
    `;
}

function renderProductDetails() {
    const product = state.currentProduct;
    const details = state.details;
    const originalPriceNum = product.originalPrice ? parseInt(product.originalPrice.replace(/[₹,]/g, '')) : 0;
    const currentPrice = details.currentPrice;
    const savings = Math.max(0, (originalPriceNum * (currentPrice / product.price)) - currentPrice);
    const scaledOriginalPrice = originalPriceNum ? Math.round(originalPriceNum * (currentPrice / product.price)) : 0;
    const discount = scaledOriginalPrice ? Math.round((1 - currentPrice / scaledOriginalPrice) * 100) : 0;

    const sizes = ['Single', 'Double', 'Queen', 'King'];
    const measurements = ['Inches', 'Centimeter', 'Feet'];
    const dimList = ['72x30', '78x30', '75x30', '84x30', '72x36', '75x36', '78x36', '84x36'];
    const heights = ['4', '5', '6', '8'];

    return `
    <section class="bg-white py-8 md:py-12 animate-fade-in min-h-screen">
        <div class="max-w-7xl mx-auto px-4 md:px-6">
            <button onclick="app.goHome()" class="text-gray-500 hover:text-[#FF6B35] mb-8 flex items-center gap-2 font-medium transition-colors">
                ${ICONS.back} Back to Products
            </button>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
                <!-- Image Section -->
                <div class="relative">
                    <div class="sticky top-24">
                        <div class="relative aspect-square bg-gray-100 rounded-3xl overflow-hidden mb-4 cursor-zoom-in group shadow-sm border border-gray-100" onclick="app.updateDetail('zoom', true)">
                            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            ${product.badge ? `<div class="absolute top-6 left-6 bg-[#FF6B35] text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">${product.badge}</div>` : ''}
                            <div class="absolute bottom-6 right-6 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 shadow-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">Click to Zoom</div>
                        </div>
                    </div>
                </div>

                <!-- Details Section -->
                <div>
                    <div class="text-sm text-[#FF6B35] font-bold tracking-widest uppercase mb-2">${product.category} • ${product.subCategory || 'General'}</div>
                    <h1 class="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">${product.name}</h1>
                    
                    <!-- Pricing Block -->
                    <div class="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <div class="flex items-end gap-4 mb-2">
                            <span class="text-4xl font-bold text-gray-900">₹${currentPrice.toLocaleString()}</span>
                            ${scaledOriginalPrice > 0 ? `
                                <span class="text-xl text-gray-400 line-through mb-1 font-medium">₹${scaledOriginalPrice.toLocaleString()}</span>
                                <span class="mb-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">${discount}% OFF</span>
                            ` : ''}
                        </div>
                        ${savings > 0 ? `<p class="text-green-600 font-semibold text-sm">You save ₹${Math.round(savings).toLocaleString()} today!</p>` : ''}
                        <p class="text-xs text-gray-400 mt-2 uppercase tracking-wide">Inclusive of all taxes & free shipping</p>
                    </div>

                    <div class="space-y-8">
                        <!-- Size -->
                        <div>
                            <h3 class="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider flex justify-between">
                                1. Choose Size Category
                            </h3>
                            <div class="flex flex-wrap gap-3">
                                ${sizes.map(s => `
                                    <button onclick="app.updateDetail('size', '${s}')" class="px-6 py-3 border rounded-xl font-medium transition-all duration-200 ${details.size === s ? 'border-[#FF6B35] bg-orange-50 text-[#FF6B35] shadow-sm ring-1 ring-[#FF6B35]' : 'border-gray-200 text-gray-600 hover:border-[#FF6B35] hover:text-[#FF6B35]'}">${s}</button>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Dimensions -->
                        <div>
                            <div class="flex justify-between items-center mb-3">
                                <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider">2. Dimensions</h3>
                                <div class="flex bg-gray-100 p-1 rounded-lg">
                                    ${measurements.map(m => `
                                        <button onclick="app.updateDetail('measurement', '${m}')" class="px-3 py-1 text-xs font-medium rounded-md transition-all ${details.measurement === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}">${m}</button>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                ${dimList.map(d => `
                                    <button onclick="app.updateDetail('dimensions', '${d}')" class="px-2 py-3 border rounded-lg text-sm font-medium transition-all duration-200 ${details.dimensions === d ? 'border-[#FF6B35] bg-orange-50 text-[#FF6B35] shadow-sm ring-1 ring-[#FF6B35]' : 'border-gray-200 text-gray-600 hover:border-[#FF6B35]'}">${d}</button>
                                `).join('')}
                                <button onclick="app.updateDetail('dimensions', 'custom')" class="px-2 py-3 border rounded-lg text-sm font-medium transition-all duration-200 ${details.dimensions === 'custom' ? 'border-[#FF6B35] bg-orange-50 text-[#FF6B35] shadow-sm ring-1 ring-[#FF6B35]' : 'border-dashed border-gray-300 text-gray-500 hover:border-[#FF6B35]'}">Custom Size</button>
                            </div>
                            
                            ${details.dimensions === 'custom' ? `
                                <div class="mt-4 p-5 bg-orange-50/50 rounded-xl border border-orange-100 flex flex-wrap items-center gap-4 animate-fade-in">
                                    <div class="flex-1 min-w-[100px]">
                                        <label class="text-xs text-gray-500 font-bold uppercase block mb-1">Length (${details.measurement})</label>
                                        <input type="number" value="${details.customLength}" oninput="updateCustomSize('customLength', this.value)" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] outline-none bg-white font-bold text-gray-900" />
                                    </div>
                                    <span class="text-gray-400 mt-5 font-light text-xl">×</span>
                                    <div class="flex-1 min-w-[100px]">
                                        <label class="text-xs text-gray-500 font-bold uppercase block mb-1">Width (${details.measurement})</label>
                                        <input type="number" value="${details.customWidth}" oninput="updateCustomSize('customWidth', this.value)" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] outline-none bg-white font-bold text-gray-900" />
                                    </div>
                                </div>
                                <p class="text-xs text-orange-600 mt-2 flex items-center gap-1">
                                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                                    Custom sizes take 2-3 extra days for delivery.
                                </p>
                            ` : ''}
                        </div>

                        <!-- Height -->
                        <div>
                            <h3 class="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">3. Thickness (Height)</h3>
                            <div class="flex flex-wrap gap-3">
                                ${heights.map(h => `
                                    <button onclick="app.updateDetail('height', '${h}')" class="px-6 py-3 border rounded-xl font-medium transition-all duration-200 ${details.height === h ? 'border-[#FF6B35] bg-orange-50 text-[#FF6B35] shadow-sm ring-1 ring-[#FF6B35]' : 'border-gray-200 text-gray-600 hover:border-[#FF6B35]'}">
                                        ${h}" ${parseInt(h) > 4 ? `<span class="text-[10px] ml-1 bg-orange-100 text-[#FF6B35] px-1 rounded">+₹${(parseInt(h) - 4) * 500}</span>` : ''}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="mt-10 pt-8 border-t border-gray-100 flex gap-4 sticky bottom-0 bg-white/95 backdrop-blur py-4 md:static md:bg-transparent md:py-0 z-20">
                        <button onclick="app.addToCartCurrent()" class="flex-1 bg-[#FF6B35] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#e55a2b] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]">
                            Add to Cart - ₹${currentPrice.toLocaleString()}
                        </button>
                        <button class="px-6 py-4 border-2 border-gray-200 rounded-xl hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors text-gray-400">
                            ${ICONS.heart}
                        </button>
                    </div>

                    <!-- Features Grid -->
                    <div class="mt-8 grid grid-cols-2 gap-4">
                        ${product.features.map(feature => `
                            <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-green-500 shadow-sm border border-gray-100">${ICONS.feature}</div>
                                <span class="text-sm font-medium text-gray-700">${feature}</span>
                            </div>
                        `).join('')}
                    </div>

                    <div class="mt-8">
                        <h3 class="text-lg font-bold text-gray-900 mb-3">Description</h3>
                        <p class="text-gray-600 leading-relaxed text-lg font-light">${product.description}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Zoom Modal -->
        ${details.zoom ? `
            <div class="fixed inset-0 z-[100] bg-white flex items-center justify-center p-4 cursor-zoom-out animate-fade-in" onclick="app.updateDetail('zoom', false)">
                <img src="${product.image}" alt="${product.name}" class="max-w-full max-h-full object-contain shadow-2xl" />
                <button class="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    ${ICONS.zoomOut}
                </button>
            </div>
        ` : ''}
    </section>
    `;
}

function renderCartDrawer() {
    const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return `
    <div class="fixed inset-0 z-[60] transition-opacity duration-300 ${state.isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onclick="app.toggleCart(false)"></div>
        <div class="absolute inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${state.isCartOpen ? 'translate-x-0' : 'translate-x-full'}">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                <div>
                    <h2 class="text-xl font-bold text-gray-900">Your Cart</h2>
                    <p class="text-sm text-gray-500">${state.cart.reduce((a, b) => a + b.quantity, 0)} items</p>
                </div>
                <button onclick="app.toggleCart(false)" class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                   ${ICONS.close}
                </button>
            </div>

            <div class="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                ${state.cart.length === 0 ? `
                    <div class="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        ${ICONS.emptyCart}
                        <p class="text-xl font-bold mb-2 text-gray-900">Your cart is empty</p>
                        <p class="text-sm mb-8 text-gray-500 max-w-xs">Looks like you haven't added anything yet. Discover our premium collection.</p>
                        <button onclick="app.toggleCart(false)" class="px-8 py-3 bg-[#FF6B35] text-white rounded-full font-bold hover:bg-[#e55a2b] transition-all shadow-md hover:shadow-lg">
                            Start Shopping
                        </button>
                    </div>
                ` : state.cart.map((item, index) => `
                    <div class="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 animate-fade-in">
                        <div class="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" />
                        </div>
                        <div class="flex-1 flex flex-col justify-between">
                            <div>
                                <div class="flex justify-between items-start">
                                    <h3 class="font-bold text-gray-900 mb-1 leading-tight line-clamp-1">${item.name}</h3>
                                    <button onclick="app.removeFromCart(${index})" class="text-gray-400 hover:text-red-500 transition-colors p-1 -mt-1 -mr-1">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                                <p class="text-xs text-gray-500 mb-2">${item.category}</p>
                                ${item.selectedDimensions ? `
                                    <div class="text-[10px] bg-gray-100 inline-flex items-center px-2 py-1 rounded text-gray-600 mb-2 border border-gray-200">
                                        ${item.selectedSize} • ${item.selectedDimensions} • ${item.selectedHeight}"
                                    </div>
                                ` : ''}
                            </div>
                            <div class="flex justify-between items-end">
                                <div class="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                                    <button onclick="app.updateQuantity(${index}, -1)" class="px-3 py-1 text-gray-600 hover:bg-white rounded-l-lg transition-colors" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                                    <span class="px-2 text-sm font-medium min-w-[1.5rem] text-center">${item.quantity}</span>
                                    <button onclick="app.updateQuantity(${index}, 1)" class="px-3 py-1 text-gray-600 hover:bg-white rounded-r-lg transition-colors">+</button>
                                </div>
                                <p class="font-bold text-gray-900 text-lg">₹${(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            ${state.cart.length > 0 ? `
                <div class="p-6 bg-white border-t border-gray-100 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-10">
                    <div class="space-y-3 mb-6">
                        <div class="flex justify-between text-gray-500 text-sm">
                            <span>Subtotal</span>
                            <span>₹${total.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between text-gray-500 text-sm">
                            <span>Delivery</span>
                            <span class="text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded text-xs">Free</span>
                        </div>
                        <div class="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-dashed border-gray-200">
                            <span>Total</span>
                            <span>₹${total.toLocaleString()}</span>
                        </div>
                    </div>
                    <button class="w-full py-4 bg-[#FF6B35] text-white font-bold rounded-xl hover:bg-[#e55a2b] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0">
                        Checkout Securely
                    </button>
                </div>
            ` : ''}
        </div>
    </div>
    `;
}

function renderCategoryModal() {
    if (!state.categoryModalOpen || !state.categoryModalData) return '';
    const modalData = state.categoryModalData;
    return `
    <div class="fixed inset-0 z-[90] flex justify-end transition-all duration-300">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="app.closeCategoryModal()"></div>
        <div class="relative bg-white w-full max-w-2xl h-full overflow-y-auto shadow-2xl transform transition-transform duration-300 ease-out animate-fade-in">
            <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex justify-between items-center z-10">
                <div>
                    <h2 class="text-xl font-bold text-gray-900 mb-1 tracking-tight">${modalData.title}</h2>
                    <div class="h-1 bg-[#FF6B35] w-12 rounded-full"></div>
                </div>
                <button onclick="app.closeCategoryModal()" class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700">
                    ${ICONS.close}
                </button>
            </div>
            <div class="p-6">
                <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
                    ${modalData.items.map(item => `
                    <div onclick="app.selectSubCategory('${item.category}')" class="group cursor-pointer">
                        <div class="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-3 group-hover:shadow-lg transition-all duration-300 border border-gray-100 group-hover:border-[#FF6B35]">
                            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <p class="text-sm font-semibold text-gray-700 text-center group-hover:text-[#FF6B35] transition-colors leading-tight">${item.name}</p>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>
    `;
}

function renderAuthModal() {
    if (!state.authModalOpen) return '';
    return `
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onclick="app.toggleAuth(false)"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in scale-100">
            <div class="p-8">
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900">Welcome Back</h3>
                        <p class="text-sm text-gray-500 mt-1">Please enter your details to sign in.</p>
                    </div>
                    <button onclick="app.toggleAuth(false)" class="text-gray-400 hover:text-gray-600 -mt-6 -mr-2 p-2">${ICONS.close}</button>
                </div>
                
                <form onsubmit="app.login(event)" class="space-y-5">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                        <input type="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none transition-all" placeholder="user@example.com" />
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">Password</label>
                        <input type="password" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none transition-all" placeholder="••••••••" />
                    </div>
                    <button type="submit" class="w-full py-4 bg-[#FF6B35] text-white font-bold rounded-lg hover:bg-[#e55a2b] transition-all shadow-md hover:shadow-lg transform active:scale-[0.98]">Sign In</button>
                </form>
                
                <div class="mt-6 text-center pt-6 border-t border-gray-100">
                    <p class="text-sm text-gray-600">Don't have an account? <button class="text-[#FF6B35] font-bold hover:underline">Create Account</button></p>
                </div>
            </div>
        </div>
    </div>
    `;
}

function renderSizeConverterModal() {
    if (!state.sizeConverterOpen) return '';
    return `
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="app.toggleSizeConverter(false)"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-fade-in p-6">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-gray-900">Size Calculator</h3>
                <button onclick="app.toggleSizeConverter(false)" class="text-gray-400 hover:text-gray-600">${ICONS.close}</button>
            </div>
            
            <div class="space-y-4">
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Input Length (Inches)</label>
                    <input id="calcLen" type="number" class="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:border-[#FF6B35] outline-none" placeholder="e.g. 72">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Input Width (Inches)</label>
                    <input id="calcWid" type="number" class="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:border-[#FF6B35] outline-none" placeholder="e.g. 36">
                </div>
                
                <button onclick="(() => {
                    const l = document.getElementById('calcLen').value;
                    const w = document.getElementById('calcWid').value;
                    if(l && w) {
                        const ft = (l/12).toFixed(1) + 'ft x ' + (w/12).toFixed(1) + 'ft';
                        const cm = (l*2.54).toFixed(0) + 'cm x ' + (w*2.54).toFixed(0) + 'cm';
                        document.getElementById('calcRes').innerHTML = '<div class=\'bg-orange-50 p-3 rounded border border-orange-100 text-center\'><div class=\'font-bold text-gray-900\'>'+ft+'</div><div class=\'text-sm text-gray-600\'>'+cm+'</div></div>';
                    }
                })()" class="w-full bg-gray-900 text-white py-2 rounded-lg font-bold hover:bg-gray-800">Convert</button>

                <div id="calcRes" class="mt-4"></div>
            </div>
        </div>
    </div>
    `;
}

function renderFooter() {
    return `
    <footer class="bg-gray-900 text-gray-400 py-16 border-t border-gray-800">
        <div class="max-w-7xl mx-auto px-4 md:px-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div>
                    <div class="flex items-center gap-2 mb-6">
                        <div class="w-8 h-8 text-white">${ICONS.logoMoon}</div>
                        <span class="text-xl font-bold text-white tracking-tight">SLEEP SOUND</span>
                    </div>
                    <p class="text-sm leading-relaxed mb-6">Experience the perfect blend of comfort and style. India's most trusted sleep solutions and furniture brand since 2010.</p>
                    <div class="flex gap-4">
                        <a href="#" class="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#FF6B35] hover:text-white transition-colors">fb</a>
                        <a href="#" class="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#FF6B35] hover:text-white transition-colors">in</a>
                        <a href="#" class="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#FF6B35] hover:text-white transition-colors">tw</a>
                    </div>
                </div>
                <div>
                    <h4 class="text-white font-bold mb-6">Shop</h4>
                    <ul class="space-y-3 text-sm">
                        <li><a href="#" class="hover:text-[#FF6B35] transition-colors">Mattresses</a></li>
                        <li><a href="#" class="hover:text-[#FF6B35] transition-colors">Bed Frames</a></li>
                        <li><a href="#" class="hover:text-[#FF6B35] transition-colors">Sofas & Recliners</a></li>
                        <li><a href="#" class="hover:text-[#FF6B35] transition-colors">Custom Size</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-white font-bold mb-6">Support</h4>
                    <ul class="space-y-3 text-sm">
                        <li><a href="#" class="hover:text-[#FF6B35] transition-colors">Track Order</a></li>
                        <li><a href="#" class="hover:text-[#FF6B35] transition-colors">Warranty Policy</a></li>
                        <li><a href="#" class="hover:text-[#FF6B35] transition-colors">Return & Refund</a></li>
                        <li><a href="#" class="hover:text-[#FF6B35] transition-colors">Contact Us</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-white font-bold mb-6">Newsletter</h4>
                    <p class="text-sm mb-4">Subscribe to get special offers and updates.</p>
                    <div class="flex gap-2">
                        <input type="email" placeholder="Email Address" class="bg-gray-800 border-none rounded-lg px-4 py-2 text-white w-full focus:ring-1 focus:ring-[#FF6B35]" />
                        <button class="bg-[#FF6B35] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#e55a2b]">Go</button>
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-800 pt-8 text-center text-sm">
                <p>&copy; 2024 Sleep Sound. All rights reserved. Designed for Excellence.</p>
            </div>
        </div>
    </footer>
    `;
}

function renderBadges() {
    return `
     <div class="bg-gray-50 py-12 border-y border-gray-100">
       <div class="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div class="flex flex-col items-center group">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#FF6B35] mb-4 shadow-sm group-hover:scale-110 transition-transform">${ICONS.feature}</div>
            <h4 class="font-bold text-gray-900 mb-1">100 Night Trial</h4><p class="text-sm text-gray-500">Try it risk-free at home</p>
          </div>
          <div class="flex flex-col items-center group">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#FF6B35] mb-4 shadow-sm group-hover:scale-110 transition-transform"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg></div>
            <h4 class="font-bold text-gray-900 mb-1">Free Delivery</h4><p class="text-sm text-gray-500">Across all major cities</p>
          </div>
          <div class="flex flex-col items-center group">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#FF6B35] mb-4 shadow-sm group-hover:scale-110 transition-transform"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
            <h4 class="font-bold text-gray-900 mb-1">10 Year Warranty</h4><p class="text-sm text-gray-500">Guaranteed durability</p>
          </div>
           <div class="flex flex-col items-center group">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#FF6B35] mb-4 shadow-sm group-hover:scale-110 transition-transform"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
            <h4 class="font-bold text-gray-900 mb-1">No Cost EMI</h4><p class="text-sm text-gray-500">Easy monthly payments</p>
          </div>
       </div>
    </div>
    `;
}

// --- MAIN RENDER ---
const root = document.getElementById('root');
let intervalId = null;

function render() {
    // Manage Slider Interval
    if (state.currentProduct || state.selectedCategory || state.searchQuery) {
        if (intervalId) { clearInterval(intervalId); intervalId = null; }
    } else {
        if (!intervalId) {
            intervalId = setInterval(() => {
                state.currentSlide = (state.currentSlide + 1) % SLIDES.length;
                render();
            }, 6000);
        }
    }

    let mainContent = '';

    if (state.currentProduct) {
        mainContent = renderProductDetails();
    } else {
        const heroSection = (!state.selectedCategory && !state.searchQuery) ? renderHero() : '';
        const catSection = (!state.selectedCategory && !state.searchQuery) ? renderCategoryCards() : '';
        const badgesSection = (!state.selectedCategory && !state.searchQuery) ? renderBadges() : '';

        mainContent = `
            ${heroSection}
            ${catSection}
            ${badgesSection}
            ${renderProductList()}
        `;
    }

    root.innerHTML = `
        ${renderHeader()}
        <main>${mainContent}</main>
        ${renderFooter()}
        ${renderCartDrawer()}
        ${renderAuthModal()}
        ${renderCategoryModal()}
        ${renderSizeConverterModal()}
    `;
}

// Expose app to window for inline event handlers
window.app = app;
window.PRODUCTS = PRODUCTS; // Exposed for ease of debug if needed

// Start App
initApp();