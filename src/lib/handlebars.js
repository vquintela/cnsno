const helpers = {};
const moment = require('moment');
moment.locale('es');

helpers.estado = (item, actual) => {
    return (item == actual);
}

helpers.date = (date) => {
    return moment(date).format('l');
}

helpers.status = (status) => {
    switch (status) {
        case 'approved':
            return '<th class="text-primary">Aprobado</th>';
        case 'in_process':
            return '<th class="text-warning">En processo</th>';
        case 'rejected':
            return '<th class="text-danger">Rechazado</th>';
        case 'efectivo':
            return '<th class="text-success">Efectivo</th>';
    }
}

helpers.casePedido = (pedido) => {
    switch (pedido) {
        case 'nuevo':
            return '<button type="button" class="btn-pedido btn btn-sm btn-success">Nuevo</button>';
        case 'proceso':
            return '<button type="button" class="btn-pedido btn btn-sm btn-warning">En Proceso</button>';
        case 'entrega':
            return '<button type="button" class="btn-pedido btn btn-sm btn-secondary">Entrega</button>';
        case 'finalizado':
            return '<p class="text-primary">Finalizado</p>';
        case 'cancelado':
            return '<button type="button" class="btn-pedido btn btn-sm btn-danger">Cancelado</button>';
    }
}

helpers.indexProd = (numero, actual, actualCategoria, actualSubCategoria) => {
    let fragment = "";
    let element;
    if (actual == 1) {
        element = `<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>`;
    } else {
        element = `<li class="page-item"><a class="page-link" href="/admin/productos/${Number(actual) - 1}?categoria=${actualCategoria}&subCat=${actualSubCategoria}">Previous</a></li>`;
    }
    fragment = fragment + element;
    for (let i = 1; i <= numero; i++) {
        if (i == actual) {
            element = `<li class="page-item disabled"><a class="page-link" href="#">${i}</a></li>`;
        } else {
            element = `<li class="page-item"><a class="page-link" href="/admin/productos/${i}?categoria=${actualCategoria}&subCat=${actualSubCategoria}">${i}</a></li>`;
        }
        fragment = fragment + element;
    }
    if (numero == actual) {
        element = `<li class="page-item disabled"><a class="page-link" href="#">Next</a></li>`;
    } else {
        element = `<li class="page-item"><a class="page-link" href="/admin/productos/${Number(actual) + 1}?categoria=${actualCategoria}&subCat=${actualSubCategoria}">Next</a></li>`;
    }
    fragment = fragment + element;
    return fragment;
}

helpers.pagProd = (numero, actual, actualEstado, usuario) => {
    let fragment = "";
    let element;
    if (actual == 1) {
        element = `<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>`;
    } else {
        element = `<li class="page-item"><a class="page-link" href="/admin/ventas/${Number(actual) - 1}?estado=${actualEstado}&usuario=${usuario}">Previous</a></li>`;
    }
    fragment = fragment + element;
    for (let i = 1; i <= numero; i++) {
        if (i == actual) {
            element = `<li class="page-item disabled"><a class="page-link" href="#">${i}</a></li>`;
        } else {
            element = `<li class="page-item"><a class="page-link" href="/admin/ventas/${i}?estado=${actualEstado}&usuario=${usuario}">${i}</a></li>`;
        }
        fragment = fragment + element;
    }
    if (numero == actual) {
        element = `<li class="page-item disabled"><a class="page-link" href="#">Next</a></li>`;
    } else {
        element = `<li class="page-item"><a class="page-link" href="/admin/ventas/${Number(actual) + 1}?estado=${actualEstado}&usuario=${usuario}">Next</a></li>`;
    }
    fragment = fragment + element;
    return fragment;
}

helpers.background = (item) => {
    switch (item) {
        case 'nuevo':
            return 'bg-success'
        case 'proceso':
            return 'bg-primary'
        case 'entrega':
            return 'bg-warning'
        case 'finalizado':
            return 'bg-secondary'
    }
}

module.exports = helpers;