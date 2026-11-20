# URL Shortener API & Service

    > Microservicio acortador de URLs desarrollado con **Node.js, Express y MongoDB (Docker)**, enfocado en buenas prácticas de arquitectura en capas, inyección de dependencias y resiliencia con rate
  limiting y validaciones estrictas.

    ![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
    ![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
    ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
    ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
    ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

    ---

    ## Características Principales

    * **Arquitectura desacoplada en capas:** Separación clara entre Rutas (API), Middlewares, Capa de Servicios y Capa de Datos (Modelos Mongoose).
    * **Inyección de Dependencias:** Uso de inyección para librerías utilitarias (`nanoid`), facilitando el testing unitario y modularidad.
    * **Seguridad & Rate Limiting:** Middleware personalizado para mitigar abuso limitando peticiones por IP (`429 Too Many Requests`).
    * **Validación estricta de URLs:** Middleware de saneamiento y comprobación de formato antes de procesar cualquier guardado (`400 Bad Request`).
    * **Redirección eficiente (HTTP 302):** Búsqueda por índices únicos y actualización asíncrona de métricas (`clicks`).
    * **Entorno contenerizado:** Base de datos MongoDB desplegada mediante Docker para fácil portabilidad.
    * **Interfaz Web Ligera:** Frontend minimalista en HTML y JavaScript para interactuar con la API directamente desde el navegador.

    ---

    ## Arquitectura y Flujos del Sistema

    GitHub renderiza estos diagramas de forma interactiva:

    ### 1. Creación de Enlaces Cortos

    > **Diagram exceeds terminal width (284 > 201 cols)**
    > Displayed as code block. Widen terminal to view inline.

    ```mermaid
    flowchart TD
        Cliente([Cliente: Web / .http]) -->|1. POST /api/acortar| RateLimit{1️⃣ Rate Limiter}
        RateLimit -->|Excede límite| E429[Error 429: Too Many Requests]
        RateLimit -->|Pasa| Validador{2️⃣ Validador URL}

        Validador -->|URL inválida| E400[Error 400: Bad Request]
        Validador -->|Válida| Servicio[3️⃣ Capa de Servicios]

        Servicio -->|Genera código 6 caracteres| NanoId[Inyección: nanoid]
        Servicio -->|4. Intenta guardar| DB[(MongoDB - Docker)]

        DB -->|¿Conflicto de Índice Único?| Retry{Colisión?}
        Retry -->|Sí| Servicio
        Retry -->|No| OK[Documento Persistido]

        OK -->|5. Retorna URL Corta| API[Capa API / Rutas]
        API -->|6. Respuesta HTTP 201 Created| Cliente
  ──────
  ### 2. Flujo de Redirección y Métricas


      ┌───────────────────┐  ┌───────────────────┐    ┌──────────────────┐  ┌─────────┐
      │ Capa API (Router) │  │ Capa de Servicios │    │ MongoDB (Docker) │  │ Usuario │
      └───────────────────┘  └───────────────────┘    └──────────────────┘  └─────────┘
                │                      │                        │                │
                ◄──────────────────GET /:codigo (ej: /g1T7x9)────────────────────│
                │                      │                        │                │
                │buscarUrlOriginal(codi►o)                      │                │
                │                      │                        │                │
                │                      │Consulta por índice únic►                │
     ┤ alt Código no encontrado ├
                │                      │                        │                │
                │                      ◄┈┈┈┈┈┈┈┈┈null┈┈┈┈┈┈┈┈┈┈┈│                │
                │                      │                        │                │
                ◄┈┈┈┈┈┈┈┈null┈┈┈┈┈┈┈┈┈┈│                        │                │
                │                      │                        │                │
                │┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈HTTP 404 Not Found┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈►
                │                      │                        │                │
                │                      ◄┈Retorna URL original┈┈┈│                │
                │                      │                        │                │
                │                      │Actualización en segundo►plano (clicks + 1)
                │                      │                        │                │
    		◄┈┈┈┈URL Original┈┈┈┈┈┈│			│		 │
                │                      │			│		 │
                │┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈HTTP 302 Found (Header Location)┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈►
                │                      │			│		 │
  ──────
  ## Especificación de la API

  ### 1. Acortar una URL

  • Método: POST
  • Endpoint: /api/acortar
  • Headers: Content-Type: application/json
  • Body:
    {
      "urlOriginal": "https://www.ejemplo.com/articulos/guia-completa-desarrollo-web"
    }

  • Respuesta Exitosa (201 Created):
    {
      "codigo": "g1T7x9",
      "urlCorta": "http://localhost:3000/g1T7x9",
      "urlOriginal": "https://www.ejemplo.com/articulos/guia-completa-desarrollo-web",
      "clicks": 0
    }

  ──────
  ### 2. Redirección a URL Original

  • Método: GET
  • Endpoint: /:codigo (Ejemplo: http://localhost:3000/g1T7x9)
  • Comportamiento: Responde HTTP 302 con el encabezado Location apuntando a la urlOriginal, incrementando el contador de clicks en segundo plano.
  ──────
  ## Tecnologías Utilizadas

  • Runtime: Node.js https://nodejs.org/
  • Framework: Express.js https://expressjs.com/
  • Base de Datos: MongoDB https://www.mongodb.com/ con Mongoose ODM https://mongoosejs.com/
  • Contenedores: Docker https://www.docker.com/ (para orquestar MongoDB local)
  • Generador de IDs: nanoid https://github.com/ai/nanoid
  • Frontend: HTML5, CSS3, JavaScript (Fetch API)
  • Testing de Endpoints: Extensión REST Client (.http)
  ──────
  ## Puesta en Marcha Local

  ### Prerrequisitos

  • Node.js v18+ instalado.
  • Docker y Docker Compose instalados y en ejecución.

  ### 1. Clonar el repositorio

    git clone https://github.com/Ulises1577/url-shortener.git
    cd url-shortener

  ### 2. Levantar la base de datos con Docker

    docker run -d -p 27017:27017 --name mongo-shortener mongo:latest

  ### 3. Configurar variables de entorno

  Crea un archivo .env en la raíz (toma como referencia .env.example):

    PORT=3000
    MONGO_URI=mongodb://localhost:27017/url_shortener
    BASE_URL=http://localhost:3000

  ### 4. Instalar dependencias y arrancar

    npm install
    npm run dev

  Abre en tu navegador http://localhost:3000 para utilizar la interfaz web o prueba las peticiones con el archivo .http incluido.
