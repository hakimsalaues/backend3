const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce API',
      version: '1.0.0',
      description: 'Documentación de endpoints de Usuarios',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      { bearerAuth: [] }
    ]
  },
  apis: ['./src/routes/sessions.routes.js'], // Asegúrate que esta ruta es correcta
};

module.exports = swaggerJSDoc(options);
