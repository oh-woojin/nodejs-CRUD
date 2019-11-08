var sanitize = require('sanitize-html');
// sanitize 적용완료

module.exports = {
HTML:function(title, body, authStatusUI = `
<li><a href="/auth/login">로그인</a></li>
<li><a href="/auth/join">회원가입</a></li>`){
  return`
  <!doctype html>
  <html>
    <head>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="mainstyle.css">
      <meta charset="utf-8">
      <title>${title}</title>
    </head>
      <body>
        <ul id="login">
        ${authStatusUI}
        </ul>
        <h1 id="title">
          <a href="/">Schedule</a>
        </h1>
        <ul id="Menu">
          <li id="Menumargin"><a href="/worklist">WorkList</a></li>
          <li><a href="/comunity/">Comunity</a></li>
        </ul>
        <div id="body">
          ${body}
        </div>
      </body>
    </html>
    `;
}, LOGIN:function(){
  return`
        <div id="loginID">
          <div>
          아이디 비밀번호를 입력 후, 로그인 버튼을 눌러주세요.
          </div>
          <form action = "/auth/login_process" method="post">
          <p><span>
          <input type="text" name="idname" placeholder="ID">
          </span></p>
          <p><span>
          <input type="password" name="password" placeholder="PASSWORD">
          </span></p>
          <p>
          <button type="submit" name="loginsubmit">로 그 인</button>
          </p>
          </form>
        </div>  `;
},JOIN:function(year, month, day, b){
  return `
        <div id="join">
        <p>
        회 원 가 입
        </p>
        <div>
        <form action = "/auth/join_process" method="post">
          <table>
            <tr>
            <td>
              <input type = "text" name = "join_id" placeholder = "아이디">
            </td>
            </tr>
            <tr>
            <td>
              <input type = "password" name = "join_pw" placeholder = "비밀번호">
            </td>
            </tr>
            <tr>
            <td>
              <input type = "password" name = "join_pw2" placeholder = "비밀번호 확인">
            </td>
            </tr>
            <tr>
            <td>
              <input type = "text" name = "join_name" placeholder = "이름">
            </td>
            </tr>
            <tr>
            <td>
              <input type = "text" name = "join_phone" placeholder = "전화번호(-빼고 입력)">
            </td>
            </tr>
            <tr>
            <td>
              <input type = "email" name = "join_email" placeholder = "이메일">
            </td>
            </tr>
            <tr>
            <td>
            <span>생년월일</span>
              <select name = "join_year">${year}
              </select>
              <select name = "join_month">${month}
              </select>
              <select name = "join_day">${day}
              </select>
            </td>
            </tr>
            <tr>
            <td>
            <input type="submit" value="회원가입" onclick="return confirm('회원가입 하시겠습니까?')">
            </td>
            </tr>
            </table>
        </form>
        </div>
        </div>
        <script>
        var a = document.getElementById('joinMargin');
        var b = document.getElementById('get-weather');
        </script>`    
},
WORKLI:function(results){
          var i = 0;
          var text = '<div class="container">';
          while(i < sanitize(results.length)){
              text += `<div><button type="button" class="btn btn-link" data-toggle="modal" data-target="#myModal${i}" id="work_button_color">${sanitize(results[i].title)}</button>
              <form action = "/worklist/delete_process" method="post" id="work_align">
              <input type="submit" id="Delete_work" onclick="return confirm('삭제하겠습니까?')" value="X"><input type="hidden"  name="title" value="${sanitize(results[i].title)}"></p></form></div>
               
              <div class="modal fade" id="myModal${i}">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                  <div class="modal-content">
                  
                    <div class="modal-header">
                      <h1 class="modal-title">${sanitize(results[i].title)}</h1>
                      <button type="button" class="close" data-dismiss="modal">×</button>
                    </div>
                    
                    <div class="modal-body">
                      <pre align="left">${sanitize(results[i].content)}</pre>
                    </div>
                    
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                  </div>
                </div>
              </div>
              <br>
              `
              i++;
           }
           return text +='</div>';
},
WORKLI_C:function(){
          return `<div class="container">
                    <form action="/worklist/create_process" method="post">
                    <input type="text" class="form-control" id="board-create-title" name="work_title" placeholder="제목">
                    <textarea class="form-control" rows="7" id="board-create-content"  onkeydown="resize(this)" onkeyup="resize(this)" placeholder="내용입력" name="work_content" id="work_textarea"></textarea>
                  <div id="board_cbtn_align">
                    <button class="btn btn-link" id="work_createbtn">작성</button>
                  </div>
                  </form>
                  </div>
                  <script>
                  function resize(obj) {
                    obj.style.height = "170px";
                    obj.style.height = (12+obj.scrollHeight)+"px";
                  }
                  </script>
          `
},
BOARD:function(page, result, countList) {
  var listlength = (result.length-1);
  var comunity_list = '<div class="container"><table class="table table-hover"><thead><tr><th id="tablenum">번호</th><th id="tabletitle">제목</th><th id="tableview">조회수</th><th id="tabledate">등록일</th><th id="tableauthor">작성자</th></tr></thead><tbody>'
    
    for(var i=(page*countList)-countList; i<(page*countList); i++)
    {
        if(i>listlength){
          i++;
        } else{
          var data = result[i];   
        comunity_list += `<tr><td id="tablenum">${listlength-(i-1)}</td><td id="tabletitle"><a href="/comunity/read/${data.pin}?id=1">${sanitize(result[i].title)}</a></td><td id="tableview">${sanitize(result[i].hit)}</td><td id="tabledate">${sanitize(result[i].regdate)}</td><td id="tableauthor">${sanitize(result[i].name)}</td></tr>`
        }
    }
    return comunity_list +'</tbody></table><div id="tablecreate"><a href="/comunity/create">글쓰기</div></div>';
},
BOARD_CREATE:function(){
  return `
          <form action="/comunity/create_process" method="post" >
          <div class="container">
            <div class="form-group">
              <input type="text" class="form-control" id="board-create-title" name="title" placeholder="제목">
              <textarea class="form-control" id="board-create-content" rows="8" name="content" placeholder="내용"></textarea>
              <div id="board_cbtn_align"><button
              class="btn btn-link" id="board_create_button">글쓰기</button></div>
            </div>
          </div>
          </form>`
},
BOARD_VIEW:function(title, date, hit, name, content, control){
  return `
  <div class="container">
  <table class="table">
  <thead>
    <tr>
      <th id="board_title">${sanitize(title)}</th>
      <th id="board_right">${sanitize(date)}</th>
      <th id="board_right">조회수 ${sanitize(hit)}</th>
      <th id="board_right_name">${sanitize(name)}</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="4" id="board_content">${sanitize(content)}</td>
    </tr>
  </tbody>
</table>
</div>
${control}
  `
},
BOARD_UPDATE:function(title, content, pin){
  return `
  <form action="/comunity/read/update_process" method="post">
  <div class="container">
    <div class="form-group">
      <input type="text" class="form-control" id="board-create-title" name="title" value="${sanitize(title)}">
      <input type="hidden" name="pin" value="${sanitize(pin)}">
      <textarea name="content" class="form-control" id="board-create-content" rows="8">${sanitize(content)}</textarea>
      <div id="board_upbtn">
      <button type="submit" class="btn btn-link" id="update_link" onclick="return confirm('수정하겠습니까??')">수정완료</button>
      </div>
  </form>
  </div>
  </div>
  `
},
BOARD_COMMENT:function(req,page, comment, countList, location, paging){
  var bdcomment = `<div class="container"><p id=comment_title>댓글</p><table class="table" id="board_comment_bottom">`
  var i = 0;
  var listlength = (comment.length-1);
  if(comment.length === 0){
     bdcomment = `<div class="container"><p id=comment_title>댓글없음</p>`;
     if(req.session.loggedin){
      bdcomment = `<div class="container"><p id=comment_title>댓글없음</p>`;
     }
  }
  for(var i=(page*countList)-countList; i<(page*countList); i++)
    {
        if(i>listlength){
          i++;
        } else{
          var data = comment[i];   
           if(req.session.username === comment[i].userid){
            bdcomment += `<tr><td id="board_comment_name">${sanitize(data.username)}</td><td id="board_comment_date">${sanitize(data.date)}</td>
            <form action="/comunity/read/comment_delete" method="post"><td rowspan="2"><button class="btn btn-link" id="board_comment_delete" onclick="return confirm('삭제하겠습니까?')">삭제</button></td>
            <input type="hidden" name="pin" value="${sanitize(comment[i].pin)}">
            <input type="hidden" name="location" value="${sanitize(location)}">
            </form>
            <tr><td colspan ="2" id="board_comment_content">${sanitize(data.content)}</td></tr>` //권한 있는 사용자일경우 댓글 삭제 활성화
           }else{
            bdcomment += `<tr><tr id="board_comment_top">
            <tr id="bdcomment"><td id="board_comment_name">${sanitize(data.username)}</td>
            <td id="board_comment_date" colspan="2">${sanitize(data.date)}</td>
            <tr><td colspan ="3" id="board_comment_content">${sanitize(data.content)}</td></tr>
            </tr></tr>` //권한없는경우 댓글만 볼수있게
           }
        }
    }
    bdcomment += `</table>`;

    if(req.session.loggedin){
      bdcomment += `
        <div class="form-group">
        <form action="/comunity/read/comment_process" method="post">
        <textarea class="form-control" onkeydown="resize(this)" onkeyup="resize(this)" placeholder="댓글 작성" name="comment" id="board_textarea"></textarea>
        <p id="board_button">
          <input type="hidden" name="location" value="${sanitize(location)}">
          <button class="btn btn-link" id="board_comment_button">작성</button>
        <p>
        </form></div>
        <script>
        function resize(obj) {
          obj.style.height = "1px";
          obj.style.height = (12+obj.scrollHeight)+"px";
        }
        </script>
      ` //로그인 되어있으면 댓글작성 가능하게
    }
  return bdcomment +=`</div>`;


},MYPAGEPW_CHECK:function(){
   return `<div id="mypage_pwcheck">
          <div>
          비밀번호를 입력해주세요.
          </div>
          <form action = "/auth/mypage_process" method="post">
          <p><span>
          <input type="password" name="password" placeholder="PASSWORD">
          </span></p>
          <p>
          <button type="submit" name="loginsubmit">입력</button>
          </p>
          </form>
        </div>  `
},MYPAGE_CHANGE:function(){
  return `<div id="mypage_pwcheck">
            <div>
            변경할 비밀번호를 입력해주세요.
            </div>
            <form action = "/auth/pwchange_process" method="post">
            <p><span>
            <input type="password" name="mypage_pw" placeholder="비밀번호">
            </span></p>
            <p><span>
            <input type="password" name="mypage_pw2" placeholder="비밀번호 확인">
            </span></p>
            <p>
            <button type="submit" name="loginsubmit">변경</button>
            </p>
            </form>
            </div>`
  }
}
