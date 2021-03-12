document.querySelectorAll('.eliminar').forEach(btn => btn.addEventListener('click', e => eliminar(e)));
document.querySelectorAll('.estado').forEach(btn => btn.addEventListener('click', e => estado(e)));

const eliminar = async (e) => {
    const id = e.target.getAttribute('data-id');
    const res = await modal('Eliminar Usuario', '¿Desea Eliminar este Usuario?');
    if (res) {
        const resp = await fetch(`/admin/users/eliminar/${id}`, { method: 'DELETE'});
        if (resp.ok) location.href = '/admin/users';
    }
}

const estado = async (e) => {
    const id = e.target.getAttribute('data-id');
    const res = await modal('Cambiar Estado', '¿Desea cambiar el estado de este usuario?')
    if (res) {
        const resp = await fetch(`/admin/users/estado/${id}`, { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });
        if (resp.ok) location.href = `${window.location.pathname}`;
    }
}