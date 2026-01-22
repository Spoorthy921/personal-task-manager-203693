const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Personal Task Manager API',
      version: '1.0.0',
      description: 'Express API for a beginner-friendly personal task manager (auth + task CRUD).',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Use: Authorization: Bearer <token>',
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'User registration and login' },
      { name: 'Tasks', description: 'Task operations for authenticated users' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;

