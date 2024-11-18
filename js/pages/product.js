import {getOneProduct} from "../services/Request.js";


function getUrlParams() {
    const link = new URL(window.location.href);
    const searchParams = new URLSearchParams(link.search);

    if (!searchParams.has('id')) return new Error('no validated identifier');

    return searchParams.get('id');
}

async function fillProduct(product) {
    const image = document.createElement('img');
    const imageContainer = document.querySelector('.item__img');

    image.src = product.imageUrl;
    imageContainer.appendChild(image);

    document.querySelector('#title').innerHTML = product.name;
    document.querySelector('#price').innerHTML = product.price;
    document.querySelector('#description').innerHTML = product.description;
    fillColorOptions(product.colors);
}

function fillColorOptions(colors) {
    const colorContainer = document.querySelector('#color-select');
   return colorContainer.innerHTML = colors.map(color => `<option value=${color}>${color}</option>`);

}

function addToOrderList(product) {
    const color = document.querySelector('#color-select').value;

    const itemQuantityElement = document.querySelector('#itemQuantity');
    if (!itemQuantityElement) return alert('Element "#itemQuantity" not found.');

    const qts = parseInt(itemQuantityElement.value);
    if (isNaN(qts) || qts <= 0 || qts > 100) return alert('Veuillez choisir une quantité valide (1-100).');

    const currentCart = JSON.parse(localStorage.getItem('product')) || [];
    const existingProductIndex = currentCart.findIndex(p => p.id === product._id && p.color === color);

    if (existingProductIndex !== -1) {

        currentCart[existingProductIndex].qts += qts;
    } else {

        currentCart.push({id: product._id, qts, color});
    }

    localStorage.setItem('product', JSON.stringify(currentCart));
    alert(`Votre produit est bien ajouter au panier`);
}

async function init(){

  const data = await getOneProduct(getUrlParams());

  await fillProduct(data);
  const addOrderButton = document.querySelector('#addToCart');

  addOrderButton.addEventListener('click',(e)=>{
      e.preventDefault();
      addToOrderList(data);
  })

}



init();