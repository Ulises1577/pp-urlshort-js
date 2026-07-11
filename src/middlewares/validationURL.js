export const validarUrlEstricta = (req, res, next ) => {
    try {
        const { urlOriginal } = req.body;

        if (!urlOriginal) {
            return next();
        }
        //Parseada es como traducida sintacticamente
        const urlParseada = new URL(urlOriginal);

        if (urlParseada.protocol !== 'http:' && urlParseada.protocol !== 'https:') {
            return res.status(400).json({
                error: 'Estructura no valida: La URL debe comenzar con http:///https://'
            });
        }
        //esto por si ya quedo chango
        next();
    } catch (error) {
        return res.status(400).json({
            error: 'La URL proporcionada no tiene un formato valido'
        });
    }
};