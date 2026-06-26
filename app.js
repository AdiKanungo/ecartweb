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
        showNotification(`${product.name} added to cart!`, 'success');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveToStorage();
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
    
    const container = document.querySelector('.notification-container') || createNotificationContainer();
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.className = 'notification-container';
    document.body.appendChild(container);
    return container;
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
    setupAuthButtons();
    renderProductsGrid();
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Product boxes
    document.querySelectorAll('.box').forEach(box => {
        box.addEventListener('click', handleProductClick);
        box.addEventListener('mouseenter', addHoverEffect);
        box.addEventListener('mouseleave', removeHoverEffect);
    });

    // Back to top
    const backToTopBtn = document.querySelector('.foot-panel1');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
    }

    // Cart button
    const cartBtn = document.querySelector('.nav-cart');
    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }

    // Sign in button
    const signInBtn = document.querySelector('.nav-singin');
    if (signInBtn) {
        signInBtn.addEventListener('click', openAuthModal);
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
        showNotification('✨ Browse our handmade collection below!', 'info');
    }
}

function handlePanelMenuClick(e) {
    const text = e.target.textContent.trim();
    showNotification(`Loading: ${text}...`, 'info');
    
    if (text.includes('Bestsellers')) {
        filterBestsellers();
    } else if (text.includes('New Arrivals')) {
        filterNewArrivals();
    } else if (text.includes('Exclusive')) {
        showNotification('✨ Exclusive handmade items - Browse below!', 'success');
    } else if (text.includes('Gift')) {
        filterGiftItems();
    } else if (text.includes('Artisan')) {
        showArtisanStories();
    }
}

function filterByCategory(e) {
    const category = e.target.value;
    if (category === 'All Categories') {
        renderProductsGrid();
        showNotification('Showing all products', 'info');
    } else {
        const filtered = productDatabase.filter(p => p.category === category);
        if (filtered.length > 0) {
            displayFilteredProducts(filtered, `${category} Collection`);
        } else {
            showNotification(`No products found in ${category}`, 'warning');
        }
    }
}

function displayFilteredProducts(products, title) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    const header = document.querySelector('.products-header');
    if (header) {
        header.innerHTML = `<h2>${title}</h2><p>Filtered results</p>`;
    }

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" onclick="handleProductCardClick(${product.id})">
            <div class="product-image" style="background-image: url('${product.image}')">
                <span class="product-badge">⭐ ${product.rating}</span>
            </div>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    <span class="stars">${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 ? '½' : ''}${'☆'.repeat(5-Math.ceil(product.rating))}</span>
                    <span class="reviews">${product.reviews} reviews</span>
                </div>
                <div class="product-footer">
                    <span class="product-price">₹${product.price.toLocaleString()}</span>
                    <button class="add-cart-btn" onclick="event.stopPropagation(); addProductToCart(${product.id})">
                        <i class="fa-solid fa-cart-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    const productsSection = document.querySelector('.products-container');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function filterBestsellers() {
    const bestsellers = productDatabase.sort((a, b) => {
        if (b.reviews !== a.reviews) return b.reviews - a.reviews;
        return b.rating - a.rating;
    });
    displayFilteredProducts(bestsellers.slice(0, 12), '⭐ Best Sellers');
    showNotification('Showing bestsellers sorted by popularity', 'success');
}

function filterNewArrivals() {
    // Simulate new arrivals by randomizing (in real app, would use date field)
    const newArrivals = [...productDatabase].sort(() => Math.random() - 0.5);
    displayFilteredProducts(newArrivals.slice(0, 12), '✨ New Arrivals');
    showNotification('Showing latest handmade products', 'success');
}

function filterGiftItems() {
    const giftItems = productDatabase.filter(p => 
        p.category.includes('Gift') || 
        p.category.includes('Jewelry') || 
        p.category.includes('Art') ||
        p.price < 3000
    );
    displayFilteredProducts(giftItems.length > 0 ? giftItems : productDatabase, '🎁 Perfect Gift Items');
    showNotification('Gift-perfect handmade items curated for you', 'success');
}

