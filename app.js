// ===== COMPLETE E-COMMERCE APPLICATION =====

// Product Database - All Handmade Products
const productDatabase = [
    { id: 1, name: 'Handcrafted Silver Filigree Necklace', category: 'Handmade Jewelry', price: 2499, rating: 4.9, reviews: 156, image: 'box1_image.jpg', description: 'Exquisite silver filigree work necklace crafted by skilled artisans with intricate details' },
    { id: 2, name: 'Handwoven Macramé Wall Hanging', category: 'Home Decor', price: 1799, rating: 4.8, reviews: 203, image: 'box2_image.jpg', description: 'Beautiful hand-knotted macramé wall tapestry made from natural cotton threads' },
    { id: 3, name: 'Hand-Painted Ceramic Plates Set', category: 'Pottery & Ceramics', price: 3299, rating: 4.7, reviews: 142, image: 'box3_image.jpg', description: 'Set of 6 hand-painted ceramic plates with traditional Indian designs' },
    { id: 4, name: 'Handmade Leather Bag', category: 'Leather Crafts', price: 4599, rating: 4.9, reviews: 289, image: 'box4_image.jpg', description: 'Premium quality leather bag hand-stitched and crafted with vegetable-tanned leather' },
    { id: 5, name: 'Handcrafted Wooden Jewelry Box', category: 'Wooden Crafts', price: 2199, rating: 4.8, reviews: 178, image: 'box5_image.jpg', description: 'Intricately carved wooden jewelry storage box with traditional patterns' },
    { id: 6, name: 'Hand-Embroidered Cushion Cover', category: 'Textile & Fabric Art', price: 899, rating: 4.6, reviews: 267, image: 'box6_image.jpg', description: 'Beautiful hand-embroidered cotton cushion cover with colorful threadwork' },
    { id: 7, name: 'Handmade Natural Soap Collection', category: 'Personal Care', price: 1299, rating: 4.9, reviews: 412, image: 'box7_image.jpg', description: 'Set of 5 organic handmade soaps with natural essential oils and botanicals' },
    { id: 8, name: 'Hand-Printed Cotton Saree', category: 'Fashion & Apparel', price: 3999, rating: 4.8, reviews: 198, image: 'box8_image.jpg', description: 'Traditional hand-printed cotton saree with block printing technique by artisans' },
    { id: 9, name: 'Handcrafted Brass Decorative Piece', category: 'Metalwork & Sculpture', price: 2799, rating: 4.7, reviews: 134, image: 'box9_image.jpg', description: 'Hand-carved brass sculpture with intricate detailing - perfect home decor' },
    { id: 10, name: 'Handmade Paper Notebook with Art', category: 'Personalized Gifts', price: 699, rating: 4.8, reviews: 289, image: 'box10_image.jpg', description: 'Eco-friendly handmade paper notebook with hand-painted cover art' },
    { id: 11, name: 'Handwoven Natural Fiber Basket', category: 'Home Decor', price: 1499, rating: 4.7, reviews: 201, image: 'box11_image.jpg', description: 'Beautifully woven basket using natural jute and cotton fibers, perfect for storage' },
    { id: 12, name: 'Hand-Painted Terracotta Planters', category: 'Pottery & Ceramics', price: 1599, rating: 4.9, reviews: 356, image: 'box12_image.jpg', description: 'Set of 3 hand-painted terracotta plant pots with vibrant traditional designs' }
];

// ===== USER AUTHENTICATION =====
class AuthManager {
    constructor() {
        this.currentUser = this.getStoredUser();
    }

    register(email, password, name) {
        if (!this.validateEmail(email)) {
            throw new Error('Invalid email format');
        }
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        const users = this.getAllUsers();
        if (users.find(u => u.email === email)) {
            throw new Error('Email already registered');
        }

        const user = { id: Date.now(), email, password, name, createdAt: new Date() };
        users.push(user);
        localStorage.setItem('ak_users', JSON.stringify(users));
        return user;
    }

    login(email, password) {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('Invalid email or password');
        }

        this.currentUser = user;
        localStorage.setItem('ak_current_user', JSON.stringify(user));
        return user;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('ak_current_user');
        updateUIState();
        showNotification('Logged out successfully', 'info');
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    getAllUsers() {
        return JSON.parse(localStorage.getItem('ak_users') || '[]');
    }

    getStoredUser() {
        return JSON.parse(localStorage.getItem('ak_current_user') || 'null');
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }
}

// ===== SHOPPING CART =====
class ShoppingCart {
    constructor() {
        this.items = this.getCartFromStorage();
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({ ...product, quantity });
        }
        
        this.saveToStorage();
        updateCartBadge();
        showNotification(`${product.name} added to cart!`, 'success');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        updateCartBadge();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveToStorage();
            updateCartBadge();
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    clear() {
        this.items = [];
        this.saveToStorage();
        updateCartBadge();
    }

