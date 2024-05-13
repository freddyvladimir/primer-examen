const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: String,
    email: String,
    contraseña: String,
    preferencias: [String]
});

const usuarioModel = mongoose.model('Usuario',usuarioSchema,'usuario');
module.exports = usuarioModel;