function showArtisanStories() {
    const stories = `
        <div style="padding: 40px; text-align: center; color: #2c3e50;">
            <h2>🎨 Meet Our Artisans</h2>
            <p style="margin: 20px 0; line-height: 1.6;">
                Every product on AK Industry is crafted by talented artisans around the world.
                Each handmade piece carries the passion and expertise of skilled craftspeople
                dedicated to preserving traditional arts and techniques.
            </p>
            <div style="margin-top: 30px; background: #f8f9fa; padding: 20px; border-radius: 8px;">
                <h4>Our Artisan Categories:</h4>
                <p>✨ Jewelry Makers • 🧵 Textile Artists • 🍽️ Potters • 👜 Leather Crafters</p>
                <p>🎨 Painters • 🪵 Woodworkers • 🔨 Metalworkers • 🧼 Natural Product Makers</p>
            </div>
            <p style="margin-top: 20px; color: #7f8c8d;">
                By shopping with us, you directly support these artisans and help preserve traditional craftsmanship.
            </p>
        </div>
    `;
    
    const modal = createModal('artisan-modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            ${stories}
        </div>
    `;
    document.body.appendChild(modal);
    setupModalClose(modal);
}

function showLocationModal() {
    const modal = createModal('location-modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Delivery Location</h2>
            <form style="margin-top: 20px;">
                <div class="form-group">
                    <label>Country/Region</label>
                    <select style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px;">
                        <option>India</option>
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>Canada</option>
                        <option>Australia</option>
                        <option>Other Countries</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Set Location</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    setupModalClose(modal);
    
    modal.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();
        const location = this.querySelector('select').value;
        showNotification(`Location set to ${location}`, 'success');
        modal.remove();
    });
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const boxes = document.querySelectorAll('.box');
    let visibleCount = 0;

    boxes.forEach(box => {
        const title = box.querySelector('h2').textContent.toLowerCase();
        if (title.includes(searchTerm) || searchTerm === '') {
            box.style.display = 'block';
            visibleCount++;
        } else {
            box.style.display = 'none';
        }
    });

    if (searchTerm && visibleCount === 0) {
        showNoResults();
    } else {
        removeNoResults();
    }
}

function handleProductClick(e) {
    const productTitle = this.querySelector('h2').textContent;
    const product = productDatabase.find(p => p.name.includes(productTitle.split(' ')[0]));
    
    if (product) {
        showProductDetail(product);
    }
}

function showProductDetail(product) {
    const modal = createModal('product-detail-modal');
    
    modal.innerHTML = `
        <div class="modal-content product-detail">
            <span class="close">&times;</span>
            <div class="product-detail-container">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300'">
                </div>
                <div class="product-info">
                    <h2>${product.name}</h2>
                    <div class="rating">
                        <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}</span>
                        <span class="rating-value">${product.rating}/5 (${product.reviews} reviews)</span>
                    </div>
                    <p class="category">Category: <strong>${product.category}</strong></p>
                    <p class="description">${product.description}</p>
                    <div class="price-section">
                        <span class="price">₹${product.price.toLocaleString()}</span>
                        <span class="discount">Save 20%</span>
                    </div>
                    <div class="quantity-selector">
                        <label>Quantity:</label>
                        <input type="number" id="quantity-input" min="1" value="1">
                    </div>
                    <button class="btn btn-primary add-to-cart-btn">Add to Cart</button>
                    <button class="btn btn-secondary buy-now-btn">Buy Now</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setupModalClose(modal);

    document.querySelector('.add-to-cart-btn').addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('quantity-input').value);
        cart.addItem(product, quantity);
        modal.remove();
    });

    document.querySelector('.buy-now-btn').addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('quantity-input').value);
        cart.addItem(product, quantity);
        modal.remove();
        openCheckout();
    });
}

function addHoverEffect() {
    this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    this.style.transform = 'translateY(-5px)';
    this.style.transition = 'all 0.3s ease';
}

