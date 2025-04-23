const express = require('express');
const solc = require('solc');

const SmartContract = require('./models/smartContract');

const router = express.Router();

// HELPERS
function isEmptyDict(obj) {
  for (var name in obj) {
    return false;
  }
  return true;
}

// API
router.get('/test', (req, res) => {
  res.send('api works');
});

router.post('/compile', (req, res) => {
  let output;
  let response;

  output = solc.compile(req.body.source, 0); // 1 => optimized

  if (isEmptyDict(output.contracts)) {
    response =
      {
        'success': false,
        'errors': output['errors']
      }
  }
  else {
    let contracts = [];
    for (let contractName in output.contracts) {
      contracts.push({
        'name': contractName.slice(1), // get rid of leading colon
        'bytecode': output.contracts[contractName].bytecode,
        'abi': output.contracts[contractName].interface,
      });
    }
    const errors = !output['errors'] ? [] : output['errors'];
    response = {
      'success': true,
      'contracts': contracts,
      'errors': errors
    }
  }
  res.send(response);
});

router.get('/smart-contracts', (req, res) => {
  let n;
  let featuredOnly;
  let query;

  if (req.query.limit) {
    n = Number(req.query.limit);
  } else {
    n = 10;
  }

  featuredOnly = !!req.query.featuredOnly;

  if (n > 30 || n < 0) {
    res.status(500).json({error: "'limit' should be <= 30"});
    return;
  }

  if (featuredOnly) {
    query = SmartContract.find({isFeatured: true});
  } else {
    query = SmartContract.find();
  }

  query.limit(n);
  query.sort({_id: 1});
  query.exec(function (err, scs) {
      if (err) {
        res.status(500).json({error: err.message});
      } else {
        res.send(scs);
      }
    }
  )
});

router.post('/smart-contracts', (req, res) => {
  SmartContract.create({
      name: req.body.name,
      address: req.body.address,
      abi: JSON.stringify(req.body.abi),
      sourceCode: req.body.sourceCode,
      byteCode: req.body.byteCode,
    }, function (err, scs) {
      if (err) {
        res.status(500).json({error: err.message});
      } else {
        res.send({success: true});
      }
    }
  );
});

module.exports = router;
