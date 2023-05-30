'use strict';
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const mountRoutes = require('./routes/routes');
const config = require('./config/config');

const morgan = require('morgan');
const developmentLogs = require('./utils/developmentLogs');

const app = express();
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(bodyParser.json({limit: "5mb"}));
app.use(bodyParser.urlencoded({extended: true, limit: "5mb",}));
app.use(cookieParser());
app.use(morgan(developmentLogs))

// Enable CORS
app.use((req, res, next) => {
    res.header('Accept', '*/*');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS, PATCH');
    next();
});


mountRoutes(app);

const errorHandler = require("./middlewares/errorHandler");
const verToken = require("./middlewares/verifyAuth");

// // global error handler
app.use(errorHandler.errorHandler);
app.use(verToken.verifyAuth);

const port = 5000;
app.listen(port, () => {
    console.log('Routes is listening on port ' + port);
});
