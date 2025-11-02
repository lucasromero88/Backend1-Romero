
const { Router } = require('express');
const { ProductModel } = require('../dao/models/productModel.js');
const { CartModel } = require('../dao/models/cartsModel.js');

const viewsRouter = Router();

viewsRouter.get('/', async (req, res) => {
  try {
    const products = await ProductModel.find().lean();
    res.render('home', {
      nombre: 'E-commerce',
      products
    });
  } catch (error) {
    res.status(500).send('Error al cargar la página de inicio.');
  }
});

viewsRouter.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await ProductModel.find().lean();
    res.render('realTimeProducts', {
      nombre: 'products',
      products
    });
  } catch (error) {
    res.status(500).send('Error al cargar la vista realtime.');
  }
});

viewsRouter.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const totalDocs = await ProductModel.countDocuments({});
    const totalPages = Math.ceil(totalDocs / limit);
    const skip = (page - 1) * limit;

    const products = await ProductModel.find({})
      .skip(skip)
      .limit(limit)
      .lean();

    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    res.render('products', {
      products,
      page,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage: page - 1,
      nextPage: page + 1
    });
  } catch (error) {
    res.status(500).send('Error al cargar productos paginados.');
  }
});

viewsRouter.get('/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await ProductModel.findById(pid).lean();
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }

    res.render('productDetail', {
      product
    });
  } catch (error) {
    res.status(500).send('Error al cargar el producto.');
  }
});

viewsRouter.get('/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartModel.findById(cid)
      .populate('products.product')
      .lean();

    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }

    res.render('cartDetail', {
      cartProducts: cart.products
    });
  } catch (error) {
    res.status(500).send('Error al cargar el carrito.');
  }
});

module.exports = viewsRouter;
