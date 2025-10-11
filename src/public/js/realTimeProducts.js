
const socket = io();

const productosContainer = document.getElementById("productos-container");

socket.on("listaProductos", (productos) => {
    const ul = productosContainer.querySelector('ul');
    ul.innerHTML = '';

    productos.forEach(p => {
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