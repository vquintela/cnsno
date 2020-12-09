const express = require('express');
const router = express.Router();
const site = require('../controller/web/siteController');

router.get('/', site.getIndex);
router.get('/producto', site.getProducto);
router.get('/productos', site.getProductos);

module.exports = router;