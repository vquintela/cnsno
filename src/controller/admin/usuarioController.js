const Usuario = require('../../models/Usuario');

const getUsuarios = async (req, res) => {
    const usuarios = await Usuario.getUsuarios();
    res.render('admin/usuarios',{
        usuarios: usuarios.map(usuario => usuario.toJSON()),
    })
}

const addUsuarios = async (req, res) => {
    res.render('admin/usuarios/crear', {
        titulo: 'Crear Usuario',
        boton: 'Crear',
        action: '/admin/users/crear'
    });
}

const crearUsuarios = async (req, res) => {
    const values = req.body;
    const resp = await Usuario.addUsuarios(values);
    if (resp === 1) {
        req.flash('success', 'Usuario creado de forma correcta');
        res.redirect('/admin/users'); 
    } else {
        res.render('admin/usuarios/crear', {
            titulo: 'Crear Usuario',
            boton: 'Crear',
            action: '/admin/users/crear',
            danger: 'Ocurrio un error en la creacion',
            e: resp,
            user: values
        });
    }
}

const deleteUsuario = async (req, res) => {
    const resp = await Usuario.deleteUsuario(req.params.id);
    if (resp != -1) req.flash('success', 'Usuario eliminado');
    res.status(200).json('Ok');
}

const getUsuario = async (req, res) => {
    const user = await Usuario.getUserPK(req.params.id);
    res.render('admin/usuarios/crear', {
        titulo: 'Editar Usuario',
        boton: 'Editar',
        action: `/admin/users/editar/${req.params.id}`,
        user: user.toJSON()
    })
}

module.exports = {
    getUsuarios,
    addUsuarios,
    crearUsuarios,
    deleteUsuario,
    getUsuario
}