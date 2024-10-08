// src/routes/carts.js
const express = require('express');
const fs = require('fs');
const router = express.Router();
const filePath = './src/data/carrito.json';

// Helper para leer el archivo
const readCarts = () => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

// Helper para escribir en el archivo
const writeCarts = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Crear nuevo carrito
router.post('/', (req, res) => {
  const carts = readCarts();
  const newCart = {
    id: carts.length ? carts[carts.length - 1].id + 1 : 1,
    products: req.body.products || []
  };
  
  carts.push(newCart);
  writeCarts(carts);
  res.status(201).json(newCart);
});

module.exports = router;
