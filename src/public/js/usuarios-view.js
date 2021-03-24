document.querySelectorAll('.eliminar').forEach(btn => btn.addEventListener('click', e => eliminar(e)));
document.querySelectorAll('.estado').forEach(btn => btn.addEventListener('click', e => estado(e)));

const eliminar = async (e) => {
    const id = e.target.getAttribute('data-id');
    const res = await modal('Eliminar Usuario', '¿Desea Eliminar este Usuario?');
    if (res) {
        const token = document.querySelector('input[name="_csrf"]').value;
        const resp = await fetch(`/admin/users/eliminar/${id}`, { 
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'CSRF-Token': token 
            },
        });
        if (resp.ok) location.href = '/admin/users';
    }
}

const estado = async (e) => {
    const id = e.target.getAttribute('data-id');
    const res = await modal('Cambiar Estado', '¿Desea cambiar el estado de este usuario?')
    if (res) {
        const token = document.querySelector('input[name="_csrf"]').value;
        const resp = await fetch(`/admin/users/estado/${id}`, { 
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'CSRF-Token': token 
            },
        });
        if (resp.ok) location.href = `${window.location.pathname}`;
    }
}

// FILTROS
document.querySelector('.estado-buscar').addEventListener('change', () => filtrar());
document.querySelector('.rol-buscar').addEventListener('change', () => filtrar());

const filtrar = () => {
    const estado = document.querySelector('.estado-buscar').value;
    const rol = document.querySelector('.rol-buscar').value;
    location.href = `/admin/users?estado=${estado}&rol=${rol}`;
}

