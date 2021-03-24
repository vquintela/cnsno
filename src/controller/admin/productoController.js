const Producto = require('../../models/Producto');
const Categoria = require('../../models/Categoria');
const imagenes = require('../../lib/imagenes');
const fse = require('fs-extra');
const path = require('path');

const getProductos = async (req, res) => {
    const porPagina = 2;
    const pagina = req.params.pagina || 1;
    const porPaginaActual = ((porPagina * pagina) - porPagina);
    let subCat;
    const idCat = req.query.subCat || req.query.categoria;
    const productos = await Producto.getProductos(idCat, porPagina, porPaginaActual);
    const prodImg = imagenes.cargarImagenes(productos.rows);
    if(req.query.categoria) subCat = await Categoria.getCategorias('', req.query.categoria);
    const catPadre = await Categoria.getCategorias('', 0);
    res.render('admin/productos', {
        productos: prodImg,
        catPadre: catPadre.map(cat => cat.toJSON()),
        subCat: subCat ? subCat.map(cat => cat.toJSON()) : '',
        actualCategoria: req.query.categoria || '',
        actualSubCategoria: req.query.subCat || '',
        paginacion: Math.ceil(productos.count / porPagina),
        actual: pagina,
        csrfToken: req.csrfToken()
    });
}

const crearProducto = async (req, res) => {
    const categorias = await Categoria.getCategorias('', 0);
    res.render('admin/productos/crear', {
        titulo: 'Crear Producto',
        action: '/admin/productos/crear',
        boton: 'Crear',
        categorias: categorias.map(categoria => categoria.toJSON()),
        csrfToken: req.csrfToken()
    });
}

const addProductos = async (req, res) => {
    const values = req.body;
    let error;
    if (req.files.length > 0) {
        const resp = await imagenes.crearCarpeta(req.files);
        if (resp != -1) {
            values.imagen = resp;
            values.id_categoria = (values.id_prod_cat_padre != 0) ? values.id_prod_cat_padre : values.id_prod_cat;
            values.destacado = (values.destacado != 'on') ? false : true;
            const prod = await Producto.addProducto(values);
            if (prod === 1) {
                req.flash('success', 'Producto Creado')
                res.redirect('/admin/productos/1');
                return
            } else {
                error = prod;
                await fse.remove(path.resolve(`src/public/img/${resp}`)); 
            }
        } 
    } 
    const categorias = await Categoria.getCategorias('', 0);
    res.render('admin/productos/crear', {
        titulo: 'Crear Producto',
        action: '/admin/productos/crear',
        boton: 'Crear',
        producto: values,
        categorias: categorias.map(categoria => categoria.toJSON()),
        error: 'Ingrese al menos una imagen jpeg o jpg',
        actual: values.id_prod_cat,
        e: error,
        csrfToken: req.csrfToken()
    });
}

const getProducto = async (req, res) => {
    const id = req.params.id;
    const [categorias, producto] = await Promise.all([
        Categoria.getCategorias('', 0),
        Producto.getProducto(id)
    ]);
    const cat = await Categoria.getCategoria(producto.id_categoria);
    const subCats = await Categoria.getCategorias('', cat.categoriaPadre);
    const prodImg =  imagenes.cargarImagenesProducto(producto);
    res.render('admin/productos/crear', {
        titulo: 'Editar Producto',
        action: `/admin/productos/editar/${id}`,
        boton: 'Editar',
        producto: prodImg,
        categorias: categorias.map(categoria => categoria.toJSON()),
        actual: cat.categoriaPadre,
        subCat: producto.id_categoria,
        subCats: subCats.map(categoria => categoria.toJSON()),
        csrfToken: req.csrfToken()
    });
}

const editProducto = async (req, res) => {
    const oldImg = req.body.imagen
    const values = req.body;
    let error;
    let resp = -1;
    values.id_categoria = (values.id_prod_cat_padre != 0) ? values.id_prod_cat_padre : values.id_prod_cat;
    values.destacado = (values.destacado != 'on') ? false : true;
    if (req.files.length > 0) {
        resp = await imagenes.crearCarpeta(req.files, values.imagen);
        if (resp != -1) {
            values.imagen = resp;
        } 
    } 
    const prod = await Producto.editProducto(values, req.params.id);
    if (prod === 1) {
        if (resp != -1) await imagenes.borrarCarpeta(oldImg);
        req.flash('success', 'Producto Editado');
        res.redirect('/admin/productos/1');
        return
    } else {
        if (resp != -1) await imagenes.borrarCarpeta(values.imagen);
        error = prod;
    }
    const categorias = await Categoria.getCategorias('', 0);
    res.render('admin/productos/crear', {
        titulo: 'Editar Producto',
        action: `/admin/productos/editar/${req.params.id}`,
        boton: 'Editar',
        producto: values,
        categorias: categorias.map(categoria => categoria.toJSON()),
        error: 'Error al editar el producto',
        actual: values.id_prod_cat,
        e: error,
        csrfToken: req.csrfToken()
    });
}

const deleteProducto = async (req, res) => {
    const id = req.params.id;
    const resp = await Producto.deleteProducto(id);
    if (resp != 1) {
        req.flash('error', 'No se pudo eliminar el producto');
    } else {
        req.flash('success', 'Producto Eliminado');
    }
    res.status(200).json('ok')
}

const estadoProducto = async (req, res) => {
    const id = req.params.id;
    const resp = await Producto.estadoProducto(id);
    if (resp != 1) {
        req.flash('error', 'No se pudo cambiar el estado');
    } else {
        req.flash('success', 'Estado cambiado');
    }
    res.status(200).json('ok')
}

module.exports = { getProductos, crearProducto, addProductos, getProducto, editProducto, deleteProducto, estadoProducto }