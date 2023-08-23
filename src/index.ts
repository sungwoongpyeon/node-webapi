import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import router from './router';

//import is a statement used in ECMAScript modules (ES modules), which is the standard module system introduced in ES6 (ES2015)
import mongoose from 'mongoose';

// require() is a function used in CommonJS modules, which is the module system used in Node.js and older versions of JavaScript.
// const mongoose = require("mongoose");

// If you are working in a Node.js environment or using an older version of JavaScript, 
// you'll likely use require(). For modern browsers and newer JavaScript projects, you'll use import.

const app = express();


/* 
// Define the function to check the allowed origin
const allowSpecificOrigin = (origin, callback) => {
  // Replace 'https://example.com' with the domain you want to accept requests from
  const allowedOrigins = ['https://example.com'];

  if (!origin || allowedOrigins.indexOf(origin) !== -1) {
    // If the origin is in the allowed list or the request doesn't have an origin header, allow the request
    callback(null, true);
  } else {
    // If the origin is not in the allowed list, block the request
    callback(new Error('Not allowed by CORS'));
  }
};

// Set up cors middleware with the custom origin function
app.use(cors({ origin: allowSpecificOrigin, credentials: true }));
*/

app.use(cors({
  credentials: true,
}));

/* 
Express cannot destructure request body so that we need a middleware.
To setup middleware that tells Express to parse json before the actual data hits the function that we are using here to handle the request.
Think of shared code that runs before every endpoint callback that you have defined. 
*/
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log('Server running on http://localhost:8080/');
});

const MONGO_URL = 'mongodb+srv://tjddnd523:5231111@demo-db.0e3u1te.mongodb.net/?retryWrites=true&w=majority'; // DB URI

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/', router());