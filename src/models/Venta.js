const Sequelize = require('sequelize');
const sequelize = require('../lib/sequelize');
const { Producto } = require('./Producto');

const DetalleVenta = sequelize.define('detalleVenta', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    id_venta: {
        type: Sequelize.INTEGER,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            }
        }
    },
    id_producto: {
        type: Sequelize.INTEGER,
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
                msg: 'Cantidad solo en numeros'
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
    }
});

const Venta = sequelize.define('venta', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    id_usuario: {
        type: Sequelize.INTEGER,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            }
        }
    },
    fecha: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date()
    },
    total_venta: {
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
    forma_pago: {
        type: Sequelize.ENUM,
        values: ['mercadopago', 'transferencia'],
    },
    status: {
        type: Sequelize.ENUM,
        values: ['approved', 'in_process', 'rejected', 'efectivo'],
    },
    payment_id: {
        type: Sequelize.STRING,
    },
    merchant_order_id: {
        type: Sequelize.STRING,
    }
});

Producto.hasMany(DetalleVenta, { foreignKey: 'id_producto', sourceKey: 'id', as: 'producto' });
DetalleVenta.hasOne(Producto, {foreignKey: 'id', sourceKey: 'id_producto', as: 'detalleVenta'});
Venta.hasMany(DetalleVenta, { foreignKey: 'id_venta', sourceKey: 'id', as: 'venta' });
// DetalleVenta.hasOne(Venta, {foreignKey: 'id', sourceKey: 'id_venta', as: 'detalleVenta'});

// Venta.sync({
//     force: true
// })
// .then(() => {
//     console.log('tabla creada')
// });
// DetalleVenta.sync({
//     force: true
// })
// .then(() => {
//     console.log('tabla creada')
// });

const getVentas = async () => {
    const ventas = await Venta.findAll();
    return ventas;
}

const crearVenta = async (venta) => {
    const vent = await Venta.build(venta);
    return vent;
}

const guardarVenta = async (venta) => {
    try {
        const vent = await Venta.create(venta);
        return vent;
    } catch (error) {
        console.log(error)
    }
}

const guardarDetalle = async (detalle) => {
    try {
        await DetalleVenta.create(detalle);
        return 1
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    Venta,
    DetalleVenta,
    getVentas,
    crearVenta,
    guardarVenta,
    guardarDetalle
}