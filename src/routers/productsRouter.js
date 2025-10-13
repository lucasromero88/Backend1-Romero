const { Router } = require("express");
const productManager = require("../dao/productManager.js");
const path = require("path");

const productsRouter = Router();

const managerproducts = new productManager(path.join(__dirname, "../data", "products.json"));

const addIo = (req, res, next) => {
    req.io = req.app.get('io');
    next();
};

productsRouter.get("/products", async (req, res) => {
    const products = await managerproducts.getProducts();
    res.json(products);
});

productsRouter.get("/products/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const producto = await managerproducts.getProductById(pid);

        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }

        res.status(200).json(producto);
    } catch (error) {
        console.error("Error al obtener el producto por ID:", error);
        res.status(500).json({ error: "Error en el servidor." });
    }
});

productsRouter.post("/products", addIo, async (req, res) => {
    const nuevoProducto = req.body;
    try {
        if (!nuevoProducto.nombre || !nuevoProducto.categoria || !nuevoProducto.precio || nuevoProducto.stock === undefined || !nuevoProducto.imagen) {
            return res.status(400).json({ error: "Faltan datos del producto" });
        }
        const productoAgregado = await managerproducts.addProduct(nuevoProducto);
        
        const productsActualizados = await managerproducts.getProducts();
        console.log("Productos a emitir:", productsActualizados); 
        req.io.emit("listaproducts", productsActualizados);

        res.status(201).json({ message: "Producto agregado con éxito", producto: productoAgregado });
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

productsRouter.delete("/products/:pid", addIo, async (req, res) => {
    try {
        const { pid } = req.params;
        const productoEliminado = await managerproducts.deleteProduct(pid);
        
        if (!productoEliminado) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }
        
        const productsActualizados = await managerproducts.getProducts();
        console.log("Productos a emitir:", productsActualizados); 
        req.io.emit("listaproducts", productsActualizados);

        res.status(200).json({ message: "Producto eliminado con éxito", producto: productoEliminado });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

module.exports = productsRouter;