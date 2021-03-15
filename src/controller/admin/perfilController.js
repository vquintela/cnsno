const Categoria = require('../../models/Categoria');
const Producto = require('../../models/Producto');
const Usuario = require('../../models/Usuario');
const Venta = require('../../models/Venta');

const dash = async (req, res) => {
    if (req.user.rol === 'admin') {
        const [cantCat, cantUser, cantProd, cantVentas] = await Promise.all([
            Categoria.cantCat(),
            Producto.contProductos(),
            Usuario.contUsuarios(),
            Venta.contVentas()
        ]);
        res.render('admin/dashboard/admindash', {
            cantCat: cantCat,
            cantUser: cantUser,
            cantProd: cantProd,
            cantVentas: cantVentas
        });
    } else {
        res.render('cliente');
    }
}

module.exports = {
    dash
}