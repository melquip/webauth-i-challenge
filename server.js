const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const usersRouter = require('./users/user-router');

const server = express();

server.use(helmet());
server.use(logger);
server.use(express.json());
server.use(cors());

server.use(cookieParser());
server.use(session({
  name: 'user_sid', // sid
  secret: 'secretvalue', // .env file
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: false, // https ? true : false // .env
    httpOnly: true // no javascript code can access it
  },
  resave: false, // dont recreate session if they didnt change
  saveUninitialized: false, // GDPR compliance | laws against setting cookies automatically
  store: new KnexSessionStore({
    knex: require('./data/db-config'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 60
  }),
}));

server.use('/api', usersRouter);

function logger(req, res, next) {
  console.log(req.method, req.url, Date.now())
  next();
};

module.exports = server;