export function displayProduct(elements = undefined,data) {
    if(elements === undefined) return;

    return elements.innerHTML = data.map(({_id,altTxt,description,imageUrl,name,}) => `
    <a href="./product.html?id=${_id}">
            <article>
                <img src="${imageUrl}" alt="${altTxt}">
                <h3 class="productName">${name}</h3>
                <p class="productDescription">${description}</p>
            </article>
    </a> 
    `).join(' ');
}

export async function displayCart(data) {
    const container = document.querySelector('#cart__items');

    if(!data || data.length <= 0 || data === undefined || data === null) return  container.innerHTML = 'Votre panier est vide';

    return container.innerHTML = await data.map(({_id,altTxt,imageUrl,name,qts,color,price}) => `
     <article class="cart__item" data-id="${_id}" data-color="${color}">
                <div class="cart__item__img">
                  <img src="${imageUrl}" alt="${altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>Nom : ${name}</h2>
                    <p>Couleur : ${color}</p>
                    <p class="cart__price">Prix : ${price * qts} Euros</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${parseInt(qts)}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>

    `).join(' ');
}


export default {
    displayProduct,
    displayCart
}