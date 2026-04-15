function init() {
    renderBasket();
}

function renderMenu() {
    renderMenuItem();
}

function renderBasket() {
    document.getElementById("basket").innerHTML = returnBasket();
}

function addToBasket(item) {
    console.log(categoryOne[item].title + ", " + categoryOne[item].price);
}
