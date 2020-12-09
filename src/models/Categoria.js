const Sequelize = require('sequelize');
const sequelize = require('../lib/sequelize');
const Producto = require('./Producto');
const mensaje = require('../lib/errorMessageValidation');

const Categoria = sequelize.define('categoria', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    nombre: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            }
        },
        min: {
            args: 3,
            msg: 'Nombre demasiado corto'
        },
        max: {
            args: 15,
            msg: 'Nombre demasiado largo'
        }
    },
    categoriaPadre: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            }
        },
        defaultValue: 0
    },
    estado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            }
        },
        defaultValue: true
    }
}, {
    timestamps: false
});

Categoria.hasMany(Producto, { foreignKey: 'id_categoria', sourceKey: 'id' })
Producto.belongsTo(Categoria, { foreignKey: 'id_categoria', sourceKey: 'id' })

// Categoria.sync({
//     force: true
// })
// .then(() => {
//     console.log('tabla creada')
// })

const addCategorias = async (values) => {
    try {
        await Categoria.create({ ...values });
        return 1;
    } catch (error) {
        return mensaje.crearMensaje(error);
    }
}

const getCategorias = async (filtro, padre) => {
    let consulta = { categoriaPadre: padre }
    if (filtro != '') consulta = { ...consulta, estado: JSON.parse(filtro) }; 
    const categorias = await Categoria.findAll({where: { ...consulta }});
    return categorias;
}

const deleteCategorias = async (id) => {
    try {
        await Categoria.destroy({ where: { id: id }});
        return 1;
    } catch (error) {
        return -1;
    }
}

const getCategoria = async (id) => {
    const categoria = await Categoria.findByPk(id);
    return categoria;
}

const editCategoria = async (id, values) => {
    try {
        await Categoria.update({ nombre: values.nombre }, { where: { id: id }});
        return 1;
    } catch (error) {
        return mensaje.crearMensaje(error);
    }
}

const estadoCategoria = async (id) => {
    try {
        let categoria = await Categoria.findByPk(id);
        await categoria.update({ estado: !categoria.estado });
        return 1;
    } catch (error) {
        return mensaje.crearMensaje(error);
    }
}

module.exports = { 
    addCategorias, 
    getCategorias, 
    deleteCategorias, 
    getCategoria,
    editCategoria,
    estadoCategoria
};