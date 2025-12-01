/**
 * DATA & CONSTANTS
 * Separated for cleaner code structure.
 */

const ICONS = {
    search: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>`,
    store: `<svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`,
    cart: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>`,
    menu: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>`,
    chevronDown: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>`,
    close: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>`,
    emptyCart: `<svg class="w-24 h-24 mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>`,
    filter: `<svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>`,
    check: `<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>`,
    back: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>`,
    feature: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>`,
    heart: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>`,
    zoomOut: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>`,
    // New Minimal Logo Icon
    logoMoon: `<svg class="w-full h-full text-[#FF6B35]" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>`
};

const NAV_ITEMS = [
    {
        label: "Mattress",
        category: "Mattress",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600&h=400",
        subItems: [
            {
                label: "By Type",
                items: ["Orthopedic Mattress", "Dual Comfort Mattress", "Latex Mattress", "Foam Spring Mattress", "Xtra Snooze Grid"]
            },
            {
                label: "By Size",
                items: ["King Size", "Queen Size", "Single Size", "Double Size", "Custom Size"]
            },
            {
                label: "Bedding",
                items: ["Mattress Protectors", "Pillows", "Comforters", "Bedsheets", "Blankets"]
            }
        ]
    },
    {
        label: "Bedroom",
        category: "Bedroom",
        image: "https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&q=80&w=600&h=400",
        subItems: [
            {
                label: "Beds",
                items: ["Sheesham Wood Beds", "Engineered Wood Beds", "Metal Beds", "Bunk Beds", "Bedside Tables"]
            },
            {
                label: "Wardrobes",
                items: ["2 Door Wardrobes", "3 Door Wardrobes", "4 Door Wardrobes", "Sliding Wardrobes"]
            },
            {
                label: "Accessories",
                items: ["Dressing Tables", "Chest of Drawers", "Bedroom Chairs", "Bedroom Benches"]
            }
        ]
    },
    {
        label: "Living",
        category: "Living",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600&h=400",
        subItems: [
            {
                label: "Sofas",
                items: ["L Shape Sofas", "3 Seater Sofas", "2 Seater Sofas", "Sofa Sets", "Sofa Cum Beds"]
            },
            {
                label: "Seating",
                items: ["Recliners", "Accent Chairs", "Ottomans", "Bean Bags", "Stools"]
            },
            {
                label: "Tables",
                items: ["Coffee Tables", "Side Tables", "Console Tables", "TV Units", "Shoe Racks"]
            }
        ]
    },
    {
        label: "Dining",
        category: "Dining",
        image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=600&h=400",
        subItems: [
            {
                label: "Dining Sets",
                items: ["4 Seater Dining Sets", "6 Seater Dining Sets", "8 Seater Dining Sets"]
            },
            {
                label: "Dining Tables",
                items: ["Solid Wood Tables", "Glass Top Tables", "Marble Top Tables"]
            },
            {
                label: "Dining Chairs",
                items: ["Wooden Chairs", "Upholstered Chairs", "Benches"]
            }
        ]
    },
    {
        label: "Study",
        category: "Office",
        image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=600&h=400",
        subItems: [
            {
                label: "Tables",
                items: ["Study Tables", "Computer Tables", "Office Tables", "Adjustable Tables"]
            },
            {
                label: "Chairs",
                items: ["Ergonomic Chairs", "Office Chairs", "Gaming Chairs", "Study Chairs"]
            },
            {
                label: "Storage",
                items: ["Bookshelves", "File Cabinets", "Wall Shelves", "Office Drawers"]
            }
        ]
    }
];

