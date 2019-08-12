const express = require('express');
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const compression = require('compression');

const api = require('./api');
const fabapi = require('./fabapi');
const transactions = require('./transactions');
const fabapi_testnet = require('./fabapi_testnet');
const transactions_testnet = require('./transactions_testnet');
const app = express();

// enable compression
app.use(compression());

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Point static path to dist
app.use(express.static(path.join(__dirname, '../dist/fabWallet')));

// for smart contract apis.
app.use('/api', api);

//for mainnet
app.use('/fabapi', fabapi);
app.use('/transactions', transactions);

//for testnet
app.use('/fabapi_testnet', fabapi_testnet);
app.use('/transactions_testnet', transactions_testnet);


// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/fabWallet/index.html'));
});

console.log("Running server in ", process.env.NODE_ENV, ' mode.');


// Try to start HTTPS server
try {
    const privateKey = fs.readFileSync(path.join(__dirname,'localhost.key'));
    const certificate = fs.readFileSync(path.join(__dirname,'localhost.crt'));
    const httpsPort = process.env.HTTP_PORT || '443';
    const server_ = https.createServer({
        key: privateKey,
        cert: certificate
    }, app).listen(httpsPort, () => {
        console.log('Https Application running on port:', httpsPort);
    });

} catch (error) {
    console.error(error.message);
    console.error('Https Application is not running');
    console.log('Trying to run HTTP server');

}

// start HTTP server
const httpPort = process.env.PORT || '80';
const server = http.createServer(app);
server.listen(httpPort,
    () => console.log(`HTTP Application running on port:${httpPort}`)
);

module.exports = {app};
