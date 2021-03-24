const generate = require('generate-password');

const generateId = {}

generateId.name = () => {
    return generate.generate({
        length: 10,
        numbers: true,
        strict: true
    })
}

module.exports = generateId
