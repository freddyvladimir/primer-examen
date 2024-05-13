const express = require('express');
const routes = express.Router();

const calificacionModel = require('../models/Calificacion');

routes.get('/listarCalificacion',async (req,res)=>{
    try {
        const calificacion = await calificacionModel.find();
        res.status(201).json(calificacion);
    } catch (error) {
        res.status(400).json({mensaje: error.mensaje});
    }
});


routes.post('/crearCalificacion',async (req,res)=>{
    const calificacion = new calificacionModel({
        usuario_id: req.body.usuario_id,
        pelicula_id: req.body.pelicula_id,
        calificacion: req.body.calificacion
    });
    try {
        const nuevaCalificacion = await calificacion.save();
        res.status(201).json(nuevaCalificacion);
    } catch (error) {
        res.status(400).json({mensaje : error.message});
    }
});

routes.put('/modificarCalificacion/:id',async (req,res)=>{
    try {
        const calificacionmodificada = await calificacionModel.findByIdAndUpdate(req.params.id, req.body, {new:true});
        if (!calificacionmodificada) {
            return res.status(404).json({mensje: 'No Existe la calificacion'});
        }else{
            return res.status(201).json(calificacionmodificada);
        }
    } catch (error) {
        res.status(400).json({mensaje : error.message});
    }
});

routes.delete('/eliminarCalificacion/:id',async (req,res)=>{
    try {
        const calificacioneliminada = await calificacionModel.findByIdAndDelete(req.params.id);
        if (!calificacioneliminada) {
            return res.status(404).json({mensje: 'No Existe la calificacion'});
        }else{
            return res.status(201).json({mensje: 'la calificacion fue eliminada'});
        }
    } catch (error) {
        res.status(400).json({mensaje : error.message});
    }
});




module.exports = routes;