const PRODUCTS = [
    { id: 1, name: "Ortho Memory Foam Mattress", category: "Mattress", subCategory: "Orthopedic Mattress", price: 12999, displayPrice: "₹12,999", originalPrice: "₹19,999", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800&h=600", description: "Medium firm, orthopedic support for back pain relief.", badge: "Bestseller", sku: "M72364", features: ["Orthopedic Support", "Memory Foam", "Medium Firm", "100 Night Trial"] },
    { id: 2, name: "Solid Wood Bed Frame", category: "Bedroom", subCategory: "Sheesham Wood Beds", price: 25999, displayPrice: "₹25,999", originalPrice: "₹35,999", image: "https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&q=80&w=800&h=600", description: "Queen size with storage, made of premium Sheesham wood.", badge: "New", sku: "B72364", features: ["Solid Wood", "Storage Space", "Queen Size", "10 Year Warranty"] },
    { id: 3, name: "Ergonomic Office Chair", category: "Office", subCategory: "Ergonomic Chairs", price: 8999, displayPrice: "₹8,999", originalPrice: "₹12,999", image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&q=80&w=800&h=600", description: "Lumbar support, adjustable height, and breathable mesh.", badge: "Sale", sku: "C72364", features: ["Lumbar Support", "Adjustable Height", "Ergonomic Design", "5 Year Warranty"] },
    { id: 4, name: "Modular Sofa Set", category: "Living", subCategory: "L Shape Sofas", price: 34999, displayPrice: "₹34,999", originalPrice: "₹49,999", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800&h=600", description: "3-seater with removable covers and premium fabric.", badge: "Popular", sku: "S72364", features: ["Modular Design", "Removable Covers", "3-Seater", "Premium Fabric"] },
    { id: 5, name: "Dining Table Set", category: "Dining", subCategory: "4 Seater Dining Sets", price: 19999, displayPrice: "₹19,999", originalPrice: "₹29,999", image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800&h=600", description: "4-seater solid wood dining set with cushioned chairs.", badge: null, sku: "D72364", features: ["Solid Wood", "4-Seater", "Durable Finish", "Easy Assembly"] },
    { id: 6, name: "Study Desk", category: "Office", subCategory: "Study Tables", price: 7999, displayPrice: "₹7,999", originalPrice: "₹11,999", image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800&h=600", description: "Minimalist design with drawers for home office.", badge: null, sku: "SD72364", features: ["Minimalist Design", "Storage Drawers", "Cable Management", "Modern Style"] },
    { id: 7, name: "Dual Comfort Mattress", category: "Mattress", subCategory: "Dual Comfort Mattress", price: 6500, displayPrice: "₹6,500", originalPrice: "₹8,000", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800&h=600", description: "Hard on one side, soft on the other. Usable on both sides.", badge: "Trending", sku: "DC72364", features: ["Dual Comfort", "Reversible", "High Density Foam", "7 Year Warranty"] },
    { id: 8, name: "Teak Wood Bedside Table", category: "Bedroom", subCategory: "Bedside Tables", price: 4500, displayPrice: "₹4,500", originalPrice: "₹6,000", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800&h=600", description: "Compact bedside table with single drawer storage.", badge: null, sku: "BT72364", features: ["Teak Wood", "Compact", "Pre-assembled", "Classic Finish"] },
    { id: 9, name: "Recliner Sofa 1 Seater", category: "Living", subCategory: "Recliners", price: 15999, displayPrice: "₹15,999", originalPrice: "₹22,999", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800&h=600", description: "Single seater manual recliner with plush cushioning.", badge: "Comfort", sku: "RC72364", features: ["Manual Recline", "High Back", "Arm Support", "Velvet Fabric"] },
    { id: 10, name: "Bookshelf with Glass Doors", category: "Office", subCategory: "Bookshelves", price: 11000, displayPrice: "₹11,000", originalPrice: "₹16,000", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800&h=600", description: "Spacious bookshelf with glass doors for dust protection.", badge: null, sku: "BS72364", features: ["Glass Doors", "Multiple Shelves", "Engineered Wood", "Walnut Finish"] },
    { id: 11, name: "Latex Mattress", category: "Mattress", subCategory: "Latex Mattress", price: 18000, displayPrice: "₹18,000", originalPrice: "₹25,000", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800&h=600", description: "Natural latex layers for breathable and bouncy support.", badge: "Premium", sku: "LM72364", features: ["Natural Latex", "Breathable", "Hypoallergenic", "10 Year Warranty"] },
    { id: 12, name: "Shoe Rack 4 Layer", category: "Living", subCategory: "Shoe Racks", price: 5500, displayPrice: "₹5,500", originalPrice: "₹7,500", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800&h=600", description: "Engineered wood shoe rack with ventilation.", badge: null, sku: "SR72364", features: ["Ventilation Cuts", "4 Shelves", "Compact Depth", "Dark Walnut"] }
];

const SLIDES = [
    {
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1600&h=600",
        title: "Sleep Better, Live Better",
        subtitle: "Premium mattresses designed for your comfort",
        cta: "Shop Mattresses",
        offer: "Up to 50% OFF",
        category: "Mattress"
    },
    {
        image: "https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&q=80&w=1600&h=600",
        title: "Transform Your Bedroom",
        subtitle: "Stylish furniture for modern homes",
        cta: "Shop Bedroom",
        offer: "Free Delivery",
        category: "Bedroom"
    },
    {
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1600&h=600",
        title: "Comfort Redefined",
        subtitle: "Premium sofas and living room furniture",
        cta: "Shop Living",
        offer: "100 Night Trial",
        category: "Living"
    }
];

const CATEGORY_MODAL_DATA = {
    'Mattress': {
        title: 'Mattresses & Beddings',
        items: [
            { name: 'All Mattresses', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=400', category: 'Mattress' },
            { name: 'Plus Mattresses', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=400', category: 'Mattress' },
            { name: 'Protectors', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&q=80&w=400', category: 'Mattress' },
            { name: 'Bedsheets', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&q=80&w=400', category: 'Mattress' },
            { name: 'Sleeping Pillows', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&q=80&w=400', category: 'Mattress' },
            { name: 'Pillow Protectors', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&q=80&w=400', category: 'Mattress' },
            { name: 'Pillow Covers', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&q=80&w=400', category: 'Mattress' },
            { name: 'Comforters', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&q=80&w=400', category: 'Mattress' },
            { name: 'Dohar Blankets', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&q=80&w=400', category: 'Mattress' }
        ]
    },
    'Bedroom': {
        title: 'Beds & Bedroom',
        items: [
            { name: 'All Beds', image: 'https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&q=80&w=400', category: 'Bedroom' },
            { name: 'Solid Wood Beds', image: 'https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&q=80&w=400', category: 'Bedroom' },
            { name: 'Storage Beds', image: 'https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&q=80&w=400', category: 'Bedroom' },
            { name: 'King Size Beds', image: 'https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&q=80&w=400', category: 'Bedroom' },
            { name: 'Queen Size Beds', image: 'https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&q=80&w=400', category: 'Bedroom' },
            { name: 'Bedside Tables', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400', category: 'Bedroom' },
            { name: 'Wardrobes', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400', category: 'Bedroom' },
            { name: 'Dressing Tables', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400', category: 'Bedroom' },
            { name: 'Bedroom Sets', image: 'https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&q=80&w=400', category: 'Bedroom' }
        ]
    },
    'Living': {
        title: 'Living Room',
        items: [
            { name: 'All Sofas', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400', category: 'Living' },
            { name: 'L Shape Sofas', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400', category: 'Living' },
            { name: '3 Seater Sofas', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400', category: 'Living' },
            { name: 'Recliners', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400', category: 'Living' },
            { name: 'Coffee Tables', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400', category: 'Living' },
            { name: 'TV Units', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400', category: 'Living' },
            { name: 'Shoe Racks', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400', category: 'Living' },
            { name: 'Accent Chairs', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400', category: 'Living' },
            { name: 'Ottomans', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400', category: 'Living' }
        ]
    },
    'Dining': {
        title: 'Dining & Kitchen',
        items: [
            { name: 'Dining Sets', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=400', category: 'Dining' },
            { name: 'Dining Tables', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=400', category: 'Dining' },
            { name: 'Dining Chairs', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=400', category: 'Dining' },
            { name: 'Bar Stools', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=400', category: 'Dining' },
            { name: 'Kitchen Cabinets', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400', category: 'Dining' },
            { name: 'Dining Storage', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=400', category: 'Dining' }
        ]
    },
    'Office': {
        title: 'Study & Office',
        items: [
            { name: 'Study Tables', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=400', category: 'Office' },
            { name: 'Office Chairs', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=400', category: 'Office' },
            { name: 'Computer Tables', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=400', category: 'Office' },
            { name: 'Bookshelves', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400', category: 'Office' },
            { name: 'Filing Cabinets', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400', category: 'Office' },
            { name: 'Office Storage', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400', category: 'Office' }
        ]
    }
};