const imagenes = {};
const generate = require('./generateId');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

imagenes.crearCarpeta = async (imgs, folder) => {
    let resp = true;
    let carpeta = generate.name()
    fs.mkdirSync(path.resolve(`src/public/img/${carpeta}`));
    Array.from(imgs).forEach(async (img, index) => {
        const imagePath = img.path;
        const ext = path.extname(img.originalname).toLowerCase();
        const targetPath = path.resolve(`src/public/img/${carpeta}/${index}${ext}`);
        if (ext === '.jpg' || ext === '.jpeg') {
            await fse.rename(imagePath, targetPath);
        } else {
            resp = false;
            await fse.remove(path.resolve(`src/public/img/${carpeta}`)); 
            await fse.unlink(imagePath);
        }
    });
    if (resp) {
        // if (folder) imagenes.borrarCarpeta(folder);
        return carpeta;
    } else {
        return -1;
    } 
}

imagenes.borrarCarpeta = async (folder) => {
    console.log(folder)
    await fse.remove(path.resolve(`src/public/img/${folder}`));
    return 1;
}

module.exports = imagenes;