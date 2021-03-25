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
        values: ['approved', 'in_process', 'rejected', 'efectivo'],
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
        values: ['nuevo', 'proceso', 'entrega', 'finalizado', 'cancelado'],
        defaultValue: 'nuevo'
    },
    pagado: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    if (estado !== '') consulta = { estadoPedido: estado };
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

const getVentasUser = async (estado, usuario) => {
    let consulta;
    if (estado !== '') consulta = { estadoPedido: estado };
    const ventas = await Venta.findAll({
        where: {
            ...consulta,
            id_usuario: usuario
        },
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
                attributes: ['id', 'nombre', 'imagen']
            }
        ]
    });
    return detalle;
}

const getEstados = async () => {
    const estados = Venta.rawAttributes.estadoPedido.values;
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

const contVentas = async () => {
    const contVentas = await Venta.count();
    return contVentas;
}

const checkPago = async (id) => {
    try {
        let venta = await Venta.findByPk(id, {
            attributes: ['id', 'pagado']
        });
        await venta.update({ pagado: !venta.pagado });
        return 1;
    } catch (error) {
        console.log(error)
    }
}

const estadoPedido = async (id) => {
    try {
        let venta = await Venta.findByPk(id, {
            attributes: ['id', 'estadoPedido'],
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    required: true,
                    attributes: ['id', 'email']
                }
            ]
        });
        let nuevoEstado;
        switch (venta.estadoPedido) {
            case 'nuevo':
                nuevoEstado = 'proceso';
                break;
            case 'proceso':
                nuevoEstado = 'entrega';
                break;
            case 'entrega':
                nuevoEstado = 'finalizado';
                break;
            case 'cancelado':
                nuevoEstado = 'nuevo';
                break;
        }
        await venta.update({ estadoPedido: nuevoEstado });
        return {valor: 1, estado: nuevoEstado, email: venta.usuario.email};
    } catch (error) {
        console.log(error)
    }
}

const cancelarPedido = async (id) => {
    try {
        let venta = await Venta.findByPk(id, {
            attributes: ['id', 'estadoPedido'],
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    required: true,
                    attributes: ['id', 'email']
                }
            ]
        });
        await venta.update({ estadoPedido: 'cancelado' });
        return {valor: 1, estado: 'cancelado', email: venta.usuario.email};
    } catch (error) {
        console.log(error);
    }
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
    contVentas,
    checkPago,
    estadoPedido,
    getVentasUser,
    cancelarPedido
}