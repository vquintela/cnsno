const router = require('express').Router();
const cliente = require('../controller/cliente/clienteController');

// RUTAS CLIENTE
router.get('/', cliente.clienteInicio);

module.exports = router;