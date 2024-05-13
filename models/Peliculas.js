const mongoose = require('mongoose');

const peliculasSchema = new mongoose.Schema({
    titulo: String,
    genero: String,
    director: String,
    actores: [String],
    año_lanzamiento: Number,
    sinopsis: String,
    calificaciones: [{ usuario_id: mongoose.Types.ObjectId, calificacion: Number }]
});

const peliculasModel = mongoose.model('Peliculas',peliculasSchema,'peliculas');
module.exports = peliculasModel;