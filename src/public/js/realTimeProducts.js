
const socket = io();

const productsContainer = document.getElementById("products-container");
const addProductForm = document.getElementById("add-product-form");
const deleteProductForm = document.getElementById("delete-product-form");
const productSelect = document.getElementById("product-select");

socket.on("listaproducts", (products) => {
    const ul = productsContainer.querySelector('ul');
    ul.innerHTML = '';

    productSelect.innerHTML = ''; 
    products.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = `ID: ${p.id} - ${p.nombre}`;
        productSelect.appendChild(option);
    });


    products.forEach(p => {
        const li = document.createElement('li');
        const stockHTML = p.stock > 0
            ? `<p class="card-text">Stock: ${p.stock}</p>`
            : `<p class="card-text sin-stock">Sin Stock</p>`;

        li.innerHTML = `
            <div class="card">
                <div class="card-content">
                    <div>
                        <h5 class="card-title">${p.nombre}</h5>
                        <p class="card-text">Precio: $${p.precio}</p>
                        ${stockHTML}
                        <span class="card-badge">${p.categoria}</span>
                    </div>
                    <img src="${p.imagen}" alt="${p.nombre}">
                </div>
            </div>
        `;
        ul.appendChild(li);
    });
});

addProductForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(addProductForm);
    const newProduct = Object.fromEntries(formData.entries());
    // const formData = new FormData(addProductosForm);
    // const newProductos = Object.fromEntries(formData.entries());
    
    socket.emit("addProduct", newProduct);
    addProductForm.reset();
});

deleteProductForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const productId = productSelect.value;
    if (productId) {
        socket.emit("deleteProduct", productId);
    }
});