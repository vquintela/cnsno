const express = require('express');
const router = express.Router();
const site = require('../controller/web/siteController');
const carrito = require('../controller/web/carritoController');
const auth = require('../controller/admin/authController');
const venta = require('../controller/admin/ventaController');
const { isAdmin, isLoggedIn, isNotLoggedIn } = require('../lib/auth');

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
router.get('/signin', isNotLoggedIn, auth.signin);
router.post('/signin', isNotLoggedIn, auth.login);
router.get('/logout', isLoggedIn, auth.logout);
router.get('/auth/google', isNotLoggedIn, auth.authGoogle);
router.get('/auth/google/callback', isNotLoggedIn, auth.callbackGoogle);
router.get('/auth/facebook', isNotLoggedIn, auth.authFacebook);
router.get('/auth/facebook/callback', isNotLoggedIn, auth.callbackFacebook);
router.get('/signup', isNotLoggedIn, auth.signup);
router.post('/signup', isNotLoggedIn, auth.saveSignup);
router.get('/verifica', auth.verificaEmail);
router.post('/renew', isNotLoggedIn, auth.nuevoPass);

// VENTAS
router.post('/pagar', isLoggedIn, venta.pagar);
router.get('/efectivo', isLoggedIn, venta.efectivo);
router.get('/success', isLoggedIn, venta.pagoSuccess);
router.get('/failure', isLoggedIn, venta.pagoFailure);
router.get('/pending', isLoggedIn, venta.pagoPending);

module.exports = router;