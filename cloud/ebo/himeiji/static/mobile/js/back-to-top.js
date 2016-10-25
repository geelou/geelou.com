function scrollToTop(time){
	if(!time){
		time = 500;
	}
	$("body,html").animate({scrollTop: 0}, time);
}

$(function(){
	/* */
    $(window).scroll(function(){
        var scrollTop = $(window).scrollTop();
        var headerHeight = $(".headerpt .header").height();
        var expressHeight = $(".index-banner").height() + $(".shopping-nav").height();

        /*
        //顶部固定导航栏
        if(scrollTop < headerHeight/2){
            $(".headerpt .header").css("background","rgba(255, 85, 85, 0)");
        }else if((scrollTop > headerHeight) && (scrollTop < expressHeight)){
            $(".headerpt .header").css("background","rgba(255, 85, 85, 1)");
        }else if(scrollTop > expressHeight){
            $(".headerpt .header .header-nav-1").hide();
            $(".headerpt .header .header-nav-2").fadeIn();
        };
        if(scrollTop < expressHeight){
            $(".headerpt .header .header-nav-1").fadeIn();
            $(".headerpt .header .header-nav-2").hide();
        };
		*/
        
        //回到顶部按钮
        if (scrollTop > headerHeight){
            $(".back-top").fadeIn(300);
        }else{
            $(".back-top").fadeOut(300);
        };
    });
	
    //回到顶部
    $(".back-top").click(function(){
    	scrollToTop();
        return false;
    });
});