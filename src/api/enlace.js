//Rutas donde se envia y recibe la informacion

import { Router } from 'express';
import  { enlaceService } from '../dependencies.js';
import { validarUrlEstricta } from '../middlewares/validationURL.js';
import { acortarRateLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.get('/', (req, res) => {
    res.json({ mensaje: "Servidor funcionando"});
});

router.post('/acortar', acortarRateLimiter, validarUrlEstricta, async (req, res) => {
    try {
        const { urlOriginal } = req.body;

        const enlaceGuardado = await enlaceService.crearEnlace(urlOriginal);

        res.status(201).json({
            orignal: enlaceGuardado.urlOriginal,
            corto: `http://127.0.0.1:3000/${enlaceGuardado.urlCorta}`,
            codigo: enlaceGuardado.urlCorta
        });
    } catch (error) {
        if (error.message === 'La URL original es obligatoria') {
            return res.status(400).json({ error: error.message });
        }
        console.error(error);
        res.status(500).json({ error: 'ERROR EN EL SERVIDOR'});
    }
});

router.get('/:codigo', async (req, res) => {
    try {
        const { codigo } = req.params; 

        const enlace = await enlaceService.obtenerEnlaceOriginal(codigo);
        //Aca lo mandamo a buscar usando el service y le mandamos como parametro el codigo que vamos a buscar

        if (!enlace) { //en caso de que no haya enlace (EL NULL) aqui se resuelve 
            return res.status(404).json({ error: 'El enlace solicitado no existe o expiro'});
        }

        return res.redirect(302, enlace.urlOriginal); //Aca redireccionamos a la url original usando 302 (movido temporalmente)

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'ERROR EN EL SERVIDOR AL REDIRECCIONAR '});
    }
});

export default router; //ocupamos el default porque luego ese mismo puede usar cualquier nombre sin {}