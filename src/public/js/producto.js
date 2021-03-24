// GALERIA DE IMAGENES
const imagenes = document.querySelectorAll('.img-principal-producto img');
imagenes[0].classList.add('show-img');
document.querySelector('.fa-chevron-left').addEventListener('click', () => {
    const img = document.querySelector('.show-img');
    if (img.previousElementSibling) {
        img.classList.remove('show-img');
        img.previousElementSibling.classList.add('show-img');
    } else {
        img.classList.remove('show-img');
        imagenes[imagenes.length - 1].classList.add('show-img');
    }
});
document.querySelector('.fa-chevron-right').addEventListener('click', () => {
    const img = document.querySelector('.show-img');
    if (img.nextElementSibling) {
        img.classList.remove('show-img');
        img.nextElementSibling.classList.add('show-img');
    } else {
        img.classList.remove('show-img');
        imagenes[0].classList.add('show-img');
    }
});

// BOTONES CANTIDAD
document.querySelector('.down').addEventListener('click', e => {
    e.target.parentNode.querySelector('input[type=number]').stepDown()
});
document.querySelector('.plus').addEventListener('click', e => {
    e.target.parentNode.querySelector('input[type=number]').stepUp();
});

// CANTIDAD DE PRODUCTOS EN VISTA DE PRODUCTO
const btnProd = document.querySelector('.boton-agregar-producto');
if(btnProd) btnProd.addEventListener('click', e => {
    const id = e.target.getAttribute('data-id');
    const inputCantidad = document.querySelector('.cantidad-productos');
    const maxCant = parseInt(inputCantidad.getAttribute('max'));
    const cantidad = parseInt(inputCantidad.value);
    if(cantidad > 0 && cantidad < maxCant) {
        location.href = `/cart/agregar/${id}/${cantidad}`;
    } else {
        document.querySelector('.error-cantidad').innerText = `La cantidad tiene que ser mayor a cero y menor a ${maxCant}`;
    }
});