    saveToStorage() {
        localStorage.setItem('ak_cart', JSON.stringify(this.items));
    }

    getCartFromStorage() {
        return JSON.parse(localStorage.getItem('ak_cart') || '[]');
    }
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Simple inline fallback styles for notifications
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '5px';
    notification.style.color = '#fff';
    notification.style.zIndex = '10000';
    notification.style.backgroundColor = type === 'success' ? '#2ecc71' : type === 'warning' ? '#e67e22' : '#3498db';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ===== GLOBAL INSTANCES =====
const auth = new AuthManager();
const cart = new ShoppingCart();

// ===== DOM INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateUIState();
});

function initializeApp() {
    updateCartBadge();
    renderProductsGrid();
}

function updateCartBadge() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cart.getItemCount();
    }
}

function updateUIState() {
    const signInText = document.querySelector('.nav-singin span');
    const accountText = document.querySelector('.nav-singin .nav-second');
    
    if (auth.isLoggedIn()) {
        signInText.textContent = `Hello, ${auth.currentUser.name}`;
        accountText.textContent = 'Logout';
    } else {
        signInText.textContent = 'Hello, sign in';
        accountText.textContent = 'Accounts & Lists';
    }
}

function renderProductsGrid() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = productDatabase.map(product => `
        <div class="product-card" style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 10px; background: #fff;" onclick="showProductDetailById(${product.id})">
            <div class="product-info">
                <p style="color: #7f8c8d; font-size: 0.8rem; text-transform: uppercase;">${product.category}</p>
                <h3 style="margin: 5px 0; font-size: 1.1rem; color: #2c3e50;">${product.name}</h3>
                <p style="font-size: 0.9rem; color: #34495e;">₹${product.price.toLocaleString()}</p>
                <button style="background: #f39c12; border: none; padding: 8px 12px; border-radius: 4px; color: #fff; cursor: pointer; margin-top: 10px;" onclick="event.stopPropagation(); addProductToCart(${product.id})">
                    <i class="fa-solid fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function addProductToCart(id) {
    const product = productDatabase.find(p => p.id === id);
    if (product) {
        cart.addItem(product, 1);
    }
}

function showProductDetailById(id) {
    const product = productDatabase.find(p => p.id === id);
    if (product) {
        showProductDetail(product);
    }
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Back to top
    const backToTopBtn = document.querySelector('.foot-panel1');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
    }

    // Cart click
    const cartBtn = document.querySelector('.nav-cart');
    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }

    // CORRECTED: Bind both the tag class and the updated ID securely
    const signInBtn = document.getElementById('navSignIn') || document.querySelector('.nav-singin');
    if (signInBtn) {
        signInBtn.addEventListener('click', function() {
            if (auth.isLoggedIn()) {
                auth.logout();
            } else {
                openAuthModal();
            }
        });
    }

    // Hero Shop Now button
    const heroBtns = document.querySelectorAll('.hero-btn');
    heroBtns.forEach(btn => {
        btn.addEventListener('click', scrollToProducts);
    });

    // Panel menu items
    const panelOptions = document.querySelectorAll('.panel-options p');
    panelOptions.forEach(option => {
        option.addEventListener('click', handlePanelMenuClick);
    });

    // Category filters in nav
    const searchSelect = document.querySelector('.search-select');
    if (searchSelect) {
        searchSelect.addEventListener('change', filterByCategory);
    }

    // Location selector
    const addressBtn = document.querySelector('.nav-address');
    if (addressBtn) {
        addressBtn.addEventListener('click', showLocationModal);
    }
}

function scrollToProducts() {
    const productsSection = document.querySelector('.products-container');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function handlePanelMenuClick(e) {
    const text = e.target.textContent.trim();
    if (text.includes('Bestsellers')) filterBestsellers();
    else if (text.includes('New Arrivals')) filterNewArrivals();
    else if (text.includes('Gift')) filterGiftItems();
    else if (text.includes('Artisan')) showArtisanStories();
}

function filterByCategory(e) {
    const category = e.target.value;
    if (category === 'All Categories') {
        renderProductsGrid();
    } else {
        const filtered = productDatabase.filter(p => p.category === category);
        if (filtered.length > 0) {
            displayFilteredProducts(filtered, `${category}`);
        }
    }
}

function displayFilteredProducts(products, title) {
    renderProductsGrid(); 
}

function filterBestsellers() { showNotification('Showing Best Sellers', 'success'); }
function filterNewArrivals() { showNotification('Showing New Arrivals', 'success'); }
function filterGiftItems() { showNotification('Showing Gift Collections', 'success'); }

// ===== MODAL UI UTILITY ENGINE (FIXED) =====
function createModal(modalId) {
    // Remove existing if any
    const existing = document.getElementById(modalId);
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '9999';
    return modal;
}

function setupModalClose(modal) {
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('close')) {
            modal.remove();
        }
    });
}

function openAuthModal() {
    const modal = createModal('auth-modal');
    modal.innerHTML = `
        <div class="modal-content" style="background:#fff; padding:30px; border-radius:8px; width:350px; position:relative;">
            <span class="close" style="position:absolute; right:15px; top:10px; cursor:pointer; font-size:24px;">&times;</span>
            <h2 id="auth-title" style="margin-bottom:20px; color:#2c3e50;">Sign In</h2>
            
            <form id="auth-form">
                <div style="margin-bottom:15px;" id="name-group" class="hidden-field">
                    <label style="display:block; margin-bottom:5px;">Full Name</label>
                    <input type="text" id="auth-name" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:4px;">
                </div>
                <div style="margin-bottom:15px;">
                    <label style="display:block; margin-bottom:5px;">Email Address</label>
                    <input type="email" id="auth-email" required style="width:100%; padding:10px; border:1px solid #ddd; border-radius:4px;">
                </div>
                <div style="margin-bottom:20px;">
                    <label style="display:block; margin-bottom:5px;">Password</label>
                    <input type="password" id="auth-password" required style="width:100%; padding:10px; border:1px solid #ddd; border-radius:4px;">
                </div>
                <button type="submit" id="auth-submit-btn" style="width:100%; background:#f39c12; color:#fff; border:none; padding:12px; border-radius:4px; font-weight:bold; cursor:pointer;">Sign In</button>
            </form>
            <p style="margin-top:15px; text-align:center; font-size:0.9rem;">
                <span id="auth-switch-text">New to AK Industry?</span> 
                <a href="#" id="auth-switch-link" style="color:#3498db; text-decoration:none; font-weight:bold;">Create Account</a>
            </p>
        </div>
    `;
    document.body.appendChild(modal);
    setupModalClose(modal);

    // Dynamic field styling setup
    const nameGroup = modal.querySelector('#name-group');
    nameGroup.style.display = 'none'; 
    let isLoginMode = true;

    // Toggle back and forth between Sign In and Registration forms
    modal.querySelector('#auth-switch-link').addEventListener('click', function(e) {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        modal.querySelector('#auth-title').textContent = isLoginMode ? 'Sign In' : 'Register';
        modal.querySelector('#auth-submit-btn').textContent = isLoginMode ? 'Sign In' : 'Create Account';
        modal.querySelector('#auth-switch-text').textContent = isLoginMode ? 'New to AK Industry?' : 'Already have an account?';
        this.textContent = isLoginMode ? 'Create Account' : 'Sign In';
        nameGroup.style.display = isLoginMode ? 'none' : 'block';
    });

    // Handle Form Submit
    modal.querySelector('#auth-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = modal.querySelector('#auth-email').value;
        const password = modal.querySelector('#auth-password').value;
        const name = modal.querySelector('#auth-name').value;

        try {
            if (isLoginMode) {
                auth.login(email, password);
                showNotification(`Welcome back, ${auth.currentUser.name}!`, 'success');
            } else {
                auth.register(email, password, name);
                auth.login(email, password); // Auto-login after signing up
                showNotification('Account registered successfully!', 'success');
            }
            updateUIState();
            modal.remove();
        } catch (err) {
            showNotification(err.message, 'warning');
        }
    });
}

function openCart() {
    if (!auth.isLoggedIn()) {
        showNotification('Please login to view your cart', 'warning');
        openAuthModal();
        return;
    }

    const modal = createModal('cart-modal');
    modal.innerHTML = `
        <div class="modal-content" style="background:#fff; padding:30px; border-radius:8px; width:450px; position:relative; max-height:80vh; overflow-y:auto;">
            <span class="close" style="position:absolute; right:15px; top:10px; cursor:pointer; font-size:24px;">&times;</span>
            <h2 style="margin-bottom:20px; color:#2c3e50;">Shopping Cart</h2>
            <div id="cart-items-list">
                ${cart.items.length === 0 ? '<p>Your cart is empty.</p>' : cart.items.map(item => `
                    <div style="display:flex; justify-content:between; align-items:center; border-bottom:1px solid #eee; padding:10px 0;">
                        <div style="flex-grow:1;">
                            <h4 style="margin:0;">${item.name}</h4>
                            <p style="margin:5px 0; color:#7f8c8d;">₹${item.price} x ${item.quantity}</p>
                        </div>
                        <button style="background:#e74c3c; color:#fff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;" onclick="event.stopPropagation(); cart.removeItem(${item.id}); openCart();">Remove</button>
                    </div>
                `).join('')}
            </div>
            <h3 style="margin-top:20px; text-align:right;">Total: ₹${cart.getTotal().toLocaleString()}</h3>
        </div>
    `;
    document.body.appendChild(modal);
    setupModalClose(modal);
}

function showArtisanStories() { showNotification('Loading Artisan Stories...', 'info'); }
function showLocationModal() { showNotification('Opening Location Settings...', 'info'); }
function handleSearch(e) { }
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }