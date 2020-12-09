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