
const express = require('express');
const path = require('path');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');
const { connDB } = require('./config/db.js');

const productsRouter = require('./routers/productsRouter.js');
const cartRouter = require('./routers/cartRouter.js');
const viewsRouter = require('./routers/viewRoutes.js');

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', exphbs.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

const httpServer = app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

const io = new Server(httpServer);

app.use((req, res, next) => {
  req.app.set('io', io);
  next();
});

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);

io.on('connection', async (socket) => {
  console.log('Nuevo cliente conectado');

  const { ProductModel } = require('./dao/models/productModel.js');

  try {
    const products = await ProductModel.find().lean();
    socket.emit('listaproducts', products);
  } catch (error) {
    console.error('Error al emitir productos iniciales:', error);
  }

  socket.on('addProduct', async (productData) => {
    try {
      await ProductModel.create(productData);
      const products = await ProductModel.find().lean();
      io.emit('listaproducts', products);
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  });

  socket.on('deleteProduct', async (productId) => {
    try {
      await ProductModel.findByIdAndDelete(productId);
      const products = await ProductModel.find().lean();
      io.emit('listaproducts', products);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  });
});

connDB(
  "mongodb+srv://coderbackend1romero:coderbk1@cluster0.oh1ussn.mongodb.net/?appName=Cluster0",
  "ecommerce"
);
