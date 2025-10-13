const express = require('express');
const path = require('path');
const { Server } = require("socket.io");
const handlebars = require("express-handlebars");

const productsRouter = require("./routers/productsRouter.js");
const viewsRouter = require("./routers/viewRoutes.js");

const port = 8080;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.use((req, res, next) => {
    req.app.set('io', io);
    next();
});

app.use("/", viewsRouter);
app.use("/api", productsRouter);

const httpServer = app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});

const io = new Server(httpServer);

io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");
    const productManager = require("./dao/productManager.js");
    const manager = new productManager(path.join(__dirname, "data", "products.json"));
    

    try {
        const products = await manager.getProducts();
        socket.emit("listaproducts", products);
    } catch (error) {
        console.error("Error al emitir productos iniciales:", error);
    }

    
    socket.on("addProduct", async (productData) => {
        try {
            await manager.addProduct(productData);
            const products = await manager.getProducts();
            io.emit("listaproducts", products); 
        } catch (error) {
            console.error("Error al agregar producto:", error);
        }
    });

    socket.on("deleteProduct", async (productId) => {
        try {
            await manager.deleteProduct(productId);
            const products = await manager.getProducts();
            io.emit("listaproducts", products); 
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    });
});