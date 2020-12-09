const getIndex = (req, res) => {
    res.render('web/');
}

const getProducto = (req, res) => {
    res.render('web/producto')
}

const getProductos = (req, res) => {
    res.render('web/productos')
}

module.exports = {getIndex, getProducto, getProductos}