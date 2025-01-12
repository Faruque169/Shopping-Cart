async function updateCartUI() {
    const response = await fetch('products.json');
    const products = await response.json();

    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const totalPrice = document.getElementById('total-price');

    // Update cart item display
    if (cartItems) {
        cartItems.innerHTML = cart.map(item => {
            const product = products.find(product => product.id === item.id);
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

    // Update total price
    if (totalPrice) {
        totalPrice.textContent = cart.reduce((total, item) => {
            const product = products.find(product => product.id === item.id);
            return total + product.price * item.quantity;
        }, 0).toFixed(2);
    }
}

document.addEventListener('DOMContentLoaded', updateCartUI);
