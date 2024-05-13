const express = require('express');
const routes = express.Router();

const peliculasModel = require('../models/Peliculas');

routes.get('/listaPeliculas',async (req,res)=>{
    try {
        const peliculas = await peliculasModel.find();
        res.json(peliculas);
    } catch (error) {
        res.status(500).json({mensaje: error.mensaje});
    }
});
module.exports = routes;