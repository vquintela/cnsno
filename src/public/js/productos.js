// MENU FILTRO
const menuDrop = document.querySelector('.productos-filtro-contenido');
menuDrop.addEventListener('click', e => {
    const filtro = document.querySelector('.filtro');
    const subMenu = document.querySelector('.productos-filtro-items-contenido');
    if(filtro.classList.contains('fa-chevron-right')) {
        filtro.classList.replace('fa-chevron-right', 'fa-chevron-down');
        subMenu.classList.add('show-drop')
    } else {
        filtro.classList.replace('fa-chevron-down', 'fa-chevron-right');
        subMenu.classList.remove('show-drop')
    }
});

const subMenu = document.querySelectorAll('.producto-filtro-item');
subMenu.forEach(element => {
    element.addEventListener('click', e => {
        const icono = e.currentTarget.getElementsByClassName('fas')[0];
        const menuSub = e.currentTarget.nextElementSibling.getElementsByClassName('contenido-filtro-items')[0];
        if(icono.classList.contains('fa-chevron-right')) {
            icono.classList.replace('fa-chevron-right', 'fa-chevron-down');
            menuSub.classList.add('show-sub')
        } else {
            icono.classList.replace('fa-chevron-down', 'fa-chevron-right');
            menuSub.classList.remove('show-sub')
        }
    });
});

// FILTROS LISTADO PRODUCTOS
document.querySelectorAll('.contenido-filtro-items p').forEach(element => {
    element.addEventListener('click', e => {
        let catPadre = '';
        if (e.target.classList.contains('padre')) catPadre = e.target.id;
        let catHijo = '';
        if (e.target.classList.contains('hijo')) {
            catHijo = e.target.id;
            catPadre = document.getElementById('catActual').value;
        } 
        location.href = `/productos?catPadre=${catPadre}&catHijo=${catHijo}`
    })
});