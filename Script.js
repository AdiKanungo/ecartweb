// Product data
const products = [
    { name: 'Refresh your space', category: 'Home & Furniture', image: 'box1_image.jpg' },
    { name: 'Health & Personal Care', category: 'Health', image: 'box2_image.jpg' },
    { name: 'Give your home a make over', category: 'Home', image: 'box3_image.jpg' },
    { name: 'Electronics & Devices', category: 'Electronics', image: 'box4_image.jpg' },
    { name: 'Beauty Picks', category: 'Beauty', image: 'box5_image.jpg' },
    { name: 'Shop Pet supplies', category: 'Pets', image: 'box6_image.jpg' },
    { name: 'New arrivals in Toys', category: 'Toys', image: 'box7_image.jpg' },
    { name: 'Discover fashion trends', category: 'Fashion', image: 'box8_image.jpg' },
    { name: 'For your Fitness Needs', category: 'Fitness', image: 'box9_image.jpg' },
    { name: 'Shop activity trackers and smartwatches', category: 'Electronics', image: 'box10_image.jpg' },
    { name: 'Home & Kitchen Under $30', category: 'Home', image: 'box11_image.jpg' },
    { name: 'Shop Laptops & Tablets', category: 'Electronics', image: 'box12_image.jpg' }
];

// DOM Elements
const searchInput = document.querySelector('.search-input');
const searchContainer = document.querySelector('.nav-search');
const shopSection = document.querySelector('.shop-section');

// Live search functionality
if (searchInput) {
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const boxes = document.querySelectorAll('.box');
        let resultCount = 0;

        boxes.forEach(box => {
            const title = box.querySelector('h2').textContent.toLowerCase();
            if (title.includes(searchTerm) || searchTerm === '') {
                box.style.display = 'flex'; // Or 'block' depending on your layout
                resultCount++;
            } else {
                box.style.display = 'none';
            }
        });

        // Show message if no results, otherwise remove it
        if (searchTerm && resultCount === 0) {
            showNoResults();
        } else {
            removeNoResults();
        }
    });
}

// Corrected: Safely appends the message instead of wiping out shopSection
function showNoResults() {
    if (!document.querySelector('.no-results') && shopSection) {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results';
        noResultsDiv.textContent = 'No products found. Try a different search term.';
        shopSection.appendChild(noResultsDiv);
    }
}

// Corrected: Safely removes the message
function removeNoResults() {
    const noResults = document.querySelector('.no-results');
    if (noResults) {
        noResults.remove();
    }
}

// Back to Top button functionality
document.addEventListener('DOMContentLoaded', function() {
    const backToTopBtn = document.querySelector('.foot-panel1');
    
    if (backToTopBtn) {
        backToTopBtn.style.cursor = 'pointer';
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Cart functionality
const cartBtn = document.querySelector('.nav-cart');
if (cartBtn) {
    cartBtn.addEventListener('click', function() {
        alert('Shopping Cart feature coming soon!');
    });
}

// Sign in functionality
const signInBtn = document.querySelector('.nav-singin');
if (signInBtn) {
    signInBtn.style.cursor = 'pointer';
    signInBtn.addEventListener('click', function() {
        alert('Sign in page coming soon!');
    });
}

// Box hover effects and click handlers
document.querySelectorAll('.box').forEach(box => {
    box.style.cursor = 'pointer';
    box.style.transition = 'all 0.3s ease'; // Set transition once instead of on hover
    
    box.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        this.style.transform = 'translateY(-5px)';
    });
    
    box.addEventListener('mouseleave', function() {
        this.style.boxShadow = 'none';
        this.style.transform = 'translateY(0)';
    });

    box.addEventListener('click', function() {
        const title = this.querySelector('h2').textContent;
        alert(`You clicked on: ${title}`);
    });
});