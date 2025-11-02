// const { Router } = require("express");
// const cartstManager = require("../dao/cartsManager.js");
// const path = require("path");

// const cartsRouter = Router();

// cartsRouter.use((req, res, next) => {
//     tr
// }

const { Router } = require('express');
const { CartModel } = require('../dao/models/cartsModel.js');

const cartRouter = Router();


cartRouter.post('/', async (req, res) => {
  try {
    const nuevo = await CartModel.create({ products: [] });

    return res.status(201).json({
      status: 'success',
      payload: nuevo
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
});


cartRouter.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await CartModel.findById(cid)
      .populate('products.product')
      .lean();

    if (!cart) {
      return res.status(404).json({
        status: 'error',
        error: 'Cart not found'
      });
    }

    return res.json({
      status: 'success',
      payload: cart
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
});


cartRouter.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    // 1. Buscar el carrito
    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        error: 'Cart not found'
      });
    }

    const item = cart.products.find(
      p => p.product.toString() === pid
    );

    if (item) {
      item.quantity = quantity;
    } else {
      cart.products.push({
        product: pid,
        quantity: quantity ?? 1
      });
    }

    await cart.save();

    const updatedCart = await CartModel.findById(cid)
      .populate('products.product')
      .lean();

    return res.json({
      status: 'success',
      payload: updatedCart
    });
  } catch (err) {
    console.error('Error en PUT /api/carts/:cid/products/:pid:', err);
    return res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
});

cartRouter.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body; 

    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        error: 'Cart not found'
      });
    }

    cart.products = Array.isArray(products) ? products : [];
    await cart.save();

    const updated = await CartModel.findById(cid)
      .populate('products.product')
      .lean();

    return res.json({
      status: 'success',
      payload: updated
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
});


cartRouter.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        error: 'Cart not found'
      });
    }

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== pid
    );

    await cart.save();

    const updated = await CartModel.findById(cid)
      .populate('products.product')
      .lean();

    return res.json({
      status: 'success',
      payload: updated
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
});


cartRouter.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        error: 'Cart not found'
      });
    }

    cart.products = [];
    await cart.save();

    return res.json({
      status: 'success',
      payload: cart
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
});

module.exports = cartRouter;
