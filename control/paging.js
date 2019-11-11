module.exports = {
    PAGING:function(req, result){
        
        var page = req.params.page;
        var countList = 10; // 한 페이지당 보여질 게시판 수 
        var countPage = 10; // 1~10페이지, 11~20페이지 처럼 페이지단위를 10으로 설정 
        var totalCount = result.length;
        var totalPage = Math.floor(totalCount / countList);
        var lastPage = Math.floor(totalCount / countList);
        if (totalCount % countList > 0) {
            totalPage++;  // 소숫점은 생략 되기 때문에 총 페이지를 1증가시켜서 모든 목록보이게 설정
        }
        if (totalCount % countList > 0) {
            lastPage++;  // 위와 같음, 끝 버튼을 위한 변수
        }
        if (totalPage < page) {
            page = totalPage; // 현재page를 totalpage보다 높을 경우 totalpage를 현재페이지로 만듬
        }
        var startPage = (Math.floor((page - 1) / 10)) * 10 + 1; //start page를 1, 11, 21등으로 설정
        var endPage = startPage + countPage - 1; //end page 설정
        var a ='<div class = "container"><ul class="pagination justify-content-center"';
        if (endPage > totalPage) { 
            endPage = totalPage; // totalpage=5인데 endpage=10일경우 endpage를 5로설정
        }
        if (startPage > 1) {
            a +=  `<li class="paging-item"><a class="page-link" href="/comunity/1">처음</a></li>`;
        }
        if (page > 1) {
            a += `<li class="paging-item"><a class="page-link" href="/comunity/${page - 1}">이전</a></li>`;
        }  
            for (var i= startPage; i <= endPage; i++){
                if (i == page){
                      a += `<li class="paging-item"><a class="page-link">${i}</a></li>`; 
                    } else {
                       a += `<li class="paging-item"><a class="page-link" href="/comunity/${i}">${i}</a></li>`;
            }
        }
        if (page < totalPage) {
            a += `<li class="paging-item"><a class="page-link" href="/comunity/${++page}">다음</a></li>`;
        }
        if (endPage < totalPage) { 
           a += `<li class="paging-item"><a class="page-link" href="/comunity/${lastPage}">끝</a></li>`;
        }
        return a += '</ul></div>';
            },
    COMMENT_PAGING:function(req, result){
        
        var page = req.query.id;
        var location = req.params.page;
        var countList = 5;
        var countPage = 10;
        var totalCount = result.length; //13개
        var totalPage = Math.floor(totalCount / countList); //2.xx
        var lastPage = Math.floor(totalCount / countList); // 2.xx
        if (totalCount % countList > 0) {
            totalPage++; //3
        }
        if (totalCount % countList > 0) {
            lastPage++; //3
        }
        if (totalPage < page) {
                page = totalPage; //3
                }
        var startPage = (Math.floor((page - 1) / 10)) * 10 + 1; //start 1
        var endPage = startPage + countPage - 1; //end 10
        var a ='<div class = "container" id="comment-paging-margin"><ul class="pagination justify-content-center">';
        if (endPage > totalPage) { //10>3
            endPage = totalPage; //end = 3
        }
        if (startPage > 1) {
            a +=  `<li class="paging-item"><a class="page-link" href="/comunity/read/${location}?id=1">처음</a></li>`;
        }
        if (page > 1) {
            a += `<li class="paging-item"><a class="page-link" href="/comunity/read/${location}?id=${page - 1}">이전</a></li>`;
        }  // i=1 i<=3 i++
            for (var i= startPage; i <= endPage; i++){
                if (i == page){
                    a += `<li class="paging-item"><a class="page-link">${i}</a></li>`; 
                } else {
                    a += `<li class="paging-item"><a class="page-link" href="/comunity/read/${location}?id=${i}">${i}</a></li>`;
                }
            }
         //1 < 3
        if (page < totalPage) {
            a += `<li class="paging-item"><a class="page-link" href="/comunity/read/${location}?id=${++page}">다음</a></li>`;
        }
            //3<3
        if (endPage < totalPage) { //5<5
            a += `<li class="paging-item"><a class="page-link" href="/comunity/read/${location}?id=${lastPage}">끝</a></li>`;
        }
        if(result.length === 0){
            a = `</ul></div>`;
        }
            return a;
        }
            
}
