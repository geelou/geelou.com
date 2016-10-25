$(function () {
    var title = $('.menu').attr('title');
    var tb = $('.banner').height();
    var mh = $('.menu').height()

    $(".menu-list li").click(function () {
        var index = $(this).index() + 1;
        var _class = '.' + 'item_' + index;
        $(this).addClass('foc').siblings().removeClass('foc')
        //console.log(_class);
        $("html,body").stop(true).animate({scrollTop: $(_class).offset().top - mh}, 500);
    });

    $(window).scroll(function () {
        t = $(document).scrollTop();
        if (t > tb) {
            $('.content').css('padding-top', mh);
            $('.menu').css({'position': 'fixed', 'top': '0'});
        } else {
            $('.content').css('padding-top', 0);
            $('.menu').css({'position': 'relative'});
        }
    });
});