var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('player', { title: 'Player test' });
});

module.exports = router;
