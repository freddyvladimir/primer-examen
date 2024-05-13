const express = require('express');
const routes = express.Router();

const usuarioModel = require('../models/Usuario');

routes.get('/listaUsuarios',async (req,res)=>{
    try {
        const usuario = await usuarioModel.find();
        res.status(201).json(usuario);
    } catch (error) {
        res.status(400).json({mensaje: error.mensaje});
    }
});


routes.post('/crearUsuarios',async (req,res)=>{
    const usuario = new usuarioModel({
        nombre: req.body.nombre,
        email: req.body.email,
        contraseña: req.body.contraseña,
        preferencias: req.body.preferencias
    });
    try {
        const nuevoUsuario = await usuario.save();
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(400).json({mensaje : error.message});
    }
});

routes.put('/modificarUsuario/:id',async (req,res)=>{
    try {
        const usuariomodificada = await usuarioModel.findByIdAndUpdate(req.params.id, req.body, {new:true});
        if (!usuariomodificada) {
            return res.status(404).json({mensje: 'No Existe la usuario'});
        }else{
            return res.status(201).json(usuariomodificada);
        }
    } catch (error) {
        res.status(400).json({mensaje : error.message});
    }
});

routes.delete('/eliminarUsuario/:id',async (req,res)=>{
    try {
        const usuarioeliminada = await usuarioModel.findByIdAndDelete(req.params.id);
        if (!usuarioeliminada) {
            return res.status(404).json({mensje: 'No Existe el usuario'});
        }else{
            return res.status(201).json({mensje: 'el usuario fue eliminado'});
        }
    } catch (error) {
        res.status(400).json({mensaje : error.message});
    }
});

module.exports = routes;