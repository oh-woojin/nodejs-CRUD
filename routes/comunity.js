var express = require('express');
var router = express.Router();
var mainhome = require('../lib/html');
var auth = require('../lib/authsts');
var db = require('./db');
var paging = require('../lib/paging');
var sanitize = require('sanitize-html');


router.get('/', function (req, res) {
    res.setHeader("Cache-Control", "no-store");
    res.redirect(`/comunity/1`);
});


router.get('/read', function (req, res) {
    res.setHeader("Cache-Control", "no-store");
    res.redirect(`/comunity/1`);
});

router.get('/create', function (req, res) {
    if(req.session.loggedin){
    var title = 'create';
        var html = mainhome.HTML(title,
           `<h2>${title}</h2>
           ${mainhome.BOARD_CREATE()}`
           ,
          auth.StatusUI(req, res)
        );
        res.setHeader("Cache-Control", "no-store");
    res.send(html);
        }else{
         res.setHeader("Cache-Control", "no-store");
        res.send('<script>alert("로그인이 필요합니다.");window.location.href="/auth/login"</script>');
        }
});

router.post('/create_process', function(req, res){
    var post = req.body;
    var username = req.session.name;
    var userid = req.session.username;
    var cleartitle = sanitize(post.title);
    var clearcontent = sanitize(post.content);
    if(cleartitle.length === 0 || clearcontent.length === 0){
        res.setHeader("Cache-Control", "no-store");
        res.send('<script>alert("제목과 내용을 입력해주세요.");window.location.href="/comunity/create"</script>');
    } else{
        db.query(`INSERT INTO comunity_board (title, content, regdate, name, userid) VALUES (?,?,now(),?,?)`,
        [cleartitle, clearcontent, username, userid],
        function (error1, results) {
        if(error1){
            throw error1;
        };
        res.setHeader("Cache-Control", "no-store");
        res.redirect(`/comunity`);
    });
    }
  });  //sanitize 적용 완료

router.get('/:page', function (req, res) {
    var countList = 10;
    var page = req.params.page;
    db.query(`SELECT pin, title, date_format(regdate, '%Y-%m-%d') regdate, hit, name FROM comunity_board ORDER BY pin DESC`, function(error, result){
        if(result.length === 0){
            var title = 'Comunity';
            var html = mainhome.HTML(title,
           `<h2>${title}</h2>
           <p><a href="/comunity/create">글쓰기</a></p>
           <p id="noboard">게시판 글이 존재하지 않습니다</p>`,
          auth.StatusUI(req, res)
        );
        res.setHeader("Cache-Control", "no-store");
        res.send(html);
        }else{
            var totalCount = result.length;
        var totalPage = Math.floor(totalCount / countList);
        if(error){
            throw error;
        }
        if (totalCount % countList > 0) {
            totalPage++;
            if(page>totalPage){
                page = totalPage;
            return  res.redirect(`/comunity/${page}`);
            }
        }else{
            if(page>totalPage){
                page = totalPage;
            return  res.redirect(`/comunity/${page}`);
            }
        }
        var pagingnum = paging.PAGING(req, result);
        var board = mainhome.BOARD(page, result, countList);
        var title = 'Comunity';
        var html = mainhome.HTML(title,
           `<h2>${title}</h2>
           <p>${board}</p>
           <p>${pagingnum}</p>`,
          auth.StatusUI(req, res)
        );
        res.setHeader("Cache-Control", "no-store");
        res.send(html);
        }
    });
});  //sanitize 적용 완료

