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
    return `${returnBasketHeader()}
                    <p class="beige fs24">Nothing here yet. <br />Go ahead and choose something<br />delicious!</p>
                    <div class="img-container"><img src="./assets/icons/shopping_cart.svg" alt=""/></div>`;
}

function returnBasketHeader() {
    return `<button class="basket-close-btn" onclick="closeMobileBasket()" aria-label="Close basket">
                        <img src="./assets/icons/close.svg" alt="" />
                    </button>
                    <h2 class="beige fs40">Your Basket</h2>`;
}

function returnBasketItem(item) {
    return `<div class="basketitem bold">
                        <span class="basketitem-title">${item.amount} x ${item.title}</span>
                        <span class="count bold">
                            <button class="count-action count-remove" onclick="deleteFromBasket(${item.menuIndex})" aria-label="Remove ${item.title} from basket">
                                ${returnDeleteButton()}
                            </button>
                            <button class="count-action count-text-action" onclick="removeFromBasket(${item.menuIndex})" aria-label="Remove one ${item.title}">
                                <span class="count-symbol count-symbol-minus" aria-hidden="true"></span>
                            </button>
                            <p class="count-value">${item.amount}</p>
                            <button class="count-action count-text-action countAdd" onclick="addToBasket(${item.menuIndex})" aria-label="Add one ${item.title}">
                                <span class="count-symbol count-symbol-plus" aria-hidden="true"></span>
                            </button>
                        </span>
                        <span class="price bold">${formatPrice(item.price * item.amount)}</span>
                    </div>`;
}

function returnDeleteButton() {
    return `<img src="./assets/icons/delete.svg" alt="" />`;
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
