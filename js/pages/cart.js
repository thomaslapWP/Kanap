import {getOneProduct, getOrder} from "../services/Request.js";
import { displayCart } from "../libs/display.js";

async function fillOrder() {
    const productData = JSON.parse(localStorage.getItem('product')) || [];

    const items = (await Promise.all(productData.map(async item => {
        try {
            const product = await getOneProduct(item.id);
            console.log(product)
            return { ...product, ...item };
        } catch (error) {
            console.error(`Failed to fetch product with id ${item.id}:`, error);
            return null;
        }
    }))).filter(item => item);

    return items;
}

function fillTotalPriceAndQuantities(items) {
    const totalQuantities = items.reduce((total, item) => total + item.qts, 0);
    const totalPrice = items.reduce((total, item) => total + (item.price * item.qts), 0);

    document.querySelector('#totalQuantity').innerText = totalQuantities;
    document.querySelector('#totalPrice').innerText = Math.floor(totalPrice);
}

function setupEventListeners(items) {
    const cartContainer = document.querySelector('#cart__items');

    cartContainer.addEventListener('click', event => {
        if (event.target.classList.contains('deleteItem')) {
            handleItemDeletion(event.target, items);
        }
    });

    cartContainer.addEventListener('input', event => {
        if (event.target.classList.contains('itemQuantity')) {
            handleQuantityChange(event.target, items);
        }
    });
}

function handleItemDeletion(targetElement, items) {
    const index = Array.from(document.querySelectorAll('.deleteItem')).indexOf(targetElement);
    items.splice(index, 1);
    updateCartAndUI(items);
}

function handleQuantityChange(targetElement, items) {
    const index = Array.from(document.querySelectorAll('.itemQuantity')).indexOf(targetElement);
    items[index].qts = parseInt(targetElement.value);
    if (items[index].qts <= 0) {
        items.splice(index, 1);
    }
    updateCartAndUI(items);
}

function updateCartAndUI(items) {
    localStorage.setItem('product', JSON.stringify(items));
    displayCart(items).then(r => r);
    fillTotalPriceAndQuantities(items);
}

async function init() {
    let items = await fillOrder();
    await displayCart(items);
    fillTotalPriceAndQuantities(items);
    setupEventListeners(items);
    const orderButton = document.querySelector("#order");

    orderButton.addEventListener("click", async (e) => {
            e.preventDefault();

            const contact = {
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                address: document.getElementById("address").value,
                city: document.getElementById("city").value,
                email: document.getElementById("email").value,
            };

            const isFormValid = validateForm(contact);

            if (!isFormValid) return;

            const products = JSON.parse(localStorage.getItem('product')) || [];

            if (items.length === 0) {
                orderButton.disabled = true;
                alert("Votre panier est vide!");
                return;
            }


            const orderData = {
                contact,
                products: products.map(product => product.id),
            };

            try {
                const response = await getOrder(orderData);
                const orderConfirmation = await response.json();
                if (response.status === 201) {
                   localStorage.clear();
                 location.href = `./confirmation.html?orderId=${orderConfirmation.orderId}`;
                }
            } catch (error) {
                console.error("Error placing the order:", error);
            }
        });
}

function validateForm(contact) {
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const regexNameCity = /^[a-zA-Z\s-]+$/;
    const regexAddress = /^\d+([]?[a-zA-Z])?/;
    let isValid = true;

    Object.entries(contact).forEach(([key, value]) => {
        const errorMsgElement = document.getElementById(`${key}ErrorMsg`);
        if (!value) {
            errorMsgElement.textContent = `${key} is required.`;
            isValid = false;
        } else if (key === "email" && !regexEmail.test(value)) {
            errorMsgElement.textContent = "Invalid email format.";
            isValid = false;
        } else if (["firstName", "lastName", "city"].includes(key) && !regexNameCity.test(value)) {
            errorMsgElement.textContent = `Invalid ${key}, use only letters, spaces, and hyphens.`;
            isValid = false;
        } else if (key === "address" && !regexAddress.test(value)) {
            errorMsgElement.textContent = "Invalid email format.";
            isValid = false;
        }
        else {
            errorMsgElement.textContent = "";
        }
    });
    return isValid;
}

init();