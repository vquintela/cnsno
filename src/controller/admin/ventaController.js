const Venta = require('../../models/Venta');

const getVentas = async (req, res) => {
    const ventas = await Venta.getVentas();
    res.render('admin/ventas', {

    })
}

module.exports = {
    getVentas
}