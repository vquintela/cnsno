const express = require('express');
const router = express.Router();
const productos = require('../controller/admin/productoController');
const categorias = require('../controller/admin/categoriaController');
const usuarios = require('../controller/admin/usuarioController');
const auth = require('../controller/admin/authController');

// PRODUCTOS
router.get('/productos/crear', productos.crearProducto);
router.post('/productos/crear', productos.addProductos);
router.get('/productos/:pagina', productos.getProductos);
router.get('/productos/editar/:id', productos.getProducto);
router.post('/productos/editar/:id', productos.editProducto);
router.delete('/productos/eliminar/:id', productos.deleteProducto);
router.put('/productos/estado/:id', productos.estadoProducto);

// CATEGORIAS
router.get('/categorias/:padre', categorias.getCategorias);
router.post('/categorias/:padre', categorias.addCategoria);
router.delete('/categorias/eliminar/:id', categorias.deleteCategoria);
router.get('/categorias/:padre/editar/:id', categorias.getCategoria);
router.post('/categorias/:padre/editar/:id', categorias.editCategoria);
router.put('/categorias/estado/:id', categorias.estadoCategoria);
router.get('/categorias/subcat/:id', categorias.subcat);

// USUARIOS
router.get('/users', usuarios.getUsuarios);
router.get('/users/crear', usuarios.addUsuarios);
router.post('/users/crear', usuarios.crearUsuarios);
router.delete('/users/eliminar/:id', usuarios.deleteUsuario);
router.get('/users/editar/:id', usuarios.getUsuario);
router.post('/users/editar/:id', usuarios.editUsuario);
router.get('/users/newpws', usuarios.newPws);
router.post('/users/newpws', usuarios.saveNewPws);

// AUTH
router.get('/signin', auth.signin);
router.post('/signin', auth.login);
router.get('/logout', auth.logout);

module.exports = router;