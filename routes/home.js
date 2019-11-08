var express = require('express');
var router = express.Router();
var mainhome = require('../lib/html');
var auth = require('../lib/authsts');

router.get('/', function (req, res) {
    var title = 'HOME';
    var des = 'WELCOME To Scheduler'
    var html = mainhome.HTML(title,
       `<h2>${des}</h2>`,
       auth.StatusUI(req, res)
    );
    res.writeHead(200);
    res.end(html);
});
module.exports = router