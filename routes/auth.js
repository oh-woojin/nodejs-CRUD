var express = require('express');
var app = express();
var router = express.Router();
var mainhome = require('../view/html');
var auth = require('../control/authsts');
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
        db.query(`SELECT salt FROM members WHERE userid = ?`, [clearidname], function(err2, salt)
        {
          crypto.pbkdf2(`${clearpassword}`, `${salt[0].salt}`, 126531, 64, 'sha512', function(err, key){
            var password = key.toString('base64');
    // DB에 저장되어있는 salt값으로 비밀번호 암호화하여 입력한 비밀번호와 저장한 비밀번호 string값을 비교함

            if (clearidname && clearpassword) {
              db.query('SELECT * FROM members WHERE userid = ? AND pw = ?', [clearidname, password], function(error, results, fields) {
                if (results.length > 0) {
                  req.session.loggedin = true;
                  req.session.username = clearidname;
                  req.session.name = sanitize(results[0].name);
                  /* 로그인에 성공했을경우 session저장소에 사용자 name, id, 로그인true값을 저장시킴
                     글쓰기, 수정, 삭제등의 권한을 확인하기 위한 작업*/
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
        if(month<10){
          month_result += `<option value="${month}">0${month}</option>`;
          month++
        }
        else{
          month_result += `<option value="${month}">${month}</option>`;
          month++;
         }
      }

      var day = 1;
      var day_result = '';
      while(day<32){
        if(day<10){
          day_result += `<option value="${day}">0${day}</option>`;
          day++;
        }
        else{
        day_result += `<option value="${day}">${day}</option>`;
        day++;
        }
      }
      var join = mainhome.JOIN(year_result, month_result, day_result);
      var html = mainhome.HTML(title, join, auth.StatusUI(req, res));
      res.setHeader("Cache-Control", "no-store");
      res.send(html);
    });

router.post('/join_process', function(req, res){
     
      var post = req.body;
      function keyfilter(post){
        var ch = post.join_id;
        var filter = /[a-zA-Z0-9]/   ;
        if(!filter.test(ch)){
              return false;
        }
        else{
          return true;
        }
      } // 사용자 아이디값은 영문과 숫자만 사용가능하게 필터링
      function idvalue(values){
        return values.userid === sanitize(post.join_id);
       } //id 중복을 확인하기 위한 함수. 중복이 아닐경우 undefined반환
      var birth = `${sanitize(post.join_year)}-${sanitize(post.join_month)}-${sanitize(post.join_day)}`;
      db.query(`SELECT userid FROM members`, function(error, idcheck){
        console.log(idcheck.find(idvalue));
        if(idcheck.find(idvalue) === undefined){
          if(keyfilter(post)){
            if(sanitize(post.join_pw).length > 7){
              if(sanitize(post.join_pw) === sanitize(post.join_pw2)){
                if(sanitize(post.join_name).length > 0){
                  if(sanitize(post.join_phone).length > 0){
                    if(sanitize(post.join_email).length > 0){
                      if(sanitize(birth).length > 0){
                        crypto.randomBytes(64, function(err, buf) {  
                        crypto.pbkdf2(sanitize(post.join_pw), buf.toString('base64'), 126531, 64, 'sha512', function(err, key){
                              var password = key;
                              var salt = buf;
                              db.query(`INSERT INTO members (userid, pw, salt, name, phone, email, birth) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                                [sanitize(post.join_id), password.toString('base64'), salt.toString('base64'), sanitize(post.join_name), sanitize(post.join_phone), sanitize(post.join_email), sanitize(birth)],
                                function (error1, results) {
                                  if(error1){
                                    throw error1;
                                  };
                                res.setHeader("Cache-Control", "no-store");
                                res.send('<script>alert("회원가입이 완료되었습니다.");         window.location.href="/"</script>');
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
              res.send('<script>alert("비밀번호는 8자리 이상 입력해주세요.");window.location.href="/auth/join"</script>');
            }
        }
        else{
          res.setHeader("Cache-Control", "no-store");
          res.send('<script>alert("아이디는 영문과 숫자만 입력해주세요.");window.location.href="/auth/join"</script>');
          
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
    var title = '마이페이지'
    var mypage = mainhome.MYPAGEPW_CHECK();
    var html = mainhome.HTML(title,
       `${mypage}`
       , auth.StatusUI(req, res));
    res.setHeader("Cache-Control", "no-store");
    res.send(html);
  }
});

router.post('/mypage_process', function(req, res){
  var post = req.body;
  var idname = req.session.username;
  var password = post.password;
  var title = '마이페이지'
  var change = mainhome.MYPAGE_CHANGE();
  var html = mainhome.HTML(title,
    `${change}`
    ,auth.StatusUI(req, res));
  db.query(`SELECT pw FROM members WHERE userid=?`, [sanitize(idname)], function(error, result){
    db.query(`SELECT salt FROM members WHERE userid = ?`, [sanitize(idname)], function(err2, salt){
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
    if(sanitize(post.mypage_pw).length > 7){
    db.query(`SELECT pw FROM members WHERE userid=?`, [idname], function(error1, results){
      if(error1){
        throw error1;
      }
      db.query(`SELECT salt, pw FROM members WHERE userid = ?`, [idname], function(err2, salt){ //저장된 salt
        crypto.pbkdf2(`${sanitize(post.mypage_pw)}`, `${salt[0].salt}`, 126531, 64, 'sha512', function(err, key){
          var pwchek = key.toString('base64'); //입력한 값에 저장된 salt로 암호화
          if(sanitize(pwchek) !== sanitize(results[0].pw)){
            crypto.randomBytes(64, function(err, buf) {  //salt 새로 생성
              crypto.pbkdf2(sanitize(post.mypage_pw), buf.toString('base64'), 126531, 64, 'sha512', function(err, key){
                var password = key;
                var salt2 = buf;
                db.query(`UPDATE members SET pw =?, salt =? WHERE userid=?`, [password.toString('base64'), salt2.toString('base64'), idname], function(error2, result){
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
    res.send('<script>alert("비밀번호는 8자리이상 입력해주세요."); window.location.href="/auth/mypage"</script>');
  }
}else{
    res.send('<script>alert("비밀번호를 똑같이 입력해주세요.");window.location.href="/auth/mypage"</script>');}
  }); // sanitize 적용완료

module.exports=router;