function removeHoverEffect() {
    this.style.boxShadow = 'none';
    this.style.transform = 'translateY(0)';
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openCart() {
    if (!auth.isLoggedIn()) {
        showNotification('Please login to view cart', 'warning');
        openAuthModal();
        return;
    }

    const modal = createModal('cart-modal');
    updateCartModal(modal);
    document.body.appendChild(modal);
    setupModalClose(modal);
}

function updateCartModal(modal) {
    const cartHTML = cart.items.length > 0 ? `
        <div class="cart-items">
            ${cart.items.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p class="price">₹${item.price.toLocaleString()}</p>
                    </div>
                    <div class="quantity-control">
                        <button class="qty-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">−</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <div class="total">₹${(item.price * item.quantity).toLocaleString()}</div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            `).join('')}
        </div>
        <div class="cart-summary">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>₹${cart.getTotal().toLocaleString()}</span>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
            </div>
            <div class="summary-row total-row">
                <span>Total:</span>
                <span>₹${cart.getTotal().toLocaleString()}</span>
            </div>
            <button class="btn btn-primary checkout-btn" onclick="openCheckout()">Proceed to Checkout</button>
        </div>
    ` : '<p class="empty-cart">Your cart is empty</p>';

    modal.innerHTML = `
        <div class="modal-content cart-modal">
            <span class="close">&times;</span>
            <h2>Shopping Cart</h2>
            ${cartHTML}
        </div>
    `;
}

function removeFromCart(productId) {
    cart.removeItem(productId);
    updateCartBadge();
    openCart();
    showNotification('Item removed from cart', 'info');
}

function updateCartQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
    } else {
        cart.updateQuantity(productId, newQuantity);
        updateCartBadge();
        openCart();
    }
}

function openCheckout() {
    if (cart.items.length === 0) {
        showNotification('Your cart is empty', 'warning');
        return;
    }

    if (!auth.isLoggedIn()) {
        showNotification('Please login to checkout', 'warning');
        openAuthModal();
        return;
    }

    const modal = createModal('checkout-modal');
    modal.innerHTML = `
        <div class="modal-content checkout-form">
            <span class="close">&times;</span>
            <h2>Checkout</h2>
            
            <div class="checkout-section">
                <h3>1. Delivery Address</h3>
                <form id="address-form">
                    <input type="text" placeholder="Full Name" id="fullname" required>
                    <input type="tel" placeholder="Phone Number" id="phone" pattern="[0-9]{10}" required>
                    <input type="text" placeholder="Street Address" id="street" required>
                    <input type="text" placeholder="City" id="city" required>
                    <input type="text" placeholder="Postal Code" id="postal" required>
                </form>
            </div>

            <div class="checkout-section">
                <h3>2. Payment Method</h3>
                <div class="payment-options">
                    <label><input type="radio" name="payment" value="card" checked onchange="togglePaymentForm('card')"> Credit/Debit Card</label>
                    <label><input type="radio" name="payment" value="upi" onchange="togglePaymentForm('upi')"> UPI</label>
                    <label><input type="radio" name="payment" value="wallet" onchange="togglePaymentForm('wallet')"> Digital Wallet</label>
                </div>
            </div>

            <div class="checkout-section" id="card-section">
                <h3>3. Card Details</h3>
                <form id="card-form">
                    <input type="text" placeholder="Card Holder Name" id="cardname" required>
                    <input type="text" placeholder="Card Number (16 digits)" id="cardnumber" maxlength="16" pattern="[0-9]{16}" required>
                    <div style="display: flex; gap: 10px;">
                        <input type="text" placeholder="MM/YY" id="expiry" maxlength="5" pattern="[0-9]{2}/[0-9]{2}" required>
                        <input type="text" placeholder="CVV" id="cvv" maxlength="3" pattern="[0-9]{3}" required>
                    </div>
                </form>
            </div>

            <div class="checkout-section hidden" id="upi-section">
                <h3>3. UPI Details</h3>
                <form id="upi-form">
                    <input type="text" placeholder="UPI ID (e.g., yourname@bank)" id="upiid" required>
                </form>
            </div>

            <div class="checkout-section hidden" id="wallet-section">
                <h3>3. Digital Wallet</h3>
                <form id="wallet-form">
                    <input type="text" placeholder="Wallet ID or Account Number" id="walletid" required>
                </form>
            </div>

            <div class="order-summary">
                <h3>Order Summary</h3>
                ${cart.items.map(item => `
                    <div class="summary-row">
                        <span>${item.name} (x${item.quantity})</span>
                        <span>₹${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                `).join('')}
                <div class="summary-row">
                    <span>Subtotal (${cart.items.length} items):</span>
                    <span>₹${cart.getTotal().toLocaleString()}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping:</span>
                    <span>Free</span>
                </div>
                <div class="summary-row total-row">
                    <span>Total Amount:</span>
                    <span>₹${cart.getTotal().toLocaleString()}</span>
                </div>
            </div>

            <button class="btn btn-primary place-order-btn" style="width: 100%; margin-top: 20px; cursor: pointer;">Place Order</button>
            <button class="btn btn-secondary" style="width: 100%; margin-top: 10px; cursor: pointer;" onclick="this.closest('.modal').remove();">Cancel</button>
        </div>
    `;

    document.body.appendChild(modal);
    setupModalClose(modal);

    document.querySelector('.place-order-btn').addEventListener('click', validateAndProcessOrder);
}

function togglePaymentForm(type) {
    document.getElementById('card-section').classList.add('hidden');
    document.getElementById('upi-section').classList.add('hidden');
    document.getElementById('wallet-section').classList.add('hidden');
    
    if (type === 'card') {
        document.getElementById('card-section').classList.remove('hidden');
    } else if (type === 'upi') {
        document.getElementById('upi-section').classList.remove('hidden');
    } else if (type === 'wallet') {
        document.getElementById('wallet-section').classList.remove('hidden');
    }
}

function validateAndProcessOrder() {
    const fullname = document.getElementById('fullname')?.value;
    const phone = document.getElementById('phone')?.value;
    const street = document.getElementById('street')?.value;
    const city = document.getElementById('city')?.value;
    const postal = document.getElementById('postal')?.value;

    if (!fullname || !phone || !street || !city || !postal) {
        showNotification('Please fill in all address fields', 'error');
        return;
    }

    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    if (paymentMethod === 'card') {
        const cardname = document.getElementById('cardname')?.value;
        const cardnumber = document.getElementById('cardnumber')?.value;
        const expiry = document.getElementById('expiry')?.value;
        const cvv = document.getElementById('cvv')?.value;

        if (!cardname || !cardnumber || !expiry || !cvv) {
            showNotification('Please fill in all card details', 'error');
            return;
        }

        if (cardnumber.length !== 16) {
            showNotification('Card number must be 16 digits', 'error');
            return;
        }

        if (cvv.length !== 3) {
            showNotification('CVV must be 3 digits', 'error');
            return;
        }

        showNotification('Processing card payment...', 'info');
    } else if (paymentMethod === 'upi') {
        const upiid = document.getElementById('upiid')?.value;
        if (!upiid || !upiid.includes('@')) {
            showNotification('Please enter valid UPI ID', 'error');
            return;
        }
        showNotification('Processing UPI payment...', 'info');
    } else if (paymentMethod === 'wallet') {
        const walletid = document.getElementById('walletid')?.value;
        if (!walletid) {
            showNotification('Please enter wallet ID', 'error');
            return;
        }
        showNotification('Processing wallet payment...', 'info');
    }

    setTimeout(() => {
        processOrder();
    }, 500);
}

function processOrder() {
    const orderId = 'ORD' + Date.now();
    const orderData = {
        id: orderId,
        userId: auth.currentUser.id,
        items: cart.items,
        total: cart.getTotal(),
        date: new Date(),
        status: 'Confirmed'
    };

    let orders = JSON.parse(localStorage.getItem('ak_orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('ak_orders', JSON.stringify(orders));

    cart.clear();
    updateCartBadge();

    showOrderConfirmation(orderId, orderData.total);

    document.querySelector('.checkout-form').parentElement.remove();
}

function showOrderConfirmation(orderId, total) {
    const modal = createModal('confirmation-modal');
    modal.innerHTML = `
        <div class="modal-content confirmation">
            <span class="close">&times;</span>
            <div class="confirmation-content">
                <div class="success-icon">✓</div>
                <h2>Order Confirmed!</h2>
                <p>Thank you for your purchase</p>
                <div class="order-details">
                    <p><strong>Order ID:</strong> ${orderId}</p>
                    <p><strong>Total Amount:</strong> ₹${total.toLocaleString()}</p>
                    <p><strong>Status:</strong> <span class="status-badge">Confirmed</span></p>
                </div>
                <p class="delivery-message">Your order will be delivered in 3-5 business days</p>
                <button class="btn btn-primary" onclick="location.reload()">Continue Shopping</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setupModalClose(modal);
    showNotification('Order placed successfully!', 'success');
}

