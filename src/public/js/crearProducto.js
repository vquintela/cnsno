// Card creacion producto
document.getElementById("imagen").onchange = (e) => {
    let preview = document.getElementById('preview');
    preview.innerHTML = '';
    Array.from(e.target.files).forEach(img => {
        let reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = function () {
            let image = document.createElement('img');
            image.src = reader.result;
            image.setAttribute('class', 'img-fluid w-50')
            preview.append(image);
        };
    });
}

// INSERTA SUBCATEGORIAS
document.getElementById('categoria').onchange = async (e) => {
    const id = e.target.value;
    if (id != 0) {
        const res = await fetch(`/admin/categorias/subcat/${e.target.value}`, { 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const categorias = JSON.parse(await res.text());
        insertarFilas(categorias);
    } else {
        insertarFilas([]);
    }
}

const insertarFilas = categorias => {
    const fragment = new DocumentFragment();
    const option = document.createElement('option');
    option.textContent = 'Subcategoria';
    fragment.appendChild(option);
    categorias.forEach(categoria => {
        const option = crearSelect(categoria);
        fragment.appendChild(option);
    });
    const subCat = document.getElementById('subCategoria');
    subCat.innerText = ''
    subCat.appendChild(fragment);
}

const crearSelect = categoria => {
    const option = document.createElement('option');
    option.value = categoria.id;
    option.textContent = categoria.nombre;
    return option;
}