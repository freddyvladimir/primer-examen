const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secretKey = process.env.KEY_LLAVE || '';
const blacklist = []; // Lista de tokens revocados

function crearToken(id) {
    const payload = {
        usuario: id,
        tiempo_creacion: Date.now()
    };
    // Tiempo de expiración del token: 10 horas (36000 segundos)
    const expiresIn = 36000;
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
}

function verificarToken(token) {
    try {
        // Comprobar si el token está en la lista de revocados
        if (blacklist.includes(token)) {
            throw new Error('Token revocado');
        }

        const decoded = jwt.verify(token, secretKey, { ignoreExpiration: false });
        const tokenExpirado = Date.now() >= (decoded.exp * 1000);
        if (tokenExpirado) {
            console.error('El token ha expirado');
            throw new Error('El token ha expirado');
        } else {
            console.log('El token aún es válido');
        }
    } catch (error) {
        console.error('Error al verificar el token:', error.message);
        throw new Error('Token inválido');
    }
}

function cerrarSesion(token) {
    // Agregar el token a la lista de revocados
    blacklist.push(token);
    console.log('Sesión cerrada y token revocado');
}

module.exports = {
    crearToken,
    verificarToken,
    cerrarSesion
};