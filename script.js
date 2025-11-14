import { drinks } from './drinks.js';
import { dishes } from './dishes.js';

window.cart = JSON.parse(localStorage.getItem('cart') || '[]');

const DELIVERY_COST = 5.0;

const foodCategories = [
    { id: 'dishes-table-container', name: 'Gerichte', items: dishes },
    { id: 'drink-table-container', name: 'Getränke', items: drinks }
];

const showCategory = (id) => {
    const current = document.getElementById(id);
    if (!current) return; 

    current.classList.add('visible');

    const otherCategory = foodCategories.find(cat => cat.id !== id);
    const other = document.getElementById(otherCategory.id);
    if (other) other.classList.remove('visible');
};

window.onload = () => {

    if (document.getElementById('dishes-table-container')) {
        updateDisplayFoodItems();
    }

    updateCartDisplay();

    const shoppingcart = document.getElementById('shoppingcart');
    shoppingcart?.addEventListener("click", () => {
        const href = shoppingcart.getAttribute("data-href") || "cart.html";
        window.location.href = href;
    });

    document.getElementById('drinks-button-dishes')?.addEventListener('click', () => {
        showCategory(foodCategories[1].id);
    });

    document.getElementById('food-button-drinks')?.addEventListener('click', () => {
        showCategory(foodCategories[0].id);
    });

    document.querySelector(".close-button")?.addEventListener("click", () => {
        const modal = document.getElementById("modal");
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        const modal = document.getElementById("modal");
        if (event.target === modal) modal.style.display = "none";
    });

    initUrlParamsToCart();
};

const initUrlParamsToCart = () => {
    const url = window.location.href;
    const query = url.split('?')[1];
    if (!query) return;

    const params = new URLSearchParams(query);
    const cart = window.cart;

    for (const [id, quantity] of params.entries()) {
        const dish = dishes.find(d => d.id === id);
        const drink = drinks.find(d => d.id === id);

        const item = dish || drink;
        if (!item) continue;

        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: parseInt(quantity)
        });
    }

    window.cart = cart;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
};

const updateDisplayFoodItems = () => {
    foodCategories.forEach(category => {
        displayFoodItem(category.id, category.items);
    });
};

const displayFoodItem = (id, items) => {
    const container = document.getElementById(id);
    if (!container) return;

    container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.classList.add('table-container');

    const table = document.createElement('table');
    table.classList.add('dish-table');

    createFoodItemTableHeader(table);

    const body = document.createElement('tbody');
    items.forEach(item => body.appendChild(createFoodItemRow(item)));

    table.appendChild(body);
    wrapper.appendChild(table);
    container.appendChild(wrapper);
};

const createFoodItemTableHeader = (table) => {
    const thead = document.createElement('thead');
    const row = document.createElement('tr');
    row.classList.add('table-header');

    ['Gericht', 'Beschreibung', 'Preis', 'Zum Warenkorb hinzufügen']
        .forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            row.appendChild(th);
        });

    thead.appendChild(row);
    table.appendChild(thead);
};

const createFoodItemRow = (dish) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${dish.name}</td>
        <td>${dish.description}</td>
        <td>€${dish.price.toFixed(2)}</td>
        <td><button class="order-button" onclick="orderItem('${dish.id}','${dish.name}', ${dish.price})">Bestellen</button></td>
    `;
    return row;
};

const updateCart = (id, name, price) => {
    let cart = window.cart;
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    window.cart = cart;
    localStorage.setItem('cart', JSON.stringify(cart));
};
const updateCartDisplay = () => {
    const cart = window.cart;
    const cartList = document.getElementById('cart-list');
    const cartCount = document.getElementById('cart-count');

    if (!cartList) return;

    cartList.innerHTML = '';

    const totalQuantity = cart.reduce((a, i) => a + i.quantity, 0);
    if (cartCount) cartCount.textContent = totalQuantity;

    if (cart.length === 0) {
        cartList.innerHTML = '<li>Warenkorb ist leer</li>';
        return;
    }

    cart.forEach(item => cartList.appendChild(createCartItem(item)));
    appendTotalPrice(cartList, cart);

    updateHeaderTotal(); 
};

const createCartItem = (item) => {
    const li = document.createElement('li');

    li.innerHTML = `
        <div class="orderList">
            <div class="orderNamePrice">
                <div class="orderName">${item.name} - €${item.price.toFixed(2)}</div>
                <div class="orderPrice">(Anzahl: ${item.quantity})</div>
            </div>
            <div class="orButton">
                <button onclick="changeQuantity('${item.id}', 1)" class="basketButton">+</button>
                <button onclick="changeQuantity('${item.id}', -1)" class="basketButton">-</button>
            </div>
        </div>
    `;

    return li;
};

const appendTotalPrice = (cartList, cart) => {
    const total = cart.reduce((a, i) => a + i.price * i.quantity, 0);
    const final = total + DELIVERY_COST;

    const h4 = document.createElement('h4');
    h4.innerHTML = `
        <div class="total">
            <span>Gesamtsumme: €${total.toFixed(2)}</span>
            <span>+ Lieferkosten: €${DELIVERY_COST.toFixed(2)}</span>
            <span>Endbetrag: €${final.toFixed(2)}</span>
        </div>
    `;

    cartList.appendChild(h4);

    const btnContainer = document.createElement('div');
    btnContainer.classList.add('order-button-container');

    const btn = document.createElement('button');
    btn.innerText = 'Bestellung abschicken';
    btn.classList.add('order-basket-button');
    btn.addEventListener('click', submitOrder);

    btnContainer.appendChild(btn);
    cartList.appendChild(btnContainer);
};

const updateHeaderTotal = () => {
    const cart = window.cart || [];
    const headerTotal = document.getElementById("cart-total-header");
    if (!headerTotal) return;

    if (cart.length === 0) {
        headerTotal.textContent = "€0.00";
        return;
    }

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const final = total + DELIVERY_COST;

    headerTotal.textContent = `€${final.toFixed(2)}`;
};

const submitOrder = () => {
    const cart = window.cart;
    if (cart.length === 0) {
        alert("Warenkorb ist leer.");
        return;
    }

    const modal = document.getElementById("modal");
    if (modal) modal.style.display = "block";

    window.cart = [];
    localStorage.removeItem('cart');
    updateCartDisplay();
};

window.orderItem = (id, name, price) => {
    updateCart(id, name, price);
    updateCartDisplay();
};

window.changeQuantity = (id, change) => {
    let cart = window.cart;
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== id);
    }

    window.cart = cart;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
};
