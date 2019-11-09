var express = require('express');
var router = express.Router();
var mainhome = require('../lib/html');
var auth = require('../lib/authsts');

router.get('/', function (req, res) {
    var title = 'HOME';
    var home = mainhome.HOME();
    var html = mainhome.HTML(title,
       home,
       auth.StatusUI(req, res)
    );
    res.writeHead(200);
    res.end(html);
});
module.exports = router