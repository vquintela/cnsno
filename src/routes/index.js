const express = require('express');
const router = express.Router();
const site = require('../controller/web/siteController');
const carrito = require('../controller/web/carritoController');
const auth = require('../controller/admin/authController');
const venta = require('../controller/admin/ventaController');

// RUTAS SITIO
router.get('/', site.getIndex);
router.get('/producto/:id', site.getProducto);
router.get('/productos', site.getProductos);

// RUTAS CARRITO
router.get('/cart', carrito.verCarrito);
router.get('/cart/agregar/:id/:cantidad', carrito.agregarItem);
router.get('/cart/reduce/:id', carrito.reduceItem);
router.get('/cart/add/:id', carrito.addItem);
router.get('/cart/remove/:id', carrito.removeItem);

// AUTH
router.get('/signin', auth.signin);
router.post('/signin', auth.login);
router.get('/logout', auth.logout);
router.get('/auth/google', auth.authGoogle);
router.get('/auth/google/callback', auth.callbackGoogle);
router.get('/auth/facebook', auth.authFacebook);
router.get('/auth/facebook/callback', auth.callbackFacebook);
router.get('/signup', auth.signup);
router.post('/signup', auth.saveSignup);
router.get('/verifica', auth.verificaEmail);
router.post('/renew', auth.nuevoPass);

// VENTAS
router.post('/pagar', venta.pagar);
router.get('/efectivo', venta.efectivo);
router.get('/success', venta.pagoSuccess);
router.get('/failure', venta.pagoFailure);
router.get('/pending', venta.pagoPending);

module.exports = router;