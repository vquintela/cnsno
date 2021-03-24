const Producto = require("../../models/Producto");
const imagenes = require("../../lib/imagenes");
const Categoria = require("../../models/Categoria");

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

const getProductos = async (req, res) => {
    const catPadre = parseInt(req.query.catPadre);
    const catHijo = parseInt(req.query.catHijo);
    const categorias = await Categoria.getCategorias(true, 0);
    let subCat = null;
    if (catPadre) {
        subCat = await Categoria.getCategorias(true, catPadre);
        subCat = subCat.map(sub => sub.toJSON());
    } 
    const id = catHijo ? catHijo : catPadre;
    let productos = await Producto.productosIndexTotal(id);
    productos = productos.map(prod => prod.toJSON());
    productos = imagenes.cargarImagen(productos);
    res.render('web/productos', {
        catPadre: catPadre,
        catHijo: catHijo,
        subCat: subCat,
        categorias: categorias.map(cat => cat.toJSON()),
        productos: productos
    });
}

module.exports = {getIndex, getProducto, getProductos}