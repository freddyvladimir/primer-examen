const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const routesPeliculas = require('./routes/peliculasRoutes');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
app.use(express.json());

mongoose.connect(MONGO_URI).then(
    () => {
        console.log("connection exitosa");
        app.listen(PORT, () => {
            console.log("Servidor corriendo en el puerto " + PORT);
        })
    }
).catch(error => console.log("error de coneccion", error));

app.use('/peliculas',routesPeliculas);