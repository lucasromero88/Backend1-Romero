const { Router } = require("express");
const productManager = require("../dao/productManager.js");
const path = require("path");

const vistasRouter = Router();

const managerProductos = new productManager(path.join(__dirname, "../data", "productos.json"));

vistasRouter.get("/", async (req, res) => {
    try {
        const productos = await managerProductos.getProducts();
        res.render("home", {
            nombre: "E-commerce",
            productos
        });
    } catch (error) {
        res.status(500).send("Error al cargar la página de inicio.");
    }
});

vistasRouter.get("/realtimeproducts", async (req, res) => {
    try {
        const productos = await managerProductos.getProducts();
        res.render("realTimeProducts", {
            nombre: "Productos",
            productos
        });
    } catch (error) {
        res.status(500).send("Error al cargar la vista de los productos");
    }
});

module.exports = vistasRouter;