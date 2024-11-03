// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Image Classification API',
            version: '1.0.1',
            description: 'A simple API to classify images, manage users, and manage models. Some endpoint are locked behind authentification, make sure to add the token in the Authorization header using the 🔒 button on the right corner of the request.<br /><br />DISCLAIMER:<br /> - Routes which require the gRPC server to be running will return an error if the server is not running. All routes concerned are marked with a 🚀.<br /> - All routes will return 405 if tested on the live instance on Github-Page, please run locally to test the routes.',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
    },
    apis: ['./src/routes/*.js'], // Path to your API routes
};

const specs = swaggerJsdoc(options);

exports.specs = specs;
exports.swaggerUi = swaggerUi;