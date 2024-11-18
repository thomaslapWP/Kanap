async function httpRequest(url, method = "GET", body = null, headers , auth = null) {
    try {

        const options = {
            method,
            headers: {
                ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
                ...headers
            },
            body: body ? body : null
        };

        const response = await fetch(url, options);

        return response;
    } catch (error) {


        console.error(error);
        throw error;
    }
}

const BASE_URL = "http://185.207.226.6:30189"

export async function getAllProduct() {
    const response = await httpRequest(`${BASE_URL}/api/products/`);

    return response.json();
}

export async function getOneProduct(id) {
    const response = await httpRequest(`${BASE_URL}/api/products/${id}`);

    return response.json();
}

export async function getOrder(orderData) {

    return  await httpRequest(`${BASE_URL}/api/products/order`,'POST',JSON.stringify(orderData), { "Content-Type": "application/json",});
}

export default {
    getAllProduct,
    getOneProduct,
    getOrder
}
