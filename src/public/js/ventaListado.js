// LOGICA BOTON VER DETALLE E INSERCION DE DATOS EN VENTANA MODAL
document.querySelectorAll('.detalle-venta').forEach(element => {
    element.addEventListener('click', async (e) => {
        e.preventDefault();
        const id = e.target.getAttribute('data-id');
        const token = document.querySelector('input[name="_csrf"]').value;
        const resp = await fetch(`/admin/ventas/detalle/${id}`, { 
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'CSRF-Token': token  
            },
        }); 
        const res = JSON.parse(await resp.text());
        detalleModal(res)
    });
});

const detalleModal = (res) => {
    const panel = document.getElementById('panelResultadosModal');
    const filas = new DocumentFragment();
    res.forEach(item => {
        const fila = generarFilas(item);
        filas.appendChild(fila);
    });
    panel.innerText = '';
    panel.appendChild(filas);
    mostrarModal();
}

const generarFilas = item => {
    const tr = document.createElement('tr');
    const thImagen = document.createElement('th');
    const img = document.createElement('img');
    img.setAttribute('class', 'img-fluid');
    img.style.width = '40px';
    img.src = `/img/${item.producto.imagenURL}`;
    thImagen.appendChild(img);
    const thNombre = document.createElement('th');
    thNombre.innerText = item.producto.nombre;
    const thCantidad = document.createElement('th');
    thCantidad.innerText = item.cantidad;
    const thPrecio = document.createElement('th');
    thPrecio.innerText = item.precio;
    tr.appendChild(thImagen);
    tr.appendChild(thNombre);
    tr.appendChild(thCantidad);
    tr.appendChild(thPrecio);
    return tr;
}

const mostrarModal = () => {
    let mascara = document.getElementById('modal-detalle');
    mascara.style.display = "block";
    document.querySelector('body').style.overflowY = 'hidden';
    const btnCerrar = document.getElementById('cerrarModalDetalle');
    btnCerrar.addEventListener("click", () => {
        mascara.style.display = "none";
        document.querySelector('body').style.overflowY = 'visible';
    });
}

// FILTRO DE BUSQUEDA POR ESTADO DE LA VENTA
document.getElementById('estado-venta')?.addEventListener('change', e => {
    const params = new URLSearchParams(window.location.search);
    const usuario = params.get('usuario') || '';
    location.href = `/admin/ventas/1?estado=${e.target.value}&usuario=${usuario}`;
});

document.querySelectorAll('.btn-usuario').forEach(element => {
    element.addEventListener('click', e => {
        const usuario = e.target.getAttribute('data-id');
        const params = new URLSearchParams(window.location.search);
        const estado = params.get('estado') || '';
        location.href = `/admin/ventas/1?estado=${estado}&usuario=${usuario}`;
    });
});

// CAMBIO ESTADO PAGOS
document.querySelectorAll('.conf-pago').forEach(element => {
    element.addEventListener('click', e => {
        const id = e.target.getAttribute('data-id');
        checkPago(id);
    });
});

const checkPago = async (id) => {
    const res = await modal('Confirmar pago', '¿Desea confirmar el pago?')
    if (res) {
        const token = document.querySelector('input[name="_csrf"]').value;
        const resp = await fetch(`/admin/ventas/pagado/${id}`, { 
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'CSRF-Token': token  
            }
        });
        if (resp.ok) location.href = '/admin/ventas/1'
    }
}

// ESTADO PEDIDO
document.querySelectorAll('.btn-pedido').forEach(element => {
    element.addEventListener('click', e => {
        const id = e.target.parentElement.getAttribute('data-id');
        estadoPedido(id);
    });
});

const estadoPedido = async (id) => {
    const res = await modal('Actualizar Estado', '¿Desea actualizar el estado?')
    if (res) {
        const token = document.querySelector('input[name="_csrf"]').value;
        const resp = await fetch(`/admin/ventas/pedido/${id}`, { 
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'CSRF-Token': token  
            }
        });
        if (resp.ok) location.href = '/admin/ventas/1'
    }
}

// FILTRO CLIENTE
document.getElementById('estado-venta-cliente')?.addEventListener('change', e => {
    location.href = `/admin/profile?estado=${e.target.value}`;
});