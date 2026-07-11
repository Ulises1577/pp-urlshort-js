Un diagrama de flujo de nuestro programa: 

CREACION DE ENLACE CORTO

[ Cliente (Archivo .http) ]
             │
             │  1. Envía POST con { "urlOriginal": "..." }
             ▼
      [ Capa API / Rutas ]  <─── (Middleware: Valida autenticación/JSON)
             │
             │  2. Llama al Servicio inyectando la urlOriginal
             ▼
     [ Capa de Servicios ]  <─── (Inyección: Usa 'dependencies' para traer nanoid)
             │
             ├─► Genera código único de 6 caracteres con nanoid()
             │
             │  3. Instancia el modelo de Mongoose
             ▼
     [ Mongo_Models ]
             │
             │  4. Intenta guardar el documento en MongoDB
             ▼
      [ MongoDB (Docker) ]
             │
             ├─► ¿El código ya existe? (Conflicto único del Índice)
             │     ├── SÍ: Lanza error / Reintenta generar otro
             │     └── NO: Guarda exitosamente
             ▼
     [ Capa de Servicios ]
             │
             │  5. Retorna objeto construido con la URL corta
             ▼
      [ Capa API / Rutas ]
             │
             │  6. Responde HTTP 201 (Creado) con el JSON final
             ▼
 [ Cliente (Recibe respuesta) ]


//////


 FLUJO DE REDIRECCION INTERMEDIARIA A ENLACES CORTOS

[ Navegador del Usuario ]
               │
               │  1. Entra a http://localhost:3000/g1T7x9
               ▼
        [ Capa API / Rutas ]
               │
               │  2. Captura el parámetro 'g1T7x9' (req.params.codigo)
               ▼
       [ Capa de Servicios ]
               │
               │  3. Consulta a la base de datos usando el ÍNDICE rápido
               ▼
        [ MongoDB (Docker) ]
               │
               ├─► ¿Encontró el código 'g1T7x9'?
               │
               ├───► [ NO ] ───► Retorna null al Servicio
               │                  │
               │                  ▼
               │          Capa API responde: HTTP 404 Not Found
               │
               └───► [ SÍ ] ───► Retorna el documento { urlOriginal, clicks, ... }
                                  │
                                  ▼
                          [ Operaciones en Paralelo del Servicio ]
                                  │
                                  ├──► Aumenta contador: clicks + 1 (save() de fondo)
                                  │
                                  ▼
                          4. Retorna la 'urlOriginal' a la Capa API
                                  │
                                  ▼
                          5. API responde: HTTP 302 (Found) + Header Location
                                  │
                                  ▼
                    [ Navegador redirige al destino final ]


FUNCIONAMIENTO Y FLUJO DE MIDDLEWARES

[Cliente: test.http] 
       │
       ▼
 1️⃣  acortarRateLimiter  ──► ¿Hizo más de 10 peticiones? ──► SÍ ──► [429 Too Many Requests]
       │ (No)
       ▼
 2️⃣  validarUrlEstricta  ──► ¿Es una URL de verdad?   ──► NO ──► [400 Bad Request]
       │ (Sí)
       ▼
 3️⃣  Servicio / MongoDB  ──► Guarda en base de datos y genera código corto [201 Created]