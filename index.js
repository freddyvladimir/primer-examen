const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const { verificarToken } = require('./middlewares/security');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const routesPeliculas = require('./routes/peliculasRoutes');
const routesUsuarios = require('./routes/usuariosRoutes');
const routesCalificacion = require('./routes/calificacionRoutes');
const routesAutenticacion = require('./routes/autenticacion');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect(MONGO_URI).then(
    () => {
        console.log("connection exitosa");
        app.listen(PORT, () => {
            console.log("Servidor corriendo en el puerto " + PORT);
        })
    }
).catch(error => console.log("error de coneccion", error));


function verificarTokenMiddleware(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token no proporcionado o en formato incorrecto' });
    }
    const token = authorizationHeader.split(' ')[1];
    verificarToken(token);
    next();
}

app.use('/autenticacion', routesAutenticacion);

app.use('/peliculas',verificarTokenMiddleware, routesPeliculas);
app.use('/usuarios',verificarTokenMiddleware, routesUsuarios);
app.use('/calificacion',verificarTokenMiddleware, routesCalificacion);
