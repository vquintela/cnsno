document.querySelectorAll('.eliminar').forEach(btn => btn.addEventListener('click', e => eliminar(e)));
document.querySelectorAll('.estado').forEach(btn => btn.addEventListener('click', e => estado(e)));
document.querySelector('.estado-buscar').addEventListener('change', () => filtrar());

const eliminar = async (e) => {
    const id = e.target.getAttribute('data-id');
    console.log(id)
    const res = await modal('Eliminar categoría', '¿Desea eliminar esta categoría?')
    if (res) {
        const resp = await fetch(`/admin/categorias/eliminar/${id}`, { method: 'DELETE'});
        if (resp.ok) location.href = `${window.location.pathname}`;
    }
}

const estado = async (e) => {
    const id = e.target.getAttribute('data-id');
    const res = await modal('Cambiar Estado', '¿Desea cambiar el estado de esta categoría?')
    if (res) {
        const resp = await fetch(`/admin/categorias/estado/${id}`, { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });
        if (resp.ok) location.href = `${window.location.pathname}`;
    }
}

const filtrar = () => {
    const estado = document.querySelector('.estado-buscar').value;
    location.href = `${window.location.pathname}?filtro=${estado}`;
}