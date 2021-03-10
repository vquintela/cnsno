const Producto = require("../../models/Producto");
const imagenes = require("../../lib/imagenes");

const randomProduct = (productos) => {
    let list = [];
    const number = [];
    if (productos.length > 6) {
        while (list.length < 6) {
            const rand = Math.floor(Math.random() * count);
            if (!number.includes(rand)) {
                number.push(rand);
                list.push(productos[rand]);
            }
        }
    } else {
        list = productos;
    }
    return list;
}

const getIndex = async (req, res) => {
    let productos = await Producto.productosIndex(true);
    productos = productos.map(producto => producto.toJSON());
    productos = randomProduct(productos);
    productos = imagenes.cargarImagen(productos);
    let productosVarios = await Producto.productosIndex(false);
    productosVarios = productosVarios.map(producto => producto.toJSON());
    productosVarios = randomProduct(productosVarios);
    productosVarios = imagenes.cargarImagen(productosVarios);
    res.render('web/', {
        // layout: 'web'
        productos: productos,
        productosVarios: productosVarios
    });
}

const getProducto = async (req, res) => {
    const id = req.params.id;
    let producto = await Producto.productoIndex(id);
    producto = imagenes.cargarImagenesProducto(producto);
    let productos = await Producto.productosIndex(true);
    productos = productos.map(producto => producto.toJSON());
    productos = randomProduct(productos);
    productos = imagenes.cargarImagen(productos);
    res.render('web/producto', {
        producto: producto,
        productos: productos
    });
}

const getProductos = (req, res) => {
    res.render('web/productos')
}

module.exports = {getIndex, getProducto, getProductos}