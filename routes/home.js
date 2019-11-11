var express = require('express');
var router = express.Router();
var mainhome = require('../view/html');
var auth = require('../control/authsts');

router.get('/', function (req, res) {
    var title = 'DWRN';
    var home = mainhome.HOME();
    var html = mainhome.HTML(title,
       home,
       auth.StatusUI(req, res)
    );
    res.writeHead(200);
    res.end(html);
});
module.exports = router