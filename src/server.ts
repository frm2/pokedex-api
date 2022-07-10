import mongoose from 'mongoose';
import config from '../config/config';
import express from 'express';
import http from 'http';
import pkmnRoutes from '../src/routes/Pokemon';

const router = express();

/** Connecting to the MongoDB server */

mongoose
    .connect(config.mongo.url)
    .then(() => {
        console.log('Connected');
        server();
    })
    .catch((error) => {
        console.log('Failed to connect');
        console.log(error.message);
    });

const server = () => {
    router.use((req, res, next) => {
        //Logs the Request
        console.log(`[INCOMING] Method: [${req.method}] URL: [${req.url}] IP [${req.ip}]`);
        res.on('finish', () => {
            //When the request finishes, logs the response
            console.log(
                `[OUTGOING] Method: [${req.method}] URL: [${req.url}] `,
                `IP: [${req.ip}] STATUS: [${res.statusCode} - ${res.statusMessage}]`
            );
        });

        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    //Routes (contains the routes for the functions)
    router.use('/pkmn', pkmnRoutes);

    //Creating the server with the functions added to the router
    http.createServer(router).listen(config.server.port, () => {
        console.log(`Server is now running - PORT [${config.server.port}]`);
    });
};
