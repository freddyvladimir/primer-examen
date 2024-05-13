const express = require('express');
const routes = express.Router();

const peliculasModel = require('../models/Peliculas');

routes.get('/listaPeliculas',async (req,res)=>{
    try {
        const peliculas = await peliculasModel.find();
        res.status(201).json(peliculas);
    } catch (error) {
        res.status(400).json({mensaje: error.mensaje});
    }
});

routes.get('/peliculasLimitadas', async (req, res) => {
    try {
        const peliculas = await peliculasModel.find().limit(10);
        res.status(201).json(peliculas);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

routes.get('/peliculasOrdenadasPorAnio', async (req, res) => {
    try {
        const peliculas = await peliculasModel.find().sort({ año_lanzamiento: 1 });
        res.status(201).json(peliculas);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

routes.get('/listaPelicula/:id',async (req,res)=>{
    try {
        const pelicula = await peliculasModel.findById(req.params.id);
        if (!pelicula) {
            return res.status(404).json({mensaje:'Pelicula no encontrada'})
        }else{
            return res.status(201).json(pelicula);
        }
    } catch (error) {
        res.status(400).json({mensaje: error.mensaje});
    }
});

routes.get('/peliculasPorGenero/:genero', async (req, res) => {
    try {
        const peliculas = await peliculasModel.find({ genero: req.params.genero });
        res.status(201).json(peliculas);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

routes.get('/peliculasLanzadasDespuesDe/:anio', async (req, res) => {
    try {
        const peliculas = await peliculasModel.find({ año_lanzamiento: { $gt: req.params.anio } });
        res.status(201).json(peliculas);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

routes.get('/peliculasPorCantidadGenero', async (req, res) => {
    try {
        const peliculas = await peliculasModel.aggregate([
            { $group: { _id: "$genero", total: { $sum: 1 } } }
        ]);
        res.status(201).json(peliculas);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

routes.post('/listaPeliculasPorUnActorEspecifico', async (req, res) => {
    try {
        const peliculas = await peliculasModel.find({ actores: req.body.actor })
        .then(peliculas => {
            res.status(201).json(peliculas);
        })
        .catch(err => {
            console.error(err);
        });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});




routes.post('/crearPeliculas',async (req,res)=>{
    const peliculas = new peliculasModel({
        titulo: req.body.titulo,
        genero: req.body.genero,
        director: req.body.director,
        actores: req.body.actores,
        año_lanzamiento: req.body.año_lanzamiento,
        sinopsis: req.body.sinopsis,
        calificaciones: req.body.calificaciones
    });
    try {
        const nuevaPelicula = await peliculas.save();
        res.status(201).json(nuevaPelicula);
    } catch (error) {
        res.status(400).json({mensaje : error.message});
    }
});

routes.put('/modificarPelicula/:id',async (req,res)=>{
    try {
        const peliculamodificada = await peliculasModel.findByIdAndUpdate(req.params.id, req.body, {new:true});
        if (!peliculamodificada) {
            return res.status(404).json({mensje: 'No Existe la pelicula'});
        }else{
            return res.status(201).json(peliculamodificada);
        }
    } catch (error) {
        res.status(400).json({mensaje : error.message});
    }
});

routes.delete('/eliminarPelicula/:id',async (req,res)=>{
    try {
        const peliculaeliminada = await peliculasModel.findByIdAndDelete(req.params.id);
        if (!peliculaeliminada) {
            return res.status(404).json({mensje: 'No Existe la pelicula'});
        }else{
            return res.status(201).json({mensje: 'la pelicula fue eliminada'});
        }
    } catch (error) {
        res.status(400).json({mensaje : error.message});
    }
});

module.exports = routes;