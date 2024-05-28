const express = require('express');
const routes = express.Router();

const usuarioModel = require('../models/Usuario');
const { crearToken,cerrarSesion } = require('../middlewares/security');

routes.post('/login', async (req, res) => {
    try {
        const { nombre, contraseña } = req.body;
        const usuario = await usuarioModel.findOne({ nombre });
        if (!usuario)
            return res.status(401).json({ status: 300,error : 'Email invalido!!!!!'});
        const validarContrasena = await usuario.compararContrasenia(contraseña);
        if (!validarContrasena)
            return res.status(401).json({ status: 300, error : 'Contrasenia invalido!!!!!'});
        const token = crearToken(usuario._id );
        res.status(200).json({ status: 200, datos: usuario._id, token: token} );
    }
    catch(error){
        res.status(500).json({mensaje: error.message});
    }
});

routes.post('/logout', (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    
    try {
        cerrarSesion(token);
        res.json({ mensaje: 'Sesión cerrada' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

module.exports = routes;