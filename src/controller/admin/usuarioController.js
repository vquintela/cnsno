const Usuario = require('../../models/Usuario');
const helperPws = require('../../lib/password');

const getUsuarios = async (req, res) => {
    const usuarios = await Usuario.getUsuarios();
    res.render('admin/usuarios',{
        usuarios: usuarios.map(usuario => usuario.toJSON()),
    })
}

const addUsuarios = async (req, res) => {
    const roles = await Usuario.getRoles();
    res.render('admin/usuarios/crear', {
        titulo: 'Crear Usuario',
        boton: 'Crear',
        action: '/admin/users/crear',
        roles: roles
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
    const roles = await Usuario.getRoles();
    res.render('admin/usuarios/crear', {
        titulo: 'Editar Usuario',
        boton: 'Editar',
        action: `/admin/users/editar/${req.params.id}`,
        user: user.toJSON(),
        roles: roles
    })
}

const editUsuario = async (req, res) => {
    const { id, nombre, apellido, email, password } = req.body;
    const values = {
        nombre,
        apellido,
        email 
    }
    if (password) values.password = await helperPws.encryptPassword(password);
    const resp = await Usuario.editUsuario(values, id);
    if (resp === 1) {
        req.flash('success', 'Usuario editado de forma correcta');
        res.redirect('/admin/users'); 
    } else {
        res.render('admin/usuarios/crear', {
            titulo: 'Editar Usuario',
            boton: 'Editar',
            action: `/admin/users/editar/${req.params.id}`,
            error: 'Ocurrio un error en la edicion',
            e: resp,
            user: values
        });
    }
}

const newPws = async (req, res) => {
    res.render('admin/usuarios/newpws');
}

const saveNewPws = async (req, res) => {
    const { id, passwordActual, nuevaPass, repNuevaPass } = req.body
    if(!passwordActual.trim() || !nuevaPass.trim() || !repNuevaPass.trim()) {
        req.flash('error', 'Debe ingresar todos los campos')
        res.redirect('/admin/users/newpws')
        return
    }
    if(nuevaPass !== repNuevaPass) { 
        req.flash('error', 'Las contraseñas no coinciden')
        res.redirect('/admin/users/newpws')
        return
    }
    const user = await Usuario.getUsuarioEmail(req.user.email);
    const value = await helperPws.matchPassword(passwordActual, user.password);
    if(value) {
        try {
            await Usuario.editPass(nuevaPass, id);
            res.redirect('/logout')
            return
        } catch (error) {
            console.log(error)
        }
    } else {
        req.flash('error', 'Password incorrecta');
        res.redirect('/admin/users/newpws');
        return
    }
}

const estadoUsuario = async (req, res) => {
    const id = req.params.id;
    const resp = await Usuario.estadoUsuario(id);
    if (resp != 1) {
        req.flash('error', 'No se pudo cambiar el estado');
    } else {
        req.flash('success', 'Estado cambiado');
    }
    res.status(200).json('ok')
}

module.exports = {
    getUsuarios,
    addUsuarios,
    crearUsuarios,
    deleteUsuario,
    getUsuario,
    newPws,
    saveNewPws,
    editUsuario,
    estadoUsuario
}