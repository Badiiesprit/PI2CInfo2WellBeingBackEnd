var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

});

router.post('/', function(req, res, next) {
  console.log(req.body);
  res.send(req.body);
});
module.exports = router;
