var sanitize = require('sanitize-html');
// sanitize 적용완료

module.exports = {
    IsOwner: function(req, res){
        if (req.session.loggedin){
          return true;
        }else{
          return false;
        }
      },
    StatusUI: function(req, res){
        var authStatusUI = `
        <li class="nav-item"><a class="nav-link" href="/auth/login">로그인</a></li>
        <li class="nav-item"><a class="nav-link" href="/auth/join">회원가입</a></li>`
        if(this.IsOwner(req, res)){
          authStatusUI = `<span class="navbar-text" id="username">${sanitize(req.session.name)}님 </span>
            <li class="nav-item"><a class="nav-link" href="/auth/logout">로그아웃</a></li>
            <li class="nav-item"><a class="nav-link" href="/auth/mypage">마이페이지</a></li>`
        }
        return authStatusUI;
      },
    ComunityUI: function(req, title, content){
        return`
            <div align="right" class="container">
            <form action="/comunity/read/update" method="post" class="comunity_inline">
                <input type="hidden" name="title" value="${sanitize(title)}">
                <input type="hidden" name="content" value="${sanitize(content)}">
                <input type="hidden" name="pin" value="${sanitize(req.params.page)}">
                <button type="submit" class="btn btn-link" id="comunity_btn_update_link">수정</button>
            </form>
            <form action="/comunity/read/delete" method="post" class="comunity_inline">
                <input type="hidden" name="title" value="${sanitize(title)}">
                <input type="hidden" name="content" value="${sanitize(content)}">
                <input type="hidden" name="pin" value="${sanitize(req.params.page)}">
                <button type="submit" class="btn btn-link" id="comunity_btn_delete_link"  onclick="return confirm('삭제하겠습니까?')">삭제</button>
            </form>
            </div>`; //권한있는 사용자일경우 게시판 글 수정 삭제 가능기능
          },
  }
