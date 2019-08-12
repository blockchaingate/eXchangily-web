const testnetApiList = ['http://fabtest.info'];
let index = 0;
const length = testnetApiList.length;
const port = '8666';
const request = require('request');
const express = require('express');
const router = express.Router();

const getUrl = () => {
    const result = testnetApiList[index];
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
