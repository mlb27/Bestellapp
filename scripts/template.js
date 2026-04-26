function returnMenuItem() {
    return `<div class="menuitem">
                <img src="./assets/img/m1.png" />

                <div class="menuitem-text">
                    <h2>${label}</h2>
                    <p>${desc}</p>
                </div>

                <span class="top-right fs24 bold">${price}</span>
                <button class="bottom-right add-btn bold" onclick="">Add to basket</button>
            </div>`;
}

function returnEmptyBasket() {
    return `<h2 class="beige fs40">Your Basket</h2>
                    <p class="beige fs24">Nothing here yet. <br />Go ahead and choose something<br />delicious!</p>
                    <div class="img-container"><img src="./assets/icons/shopping_cart.svg" alt=""/></div>`;
}

function returnBasket() {
    if (basket.length === 0) {
        return returnEmptyBasket();
    }

    let basketItems = "";

    for (let index = 0; index < basket.length; index++) {
        basketItems += returnBasketItem(basket[index]);
    }

    return `<h2 class="beige fs40">Your Basket</h2>
                    <div class="basket-items" id="basket-items">${basketItems}</div>
                    ${returnBasketSummary()}`;
}

function returnBasketItem(item) {
    let isAddDisabled = item.amount >= maxItemAmount;

    return `<div class="basketitem bold">
                        <span class="basketitem-title">${item.amount} x ${item.title}</span>
                        <span class="count bold">
                            <button class="count-action count-remove ${item.amount > 1 ? "count-text-action" : ""}" onclick="removeFromBasket(${item.menuIndex})" aria-label="${item.amount > 1 ? `Remove one ${item.title}` : `Remove ${item.title} from basket`}">
                                ${returnRemoveButton(item)}
                            </button>
                            <p class="count-value">${item.amount}</p>
                            <button class="count-action count-text-action countAdd ${isAddDisabled ? "count-action-disabled" : ""}" onclick="addToBasket(${item.menuIndex})" aria-label="Add one ${item.title}" ${isAddDisabled ? "disabled" : ""}>
                                <span class="count-symbol">+</span>
                            </button>
                        </span>
                        <span class="price bold">${formatPrice(item.price * item.amount)}</span>
                    </div>`;
}

function returnRemoveButton(item) {
    if (item.amount === 1) {
        return `<img src="./assets/icons/delete.svg" alt="" />`;
    }

    return `<span class="count-symbol">-</span>`;
}

function returnBasketSummary() {
    return `<div class="basket-summary bold">
                        <div class="basket-summary-row">
                            <span>Subtotal</span>
                            <span>${formatPrice(getSubTotal())}</span>
                        </div>
                        <div class="basket-summary-row">
                            <span>Delivery fee</span>
                            <span>${formatPrice(deliveryFee)}</span>
                        </div>
                        <div class="basket-summary-row basket-summary-total">
                            <span>Total</span>
                            <span>${formatPrice(getTotalCost())}</span>
                        </div>
                        <button class="buy-now-btn bold" onclick="openBuyNowDialog()">Buy Now (${formatPrice(getTotalCost())})</button>
                    </div>`;
}
