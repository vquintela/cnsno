const Carrito = require('../../models/Carrito');
const Producto = require('../../models/Producto');
const imagenes = require('../../lib/imagenes');

const agregarItem = async (req, res) => {
  const productId = req.params.id;
  const cantidad = req.params.cantidad || 1;
  try {
    const carrito = new Carrito(req.session.carrito ? req.session.carrito : {});
    const producto = await Producto.getProducto(productId);
    if (producto.cantidad >= cantidad && cantidad > 0) {
      carrito.add(producto, productId, cantidad);
      req.session.carrito = carrito;
      req.flash("success", "Producto agregado correctamente");
      res.redirect("/");
    } else {
      req.flash("danger", "Cantidad fuera de stock");
      res.redirect("/producto/productId");
    }
  } catch (error) {
    req.flash("error", "Ocurrio un problema agregando el producto");
    res.redirect("/");
  }
};

const reduceItem = (req, res) => {
  const productId = req.params.id;
  const cart = new Carrito(req.session.carrito ? req.session.carrito : {});
  cart.reduceByOne(productId);
  req.session.carrito = cart;
  res.redirect("/cart");
};

const addItem = (req, res) => {
  const productId = req.params.id;
  const cart = new Carrito(req.session.carrito ? req.session.carrito : {});
  cart.addByOne(productId);
  req.session.carrito = cart;
  res.redirect("/cart");
};

const removeItem = (req, res) => {
  const productId = req.params.id;
  const cart = new Carrito(req.session.carrito ? req.session.carrito : {});
  cart.removeItem(productId);
  req.session.carrito = cart;
  req.flash("success", "Producto eliminado correctamente");
  res.redirect("/cart");
};

const verCarrito = (req, res) => {
  if (!req.session.carrito) {
    return res.render("web/carrito", {
      productos: null,
    });
  }
  const carrito = new Carrito(req.session.carrito);
  let productos = carrito.generateArray();
  productos = imagenes.carritoImagenes(productos);
  console.log(productos);
  res.render("web/carrito", {
    productos: carrito.generateArray(),
    precioTotal: carrito.totalPrice,
  });
};

module.exports = {
    agregarItem,
    reduceItem,
    addItem,
    removeItem,
    verCarrito
}