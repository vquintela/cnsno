const express = require('express');
const router = express.Router();
const site = require('../controller/web/siteController');
const carrito = require('../controller/web/carritoController');

// RUTAS SITIO
router.get('/', site.getIndex);
router.get('/producto', site.getProducto);
router.get('/productos', site.getProductos);

// RUTAS CARRITO
router.get('/cart', carrito.verCarrito);
router.get('/cart/agregar/:id/:cantidad', carrito.agregarItem);
router.get('/cart/reduce/:id', carrito.reduceItem);
router.get('/cart/add/:id', carrito.addItem);
router.get('/cart/remove/:id', carrito.removeItem);

module.exports = router;