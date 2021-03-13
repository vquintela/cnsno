// BTN RESPONSIVE NAVBAR
document.getElementById("btn-menu").addEventListener("click", () => {
    document.getElementById("nav-navbar").classList.toggle("show");
});

// SACA EL MENSAJE DE REQ FLASH
window.onload = () => {
    const message = document.getElementById('message-success');
    if(message) {
        setTimeout(() => {
            message.remove();
        }, 2000)
    }
}

// MODAL
const modal = (titulo, texto) => {
    let mascara = document.getElementById('lamascara');
    mascara.style.display = "block";
    document.querySelector('body').style.overflowY = 'hidden';
    document.getElementById('titulo-modal').innerText = titulo;
    document.querySelector('#panelResultados').innerText = texto;
    return new Promise((resolve, reject) => {
        const btnCerrar = document.getElementById('cerrarModal');
        btnCerrar.addEventListener("click", () => {
            document.getElementById('lamascara').style.display = "none";
            document.querySelector('body').style.overflowY = 'visible';
            resolve(false);
        });
        const btnAceptar = document.getElementById('aceptarModal');
        btnAceptar.addEventListener("click", () => {
            document.getElementById('lamascara').style.display = "none";
            document.querySelector('body').style.overflowY = 'visible';
            resolve(true);
        });
    });
}

// CHECKBOX METODO DE PAGO EN CARRITO
const check1 = document.getElementById('check1');
const check2 = document.getElementById('check2');
if (check1) check1.addEventListener('change', e => {
    if (e.target.checked) {
        check2.checked = null;
    }
});
if (check2) check2.addEventListener('change', e => {
    if (e.target.checked) {
        check1.checked = null;
    }
});