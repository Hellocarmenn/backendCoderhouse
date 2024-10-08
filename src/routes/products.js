// src/routes/products.js
const express = require('express');
const fs = require('fs');
const router = express.Router();
const filePath = './src/data/productos.json';

// Helper para leer el archivo
const readProducts = () => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

// Helper para escribir en el archivo
const writeProducts = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Listar productos
router.get('/', (req, res) => {
  const products = readProducts();
  const limit = parseInt(req.query.limit) || products.length;
  res.json(products.slice(0, limit));
});

// Obtener producto por ID
router.get('/:pid', (req, res) => {
  const products = readProducts();
  const product = products.find(p => p.id == req.params.pid);
  product ? res.json(product) : res.status(404).json({ error: 'Producto no encontrado' });
});

// Agregar nuevo producto
router.post('/', (req, res) => {
  const products = readProducts();
  const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1,
    ...req.body,
    status: req.body.status ?? true,
    thumbnails: req.body.thumbnails || []
  };
  
  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});

// Actualizar producto
router.put('/:pid', (req, res) => {
  const products = readProducts();
  const index = products.findIndex(p => p.id == req.params.pid);
  
  if (index !== -1) {
    const updatedProduct = { ...products[index], ...req.body };
    products[index] = updatedProduct;
    writeProducts(products);
    res.json(updatedProduct);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Eliminar producto
router.delete('/:pid', (req, res) => {
  const products = readProducts();
  const index = products.findIndex(p => p.id == req.params.pid);
  
  if (index !== -1) {
    products.splice(index, 1);
    writeProducts(products);
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

module.exports = router;
