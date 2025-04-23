const mainnetApiList = ['http://fabexplorer.info',
    'http://fabexplorer.com',
    'http://api.fabcoin.biz',
    'http://api1.fabcoin.club',
    'http://api2.fabcoin.club',
    'http://api3.fabcoin.club',
    'http://api1.fabexplorer.net',
    'http://api2.fabexplorer.net',
    'http://api3.fabexplorer.net'];
let index = 0;
const length = mainnetApiList.length;
const port = '8666';
const request = require('request');
const express = require('express');
const router = express.Router();

const getUrl = () => {
    const result = mainnetApiList[index];
    index++;
    if (index === length) {
        index = 0;
    }
    return `${result}:${port}`
};

router.get('*', (req, res) => {
    const url = getUrl() + '/transactions' + req.url;
    if (process.env.NODE_ENV !== 'production')
        console.log('getting from ' + url);
    request(url).pipe(res);
});

module.exports = router;
