const express = require('express');
const routes = express.Router();

const peliculasModel = require('../models/Peliculas');
const usuarioModel = require('../models/Usuario');
const calificacionModel = require('../models/Calificacion');

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
        const peliculas = await peliculasModel.find().sort({ anio_lanzamiento: 1 });
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
        const peliculas = await peliculasModel.find({ anio_lanzamiento: { $gt: req.params.anio } });
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
        anio_lanzamiento: req.body.anio_lanzamiento,
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

routes.get('/peliculasCalificadasPorUsuario/:usuarioId', async (req, res) =>{
    const {usuarioId} = req.params;    
    try{
        const usuario = await usuarioModel.findById(usuarioId);
        if (!usuario)
            return res.status(404).json({mensaje: 'usuario no encontrado'});
        const peliculas = await peliculasModel.find({ 'calificaciones.usuario_id' : usuarioId }).populate('calificaciones.usuario_id');
        res.json(peliculas);
    } catch(error){
        res.status(500).json({ mensaje :  error.message})
    }
})



routes.get('/cantidadDecalificacionesPorPelicula', async (req, res) => {
    try {   
        const usuarios = await usuarioModel.find();
        const reporte = await Promise.all(
            usuarios.map( async ( mapUsuario ) => {
                const peliculas = await peliculasModel.find({ 'calificaciones.usuario_id' : mapUsuario._id});
                const calificaciones = await calificacionModel.find({ usuario_id : mapUsuario._id});
                
                const suma = calificaciones.reduce((sum, calificaciones) => sum + calificaciones.calificacion , 0);

                return {
                    peliculas: peliculas.map( r => ( {
                        _id: r._id,
                        titulo: r.titulo,
                        genero: r.genero
                    })),
                    suma,
                    calificaciones:calificaciones.map( c => ( {
                        fecha: c.fecha
                    })),
                }
            } )
        )
        res.json(reporte);
    } catch (error){
        res.status(500).json({ mensaje :  error.message})
    }
})


routes.get('/listarPeliculasCalificaciones', async (req, res) => {
    try {   
        const usuarios = await usuarioModel.find();
        const reporte = await Promise.all(
            usuarios.map( async ( mapUsuario ) => {
                const peliculas = await peliculasModel.find({ 'calificaciones.usuario_id' : mapUsuario._id});
                const calificaciones = await calificacionModel.find({ usuario_id : mapUsuario._id});
                return {
                    usuario: {
                        _id: mapUsuario._id,
                        nombre: mapUsuario.nombre
                    },
                    peliculas: peliculas.map( r => ( {
                        _id: r._id,
                        titulo: r.titulo,
                        genero: r.genero
                    })),
                    calificaciones:calificaciones.map( c => ( {
                        _id: c._id,
                        calificacion: c.calificacion,
                        fecha: c.fecha
                    })),
                }
            } )
        )
        res.status(201).json(reporte);
    } catch (error){
        res.status(500).json({ mensaje :  error.message})
    }
})

module.exports = routes;