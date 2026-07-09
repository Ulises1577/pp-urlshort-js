import express from 'express';
import mongoose from 'mongoose';

const app = express();
const PORT = 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/acortador';

//Conexion a MongoDb
mongoose.connect(MONGO_URI) 
    .then(() => {
        console.log('Conexión a MongoDB establecida');
    })
    .catch((error) => {
        console.error('Error al conectar a MongoDB:', error);
    });

//Arranque del Servidor
app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});