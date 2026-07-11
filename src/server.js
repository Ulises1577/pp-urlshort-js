//Arranque del servidor 

import express from 'express';
import mongoose from 'mongoose';
import rutasEnlace from './api/enlace.js' //posible error en las rutas


const app = express();
const PORT = 3000;
app.use(express.json()); //Esta madre es para recibir los archivos en JSON

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/acortador';

//Conexion a MongoDb
mongoose.connect(MONGO_URI) 
    .then(() => {
        console.log('Conexión a MongoDB establecida');
    })
    .catch((error) => {
        console.error('Error al conectar a MongoDB:', error);
    });

//Arranque del Servidor
app.use('/', rutasEnlace); //posible error

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});