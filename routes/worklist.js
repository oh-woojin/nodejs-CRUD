var express = require('express');
var router = express.Router();
var mainhome = require('../lib/html');
var auth = require('../lib/authsts');
var db = require('./db');
var sanitize = require('sanitize-html');

router.get('/', function (req, res) {
    if(req.session.loggedin){
        userid = req.session.username;
        db.query(`SELECT * FROM ${sanitize(userid)}`, function(error, results, fields) {
            var text = mainhome.WORKLI(results);
            var title = 'WorkList';
            var html = mainhome.HTML(title,
            `<h2>${title}</h2>
            <p>
            <a href = "/worklist/worklist_create" id = "List_create">create<a>
            </p>
            <p>
            ${text}</ul>
            </p>
            `,
           auth.StatusUI(req, res)
             );
             res.setHeader("Cache-Control", "no-store");
             res.send(html);
            });
    } else{
        res.setHeader("Cache-Control", "no-store");
        res.send('<script>alert("로그인이 필요합니다.");window.location.href="/auth/login"</script>');
    }
}); // sanitize 적용완료

router.get('/worklist_create', function (req, res) {
    if(req.session.loggedin){
        userid = req.session.username;
        db.query(`SELECT * FROM ${sanitize(userid)}`, function(error, results, fields) {
            var title = 'List_Create';
            var create = mainhome.WORKLI_C();
            var html = mainhome.HTML(title,
            `<h2>Work${title}</h2>
            <p>${create}</p>
            `,
           auth.StatusUI(req, res)
             );
             res.setHeader("Cache-Control", "no-store");
             res.send(html);
            });
    } else{
        res.setHeader("Cache-Control", "no-store");
        res.send('<script>alert("로그인이 필요합니다.");window.location.href="/auth/login"</script>');
    }
}); // sanitize 적용완료


router.post('/create_process', function(req, res){
    var post = req.body;
    userid = req.session.username;
    if(sanitize(post.work_title).length === 0 && sanitize(post.work_content).length === 0){
      res.setHeader("Cache-Control", "no-store");
      res.send('<script>alert("제목과 내용을 입력해주세요.");window.location.href="/worklist/worklist_create"</script>');
    }else{
      db.query(`INSERT INTO ${sanitize(userid)} (title, content) VALUES (?, ?)`,
    [sanitize(post.work_title), sanitize(post.work_content)],
     function (error1, results) {
      if(error1){
        throw error1;
      }
    });
    res.setHeader("Cache-Control", "no-store");
    res.redirect(`/worklist`);
    }
  }); // sanitize 적용완료

router.post('/delete_process', function(req, res){
     var post = req.body;
     userid = req.session.username;
     db.query(`DELETE FROM ${sanitize(userid)} WHERE title=?`, [sanitize(post.title)], function(error, results){
     if(error){
       throw error;
      }
      res.setHeader("Cache-Control", "no-store");
     res.redirect(`/worklist`);
    });
  }); // sanitize 적용완료

module.exports = router