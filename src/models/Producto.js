const Sequelize = require('sequelize');
const { Op } = require("sequelize");
const sequelize = require('../lib/sequelize');
const mensaje = require('../lib/errorMessageValidation');
const imagenes = require('../lib/imagenes');
const { Categoria } = require('./Categoria');
// const Itemventa = require('./Itemventa');

const Producto = sequelize.define('producto', {
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
    precio: {
        type: Sequelize.DOUBLE,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            },
            isNumeric: {
                msg: 'Precio solo en numeros'
            }
        }
    },
    descripcion: {
        type: Sequelize.TEXT,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            },
            min: {
                args: 10,
                msg: 'Descripcion demasiado corto'
            },
            max: {
                args: 100,
                msg: 'Descripcion demasiado larga'
            }
        }
    },
    imagen: {
        type: Sequelize.TEXT,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            }
        }
    },
    cantidad: {
        type: Sequelize.INTEGER,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            },
            isNumeric: {
                msg: 'Stock solo en numeros'
            }
        }
    }, 
    id_categoria: {
        type: Sequelize.INTEGER,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            }
        }
    },
    destacado: { 
        type: Sequelize.BOOLEAN,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            }
        },
        defaultValue: false
    },
    estado: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: false
});

// Producto.hasMany(Itemventa, { foreignKey: 'id_producto', sourceKey: 'id' })
// Itemventa.belongsTo(Producto, { foreignKey: 'id_producto', sourceKey: 'id' })
Categoria.hasMany(Producto, { foreignKey: 'id_categoria', sourceKey: 'id', as: 'producto' })
Producto.hasOne(Categoria, { foreignKey: 'id', sourceKey: 'id_categoria', as: 'categoria' })

// Producto.sync({
//     force: true
// })
// .then(() => {
//     console.log('tabla creada')
// })

const addProducto = async (values) => {
    try {
        await Producto.create({...values, estado: true});
        return 1
    } catch (error) {
        return mensaje.crearMensajeObj(error);
    }
}

const getProductos = async (id, porPagina, porPaginaActual) => {
    const consulta = id ? { [Op.or]: [{id: id}, { categoriaPadre: id }] } : '';
    try {
        const productos = await Producto.findAndCountAll({
            include: [
                {
                    model: Categoria,
                    as: 'categoria',
                    required : true,
                    where: {
                        ...consulta
                    }
                }
            ],
            limit: porPagina,
            offset: porPaginaActual
        });
        return productos;
    } catch (error) {
        console.log(error)
    }
}

const getProducto = async (id) => {
    try {
        const producto = await Producto.findByPk(id);
        return producto;
    } catch (error) {
        console.log(error);
    }
}

const editProducto = async (values, id) => {
    try {
        await Producto.update({ ...values }, {where: {id: id}});
        return 1;
    } catch (error) {
        return -1;
    }
}

const deleteProducto = async (id) => {
    try {
        const prod = await Producto.findByPk(id);
        await prod.destroy();
        await imagenes.borrarCarpeta(prod.imagen)
        return 1;
    } catch (error) {
        return -1;
    }
}

const estadoProducto = async (id) => {
    try {
        let producto = await Producto.findByPk(id);
        await producto.update({ estado: !producto.estado });
        return 1;
    } catch (error) {
        return mensaje.crearMensaje(error);
    }
}

const productosIndex = async (estado) => {
    const productos = Producto.findAll({
        where: {
            estado: true,
            destacado: estado
        },
        include: [
            {
                model: Categoria,
                as: 'categoria',
            }
        ]
    });
    return productos;
}

const productoIndex = async (id) => {
    const producto = await Producto.findByPk(id, {
        include: [
            {
                model: Categoria,
                as: 'categoria',
            }
        ]
    });
    return producto;
}

const productosIndexTotal = async (id) => {
    const consulta = id ? { [Op.or]: [{id: id}, { categoriaPadre: id }] } : '';
    try {
        const productos = await Producto.findAll({
            include: [
                {
                    model: Categoria,
                    as: 'categoria',
                    required : true,
                    where: {
                        estado: true,
                        ...consulta
                    }
                }
            ],
        });
        return productos;
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    Producto, 
    addProducto, 
    getProductos, 
    getProducto, 
    editProducto, 
    deleteProducto, 
    estadoProducto,
    productosIndex,
    productoIndex,
    productosIndexTotal
};