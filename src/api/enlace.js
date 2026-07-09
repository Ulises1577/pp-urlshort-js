import { Router } from 'express';
import  { enlaceService } from '../dependencies.js';

const router = Router();

router.post('/acortar', async (req, res) => {
    try {
        const { urlOriginal } = req.body;

        const enlaceGuardado = await enlaceService.crearEnlace(urlOriginal);

        res.status(201).json({
            orignal: enlaceGuardado.urlOriginal,
            corto: `http://localhost:3000/${enlaceGuardado.codigoCorto}`,
            codigo: enlaceGuardado.codigoCorto
        });
    } catch (error) {
        if (error.mesagge === 'La URL original es obligatoria') {
            return res.status(400).json({ error: error.message });
        }
        console.error(error);
        res.status(500).json({ error: 'ERROR EN EL SERVIDORE'});
    }
});

export default router; //ocupamos el default porque luego ese mismo puede usar cualquier nombre sin {}