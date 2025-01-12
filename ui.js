// Calculate Subtotal
function calculateSubtotal(products) {
    const subtotal = cart.reduce((sum, item) => {
        const product = products.find(product => product.id === item.id);
        if (!product) {
            console.warn(`Product with ID ${item.id} not found`);
            return sum;
        }
        return sum + product.price * item.quantity;
    }, 0);
    console.log('Subtotal:', subtotal);
    return subtotal;
}

// Promo Code Data
const promoCodes = {
    ostad10: 0.10,
    ostad5: 0.05,
};

let appliedPromoCode = null; // Track applied promo code

// Apply Promo Code
function applyPromoCode() {
    const promoInput = document.getElementById('promo-code').value.trim().toLowerCase();
    const promoMessage = document.getElementById('promo-message');

    if (promoCodes.hasOwnProperty(promoInput)) {
        if (appliedPromoCode === promoInput) {
            promoMessage.textContent = 'This promo code is already applied.';
            promoMessage.style.color = 'red';
        } else {
            appliedPromoCode = promoInput;
            promoMessage.textContent = `Promo code "${promoInput}" applied successfully!`;
            promoMessage.style.color = 'green';
            updateCartUI();
        }
    } else {
        promoMessage.textContent = 'Invalid promo code. Please try again.';
        promoMessage.style.color = 'red';
    }
}

// Calculate Discount
function calculateDiscount(subtotal) {
    const discountPrice = document.getElementById('discount-price');
    if (appliedPromoCode && promoCodes[appliedPromoCode]) {
        const discount = subtotal * promoCodes[appliedPromoCode];
        console.log('Discount:', discount, 'for promo code:', appliedPromoCode);
        return discount;
    }
    console.log('No discount applied');
    return 0;
}

// Update Cart UI
async function updateCartUI() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) throw new Error('Failed to fetch product data');
        const products = await response.json();

        const cartItems = document.getElementById('cart-items');
        const cartCount = document.getElementById('cart-count');
        const totalPrice = document.getElementById('total-price');
        
        const promoInput = document.getElementById('promo-code').value.trim().toLowerCase();

        // Create a product map for efficient lookup
        const productMap = products.reduce((map, product) => {
            map[product.id] = product;
            return map;
        }, {});

        // Update cart item display
        if (cartItems) {
            cartItems.innerHTML = cart.map(item => {
                const product = productMap[item.id];
                if (!product) {
                    console.warn(`Product with ID ${item.id} not found`);
                    return '';
                }
                return `
                    <div class="cart-item">
                        <h3>${product.name}</h3>
                        <p>Price: $${product.price.toFixed(2)}</p>
                        <input type="number" min="1" value="${item.quantity}" 
                               onchange="updateQuantity(${item.id}, this.value)">
                        <button onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                `;
            }).join('');
        }

        // Update cart count
        if (cartCount) {
            cartCount.textContent = cart.reduce((count, item) => count + item.quantity, 0);
        }

        // Calculate subtotal and apply discount
        const subtotal = calculateSubtotal(products);
        const discount = calculateDiscount(subtotal);
        const total = (subtotal - discount).toFixed(2);

        // showing subtotal and discount
        const subtotalValue = document.getElementById('subtotal-value');
        subtotalValue.textContent = subtotal.toFixed(2); // Display subtotal

        const discountValue = document.getElementById('discount-value');
        discountValue.textContent = discount; // Display total (after discount)

        const promocodeValue = document.getElementById('promo-value');
        promocodeValue.textContent = promoInput; // Display total (after discount)

        // Update total price
        if (totalPrice) {
            totalPrice.textContent = total;
        }
    } catch (error) {
        console.error('Error updating cart UI:', error.message);
    }
}

document.addEventListener('DOMContentLoaded', updateCartUI);
