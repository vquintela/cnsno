document.querySelectorAll('.eliminar').forEach(btn => btn.addEventListener('click', e => eliminar(e)));

const eliminar = async (e) => {
    const id = e.target.getAttribute('data-id');
    const res = await modal('Eliminar Usuario', '¿Desea Eliminar este Usuario?');
    if (res) {
        const resp = await fetch(`/admin/users/eliminar/${id}`, { method: 'DELETE'});
        if (resp.ok) location.href = '/admin/users';
    }
}