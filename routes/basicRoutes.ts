import express from "express";

const basicRoutes = express.Router();

basicRoutes.get('/', (request, response) => {
    response.send('openletter backend v0.0.1');
});

export default basicRoutes;