const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: String, required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  imagen: { type: String },
  status: { type: Boolean, default: true }
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = { ProductModel };
