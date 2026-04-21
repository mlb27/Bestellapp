let basketRef;
let basketItemsRef;
let buyNowDialogRef;
let basket = [];
let buyNowDialogTimeout;

const basketStorageKey = "bestellApp-Basket";
const maxItemAmount = 3;
const deliveryFee = 4.99;
const buyNowDialogAutoCloseDelay = 3000;
const buyNowDialogFadeDuration = 300;

function init() {
    basketRef = document.getElementById("basket");
    getBasketFromLocalStorage();
    renderBasket();
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
    buyNowDialogRef = document.getElementById("buy-now-dialog");
}

function updateBasketScrollState() {
    if (!basketItemsRef) {
        return;
    }

    if (basket.length > 3) {
        basketItemsRef.classList.add("basket-items-scroll");
    } else {
        basketItemsRef.classList.remove("basket-items-scroll");
    }
}

function openBuyNowDialog() {
    basket = [];
    saveBasketToLocalStorage();
    renderBasket();

    if (!buyNowDialogRef) {
        return;
    }

    clearTimeout(buyNowDialogTimeout);
    buyNowDialogRef.classList.remove("buy-now-dialog-fadeout");
    buyNowDialogRef.showModal();
    buyNowDialogTimeout = setTimeout(() => {
        fadeOutBuyNowDialog();
    }, buyNowDialogAutoCloseDelay);
}

function closeBuyNowDialog() {
    if (!buyNowDialogRef) {
        return;
    }

    clearTimeout(buyNowDialogTimeout);
    buyNowDialogRef.classList.remove("buy-now-dialog-fadeout");
    buyNowDialogRef.close();
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

function addToBasket(menuIndex) {
    let selectedMenuItem = menuItems[menuIndex];

    let basketItem = basket.find((item) => item.menuIndex === menuIndex);

    if (basketItem) {
        if (basketItem.amount >= maxItemAmount) {
            return;
        }
        basketItem.amount++;
    } else {
        basket.push({
            menuIndex: menuIndex,
            title: selectedMenuItem.title,
            price: selectedMenuItem.price,
            amount: 1
        });
    }
    saveBasketToLocalStorage();
    renderBasket();
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

    basket = parsedBasket
        .filter((item) => {
            return (
                typeof item.menuIndex === "number" &&
                typeof item.title === "string" &&
                typeof item.price === "number" &&
                typeof item.amount === "number" &&
                item.amount > 0
            );
        })
        .map((item) => {
            return {
                menuIndex: item.menuIndex,
                title: item.title,
                price: item.price,
                amount: Math.min(item.amount, maxItemAmount)
            };
        });
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
