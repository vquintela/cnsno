const express = require('express');
const router = express.Router();
const productos = require('../controller/admin/productoController');
const categorias = require('../controller/admin/categoriaController');

// PRODUCTOS
router.get('/productos', productos.getProductos);
router.get('/productos/crear', productos.crearProducto);

// CATEGORIAS
router.get('/categorias/:padre', categorias.getCategorias);
router.post('/categorias/:padre', categorias.addCategoria);
router.delete('/categorias/eliminar/:id', categorias.deleteCategoria);
router.get('/categorias/:padre/editar/:id', categorias.getCategoria);
router.post('/categorias/:padre/editar/:id', categorias.editCategoria);
router.put('/categorias/estado/:id', categorias.estadoCategoria);

module.exports = router;