import { rateLimit } from 'express-rate-limit';

export const acortarRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10, //limite de peticiones por IP
    message: {
        error: 'Demasiadas peticiones. Por favor, intenta de nuevo en un minuto.'
    },
    standardHeaders: true,
    legacyHeaders: false,
})