import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './router';

dotenv.config(); // load environment variables from a .env file
 
const app = express(); // create a new express application instance

app.use(cors({
    credentials: true,
})); // enable Cross-Origin Resource Sharing (CORS) with support for credentials

app.use(compression()); // enable gzip compression for HTTP responses
app.use(cookieParser()); // parse HTTP cookies
app.use(bodyParser.json()); // parse HTTP request bodies in JSON format

const PORT = process.env.PORT || 8080; // set the port number to listen on, from .env file or 8080

const server = http.createServer(app); // create a new HTTP server instance with the express app as the request handler

server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
}); // start listening on the specified port and log a message to the console when the server is ready

mongoose.Promise = Promise; // set the default promise library for Mongoose to the built-in Promise object
mongoose.connect(process.env.MONGO_URI); // connect to a MongoDB database using the URI specified in an environment variable
mongoose.connection.on('error', (error: Error) => console.log(error)); // log an error message to the console if there is an error connecting to the MongoDB database

app.use('/', router()); // use the router module to handle HTTP requests to the root path