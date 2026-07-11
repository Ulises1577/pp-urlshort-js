//Logica de negocio

export class EnlaceService {
    constructor ({ generarCodigo, modeloEnlace }) {
        this.generarCodigo = generarCodigo
        this.modeloEnlace = modeloEnlace;
    }

    async crearEnlace(urlOriginal) {
        if (!urlOriginal) {
            throw new Error('La URL es obligatoria') //Cuando no nos la envia

        }

        const codigoCorto = this.generarCodigo();

        const nuevoEnlace = new this.modeloEnlace({
            urlOriginal,
            urlCorta: codigoCorto
        });

        await nuevoEnlace.save();
        return nuevoEnlace;
    }

    async obtenerEnlaceOriginal(codigo) {
        const enlace = await this.modeloEnlace.findOne({ urlCorta: codigo });

        if (!enlace) {
            return null; //Esto es por si el enlace no existe y devolvemos nada. Luego la API lo resuelve
        }

        enlace.clicks = (enlace.clicks || 0) + 1 //Definimos la cantidad de click y la inicia
        // una aclaracion aqui ocupa el OR por lo que revisa: enlace click existe? Si si, la aumenta en 1. Sino existe, la crea, vuelve a hacer la pregunta y luego le aumenta 1.
        await enlace.save();

        return enlace;
    }
    async obtenerEstadisticas(codigo) {
        const enlace = await this.modeloEnlace.findOne({ urlCorta: codigo });

        if (!enlace) {
            return null; //en caso de que no tengamos el enlace, ya luego lo resuelve API
        }
        
        return { //Nos devuelve los datos de la url
            urlOriginal: enlace.urlOriginal,
            urlCorta: enlace.urlCorta,
            clicks: enlace.clicks || 0,
            fechaCreacion: enlace.fechaCreacion
        };
    }
}