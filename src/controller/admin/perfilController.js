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
            cantVentas: cantVentas,
        });
    } 
    if (req.user.rol === 'cliente') {
        const estado = req.query.estado || '';
        const usuario = req.user.id;
        let ventas = await Venta.getVentasUser(estado, usuario);
        ventas = ventas.map(vent => vent.toJSON());
        const estados = await Venta.getEstados();
        res.render('cliente', {
            actualEstado: estado,
            estados: estados,
            ventas: ventas,
            csrfToken: req.csrfToken()
        });
    }
}

module.exports = {
    dash
}