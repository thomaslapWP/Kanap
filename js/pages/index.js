import {getAllProduct} from "../services/Request.js";
import {displayProduct} from "../libs/display.js";


async function init() {
    const items = document.querySelector('#items');
    displayProduct(items, await getAllProduct());
}


init();