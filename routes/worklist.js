var express = require('express');
var router = express.Router();
var mainhome = require('../view/html');
var auth = require('../control/authsts');
var db = require('./db');
var sanitize = require('sanitize-html');

router.get('/', function (req, res) {
    if(req.session.loggedin){
        userid = req.session.username;
        db.query(`SELECT * FROM worklist WHERE userid=?`,[sanitize(userid)], function(error, results, fields) { // DB에서 로그인된 ID로 저장되어있는 목록 찾기
            var text = mainhome.WORKLI(results);
            var title = 'WorkList';
            var html = mainhome.HTML(title,
            `<h2>${title}</h2>
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
    } else{
        res.setHeader("Cache-Control", "no-store");
        res.send('<script>alert("로그인이 필요합니다.");window.location.href="/auth/login"</script>');
    }
}); // sanitize 적용완료


router.post('/create_process', function(req, res){
    var post = req.body;
    userid = req.session.username;
    if(sanitize(post.work_title).length === 0 || sanitize(post.work_content).length === 0){
      res.setHeader("Cache-Control", "no-store");
      res.send('<script>alert("제목과 내용을 입력해주세요.");window.location.href="/worklist/worklist_create"</script>');
    }else{
      db.query(`INSERT INTO worklist (title, content, userid) VALUES (?, ?, ?)`,
    [sanitize(post.work_title), sanitize(post.work_content), sanitize(userid)],
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
     db.query(`DELETE FROM worklist WHERE title=? AND userid=?`, [sanitize(post.title),sanitize(userid)], function(error, results){
     if(error){
       throw error;
      }
      res.setHeader("Cache-Control", "no-store");
     res.redirect(`/worklist`);
    });
  }); // sanitize 적용완료

module.exports = router