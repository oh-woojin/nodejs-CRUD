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
      <meta charset="utf-16">
      <title>${title}</title>
    </head>
      <body>
          <nav class="navbar navbar-expand-sm sticky-top">
          <div class="navbar-collapse collapse  order-1 order-md-0 dual-collapse2" id="menu1">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item leftmenu" id="nav-leftmenu"><a class="nav-link" id="hover-menu" href="/worklist">WorkList</a></li>
              <li class="nav-item"><a class="nav-link" id="hover-menu" href="/comunity/">Comunity</a></li>
            </ul>
          </div>
          <div class="mx-autor">
          <a class="navbar-brand" href="/"><img src="DWRN.png" id="logo-size" alt="Logo"></a>
          </div>
           <button class="navbar-toggler bg-dark navbar-dark" type="button" data-toggle="collapse" data-target="#menu1">
           <span class="navbar-toggler-icon"></span>
           </button>
          <div class="navbar-collapse collapse  order-3 dual-collapse2" id="menu1">
            <ul class="navbar-nav ml-auto">
            ${authStatusUI}
            </ul>
          </div>
            </nav>
            <div id="body">
              ${body}
            </div>
          </body>
        </html>
    `;
}, HOME:function(){
  return `<div class="container-fluid">
            <div class="row">
              <div class="col-12 px-0">
                    <div id="demo" class="carousel slide" data-ride="carousel">

                    <!-- Indicators -->
                    <ul class="carousel-indicators">
                    <li data-target="#demo" data-slide-to="0" class="active"></li>
                    <li data-target="#demo" data-slide-to="1"></li>
                    <li data-target="#demo" data-slide-to="2"></li>
                    </ul>
                    
                    <!-- The slideshow -->
                    <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img class="img-fluid" src="back1.jpg">
                        <div class="carousel-caption">
                        <h1>WELCOME TO DWRN!</h1>
                        <h3>This website can write your to do list</h3>
                      </div> 
                    </div>
                    <div class="carousel-item">
                        <img class="img-fluid" src="back2.jpg">
                        <div class="carousel-caption">
                        <h1>WRITE YOUR TO DO LIST!</h1>
                        <h3><a class="nav-link" id="hover-menu" href="/worklist">☞ write list ☜</a></h3>
                      </div>   
                    </div>
                    <div class="carousel-item">
                        <img class="img-fluid" src="back3.jpg">
                        <div class="carousel-caption">
                        <h2>COMUNICATION CAN HELP YOUR STUDY!</h2>
                        <h3><a class="nav-link" id="hover-menu" href="/comunity">☞ Go comunity ☜</a></h3>
                      </div>   
                    </div>
                    </div>
                    
                    <!-- Left and right controls -->
                    <a class="carousel-control-prev" href="#demo" data-slide="prev">
                    <span class="carousel-control-prev-icon"></span>
                    </a>
                    <a class="carousel-control-next" href="#demo" data-slide="next">
                    <span class="carousel-control-next-icon"></span>
                    </a>
                </div>


              </div>
            </div>  
          </div>`
},
LOGIN:function(){
  return` <div class="login-centerd">
  <div class="container" id="login-container">
  <form class="login-form" action="/auth/login_process" method="post">
      <h1>로그인</h1>
      <p>아이디 패스워드 입력후 로그인 버튼을 눌러주세요.</p>
      <hr>
          <input class="input-login" type="text" placeholder="UserID" name="idname" required>
  
        <input class="input-login" type="password" placeholder="Password" name="password" required>
  
        <button class="login-button"type="submit">Login</button>
  </form>
    </div>
    </div>`;
},JOIN:function(year, month, day, b){
  return `
  <div class="container" id="join-container">
   	 <div class="join-centerd">
		<form class="join-form" action="/auth/join_process" method="post">
          <h1>회원가입</h1>
          <p>아래 입력칸을 입력하고 회원가입을 클릭하세요.</p>
          <hr>

          <input class="input-join" type="text" placeholder="UserID" name="join_id" required>

          <input class="input-join" type="password" placeholder="Password" name="join_pw" required>

          <input class="input-join" type="password" placeholder="Repeat Password" name="join_pw2" required>

          <input class="input-join" type = "text" name = "join_name" placeholder = "Name">

          <input class="input-join" type = "text" name = "join_phone" placeholder = "Phone (Insert Only number)">

          <input class="input-join" type = "email" name = "join_email" placeholder = "Email">

          <p class="join-birth-margin"><b>생년월일</b></p>
 					<select class="join-birth" name = "join_year">${year}
          </select>
          <select class="join-birth" name = "join_month">${month}
          </select>
          <select class="join-birth" name = "join_day">${day}
          </select>
            <button type="submit" class="join-btn">회원가입</button>
	</form>
   </div>
 </div>
  `    
},
WORKLI:function(results){
          var i = 0;
          var text = '<div class="container"> <p> <a href = "/worklist/worklist_create" id = "List_create">create<a></p><p>';
          if(results.length === 0){
            text += '<h1 class="noworklist">목록이 없습니다.</h1>'
          }else{
          while(i < sanitize(results.length)){
              text += `<div><button type="button" class="btn btn-link" data-toggle="modal" data-target="#myModal${i}" id="work_button_color">${sanitize(results[i].title)}</button>
              <form action = "/worklist/delete_process" method="post" id="work_align">
              <input type="submit" id="Delete_work" onclick="return confirm('삭제하겠습니까?')" value="X"><input type="hidden"  name="title" value="${sanitize(results[i].title)}"></p></form></div>
               
              <div class="modal fade" id="myModal${i}">
                <div class="modal-dialog  modal-lg modal-dialog-centered modal-dialog-scrollable">
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
          var data = result[i];                 //내림차순으로 최신 글목록부터 보이게함
        comunity_list += `<tr><td id="tablenum">${listlength-(i-1)}</td><td id="tabletitle"><a href="/comunity/read/${data.num}?id=1">${sanitize(result[i].title)}</a></td><td id="tableview">${sanitize(result[i].hit)}</td><td id="tabledate">${sanitize(result[i].regdate)}</td><td id="tableauthor">${sanitize(result[i].name)}</td></tr>`
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
BOARD_VIEW:function(result, control){
  return `
  <div class="container">
  <table class="table">
  <thead>
    <tr>
      <th id="board_title">${sanitize(result[0].title)}</th>
      <th id="board_right">${sanitize(result[0].regdate)}</th>
      <th id="board_right">조회수 ${sanitize(result[0].hit)}</th>
      <th id="board_right_name">${sanitize(result[0].name)}</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="4" id="board_content"><pre>${sanitize(result[0].content)}</pre></td>
    </tr>
  </tbody>
</table>
</div>
${control}
  `
},
BOARD_UPDATE:function(title, content, num){
  return `
  <form action="/comunity/read/update_process" method="post">
  <div class="container">
    <div class="form-group">
      <input type="text" class="form-control" id="board-create-title" name="title" value="${sanitize(title)}">
      <input type="hidden" name="num" value="${sanitize(num)}">
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
  var bdcomment = `<div class="container" id="comment-margin"><p id=comment_title>댓글</p><table class="table" id="board_comment_bottom">`
  var i = 0;
  var listlength = (comment.length-1);
  if(comment.length === 0){
     bdcomment = `<div class="container"><p id=comment_title>댓글없음</p>`;
     if(req.session.loggedin){
      bdcomment = `<div class="container"><p id=comment_title>댓글없음</p>`;
     }
  }
  for(var i=(page*countList)-countList; i<(page*countList); i++) //댓글 목록 가져오기
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
            <tr><td colspan ="2" id="board_comment_content">${sanitize(data.content)}</td></tr>` 
            //권한 있는 사용자일경우 댓글 삭제 활성화
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
   return `
   <div class="mypage-centerd">
   <div class="container" id="mypage-container">
   <form class="mypage-form" action="/auth/mypage_process" method="post">
       <h1>마이페이지</h1>
       <p>비밀번호를 입력해주세요.</p>
       <hr>
       
         <input class="input-mypage" type="password" placeholder="Password" name="password" required>
   
         <button class="mypage-button"type="submit">Login</button>
   </form>
     </div>
     </div> `
},MYPAGE_CHANGE:function(){
  return `
        <div class="mypage-centerd">
        <div class="container" id="mypage-container">
        <form class="mypage-form" action="/auth/pwchange_process" method="post">
            <h1>마이페이지</h1>
            <p>변경할 비밀번호를 입력해주세요.</p>
            <hr>
            <input class="input-mypage" type="password" placeholder="Password" name="mypage_pw">
            <input class="input-mypage" type="password" placeholder="Repeat Password" name="mypage_pw2">
            <button class="mypage-button"type="submit">변경</button>
        </form>
          </div>
          </div> `
}
}
