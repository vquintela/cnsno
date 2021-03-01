const helpers = {};

helpers.estado = (item, actual) => {
    return (item == actual);
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

module.exports = helpers;