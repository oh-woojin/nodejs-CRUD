var express = require('express');
var app = express();
var router = express.Router();
var mainhome = require('../lib/html');
var auth = require('../lib/authsts');
var db = require('./db');
var bodyParser = require('body-parser');
var sanitize = require('sanitize-html');
var crypto = require('crypto');

app.use(bodyParser.urlencoded({ extended: false }))


router.get('/login', function (req, res) {
    var title = '로그인';
    var login = mainhome.LOGIN();
    var html = mainhome.HTML(title, login, auth.StatusUI(req, res));
    res.setHeader("Cache-Control", "no-store");
    res.send(html);
});


router.post('/login_process', function(req, res){
        var post = req.body;
        var clearidname = sanitize(post.idname);
        var clearpassword = sanitize(post.password);
        db.query(`SELECT salt FROM members WHERE id = ?`, [clearidname], function(err2, salt)
        {
          crypto.pbkdf2(`${clearpassword}`, `${salt[0].salt}`, 126531, 64, 'sha512', function(err, key){
            var password = key.toString('base64');

            if (clearidname && clearpassword) {
              db.query('SELECT * FROM members WHERE id = ? AND pw = ?', [clearidname, password], function(error, results, fields) {
                if (results.length > 0) {
                  req.session.loggedin = true;
                  req.session.username = clearidname;
                  req.session.name = sanitize(results[0].name);
                  res.setHeader("Cache-Control", "no-store");
                  res.redirect('/');
                } else {
                  res.setHeader("Cache-Control", "no-store");
                  res.send('<script>alert("아이디와 비밀번호를 확인해주세요.");window.location.href="/auth/login"</script>');
                }			
              });
            } else {
              res.setHeader("Cache-Control", "no-store");
              res.send('<script>alert("아이디 또는 비밀번호를 입력해주세요.");window.location.href="/auth/login"</script>');
            }
          });
        });
      });
         // sanitize 적용완료

router.get('/join', function (req, res) {
  var title = '회원가입';
      var year = 1970;
      var year_result = '';
      while(year<2020){
        year_result += `<option value="${year}">${year}</option>`;
        year++;
      }

      var month = 1;
      var month_result = '';
      while(month<13){
        month_result += `<option value="${month}">${month}</option>`;
        month++;
      }

      var day = 1;
      var day_result = '';
      while(day<32){
        day_result += `<option value="${day}">${day}</option>`;
        day++;
      }
      var join = mainhome.JOIN(year_result, month_result, day_result);
      var html = mainhome.HTML(title, join, auth.StatusUI(req, res));
      res.setHeader("Cache-Control", "no-store");
      res.send(html);
    });

