const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerAutogen = require('swagger-autogen')();


// Swagger configuration options
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API',
      version: '1.0.0',
      description: 'API documentation using Swagger',
    },
    servers: [
      {
        url: 'http://localhost:5050', // Update with your server's URL
      },
    ],
  },
  apis: ['./routes/*.js'], // Specify the path to your API routes
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./swagger-output.json'); // Spécifiez ici le chemin vers votre fichier de sortie Swagger généré
});
// Start your server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});