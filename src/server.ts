import mongoose from 'mongoose';
import config from '../config/config';
import express from 'express';
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
    //express doesn't work with nested objects without this setting
    router.use(express.urlencoded({ extended: true }));
    //the body of our messages will contain JSONs in our POST and PATCH methods
    router.use(express.json());
    //Routes (contains the routes for the functions)
    router.use('/pkmn', pkmnRoutes);

    //Creating the server with the functions added to the router

    router.listen(config.server.port, () => {
        console.log(`Server is now running - PORT [${config.server.port}]`);
    });
};
