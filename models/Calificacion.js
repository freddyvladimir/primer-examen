const mongoose = require('mongoose');

const calificacionSchema = new mongoose.Schema({
    usuario_id: mongoose.Types.ObjectId,
    pelicula_id: mongoose.Types.ObjectId,
    calificacion: Number,
    fecha: { type: Date, default: Date.now }
});

const calificacionModel = mongoose.model('Calificacion',calificacionSchema,'calificacion');
module.exports = calificacionModel;