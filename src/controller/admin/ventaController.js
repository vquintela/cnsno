const Venta = require('../../models/Venta');
const Carrito = require('../../models/Carrito');
const Producto = require('../../models/Producto');
const { generarPago } = require('../../lib/mercadopago');
const imagenes = require('../../lib/imagenes');

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
    const venta = await Venta.crearVenta({
        id_usuario: req.user.id,
        total_venta: carrito.totalPrice,
        forma_pago: factura.efectivo == 'on' ? 'transferencia' : 'mercadopago',
    });
    elementosCarrito.forEach(elemento => {
        const item = {
            id_producto: elemento.item.id,
            cantidad: elemento.qty,
            precio: elemento.item.precio
        }
        detalleVenta.push(item)
    });
    req.session.venta = venta;
    req.session.detalleVenta = detalleVenta;
    if (factura.mercadoPago) {
        urlPago = await generarPago(elementosCarrito, venta._id, req.user);
    }
    if (factura.efectivo) {
        urlPago = '/efectivo'
    }
    let productos = carrito.generateArray();
    productos = imagenes.carritoImagenes(productos);
    res.render("admin/ventas/confirmar", {
        productos: productos,
        precioTotal: carrito.totalPrice,
        factura: factura,
        urlPago: urlPago
    });
}

const efectivo = async (req, res) => {
    let venta;
    try {
        venta = await Venta.guardarVenta({...req.session.venta, status: 'efectivo' });
        req.session.detalleVenta.forEach(async det => {
            const prod = await Producto.getProducto(det.id_producto);
            prod.cantidad = prod.cantidad - det.cantidad;
            await Producto.editProducto({cantidad: prod.cantidad}, prod.id);
            await Venta.guardarDetalle({ ...det, id_venta: venta.id });
        });
        req.session.destroy();
    } catch (error) {
        console.log(error)
        return
    }
    res.render('admin/ventas/efectivo', {
        venta: venta.total_venta
    });
}

const pagoSuccess = async (req, res) => {
    const { status, payment_id, merchant_order_id } = req.query;
    let venta;
    try {
        venta = await Venta.guardarVenta({...req.session.venta, status, payment_id, merchant_order_id });
        req.session.detalleVenta.forEach(async det => {
            const prod = await Producto.getProducto(det.id_producto);
            prod.cantidad = prod.cantidad - det.cantidad;
            await Producto.editProducto({cantidad: prod.cantidad}, prod.id);
            await Venta.guardarDetalle({ ...det, id_venta: venta.id });
        });
        req.session.destroy();
    } catch (error) {
        console.log(error)
    }
    res.render('admin/ventas/success', {
        venta: venta.total_venta
    });
}

const pagoFailure = async (req, res) => {
    const { status, payment_id, merchant_order_id } = req.query;
    let venta;
    try {
        venta = await Venta.guardarVenta({...req.session.venta, status, payment_id, merchant_order_id });
        req.session.detalleVenta.forEach(async det => {
            await Venta.guardarDetalle({ ...det, id_venta: venta.id });
        });
    } catch (error) {
        console.log(error)
    }
    res.render('admin/ventas/failure', {
        venta: venta.total_venta
    });
}

const pagoPending = async (req, res) => {
    const { status, payment_id, merchant_order_id } = req.query;
    let venta;
    try {
        venta = await Venta.guardarVenta({...req.session.venta, status, payment_id, merchant_order_id });
        req.session.detalleVenta.forEach(async det => {
            await Venta.guardarDetalle({ ...det, id_venta: venta.id });
        });
    } catch (error) {
        console.log(error)
    }
    res.render('admin/ventas/pending', {
        venta: venta.total_venta
    });
}

module.exports = {
    getVentas,
    pagar,
    efectivo,
    pagoSuccess,
    pagoFailure,
    pagoPending,
}