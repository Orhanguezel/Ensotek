const NODE_ENV = process.env.NODE_ENV || 'development';
const SERVER_URL = NODE_ENV === 'development'
    ? 'http://localhost:5004'
    : 'https://www.ensotek.de';

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
                url: SERVER_URL,
            },
        ],
    },
    apis: ['./routes/*.js'],
};

