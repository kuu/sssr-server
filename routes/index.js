const express = require('express');
const debug = require('debug');
const discovery = require('../models/discovery');

const router = express.Router();
const print = debug('sssr');

router.get('/', (req, res) => {
  print(`/ called`);

  discovery.getTrends().then(assets => {
    res.render('index', {assets});
  }).catch(err => {
    res.render('error', {err});
  });
});

module.exports = router;
