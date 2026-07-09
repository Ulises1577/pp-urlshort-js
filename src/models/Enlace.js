import mongoose from "mongoose";

const enlaceSchema = new mongoose.Schema({
    urlOriginal: {
        type: String,
        required: true,
        trim: true //Borrar espacios en blanco
    },
    urlCorta: {
        type: String,
        required: true,
        unique: true,
        index: true //Creacion del Indice para evitar collscan
    },

    clicks: {
        type: Number,
        default: 0
    },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

export const Enlace = mongoose.model('Enlace', enlaceSchema);