const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex");
const database = require("../data/dbConfig");
const restrict = require("./middleware/restricted.js");

const authRouter = require('./auth/auth-router.js');
const jokesRouter = require('./jokes/jokes-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/jokes', restrict, jokesRouter); // only logged-in users should have access!
server.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.JWT_VERIFY || "shhh",
    store: new KnexSessionStore({
      knex: database,
      createtable: true,
    }),
  })
);

module.exports = server;
