const express = require('express');
const path = require('path');
const { Server } = require("socket.io");
const handlebars = require("express-handlebars");

const apiRouter = require("./routes/apiRoutes.js");
const vistasRouter = require("./routes/viewRoutes.js");

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

app.use("/", vistasRouter);
app.use("/api", apiRouter);

const httpServer = app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});

const io = new Server(httpServer);

io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");
});