router.get('/read/:page', function (req, res) {
    var page = req.params.page;
    var query = req.query.id;
    var TEst ="";
    var countList = 5;
    db.query(`SELECT userid FROM comunity_board WHERE pin=?`,[page],
         function(error, results){  //수정 삭제버튼을 위해 db에서 글쓴이 id 가져오기
             if(error){
                 throw error;
             }
             db.query(`SELECT pin, title, content, date_format(regdate, '%Y-%m-%d') regdate, hit, name FROM comunity_board WHERE pin=${page}`, function(error1, result){ //게시판 상세보기
                if(error1){
                    throw error1;
                } db.query(`UPDATE comunity_board SET hit=hit+1 WHERE pin=${page}`,
                function(error, result2){    //게시판 조회수 증가
                    if(req.session.loggedin){
                        if(req.session.username === results[0].userid){
                          TEst = auth.ComunityUI(req, result[0].title,result[0].content);
                              } //게시판 주인이면 수정 삭제버튼 활성화
                            }
                    db.query(`SELECT pin, username, userid, content, date_format(date, '%Y-%m-%d %H:%i') date FROM comunity_comment WHERE num=? ORDER BY pin DESC`,[page], function(error2,result2){ //현재 게시판 page로 댓글 찾기
                        if(error2){
                            throw error2;
                        }
                        var view = mainhome.BOARD_VIEW(result[0].title, result[0].regdate, result[0].hit, result[0].name, result[0].content, TEst);
                        var title = 'Comunity';
                        var pagingnum = paging.COMMENT_PAGING(req, result2);
                        var comment = mainhome.BOARD_COMMENT(req,query,result2,countList, page);
                        var html = mainhome.HTML(title,
                            `<h2>${title}</h2>
                            <p>${view}</p>
                            <p>${comment}</p>
                            <table>${pagingnum}</table>`,
                            auth.StatusUI(req, res)
                            );
                            res.setHeader("Cache-Control", "no-store");
                        res.send(html); 
                    })
                })            
        });
    });
});  //sanitize 적용 완료

router.post('/read/update', function(req, res){
        var title = 'Comunity';
        var body = req.body;
        var cleartitle = sanitize(body.title);
        var clearcontent = sanitize(body.content);
        var clearpin = sanitize(body.pin);
        var update = mainhome.BOARD_UPDATE(cleartitle, clearcontent, clearpin);
        var html = mainhome.HTML(title,
           `<h2>${title}</h2>
           ${update}`,
          auth.StatusUI(req, res)
        );
        res.setHeader("Cache-Control", "no-store");
        res.send(html);
    }); //sanitize 적용 완료

router.post('/read/update_process', function(req, res){
    var body = req.body;
    var cleartitle = sanitize(body.title);
    var clearcontent = sanitize(body.content);
    var clearpin = sanitize(body.pin);
    db.query(`UPDATE comunity_board SET title=?, content=? WHERE pin=?`, [cleartitle, clearcontent, clearpin], function(error, result){
        if(error){
            throw error;
        }
        res.setHeader("Cache-Control", "no-store");
        res.redirect(`/comunity/read/${clearpin}?id=1`);
    });
}); //sanitize 적용 완료


router.post('/read/delete', function(req, res){
    var post = req.body;
    var clearpin = sanitize(post.pin);
    db.query('DELETE FROM comunity_board WHERE pin=?', [clearpin], function(error, result){
        if(error){
          throw error;
        }db.query('DELETE FROM comunity_comment WHERE num=?', [clearpin], function(error2, results){
            res.setHeader("Cache-Control", "no-store");
            res.redirect(`/comunity`);
        })
    });
}); //sanitize 적용 완료


router.post('/read/comment_process', function(req, res){
    var post = req.body;
    var clearlocation = sanitize(post.location);
    var clearcomment = sanitize(post.comment);
    var username = req.session.name;
    var userid = req.session.username;
    if(clearcomment.length === 0){
        res.setHeader("Cache-Control", "no-store");
        res.send(`<script>alert("내용을 입력해주세요.");window.location.href="/comunity/read/${clearlocation}?id=1"</script>`);
    }
    else{
        db.query('INSERT INTO comunity_comment (num, userid, content, date, username) VALUES (?,?,?,now(),?)', [clearlocation, userid, clearcomment, username], function(error, results){
            if(error){
              throw error;
            }
            res.setHeader("Cache-Control", "no-store");
        res.redirect(`/comunity/read/${clearlocation}?id=1`);
        });
    }
}); //sanitize 적용 완료

router.post('/read/comment_delete', function(req, res){
    var post = req.body;
    var clearpin = sanitize(post.pin);
    var clearlocation = sanitize(post.location);
    db.query('DELETE FROM comunity_comment WHERE pin=?', [clearpin], function(error, results){
        if(error){
          throw error;
        }
        res.setHeader("Cache-Control", "no-store");
    res.redirect(`/comunity/read/${clearlocation}?id=1`);
    });
}); //sanitize 적용 완료

module.exports = router