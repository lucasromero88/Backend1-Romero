

const { Router } = require('express');
const { ProductModel } = require('../dao/models/productModel.js');

const productsRouter = Router();

productsRouter.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sortParam = req.query.sort;   
    const queryParam = req.query.query;  

    
    const filter = {};
    if (queryParam) {
      if (queryParam === 'true' || queryParam === 'false') {
        filter.status = queryParam === 'true';
      } else {
        filter.categoria = queryParam;
      }
    }

    let sortOptions = {};
    if (sortParam === 'asc') {
      sortOptions = { precio: 1 };
    } else if (sortParam === 'desc') {
      sortOptions = { precio: -1 };
    }

    const totalDocs = await ProductModel.countDocuments(filter);
    const totalPages = Math.ceil(totalDocs / limit);
    const skip = (page - 1) * limit;

    const products = await ProductModel.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    const baseUrl = `/api/products`;

    const makeLink = (targetPage) => {
      if (!targetPage) return null;
      const params = new URLSearchParams();
      params.set('page', targetPage);
      params.set('limit', limit.toString());
      if (sortParam) params.set('sort', sortParam);
      if (queryParam) params.set('query', queryParam);
      return `${baseUrl}?${params.toString()}`;
    };

    return res.json({
      status: "success",
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink: makeLink(prevPage),
      nextLink: makeLink(nextPage)
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      error: err.message
    });
  }
});

productsRouter.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const producto = await ProductModel.findById(pid).lean();
    if (!producto) {
      return res.status(404).json({
        status: "error",
        error: "Producto no encontrado"
      });
    }
    return res.json({
      status: "success",
      payload: producto
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      error: err.message
    });
  }
});

productsRouter.post('/', async (req, res) => {
  try {
    const nuevoProducto = req.body;

    if (
      !nuevoProducto.nombre ||
      !nuevoProducto.categoria ||
      nuevoProducto.precio === undefined ||
      nuevoProducto.stock === undefined ||
      !nuevoProducto.imagen
    ) {
      return res.status(400).json({
        status: "error",
        error: "Faltan datos del producto"
      });
    }

    const creado = await ProductModel.create(nuevoProducto);

    const io = req.app.get('io');
    const productsActualizados = await ProductModel.find().lean();
    io.emit('listaproducts', productsActualizados);

    return res.status(201).json({
      status: "success",
      payload: creado
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      error: err.message
    });
  }
});

productsRouter.delete('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const eliminado = await ProductModel.findByIdAndDelete(pid);

    if (!eliminado) {
      return res.status(404).json({
        status: "error",
        error: "Producto no encontrado"
      });
    }

    const io = req.app.get('io');
    const productsActualizados = await ProductModel.find().lean();
    io.emit('listaproducts', productsActualizados);

    return res.json({
      status: "success",
      payload: eliminado
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      error: err.message
    });
  }
});

module.exports = productsRouter;
