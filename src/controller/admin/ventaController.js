const Venta = require('../../models/Venta');

const getVentas = async (req, res) => {
    const ventas = await Venta.getVentas();
    res.render('admin/ventas', {

    })
}

const pagar = async (req, res) => {
    if (!req.isAuthenticated() || !req.session.carrito) {
        req.flash('error', 'Debe ingresar al sistema para pagar');
        res.redirect('/carrito');
    }
    const carrito = new Carrito(req.session.carrito);
    const factura = req.body;
    let urlPago;
    const detalleVenta = [];
    const elementosCarrito = carrito.generateArray();
    elementosCarrito.forEach(elemento => {
        const item = {
            id_producto: elemento.item._id,
            cantidad: elemento.qty,
            precio: elemento.item.precio
        }
        detalleVenta.push(item)
    });
    const venta = new Venta({
        id_usuario: req.user._id,
        total_venta: carrito.totalPrice,
        forma_pago: factura.efectivo == 'on' ? 'transferencia' : 'mercadopago',
        detalle: detalleVenta
    });
    req.session.venta = venta;
    if (factura.mercadoPago) {
        urlPago = await generarPago(elementosCarrito, venta._id, req.user);
    }
    if (factura.efectivo) {
        urlPago = '/efectivo'
    }
    res.render("ventas", {
        productos: carrito.generateArray(),
        precioTotal: carrito.totalPrice,
        factura: factura,
        urlPago: urlPago
    });
}

const efectivo = async (req, res) => {
    let venta;
    try {
        venta = new Venta({...req.session.venta, status: 'efectivo' });
        await venta.save();
        venta.detalle.forEach(async det => {
            const prod = await Producto.findById({_id: det.id_producto});
            prod.cantidad = prod.cantidad - det.cantidad;
            await Producto.updateOne({_id: prod._id}, {cantidad: prod.cantidad});
        });
    } catch (error) {
        console.log(error)
        return
    }
    res.render('ventas/efectivo', {
        venta: venta.total_venta
    });
}

module.exports = {
    getVentas,
    pagar,
    efectivo
}