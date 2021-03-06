const Categorias = require('../../models/Categoria');

const getCategorias = async (req, res) => {
    const filtro = req.query.filtro || '';
    const padre = req.params.padre;
    const categorias = await Categorias.getCategorias(filtro, padre);
    let categoriaPadre = '';
    if (padre != 0) {
        categoriaPadre = await Categorias.getCategoria(padre);
        categoriaPadre = categoriaPadre.toJSON();
    }
    res.render('admin/categorias', {
        titulo: 'Agregar categoría',
        nombrePadre: categoriaPadre,
        boton: 'Guardar',
        action: `/admin/categorias/${padre}`,
        padre: req.params.padre,
        actual: filtro,
        categorias: categorias.map(categoria => categoria.toJSON()),
        csrfToken: req.csrfToken()
    });
}

const addCategoria = async (req, res) => {
    let values = {};
    values.categoriaPadre = req.params.padre;
    values.nombre = req.body.nombre;
    const resp = await Categorias.addCategorias(values);
    if (resp != 1) {
        req.flash('error', resp);
    } else {
        req.flash('success', 'Categoria Creada');
    }
    res.redirect(`/admin/categorias/${req.params.padre}`);
}

const deleteCategoria = async (req, res) => {
    const id = req.params.id;
    const resp = await Categorias.deleteCategorias(id);
    if (resp != 1) {
        req.flash('error', 'No se pudo eliminar la categoria');
    } else {
        req.flash('success', 'Categoria Eliminada');
    }
    res.status(200).json('ok')
}

const getCategoria = async (req, res) => {
    const filtro = req.query.filtro || '';
    const padre = req.params.padre;
    const id = req.params.id;
    const [categoria, categorias] = await Promise.all([
        Categorias.getCategoria(id),
        Categorias.getCategorias(filtro, padre),
    ]);
    let categoriaPadre = '';
    if (padre != 0) {
        categoriaPadre = await Categorias.getCategoria(padre);
        categoriaPadre = categoriaPadre.toJSON();
    }
    res.render('admin/categorias', {
        titulo: 'Editar categoría',
        nombrePadre: categoriaPadre,
        boton: 'Editar',
        action: `/admin/categorias/${padre}/editar/${categoria.id}`,
        padre: req.params.padre,
        value: categoria.nombre,
        categorias: categorias.map(categoria => categoria.toJSON()),
        csrfToken: req.csrfToken()
    });
}

const editCategoria = async (req, res) => {
    const id = req.params.id;
    const padre = req.params.padre
    const values = req.body;
    const resp = await Categorias.editCategoria(id, values);
    if (resp != 1) {
        req.flash('error', resp);
    } else {
        req.flash('success', 'Categoria Editada');
    }
    res.redirect(`/admin/categorias/${padre}`);
}

const estadoCategoria = async (req, res) => {
    const id = req.params.id;
    const resp = await Categorias.estadoCategoria(id);
    if (resp != 1) {
        req.flash('error', 'No se pudo cambiar el estado');
    } else {
        req.flash('success', 'Estado cambiado');
    }
    res.status(200).json('ok')
}

const subcat = async (req, res) => {
    const id = req.params.id;
    const resp = await Categorias.getCategorias('', id);
    res.status(200).json(resp)
}

module.exports = { 
    getCategorias, 
    addCategoria, 
    deleteCategoria, 
    getCategoria, 
    editCategoria, 
    estadoCategoria,
    subcat
}