const Sequelize = require('sequelize');
const sequelize = require('../lib/sequelize');
const bcrypt = require('bcrypt');
const mensaje = require('../lib/errorMessageValidation');

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
        allowNull: false,
        unique: {
            msg: 'Email en uso'
        },
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
            is: {
                args: /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/g,
                msg: 'La password no cumple los requisitos de seguridad'
            }
        }
    },
    rol: {
        type: Sequelize.ENUM,
        values: ['cliente', 'admin'],
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            }
        },
        defaultValue: 'cliente'
    },
    oauthId: {
        type: Sequelize.STRING
    },
    numAut: {
        type: Sequelize.STRING
    },
    estado: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: false
})

Usuario.beforeCreate(async (usuario, options) => {
    if(usuario.password) {
        const hashedPassword = await hashPassword(usuario.password);
        usuario.password = hashedPassword;
    }
});

Usuario.beforeUpdate(async (usuario, options) => {
    if(usuario.password) {
        const hashedPassword = await hashPassword(usuario.password);
        usuario.password = hashedPassword;
    }
});

// Usuario.sync({
//     force: true
// })
// .then(() => {
//     console.log('tabla creada')
// })

const getUsuarioEmail = async (email) => {
    const user = await Usuario.findOne({where: {email: email}});
    return user;
}

const getUserPK = async (id) => {
    const user = await Usuario.findByPk(id, {
        attributes: ['id', 'nombre', 'apellido', 'email', 'rol']
    });
    return user;
}

const getUsuarios = async (rol, estado) => {
    let consulta = {};
    if(rol) consulta = { rol: rol };
    if(estado) consulta = { ...consulta, estado: JSON.parse(estado) };
    const users = await Usuario.findAll({where: { ...consulta }});
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
        await Usuario.update(
            { password: newPass }, 
            {where: { id: id },
            individualHooks: true
        });
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
        console.log(error)
        return mensaje.crearMensajeObj(error);
    }
}

const getRoles = async () => {
    const roles = Usuario.rawAttributes.rol.values;
    return roles;
}

const getUSerOauth = async (oauthId) => {
    const user = await Usuario.findOne({where: {oauthId: oauthId}});
    return user;
}

const findOrCreate = async (user) => {
    const usuario = await Usuario.findOrCreate({
        where: {
            oauthId: user.oauthId
        },
        defaults: {
            oauthId: user.oauthId,
            rol: 'cliente',
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            estado: true
        }
    });
    return usuario;
}

const estadoUsuario = async (id) => {
    try {
        let usuario = await Usuario.findByPk(id, {
            attributes: ['id', 'estado']
        });
        await usuario.update({ estado: !usuario.estado },{individualHooks: false});
        return 1;
    } catch (error) {
        return mensaje.crearMensaje(error);
    }
}

const contUsuarios = async (req, res) => {
    const contUser = await Usuario.count({
        where: { estado: true }
    });
    return contUser;
}

module.exports = {
    Usuario,
    getUsuarioEmail,
    getUserPK,
    getUsuarios,
    addUsuarios,
    deleteUsuario,
    editPass,
    editUsuario,
    getRoles,
    getUSerOauth,
    findOrCreate,
    estadoUsuario,
    contUsuarios
}