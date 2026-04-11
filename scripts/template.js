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

function returnBasket() {
    return `<h2 class="beige fs40">Your Basket</h2>
                    <p class="beige fs24">Nothing here yet. <br />Go ahead and choose something<br />delicious!</p>
                    <div class="img-container"><img src="./assets/icons/shopping_cart.svg" alt="" /></div>`;
}
