module.exports = {
    PAGING:function(req, result){
        
        var page = req.params.page;
        var countList = 10;
        var countPage = 10;
        var totalCount = result.length;
        var totalPage = Math.floor(totalCount / countList);
        var lastPage = Math.floor(totalCount / countList);

        if (totalCount % countList > 0) {
            totalPage++;
        }

        if (totalCount % countList > 0) {
            lastPage++;
        }

        if (totalPage < page) {
            page = totalPage;//5
        }

        var startPage = (Math.floor((page - 1) / 10)) * 10 + 1; //start 1
        var endPage = startPage + countPage - 1; //end 10
        var a ='<div class = "container"><ul class="pagination justify-content-center"';
        if (endPage > totalPage) { //10>5
            endPage = totalPage; //5
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

        if (endPage < totalPage) { //5<5
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
        var a ='<div class = "container"><ul class="pagination justify-content-center">';
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
