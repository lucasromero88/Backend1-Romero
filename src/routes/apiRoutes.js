const { Router } = require("express");
const productManager = require("../dao/productManager.js");
const path = require("path");

const apiRouter = Router();

const managerProductos = new productManager(path.join(__dirname, "../data", "productos.json"));

const addIo = (req, res, next) => {
    req.io = req.app.get('io');
    next();
};

apiRouter.get("/productos", async (req, res) => {
    const productos = await managerProductos.getProducts();
    res.json(productos);
});

apiRouter.get("/productos/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const producto = await managerProductos.getProductById(pid);

        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }

        res.status(200).json(producto);
    } catch (error) {
        console.error("Error al obtener el producto por ID:", error);
        res.status(500).json({ error: "Error en el servidor." });
    }
});

apiRouter.post("/productos", addIo, async (req, res) => {
    const nuevoProducto = req.body;
    try {
        if (!nuevoProducto.nombre || !nuevoProducto.categoria || !nuevoProducto.precio || nuevoProducto.stock === undefined || !nuevoProducto.imagen) {
            return res.status(400).json({ error: "Faltan datos del producto" });
        }
        const productoAgregado = await managerProductos.addProduct(nuevoProducto);
        
        const productosActualizados = await managerProductos.getProducts();
        req.io.emit("listaProductos", productosActualizados);

        res.status(201).json({ message: "Producto agregado con éxito", producto: productoAgregado });
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

apiRouter.delete("/productos/:pid", addIo, async (req, res) => {
    try {
        const { pid } = req.params;
        const productoEliminado = await managerProductos.deleteProduct(pid);
        
        if (!productoEliminado) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }
        
        const productosActualizados = await managerProductos.getProducts();
        req.io.emit("listaProductos", productosActualizados);

        res.status(200).json({ message: "Producto eliminado con éxito", producto: productoEliminado });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

module.exports = apiRouter;