const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contraseña: {
        type: String,
        required: true,
        unique: true
    },
    preferencias: [String]
});


usuarioSchema.pre('save', async function (next){
    if (this.isModified('contraseña')){
        this.contraseña =  await bcrypt.hash(this.contraseña, 10);
        console.log(this.contraseña);
    }
    next();
});



usuarioSchema.methods.compararContrasenia = async function  ( contraseniaComparar ){
    return await bcrypt.compare(contraseniaComparar, this.contraseña);
};


const usuarioModel = mongoose.model('Usuario',usuarioSchema,'usuario');
module.exports = usuarioModel;