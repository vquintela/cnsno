const Sequelize = require('sequelize');
const sequelize = require('../lib/sequelize');
const bcrypt = require('bcrypt');
const mensaje = require('../lib/errorMessageValidation');
const { where } = require('sequelize');

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

const Usuario = sequelize.define('usuario', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    nombre: {
        type: Sequelize.TEXT,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            },
            min: {
                args: 3,
                msg: 'Nombre demasiado corto'
            },
            max: {
                args: 15,
                msg: 'Nombre demasiado largo'
            }
        }
    },
    apellido: {
        type: Sequelize.TEXT,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            },
            min: {
                args: 3,
                msg: 'Apellido demasiado corto'
            },
            max: {
                args: 20,
                msg: 'Apellido demasiado largo'
            }
        }
    },
    email: {
        type: Sequelize.TEXT,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            },
            isEmail: {
                msg: 'Formato no valido'
            }
        }
    },
    password: {
        type: Sequelize.TEXT,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            },
            is: {
                args: /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/g,
                msg: 'La password no cumple los requisitos de seguridad'
            }
        }
    },
    rol: {
        type: Sequelize.ENUM,
        values: ['cliente', 'admin'],
    }
}, {
    timestamps: false
})

Usuario.beforeCreate(async (usuario, options) => {
    const hashedPassword = await hashPassword(usuario.password);
    usuario.password = hashedPassword;
})

Usuario.sync({
    force: true
})
.then(() => {
    console.log('tabla creada')
})

const getUsuarioEmail = async (email) => {
    const user = await Usuario.findOne({where: {email: email}});
    return user;
}

const getUserPK = async (id) => {
    const user = await Usuario.findByPk(id);
    return user;
}

const getUsuarios = async () => {
    const users = await Usuario.findAll();
    return users;
}

const addUsuarios = async (values) => {
    try {
        await Usuario.create({...values});
        return 1;   
    } catch (error) {
        return mensaje.crearMensajeObj(error);
    }
}

const deleteUsuario = async (id) => {
    try {
        await Usuario.destroy({where: {id: id}});
        return 1;
    } catch (error) {
        return -1;
    }
}

const editPass = async (newPass, id) => {
    try {
        await Usuario.update({ password: newPass }, {where: {id: id}});
        return 1
    } catch (error) {
        console.log(error)
    }
}

const editUsuario = async (values, id) => {
    try {
        await Usuario.update({ ...values }, {where: {id: id}});
        return 1;
    } catch (error) {
        return mensaje.crearMensajeObj(error);
    }
}

module.exports = {
    getUsuarioEmail,
    getUserPK,
    getUsuarios,
    addUsuarios,
    deleteUsuario,
    editPass,
    editUsuario
}