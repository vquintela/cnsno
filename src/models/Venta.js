const Sequelize = require('sequelize');
const sequelize = require('../lib/sequelize');
const { Producto } = require('./Producto');
const { Usuario } = require('./Usuario');

const DetalleVenta = sequelize.define('detalleVenta', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    id_venta: {
        type: Sequelize.INTEGER,
    },
    id_producto: {
        type: Sequelize.INTEGER,
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
        values: ['approved', 'in_process', 'rejected', 'efectivo', 'pagado'],
    },
    payment_id: {
        type: Sequelize.STRING,
    },
    merchant_order_id: {
        type: Sequelize.STRING,
    },
    domicilio: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            }
        }
    },
    estadoPedido: {
        type: Sequelize.ENUM,
        values: ['nuevo', 'proceso', 'entrega', 'finalizado']
    }
});

// Producto.hasMany(DetalleVenta, { foreignKey: 'id_producto', sourceKey: 'id', as: 'producto' });
// DetalleVenta.hasOne(Producto, { foreignKey: 'id_producto', sourceKey: 'id', as: 'detalleVenta' });
// Venta.hasOne(DetalleVenta, { foreignKey: 'id_venta', sourceKey: 'id', as: 'venta' });
// DetalleVenta.hasMany(Venta, { foreignKey: 'id_venta', sourceKey: 'id', as: 'detVenta' })
Producto.hasMany(DetalleVenta, { foreignKey: 'id_producto' });
DetalleVenta.hasOne(Producto,{ foreignKey: 'id', sourceKey: 'id_producto' });
Venta.hasMany(DetalleVenta, { foreignKey: 'id_venta' });
Usuario.hasMany(Venta, { foreignKey: 'id_usuario', sourceKey: 'id', as: 'usuario' });
Venta.hasOne(Usuario, { sourceKey: 'id_usuario', foreignKey: 'id' });

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

const getVentas = async (estado, usuario, porPagina, porPaginaActual) => {
    let consulta;
    if (estado !== '') consulta = { status: estado };
    if (usuario !== '') consulta = { ...consulta, id_usuario: usuario }
    const ventas = await Venta.findAndCountAll({
        where: {
            ...consulta
        },
        include: [
            // {
            //     model: DetalleVenta,
            //     required : true,
            // },
            {
                model: Usuario,
                as: 'usuario',
                required: true,
                attributes: ['id', 'nombre', 'apellido', 'email']
            }
        ],
        limit: porPagina,
        offset: porPaginaActual,
        order: [['fecha', 'DESC']]
    });
    return ventas;
}

const getDetalle = async (id) => {
    const detalle = await DetalleVenta.findAll({
        where: {
            id_venta: id,
        },
        include: [
            {
                model: Producto,
                require: true,
                attributes: ['id', 'nombre']
            }
        ]
    });
    return detalle;
}

const getEstados = async () => {
    const estados = Venta.rawAttributes.status.values;
    return estados;
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

const contVentas = async (req, res) => {
    const contVentas = await Venta.count();
    return contVentas;
}

module.exports = {
    Venta,
    DetalleVenta,
    getVentas,
    crearVenta,
    guardarVenta,
    guardarDetalle,
    getDetalle,
    getEstados,
    contVentas
}