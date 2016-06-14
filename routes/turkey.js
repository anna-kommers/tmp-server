let express = require('express'),
  router = express.Router();

router.get('/', function(req, res, next) {
  res.render('turkey', {
    styles: 'turkey'
  });
});

module.exports = router;
