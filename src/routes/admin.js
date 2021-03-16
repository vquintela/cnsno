const express = require('express');
const router = express.Router();
const productos = require('../controller/admin/productoController');
const categorias = require('../controller/admin/categoriaController');
const usuarios = require('../controller/admin/usuarioController');
const ventas = require('../controller/admin/ventaController');
const dash = require('../controller/admin/perfilController');
const { isAdmin, isLoggedIn } = require('../lib/auth');

// PRODUCTOS
router.get('/productos/crear', isAdmin, productos.crearProducto);
router.post('/productos/crear', isAdmin, productos.addProductos);
router.get('/productos/:pagina', isAdmin, productos.getProductos);
router.get('/productos/editar/:id', isAdmin, productos.getProducto);
router.post('/productos/editar/:id', isAdmin, productos.editProducto);
router.delete('/productos/eliminar/:id', isAdmin, productos.deleteProducto);
router.put('/productos/estado/:id', isAdmin, productos.estadoProducto);

// CATEGORIAS
router.get('/categorias/:padre', isAdmin, categorias.getCategorias);
router.post('/categorias/:padre', isAdmin, categorias.addCategoria);
router.delete('/categorias/eliminar/:id', isAdmin, categorias.deleteCategoria);
router.get('/categorias/:padre/editar/:id', isAdmin, categorias.getCategoria);
router.post('/categorias/:padre/editar/:id', isAdmin, categorias.editCategoria);
router.put('/categorias/estado/:id', isAdmin, categorias.estadoCategoria);
router.get('/categorias/subcat/:id', isAdmin, categorias.subcat);

// USUARIOS
router.get('/users', isAdmin, usuarios.getUsuarios);
router.get('/users/crear', isAdmin, usuarios.addUsuarios);
router.post('/users/crear', isAdmin, usuarios.crearUsuarios);
router.delete('/users/eliminar/:id', isAdmin, usuarios.deleteUsuario);
router.get('/users/editar/:id', isAdmin, usuarios.getUsuario);
router.post('/users/editar/:id', isAdmin, usuarios.editUsuario);
router.get('/users/newpws', isLoggedIn, usuarios.newPws);
router.post('/users/newpws', isLoggedIn, usuarios.saveNewPws);
router.put('/users/estado/:id', isAdmin, usuarios.estadoUsuario);

// VENTAS
router.get('/ventas/:pagina', isAdmin, ventas.getVentas);
router.get('/ventas/detalle/:id', isAdmin, ventas.getDetalle);

// PERFIL
router.get('/profile', isAdmin, dash.dash);

module.exports = router;