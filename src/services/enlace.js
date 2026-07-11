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
}