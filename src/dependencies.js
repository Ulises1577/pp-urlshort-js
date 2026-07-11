//Recordatorio: Esta zona es el ensamblaje del enlace ya hasheado con su modelo de mongo

import { nanoid } from 'nanoid';
import { Enlace } from './mongo_models/Enlace.js';
import { EnlaceService} from './services/enlace.js';

const enlaceService = new EnlaceService({
    generarCodigo: () => nanoid(6),
    modeloEnlace: Enlace
});

export { enlaceService };