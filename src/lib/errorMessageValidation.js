const errorMessageValidation = {}

errorMessageValidation.crearMensajeObj = (error) => {
    let errors = {}
    const errores = error.errors
    errores.map(error => {
        const [key, value] = [error.path, error.message]
        errors[key] = value
    })
    return errors
}

errorMessageValidation.crearMensaje = (error) => {
    const allErrors = error.message.substring(error.message.indexOf(':')+1).trim();
    const errors = allErrors.split(',').map(err => err.trim())
    return errors
}

module.exports = errorMessageValidation;