router.post('/join_process', function(req, res){
     
      var post = req.body;
      function idvalue(values){
        return values.id === sanitize(post.join_id);
       }
      var birth = `${sanitize(post.join_year)}-${sanitize(post.join_month)}-${sanitize(post.join_day)}`;
      db.query(`SELECT id FROM members`, function(error, idcheck){
        if(idcheck.find(idvalue) === undefined){
            if(sanitize(post.join_pw).length > 0){
              if(sanitize(post.join_pw) === sanitize(post.join_pw2)){
                if(sanitize(post.join_name).length > 0){
                  if(sanitize(post.join_phone).length > 0){
                    if(sanitize(post.join_email).length > 0){
                      if(sanitize(birth).length > 0){
                        crypto.randomBytes(64, function(err, buf) {  
                        crypto.pbkdf2(sanitize(post.join_pw), buf.toString('base64'), 126531, 64, 'sha512', function(err, key){
                              var password = key;
                              var salt = buf;
                              db.query(`INSERT INTO members (id, pw, salt, name, phone, email, birth) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                                [sanitize(post.join_id), password.toString('base64'), salt.toString('base64'), sanitize(post.join_name), sanitize(post.join_phone), sanitize(post.join_email), sanitize(birth)],
                                function (error1, results) {
                                  if(error1){
                                    throw error1;
                                  };
                                  db.query(`CREATE TABLE ${sanitize(post.join_id)}(title VARCHAR(100) NOT NULL, content VARCHAR(300) NOT NULL)`,
                                  function(error2, result){
                                    if(error2){
                                      throw error2;
                                    }
                                  }
                                );
                                res.setHeader("Cache-Control", "no-store");
                                res.redirect(`/`);
                            });
                           });
                          });
                      }
                      else{
                        res.setHeader("Cache-Control", "no-store");
                        res.send('<script>alert("생년월일을 입력해주세요.");         window.location.href="/auth/join"</script>');
                      }
                    }
                    else{
                      res.setHeader("Cache-Control", "no-store");
                      res.send('<script>alert("이메일을 입력해주세요.");         window.location.href="/auth/join"</script>'); 
                    }
                  }
                  else{
                    res.setHeader("Cache-Control", "no-store");
                    res.send('<script>alert("전화번호를 입력해주세요.");         window.location.href="/auth/join"</script>');
                  }
                }
                else{
                  res.setHeader("Cache-Control", "no-store");
                  res.send('<script>alert("이름을 입력해주세요.");window.location.href="/auth/join"</script>');
                }
              }
              else{
                res.setHeader("Cache-Control", "no-store");
                res.send('<script>alert("비밀번호를 확인해주세요.");window.location.href="/auth/join"</script>');
              }
            }
            else{
              res.setHeader("Cache-Control", "no-store");
              res.send('<script>alert("비밀번호를 입력해주세요.");window.location.href="/auth/join"</script>');
            }
        }
        else{
          res.setHeader("Cache-Control", "no-store");
          res.send('<script>alert("중복된 아이디입니다.");window.location.href="/auth/join"</script>');
        }
    });
  }); // sanitize 적용완료

router.get('/logout', function(req, res){
  req.session.destroy(function(err) {
      res.setHeader("Cache-Control", "no-store");
      res.redirect(`/`);
    })
});

router.get('/mypage', function(req, res){
  if(!req.session.loggedin){
    res.setHeader("Cache-Control", "no-store");
    res.send('<script>alert("잘못된 접근입니다."); window.location.href="/"</script>');
  } else{
    var mypage = mainhome.MYPAGEPW_CHECK();
    var title = '마이페이지';
    var html = mainhome.HTML(title,
       `<h2>${title}</h2>
       ${mypage}`
       , auth.StatusUI(req, res));
    res.setHeader("Cache-Control", "no-store");
    res.send(html);
  }
});

router.post('/mypage_process', function(req, res){
  var post = req.body;
  var idname = req.session.username;
  var password = post.password;
  var title = '마이페이지';
  var change = mainhome.MYPAGE_CHANGE();
  var html = mainhome.HTML(title,
    `<h2>${title}</h2>
    ${change}`
    ,auth.StatusUI(req, res));
  db.query(`SELECT pw FROM members WHERE id=?`, [sanitize(idname)], function(error, result){
    db.query(`SELECT salt FROM members WHERE id = ?`, [sanitize(idname)], function(err2, salt){
          crypto.pbkdf2(`${sanitize(password)}`, `${salt[0].salt}`, 126531, 64, 'sha512', function(err, key){
            var pwchek = key.toString('base64');
          if(sanitize(pwchek) === sanitize(result[0].pw)){
            res.send(html);
          } else{
            res.send(`<script>alert("비밀번호를 확인해주세요.");window.location.href="/auth/mypage"</script>`);
          }
      });
    });
  });
}); // sanitize 적용완료

router.post('/pwchange_process', function(req, res){
  var post = req.body;
  var idname = sanitize(req.session.username);
  if(sanitize(post.mypage_pw) === sanitize(post.mypage_pw2)){
    db.query(`SELECT pw FROM members WHERE id=?`, [idname], function(error1, results){
      if(error1){
        throw error1;
      }
      db.query(`SELECT salt, pw FROM members WHERE id = ?`, [idname], function(err2, salt){ //저장된 salt
        crypto.pbkdf2(`${sanitize(post.mypage_pw)}`, `${salt[0].salt}`, 126531, 64, 'sha512', function(err, key){
          var pwchek = key.toString('base64'); //입력한 값에 저장된 salt로 암호화
          if(sanitize(pwchek) !== sanitize(results[0].pw)){
            crypto.randomBytes(64, function(err, buf) {  //salt 새로 생성
              crypto.pbkdf2(sanitize(post.mypage_pw), buf.toString('base64'), 126531, 64, 'sha512', function(err, key){
                var password = key;
                var salt2 = buf;
                db.query(`UPDATE members SET pw =?, salt =? WHERE id=?`, [password.toString('base64'), salt2.toString('base64'), idname], function(error2, result){
                  if(error2){
                    throw error2;
                  }
                  res.send('<script>alert("비밀번호가 변경되었습니다.");         window.location.href="/"</script>');
                });
              });
            });
          } else{
            res.send('<script>alert("현재 비밀번호와 일치합니다. 다른 비밀번호를 입력해주세요."); window.location.href="/auth/mypage"</script>');
          }
      });
    });
  });
  }else{
    res.send('<script>alert("비밀번호를 똑같이 입력해주세요.");window.location.href="/auth/mypage"</script>');}
  }); // sanitize 적용완료

module.exports=router;
