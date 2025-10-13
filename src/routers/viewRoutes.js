const { Router } = require("express");
const productManager = require("../dao/productManager.js");
const cartsManager = require("../dao/cartsManager.js");
const path = require("path");

const viewsRouter = Router();

const managerproducts = new productManager(path.join(__dirname, "../data", "products.json"));
const managercarts = new productManager(path.join(__dirname, "../data", "carts.json"));

viewsRouter.get("/", async (req, res) => {
    try {
        const products = await managerproducts.getProducts();
        res.render("home", {
            nombre: "E-commerce",
            products
        });
    } catch (error) {
        res.status(500).send("Error al cargar la página de inicio.");
    }
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await managerproducts.getProducts();
        res.render("realTimeProducts", {
            nombre: "products",
            products
        });
    } catch (error) {
        res.status(500).send("Error al cargar la vista de los products");
    }
});

viewsRouter.get("/", async (req, res) => {
    try {
        const products = await managerproducts.getProducts();
        res.render("realTimeProducts", {
            nombre: "products",
            products
        });
    } catch (error) {
        res.status(500).send("Error al cargar la vista de los products");
    }
});
module.exports = viewsRouter;