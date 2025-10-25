import { drinks } from './drinks.js';
import { dishes } from './dishes.js';

window.cart = window.cart || [];
const DELIVERY_COST = 5.0;

const foodCategories = [
    { id: 'dishes-table-container', name: 'Gerichte', items: dishes, },
    { id: 'drink-table-container', name: 'Getränke', items: drinks, }
]

const showCategory = (id) => {
    document.getElementById(id).classList.add('visible');
    const otherCategory = foodCategories.find(cat => cat.id !== id);
    document.getElementById(otherCategory.id).classList.remove('visible');
}

window.onload = () => {
    if (window.location.href.includes('index.html')) {
        updateDisplayFoodItems()

    }
    updateCartDisplay();
    document.getElementById('drinks-button-dishes')?.addEventListener('click', () => {
        showCategory(foodCategories[1].id);
    });
    document.getElementById('food-button-drinks')?.addEventListener('click', () => {
        showCategory(foodCategories[0].id);
    });

    document.querySelector(".close-button")?.addEventListener("click", () => {
        document.getElementById("modal").style.display = "none";
    });
    window.addEventListener("click", event => {
        const modal = document.getElementById("modal");
        if (event.target === modal) modal.style.display = "none";
    });
    const shoppingcart = document.getElementById('shoppingcart')
    shoppingcart?.addEventListener("click", event => {
        const cartItemParameters = (window.cart || []).map(item => `${item.id}=${item.quantity}`).join('&');
        var href = document.getElementById('shoppingcart').getAttribute("data-href");

        if (href) {
            const hasCartItems = cartItemParameters.length > 0;
            const newPath = hasCartItems ? `${href}?${cartItemParameters}` : href;
            location.href = newPath
            event.preventDefault();
        }
    });


    initUrlParamsToCart();
}

const initUrlParamsToCart = () => {
    const currentUrl = window.location.href;
    const allUrlParams = currentUrl.split('?')[1];
    console.log('allUrlParams', allUrlParams)
    if (!allUrlParams) {
        updateCartDisplay();
        return
    };

    const urlParams = new URLSearchParams(allUrlParams);
    const cart = window.cart || [];
    for (const [id, quantity] of urlParams.entries()) {
        const dish = dishes.find(d => d.id === id);
        const drink = drinks.find(d => d.id === id);
        if (dish) {
            cart.push({ id: dish.id, name: dish.name, price: dish.price, quantity: parseInt(quantity) });
        } else if (drink) {
            cart.push({ id: drink.id, name: drink.name, price: drink.price, quantity: parseInt(quantity) });
        }
        window.cart = cart
    }

    updateCartDisplay();
}


const updateDisplayFoodItems = () => {
    foodCategories.forEach(category => {
        displayFoodItem(category.id, category.items);
    })
}

const displayFoodItem = (id, items) => {

    const tableContainer = document.getElementById(id);
    tableContainer.innerHTML = '';
    const containerDiv = document.createElement('div');
    containerDiv.classList.add('table-container');
    const table = document.createElement('table');
    table.classList.add('dish-table');
    createFoodItemTableHeader(table);
    const tableBody = document.createElement('tbody');
    items.forEach(dish => tableBody.appendChild(createFoodItemRow(dish)));
    table.appendChild(tableBody);
    containerDiv.appendChild(table);
    tableContainer.appendChild(containerDiv);
    // document.getElementById("table-container").style.display = "block";
    // document.getElementById("drink-table-container").style.display = "none";
};

const createFoodItemTableHeader = table => {
    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.classList.add('table-header');
    ['Gericht', 'Beschreibung', 'Preis', 'Zum Warenkorb hinzufügen'].forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    tableHeader.appendChild(headerRow);
    table.appendChild(tableHeader);
};

const createFoodItemRow = dish => {
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
    const cart = window.cart || [];
    const existingDish = cart.find(item => item.id === id);
    if (existingDish) {
        existingDish.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
        window.cart = cart;
    }
};

const updateCartDisplay = () => {
    const cart = window.cart || [];
    const cartList = document.getElementById('cart-list');
    if (!cartList) return;
    cartList.innerHTML = '';
    if (cart.length === 0) {
        cartList.innerHTML = '<li>Warenkorb ist leer</li>';
    } else {
        cart.forEach(item => {
            cartList.appendChild(createCartItem(item));
        });
        appendTotalPrice(cartList);
    }
};

const createCartItem = item => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <div class="orderList">
            <div class="orderNamePrice">
                <div class="orderName">${item.name} - €${item.price.toFixed(2)}</div>
                <div class="orderPrice">(Anzahl: ${item.quantity})</div>
            </div>
            <div class="orButton">
                <button onclick="changeQuantity('${item.name}', 1)" class="basketButton">+</button>
                <button onclick="changeQuantity('${item.name}', -1)" class="basketButton">-</button>
            </div>
        </div>
    `;
    return listItem;
};

const appendTotalPrice = cartList => {
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalWithDelivery = total + DELIVERY_COST;
    const totalPrice = document.createElement('h4');
    totalPrice.innerHTML = `
        <div class="total">
            <span>Gesamtsumme: €${total.toFixed(2)}</span>
            <span>+ Lieferkosten: €${DELIVERY_COST.toFixed(2)}</span>
            <span>Endbetrag: €${totalWithDelivery.toFixed(2)}</span>
        </div>
    `;
    cartList.appendChild(totalPrice);
    const orderButton = document.createElement('button');
    orderButton.innerText = 'Bestellung abschicken';
    orderButton.addEventListener('click', submitOrder);
    orderButton.classList.add('order-basket-button');
    const orderButtonContainer = document.createElement('div');
    orderButtonContainer.classList.add('order-button-container');
    orderButtonContainer.appendChild(orderButton);
    cartList.appendChild(orderButtonContainer);
};

const submitOrder = () => {
    if (cart.length === 0) {
        alert("Warenkorb ist leer. Bitte zuerst ein Gericht oder Getränk bestellen.");
        return;
    }
    const modal = document.getElementById("modal");
    modal.style.display = "block";
    cart = [];
    updateCartDisplay();
    document.querySelector(".close-button").onclick = () => {
        modal.style.display = "none";
    };
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
};

window.orderItem = (id, name, price) => {
    updateCart(id, name, price);
    updateCartDisplay();
};

window.changeQuantity = (name, change) => {
    const item = cart.find(i => i.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.name !== name);
            window.cart = cart;
        }
        updateCartDisplay();
    }
};