const express = require('express');
const request = require('supertest');
const peliculasRotes = require('../../routes/peliculasRoutes');
const PeliculasModel = require('../../models/Peliculas');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

app.use('/peliculas', peliculasRotes);

describe('Pruebas Unitarias para Recetas', () => {
    beforeEach(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/recomendaciondepeliculas', {
            useNewUrlParser: true,
        });
        await PeliculasModel.deleteMany({});
    });
    // al finalziar las pruebas
    afterAll(() => {
        return mongoose.connection.close();
    });

    //1er test : GET
    /*
    test('Traer la lista de dos peliculas metodo: GET: listaPeliculas', async () => {
        await PeliculasModel.create({
            titulo: "pelicula",
            genero: "Drama",
            director: "Director",
            actores: ["actores"],
            anio_lanzamiento: 2024,
            sinopsis: "sinopsis",
            calificaciones: []
        });
        await PeliculasModel.create({
            titulo: "pelicula 2",
            genero: "Comedia",
            director: "Director 2",
            actores: ["actor"],
            anio_lanzamiento: 2024,
            sinopsis: "sinopsis 2",
            calificaciones: []
        });
        // solicitud - request
        const res = await request(app).get('/peliculas/listaPeliculas');
        //verificar la respuesta
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveLength(2);
    }, 10000);

    test('Agregar una nueva Pelicula: POST: /crearPeliculas', async () => {
        const nuevaPeliculas = {
            titulo: "pelicula 3",
            genero: "Serie",
            director: "Director 3",
            actores: ["actor 3"],
            anio_lanzamiento: 2024,
            sinopsis: "sinopsis 3",
            calificaciones: []
        };
        const res = await request(app)
            .post('/peliculas/crearPeliculas')
            .send(nuevaPeliculas);
        expect(res.statusCode).toEqual(201);
        expect(res.body.titulo).toEqual(nuevaPeliculas.titulo);
    });

    test('Actualizar una nueva pelicula : PUT /modificarPelicula/:id', async () => {
        const peliculaCreada = await PeliculasModel.create(
            {
                titulo: "pelicula 3",
                genero: "Serie",
                director: "Director 3",
                actores: ["actor 3"],
                anio_lanzamiento: 2024,
                sinopsis: "sinopsis 3",
                calificaciones: []
            });
        const peliculaaActualizar = {
            titulo: "pelicula 3 (editado)",
            genero: "Serie",
            director: "Director 3 (editado)",
            actores: ["actor 3 (editado)"],
            anio_lanzamiento: 2025,
            sinopsis: "sinopsis 3 (editado)",
            calificaciones: []
        };
        const res = await request(app)
            .put('/peliculas/modificarPelicula/' + peliculaCreada._id)
            .send(peliculaaActualizar);
        expect(res.statusCode).toEqual(201);
        expect(res.body.titulo).toEqual(peliculaaActualizar.titulo);

    });

    test('Eliminar una pelicula existente : DELETE /eliminarPelicula/:id', async () => {
        const peliculaCreada = await PeliculasModel.create(
            {
                titulo: "pelicula 3 (editado)",
                genero: "Serie",
                director: "Director 3 (editado)",
                actores: ["actor 3 (editado)"],
                anio_lanzamiento: 2025,
                sinopsis: "sinopsis 3 (editado)",
                calificaciones: []
            });

        const res = await request(app).delete('/peliculas/eliminarPelicula/' + peliculaCreada._id);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({ mensje: 'la pelicula fue eliminada' });
    });
    */





    test('Debe devolver la lista de películas con sus calificaciones', async () => {
        const res = await request(app).get('/listarPeliculasCalificaciones');
        expect(res.statusCode).toBe(201); // Usuario2 tiene una calificación
    });
});