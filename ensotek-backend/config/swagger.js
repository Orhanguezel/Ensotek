const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ensotek API',
            version: '1.0.0',
            description: 'Ensotek API documentation',
        },
        servers: [
            {
                url: 'http://localhost:5000',
            },
        ],
    },
    apis: ['./routes/*.js'], // Swagger açıklamaları için dosyalar
};

const swaggerSpecs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerSpecs;

