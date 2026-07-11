//Rutas donde se envia y recibe la informacion

import { Router } from 'express';
import  { enlaceService } from '../dependencies.js';

const router = Router();

router.get('/', (req, res) => {
    res.json({ mensaje: "Servidor funcionando"});
});

router.post('/acortar', async (req, res) => {
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

export default router; //ocupamos el default porque luego ese mismo puede usar cualquier nombre sin {}