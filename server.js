const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash'); // test messages

// Call routers - 
const loginRouter = require('./routes/loginRouter');
const dishRouter = require('./routes/dishRouter');
const locationRouter = require('./routes/locationRouter');

// Call connection routers
const menuConnectRouter = require('./routes/menuConnectRouter');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config/config');

const app = express();

app.use(express.static('public'));
app.use(express.static('views'));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// define routers
app.use('/', loginRouter);
app.use('/dish', dishRouter);
app.use('/location', locationRouter);

app.use('/menu', menuConnectRouter);

let server;
// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise. 
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};