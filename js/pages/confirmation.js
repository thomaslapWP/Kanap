function getUrlParams() {
    const link = new URL(window.location.href);
    const searchParams = new URLSearchParams(link.search);

    if (!searchParams.has('orderId')) return new Error('no validated identifier');

    return searchParams.get('orderId');
}



function init() {
    const orderId = document.querySelector('#orderId');
    orderId.innerText = getUrlParams();
}

init();