const swaggerJsDoc = require("swagger-jsdoc");

const NODE_ENV = process.env.NODE_ENV || "development";
const SERVER_URL =
  NODE_ENV === "development"
    ? "http://localhost:5004" // Geliştirme ortamı URL'si
    : "https://www.ensotek.de"; // Üretim ortamı URL'si

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ensotek API",
      version: "1.0.0",
      description: "Ensotek API documentation",
    },
    servers: [
      {
        url: "https://www.ensotek.de/api",
        description: "Production server",
      },
      {
        url: "http://localhost:5004",
        description: "Development server",
      },
    ],
  },
  apis: ["./routes/*.js"], // Swagger açıklamaları için dosya yolu
};

const swaggerSpecs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerSpecs;
