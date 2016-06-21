var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('codeStyle', {
    title: 'Code Styles',
    styles: 'codeStyle'
  });
});

module.exports = router;
