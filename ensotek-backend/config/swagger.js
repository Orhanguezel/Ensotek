const swaggerJsDoc = require('swagger-jsdoc');

const NODE_ENV = process.env.NODE_ENV || 'development';
const SERVER_URL =
    NODE_ENV === 'development'
        ? 'http://localhost:5004' // Development URL
        : 'https://www.ensotek.de'; // Production URL

const swaggerOptions = {
    definition: {
        openapi: '3.0.0', // OpenAPI sürümü
        info: {
            title: 'Ensotek API',
            version: '1.0.0',
            description: 'Ensotek API documentation',
        },
        servers: [
            {
                url: SERVER_URL, // Sunucu URL'si
            },
        ],
    },
    apis: ['./routes/*.js'], // Swagger açıklamalarını içeren dosyalar
};

const swaggerSpecs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerSpecs;

