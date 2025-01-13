let cart = [];

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    cart = savedCart ? JSON.parse(savedCart) : [];
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    } else {
        console.warn('Cart count element not found in the DOM.');
    }
}


// Add product to cart
function addToCart(productId) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    saveCart();
    updateCartCount();
    updateCartUI();
}



// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    updateCartUI();
}

// Update product quantity in cart
function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, parseInt(quantity));
    }
    saveCart();
    updateCartUI();
}

// Clear the cart
function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
    updateCartUI();
}

// checkout
function checkout() {
    const appliedCodeMessage = appliedPromoCode ? ` with promo code ${appliedPromoCode} applied successfully.` : 'No promo code applied.';

    // clear promo-code & message
    const promoCodeInput = document.getElementById('promo-code');
    const promoMessage = document.getElementById('promo-message');
    
    
    // Clear promo code and message
    if (promoCodeInput) promoCodeInput.value = '';
    if (promoMessage) promoMessage.textContent = '';

    alert(`Checkout complete! \n${appliedCodeMessage}`);

    clearCart();
}


loadCart();