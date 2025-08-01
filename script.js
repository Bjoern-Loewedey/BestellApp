const drinks = [
    { name: "Coca-Cola", description: "Klassische Cola mit spritziger Frische.", price: 2.50 },
    { name: "Fanta", description: "Fruchtiger Limonadegeschmack in jedem Schluck.", price: 2.50 },
    { name: "Sprite", description: "Erfrischendes Zitrusgetränk, ideal für heiße Tage.", price: 2.50 },
    { name: "Mineralwasser", description: "Kohlensäurehaltiges Wasser - perfekt für jeden Anlass.", price: 1.50 },
    { name: "Orangensaft", description: "Frisch gepresster Orangensaft, voller Vitamin C.", price: 3.00 },
    { name: "Apfelsaft", description: "Süßer, fruchtiger Apfelsaft.", price: 3.00 }
];
const dishes = [
    { name: "Margherita Pizza", description: "Klassische Pizza mit frischen Tomaten, Mozzarella und Basilikum.", price: 8.50 },
    { name: "Pasta Carbonara", description: "Hausgemachte Pasta mit Ei, Käse, Speck und schwarzem Pfeffer.", price: 9.90 },
    { name: "Caesar Salad", description: "Frischer Salat mit Romanasalat, Croutons, Parmesan und Caesar-Dressing.", price: 7.00 },
    { name: "Schweinebraten", description: "Zartes Schweinefleisch, langsam gegart, serviert mit Knödeln und Sauerkraut.", price: 12.50 },
    { name: "Lasagne", description: "Hausgemachte Lasagne mit Fleischsoße und Käseüberbacken.", price: 10.00 },
    { name: "Tiramisu", description: "Klassisches italienisches Dessert mit Kaffee, Mascarpone und Kakao.", price: 5.50 }
];
let cart = []; // Globaler Warenkorb
const DELIVERY_COST = 5.0;
window.onload = () => {
    displayDishes(dishes); // Gerichte anzeigen
    updateCartDisplay(); // Warenkorb anzeigen
    // Event Listener für die Navigation zwischen Gerichten und Getränken
    document.getElementById('drinks-button-dishes').addEventListener('click', () => {
        displayDrinks(drinks); // Getränkekarte anzeigen
    });
    document.getElementById('food-button-drinks').addEventListener('click', () => {
        displayDishes(dishes); // Zurück zu Gerichten
    });
    document.getElementById('home-button-dishes').addEventListener('click', () => {
        alert("Zur Hauptseite navigieren"); // Hier kannst du die Hauptseite zu einer anderen Funktion oder Seite weiterleiten
    });
    document.querySelector(".close-button").addEventListener("click", () => {
        const modal = document.getElementById("modal");
        modal.style.display = "none";
    });
    window.addEventListener("click", (event) => {
        const modal = document.getElementById("modal");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

};

function displayDishes(dishes) {
    const tableContainer = document.getElementById('table-container');
    tableContainer.innerHTML = ''; // Inhalt zurücksetzen

    const containerDiv = document.createElement('div');
    containerDiv.classList.add('table-container'); // Füge die Klasse hinzu
    const table = document.createElement('table');
    table.classList.add('dish-table');
    createTableHeader(table);
    const tableBody = document.createElement('tbody');
    dishes.forEach(dish => tableBody.appendChild(createDishRow(dish)));
    table.appendChild(tableBody);
    containerDiv.appendChild(table);
    tableContainer.appendChild(containerDiv); // Füge den Container in die Hauptansicht ein
    // Zeige die Gerichte an und verstecke die Getränkekarte
    document.getElementById("table-container").style.display = "block";
    document.getElementById("drink-table-container").style.display = "none";
}
function createTableHeader(table) {
    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.classList.add('table-header');
    const headers = ['Gericht', 'Beschreibung', 'Preis', 'Zum Warenkorb hinzufügen'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    tableHeader.appendChild(headerRow);
    table.appendChild(tableHeader);
}
function createDishRow(dish) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${dish.name}</td>
        <td>${dish.description}</td>
        <td>€${dish.price.toFixed(2)}</td>
        <td><button class="order-button" onclick="orderDish('${dish.name}', ${dish.price})">Bestellen</button></td>
    `;
    return row;
}
function orderDish(name, price) {
    updateCart(name, price);
    updateCartDisplay();
}
function updateCart(name, price) {
    const existingDish = cart.find(item => item.name === name);
    if (existingDish) {
        existingDish.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
}
function updateCartDisplay() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = '';
    if (cart.length === 0) {
        cartList.innerHTML = '<li>Warenkorb ist leer</li>';
    } else {
        cart.forEach(item => {
            cartList.appendChild(createCartItem(item));
        });
        appendTotalPrice(cartList);
    }
}
function createCartItem(item) {
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
}
function appendTotalPrice(cartList) {
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
}
function changeQuantity(name, change) {
    const item = cart.find(i => i.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.name !== name);
        }
        updateCartDisplay();
    }
}
function submitOrder() {
    if (cart.length === 0) {
        alert("Warenkorb ist leer. Bitte zuerst ein Gericht oder Getränk bestellen.");
        return;
    }
    const modal = document.getElementById("modal");
    modal.style.display = "block";
    cart = [];
    updateCartDisplay();
}
function displayDrinks(drinks) {
    const drinkTableContainer = document.getElementById('drink-table-container');
    drinkTableContainer.innerHTML = '';

    const containerDiv = document.createElement('div');
    containerDiv.classList.add('table-container');
    const table = document.createElement('table');
    table.classList.add('dish-table');
    createDrinkTableHeader(table);
    const tableBody = document.createElement('tbody');
    drinks.forEach(drink => tableBody.appendChild(createDrinkRow(drink)));
    table.appendChild(tableBody);
    containerDiv.appendChild(table);
    drinkTableContainer.appendChild(containerDiv);
    // Zeige die Getränkekarte an und verstecke die Gerichte
    document.getElementById("drink-table-container").style.display = "block";
    document.getElementById("table-container").style.display = "none";
}
function createDrinkTableHeader(table) {
    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.classList.add('table-header');
    const headers = ['Getränk', 'Beschreibung', 'Preis', 'Zum Warenkorb hinzufügen'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    tableHeader.appendChild(headerRow);
    table.appendChild(tableHeader);
}
function createDrinkRow(drink) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${drink.name}</td>
        <td>${drink.description}</td>
        <td>€${drink.price.toFixed(2)}</td>
        <td><button class="order-button" onclick="orderDrink('${drink.name}', ${drink.price})">Bestellen</button></td>
    `;
    return row;
}
function orderDrink(name, price) {
    updateCart(name, price);
    updateCartDisplay();
}