function openAuthModal() {
    const modal = createModal('auth-modal');
    modal.innerHTML = `
        <div class="modal-content auth-modal">
            <span class="close">&times;</span>
            <div class="auth-container">
                <div class="auth-tabs">
                    <button class="tab-btn active" data-tab="login">Login</button>
                    <button class="tab-btn" data-tab="register">Register</button>
                </div>

                <div class="tab-content" id="login-tab">
                    <h2>Sign In</h2>
                    <form id="login-form">
                        <input type="email" placeholder="Email Address" required>
                        <input type="password" placeholder="Password" required>
                        <button type="submit" class="btn btn-primary">Sign In</button>
                    </form>
                </div>

                <div class="tab-content hidden" id="register-tab">
                    <h2>Create Account</h2>
                    <form id="register-form">
                        <input type="text" placeholder="Full Name" required>
                        <input type="email" placeholder="Email Address" required>
                        <input type="password" placeholder="Password (min. 6 chars)" required>
                        <input type="password" placeholder="Confirm Password" required>
                        <button type="submit" class="btn btn-primary">Create Account</button>
                    </form>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setupModalClose(modal);

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
            
            this.classList.add('active');
            document.getElementById(this.dataset.tab + '-tab').classList.remove('hidden');
        });
    });

    // Login handler
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;

        try {
            auth.login(email, password);
            showNotification(`Welcome back, ${auth.currentUser.name}!`, 'success');
            modal.remove();
            updateUIState();
        } catch (error) {
            showNotification(error.message, 'error');
        }
    });

    // Register handler
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelectorAll('input[type="email"]')[0].value;
        const password = this.querySelectorAll('input[type="password"]')[0].value;
        const confirmPassword = this.querySelectorAll('input[type="password"]')[1].value;

        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        try {
            auth.register(email, password, name);
            auth.login(email, password);
            showNotification(`Welcome, ${auth.currentUser.name}!`, 'success');
            modal.remove();
            updateUIState();
        } catch (error) {
            showNotification(error.message, 'error');
        }
    });
}

function setupAuthButtons() {
    const signInBtn = document.querySelector('.nav-singin');
    if (signInBtn && auth.isLoggedIn()) {
        signInBtn.innerHTML = `
            <p><span>Hello, ${auth.currentUser.name}</span></p>
            <p class="nav-second logout-btn">Logout</p>
        `;
        signInBtn.querySelector('.logout-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            auth.logout();
            showNotification('Logged out successfully', 'info');
            updateUIState();
            location.reload();
        });
    }
}

function updateUIState() {
    setupAuthButtons();
    updateCartBadge();
}

function updateCartBadge() {
    const cartBtn = document.querySelector('.nav-cart');
    if (cartBtn) {
        const count = cart.getItemCount();
        if (count > 0) {
            let badge = cartBtn.querySelector('.cart-badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                cartBtn.appendChild(badge);
            }
            badge.textContent = count;
        }
    }
}

function createModal(id) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = id;
    return modal;
}

function setupModalClose(modal) {
    const closeBtn = modal.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.remove());
    }

    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
}

function showNoResults() {
    if (!document.querySelector('.no-results')) {
        const shopSection = document.querySelector('.shop-section');
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = '<p>No products found. Try a different search term.</p>';
        shopSection.appendChild(noResults);
    }
}

function removeNoResults() {
    const noResults = document.querySelector('.no-results');
    if (noResults) {
        noResults.remove();
    }
}

// Render products grid
function renderProductsGrid() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = productDatabase.map(product => `
        <div class="product-card" onclick="handleProductCardClick(${product.id})">
            <div class="product-image" style="background-image: url('${product.image}')">
                <span class="product-badge">⭐ ${product.rating}</span>
            </div>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    <span class="stars">${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 ? '½' : ''}${'☆'.repeat(5-Math.ceil(product.rating))}</span>
                    <span class="reviews">${product.reviews} reviews</span>
                </div>
                <div class="product-footer">
                    <span class="product-price">₹${product.price.toLocaleString()}</span>
                    <button class="add-cart-btn" onclick="event.stopPropagation(); addProductToCart(${product.id})">
                        <i class="fa-solid fa-cart-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function handleProductCardClick(productId) {
    const product = productDatabase.find(p => p.id === productId);
    if (product) {
        showProductDetail(product);
    }
}

function addProductToCart(productId) {
    const product = productDatabase.find(p => p.id === productId);
    if (product) {
        if (!auth.isLoggedIn()) {
            showNotification('Please login to add items to cart', 'warning');
            openAuthModal();
            return;
        }
        cart.addItem(product, 1);
        updateCartBadge();
    }
}
