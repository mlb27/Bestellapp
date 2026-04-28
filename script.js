let basketRef;
let basketItemsRef;
let buyNowDialogRef;
let basketBackdropRef;
let basket = [];
let buyNowDialogTimeout;
let addButtonFeedbackTimeouts = new WeakMap();

const basketStorageKey = "bestellApp-Basket";
const deliveryFee = 4.99;
const buyNowDialogAutoCloseDelay = 3000;
const buyNowDialogFadeDuration = 300;

function init() {
    basketRef = document.getElementById("basket");
    basketBackdropRef = document.getElementById("basket-backdrop");
    buyNowDialogRef = document.getElementById("buy-now-dialog");
    getBasketFromLocalStorage();
    renderBasket();
    window.addEventListener("resize", closeMobileBasketOnDesktop);
}

function renderMenu() {
    renderMenuItem();
}

function renderBasket() {
    if (!basketRef) {
        return;
    }

    basketRef.innerHTML = returnBasket();
    updateBasketRefs();
    updateBasketScrollState();
}

function updateBasketRefs() {
    basketItemsRef = document.getElementById("basket-items");
}

function updateBasketScrollState() {
    let hasScrollableBasket = basket.length > 3;

    if (basketRef) {
        basketRef.classList.toggle("basket-has-scroll", hasScrollableBasket);
    }

    if (!basketItemsRef) {
        return;
    }

    if (hasScrollableBasket) {
        basketItemsRef.classList.add("basket-items-scroll");
    } else {
        basketItemsRef.classList.remove("basket-items-scroll");
    }
}

function openBuyNowDialog() {
    closeMobileBasket();
    basket = [];
    saveBasketToLocalStorage();
    renderBasket();

    if (!buyNowDialogRef) {
        return;
    }

    openBuyNowDialogWithTimeout();
}

function closeBuyNowDialog() {
    if (!buyNowDialogRef) {
        return;
    }

    clearTimeout(buyNowDialogTimeout);
    buyNowDialogRef.classList.remove("buy-now-dialog-fadeout");
    buyNowDialogRef.close();
    closeMobileBasket();
}

function openMobileBasket() {
    if (!basketRef || !basketBackdropRef) {
        return;
    }

    basketRef.classList.add("basket-mobile-open");
    basketBackdropRef.classList.add("basket-backdrop-visible");
    document.body.classList.add("mobile-basket-open");
}

function closeMobileBasket() {
    if (!basketRef || !basketBackdropRef) {
        return;
    }

    basketRef.classList.remove("basket-mobile-open");
    basketBackdropRef.classList.remove("basket-backdrop-visible");
    document.body.classList.remove("mobile-basket-open");
}

function fadeOutBuyNowDialog() {
    if (!buyNowDialogRef) {
        return;
    }

    if (!buyNowDialogRef.open) {
        return;
    }

    buyNowDialogRef.classList.add("buy-now-dialog-fadeout");
    buyNowDialogTimeout = setTimeout(() => {
        closeBuyNowDialog();
    }, buyNowDialogFadeDuration);
}

function addToBasket(menuIndex, triggerButton) {
    let basketItem = getOrCreateBasketItem(menuIndex);
    basketItem.amount++;

    saveBasketToLocalStorage();
    renderBasket();
    showAddButtonFeedback(triggerButton, basketItem.amount);
}

function removeFromBasket(menuIndex) {
    let basketItemIndex = basket.findIndex((item) => item.menuIndex === menuIndex);

    if (basketItemIndex === -1) {
        return;
    }

    basket[basketItemIndex].amount--;

    if (basket[basketItemIndex].amount <= 0) {
        basket.splice(basketItemIndex, 1);
    }

    saveBasketToLocalStorage();
    renderBasket();
}

function deleteFromBasket(menuIndex) {
    let basketItemIndex = basket.findIndex((item) => item.menuIndex === menuIndex);

    if (basketItemIndex === -1) {
        return;
    }

    basket.splice(basketItemIndex, 1);
    saveBasketToLocalStorage();
    renderBasket();
}

function saveBasketToLocalStorage() {
    localStorage.setItem(basketStorageKey, JSON.stringify(basket));
}

function getBasketFromLocalStorage() {
    let basketFromStorage = localStorage.getItem(basketStorageKey);
    if (!basketFromStorage) {
        basket = [];
        return;
    }

    let parsedBasket = JSON.parse(basketFromStorage);
    if (!Array.isArray(parsedBasket)) {
        basket = [];
        return;
    }

    basket = [];
    pushStoredBasketItems(parsedBasket);
}

function getSubTotal() {
    let subtotal = 0;

    for (let index = 0; index < basket.length; index++) {
        subtotal += basket[index].price * basket[index].amount;
    }

    return subtotal;
}

function getTotalCost() {
    return getSubTotal() + deliveryFee;
}

function formatPrice(price) {
    return `${price.toFixed(2).replace(".", ",")} &euro;`;
}

function getOrCreateBasketItem(menuIndex) {
    let basketItem = basket.find((item) => item.menuIndex === menuIndex);

    if (basketItem) {
        return basketItem;
    }

    let selectedMenuItem = menuItems[menuIndex];
    basket.push({
        menuIndex: menuIndex,
        title: selectedMenuItem.title,
        price: selectedMenuItem.price,
        amount: 0
    });
    return basket[basket.length - 1];
}

function showAddButtonFeedback(button, amount) {
    if (!button) {
        return;
    }

    clearTimeout(addButtonFeedbackTimeouts.get(button));
    button.textContent = `Added ${amount}`;
    button.classList.add("add-btn-added");

    let feedbackTimeout = setTimeout(() => {
        button.textContent = "Add to basket";
        button.classList.remove("add-btn-added");
        addButtonFeedbackTimeouts.delete(button);
    }, 900);

    addButtonFeedbackTimeouts.set(button, feedbackTimeout);
}

function closeMobileBasketOnDesktop() {
    if (window.innerWidth > 1150) {
        closeMobileBasket();
    }
}

function returnBasket() {
    if (basket.length === 0) {
        return returnEmptyBasket();
    }

    let basketItems = "";

    for (let index = 0; index < basket.length; index++) {
        basketItems += returnBasketItem(basket[index]);
    }

    return `${returnBasketHeader()}
                    <div class="basket-items" id="basket-items">${basketItems}</div>
                    ${returnBasketSummary()}`;
}

function openBuyNowDialogWithTimeout() {
    clearTimeout(buyNowDialogTimeout);
    buyNowDialogRef.classList.remove("buy-now-dialog-fadeout");
    buyNowDialogRef.showModal();
    buyNowDialogTimeout = setTimeout(() => {
        fadeOutBuyNowDialog();
    }, buyNowDialogAutoCloseDelay);
}

function pushStoredBasketItems(parsedBasket) {
    for (let index = 0; index < parsedBasket.length; index++) {
        let item = parsedBasket[index];

        if (
            typeof item.menuIndex === "number" &&
            typeof item.title === "string" &&
            typeof item.price === "number" &&
            typeof item.amount === "number" &&
            item.amount > 0
        ) {
            basket.push({
                menuIndex: item.menuIndex,
                title: item.title,
                price: item.price,
                amount: item.amount
            });
        }
    }
}

function returnBasket() {
    if (basket.length === 0) {
        return returnEmptyBasket();
    }

    let basketItems = "";

    for (let index = 0; index < basket.length; index++) {
        basketItems += returnBasketItem(basket[index]);
    }

    return `${returnBasketHeader()}
                    <div class="basket-items" id="basket-items">${basketItems}</div>
                    ${returnBasketSummary()}`;
}
