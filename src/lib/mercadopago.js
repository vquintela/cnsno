const mercadopago = require ('mercadopago');
const { mercadoPagoKeys } = require('./keys');

mercadopago.configure({
    access_token: mercadoPagoKeys.accesToken
});

const generarPago = async (carrito, factura, user) => {
    let itemsMP = [];
    carrito.forEach(element => {
        const item = {
            id: element.item._id,
            title: element.item.nombre,
            category_id: `${element.item.id_prod_cat}`,
            quantity: parseInt(element.qty), 
            currency_id: 'ARS',
            unit_price: element.item.precio
        }
        itemsMP.push(item)
    });
    let preference = {
        items: itemsMP,
        payer: {
            name: user.nombre,
            surname: user.apellido,
            email: user.email,
        },
        external_reference: `${factura}`,
        back_urls: {
            "success": "http://localhost:3000/success",
            "failure": "http://localhost:3000/failure",
            "pending": "http://localhost:3000/pending"
        },
        auto_return: "approved"
    };
    try {
        const response = await mercadopago.preferences.create(preference);
        initPoint = response.body.init_point;
        return initPoint;
    } catch (error) {
        console.log(error)
    }
}

module.exports = { generarPago };