document.querySelectorAll('.eliminar').forEach(btn => btn.addEventListener('click', e => eliminar(e)));
document.querySelectorAll('.estado').forEach(btn => btn.addEventListener('click', e => estado(e)));
document.querySelector('.categoria-buscar').addEventListener('change', () => {
    const categoria = document.querySelector('.categoria-buscar').value;
    const subCat = '';
    filtrar(categoria, subCat);
});
document.querySelector('.subCat-buscar').addEventListener('change', () => {
    const categoria = document.querySelector('.categoria-buscar').value;
    const subCat = document.querySelector('.subCat-buscar').value;
    filtrar(categoria, subCat);
});

const eliminar = async (e) => {
    const id = e.target.getAttribute('data-id');
    const res = await modal('Eliminar Producto', '¿Desea Eliminar este Producto?')
    if (res) {
        const resp = await fetch(`/admin/productos/eliminar/${id}`, { method: 'DELETE'});
        if (resp.ok) location.href = '/admin/productos/1'
    }
}

const estado = async (e) => {
    const id = e.target.getAttribute('data-id');
    const estado = JSON.parse(e.target.getAttribute('estado-producto'));
    const res = await modal('Cambiar Estado', '¿Desea cambiar el estado de este Producto?')
    if (res) {
        const resp = await fetch(`/admin/productos/estado/${id}`, { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({estado})
        });
        if (resp.ok) location.href = '/admin/productos/1'
    }
}

const filtrar = (categoria, subCat) => {
    location.href = `/admin/productos/1?categoria=${categoria}&subCat=${subCat}`;
}