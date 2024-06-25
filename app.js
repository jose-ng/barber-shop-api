const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').Server(app);
const useGraphQL = require('./graphQL');
const dotenv = require('dotenv');

dotenv.config();

// start server
async function startServer() {
  try {
    app.use(express.json());

    // All domains are allowed
    // const whitelist = [
    //   'http://localhost:3000',
    //   'http://localhost:4000',
    // ];
    // const corsOptions = {
    //   origin: (origin, callback) => {
    //     if (whitelist.indexOf(origin) !== -1 || !origin) {
    //       callback(null, true);
    //     } else {
    //       callback(new Error('Not allowed by CORS'));
    //     }
    //   },
    // };
    // app.use(cors(corsOptions));

    app.use(cors());

    // GraphQL
    await useGraphQL(app);

    // server
    app.disable('x-powered-by');

    return app;
  } catch (err) {
    console.log(err);
    throw new Error('Internal server error', err);
  }
}

module.exports = { server, startServer };
