const express = require('express');
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

// Parsers for POST data

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const fabapi = require('./fabapi');
const transactions = require('./transactions');
app.use('/fabapi', fabapi);
app.use('/transactions',transactions);

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '80';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port,
    () => console.log(`Application running on port:${port}`)
);


module.exports = {app};
