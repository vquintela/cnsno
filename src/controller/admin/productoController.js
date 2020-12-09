const getProductos = (req, res) => {
    res.render('admin/productos', {

    });
}

const crearProducto = (req, res) => {
    res.render('admin/productos/crear');
}

module.exports = { getProductos, crearProducto }