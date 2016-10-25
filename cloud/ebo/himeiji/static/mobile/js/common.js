
var APIDOMAIN_LIST = {
	"server":	"http://api.himeiji.com/",
	"server_a":	"http://api.himeiji.net/",
	"dev":	"http://dev.himeiji.com/",
	"liqiang":"http://192.168.0.222/himeiji/index.php/",
	"liqiang_223":"http://192.168.0.223/himeiji/index.php/",
	"xiaolei":"http://192.168.0.246/himeiji/index.php/",
	"xiaolei_home":"http://192.168.1.101/himeiji/index.php/",
	"qihong":"http://192.168.0.210/himeiji/index.php/"
};

var DOMAIN_LIST = {
		"server":	"http://www.himeiji.com/index.php/",
		"server_a":	"http://m.himeiji.net/",
		"dev":	"http://dev.himeiji.com/",
		"liqiang":"http://192.168.0.222/himeiji/index.php/",
		"liqiang_223":"http://192.168.0.223/himeiji/index.php/",
		"xiaolei":"http://192.168.0.246/himeiji/index.php/",
		"xiaolei_home":"http://192.168.1.101/himeiji/index.php/",
		"qihong":"http://192.168.0.210/himeiji/index.php/"
};

var BASE_DOMAIN_LIST = {
		"server":	".himeiji.com",
		"server_a":	".himeiji.net",
		"dev":	".himeiji.com",
		"liqiang":"",
		"liqiang_223":"",
		"xiaolei":"",
		"xiaolei_home":"",
		"qihong":""
};

if(typeof LIST_KEY == "undefined"){
	LIST_KEY = "server";
	LIST_KEY = "xiaolei";
	//LIST_KEY = "xiaolei_home";
	//LIST_KEY = "liqiang";
	//LIST_KEY = "qihong";
	//LIST_KEY = "dev";
	//LIST_KEY = "server_a";
}

var APIDOMAIN = APIDOMAIN_LIST[LIST_KEY];
var DOMAIN = DOMAIN_LIST[LIST_KEY];
var BASE_DOMAIN = BASE_DOMAIN_LIST[LIST_KEY]

var DOWNLOAD_URL = 'http://dwz.cn/himeiji';
var VERSION = '2.6';

//是否是debug模式
var IS_DEBUG=true;
//是否显示debug的Layer
var IS_SHOW_DEBUG_LAYER= false;

var is_show_update_layer=false;

function setVersion(ver){
	if(ver){
		VERSION = ver;
		localStorage.setItem('version',VERSION);
	}
}

function getVersion(){
	var ver = localStorage.getItem('version');
	if(!ver){
		if($.isApp()){
			ver = '2.2';
		}else{
			ver = VERSION;
		}
	}
	return ver;
}

$.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
};

/**
 * 判断对象是否是json
 * @param obj
 * @returns
 */
function isJson(obj){
	var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length; 
	return isjson;
}

$.hmjpost = function(url,data,fun,errfun){
    if(!fun){
        fun = data;
        data = "";
    }
    
    if(url.indexOf("?")>0){
    	url = url + "&origin=" + getOrigin();
    }else{
    	url = url + "?origin=" + getOrigin();
    }
    url += "&v="+getVersion();
    
    var imei = localStorage.getItem('cookie_imei');
    if(imei){
    	url = url + "&imei="+imei;
    }
    
    var token = getToken();
    if(token){
    	if(data){ // 如果有post数据
    		if(isJson(data)){ // 如果是json格式的数据
    			data['token']=token;
    		}else{
    			data += '&token='+token;
    		}
    	}else{
    		data = 'token='+token;
    	}
    }
    
    $.ajax({
        type: 'POST',
        url:APIDOMAIN+"api/"+url + "",
        data: data ,
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        success: fun,
        error : function(){
        	alert_layer("数据加载错误");
        	if(errfun){
        		errfun();
        	}
        }
    });
//    $.post(APIHOST+url,data,fun);
};

/**
 * 统计数据
 */
$.hmjstats = function(type,parse){
	if(!parse){
		parse = {};
	}
	parse.type = type;
	parse.origin = getOrigin();
	parse.v = getVersion();
	var imei = localStorage.getItem('cookie_imei');
	if(!imei){
		imei = $.cookie('cookie_imei');
	}
	
    if(imei){
    	parse.imei = imei;
    }
    
	var postData = 'data='+JSON.stringify(parse);
    $.ajax({
        type: 'POST',
        url:APIDOMAIN+"api/stats/log",
        data: postData ,
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        success: function(){
        	
        },
        error : function(){
        	
        }
    });
};

$.hmjstats1 = function(type){
	var parse = {};
	var len = arguments.length;
	if(len>1){ parse.f1 = arguments[1];}
	if(len>2){ parse.f2 = arguments[2];}
	if(len>3){ parse.f3 = arguments[3];}
	if(len>4){ parse.f4 = arguments[4];}
	if(len>5){ parse.f5 = arguments[5];}
	if(len>6){ parse.f6 = arguments[6];}
	$.hmjstats(type,parse);
}

function getOrigin(){
	var origin = localStorage.getItem('device_origin');
	if(!origin){
		if($.isAndroidApp()){
			origin = 'android';
		}else if($.isIphoneApp()){
			origin = 'ios';
		}else if(is_weixin()){
			origin = 'wx';
		}else{
			origin = 'pc';
		}
		localStorage.setItem('device_origin',origin);
	}
	return origin;
}

$.change_footer = function(cate){
    $_cate = $('.i-nav-'+cate);
    if($_cate.length){
        $_cate.parent().addClass('on');
    }
};

/** 判断当前是否在android app里面 */
$.isAndroidApp=function(){
	if(typeof webControl != "undefined"){
		return true;
	}
	
	return false;
}

$.getAndroidVersion=function(){
	if($.isAndroidApp() && webControl.getAndroidVersion){
		return webControl.getAndroidVersion();
		//var ver = webControl.getAndroidVersion();
		//alert(ver);
		//return ver;
	}
	return 22;
}

/** 判断当前是否在iphone app里面 */
$.isIphoneApp=function(){
	if(typeof $.cookie != "undefined"){
		if( $.cookie("IOSAPP") > 0 || (typeof hmjjump != "undefined")){
			//layer.open({content:'2222', time: 2});
			return true;
		}
	}
	//layer.open({content:'3333', time: 2});
	//if(typeof hmjjump != "undefined"){
		//alert('是ios app哦');
	//	return true;
	//}
	
	return false;
}


//IOSAPP 1
function setPlatform (key,value){
	$.cookie(key, value, $.getCookieDomain());
	
	//var values = $.cookie("token");
	//layer.open({content:'token222s='+values, time: 10});
}

/**
 * 是否在APP里面
 */
$.isApp=function(){
	return ($.isIphoneApp() || $.isAndroidApp() );
}

$.isPC=function(){
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            return false;
            break;
        }
    }
    return true;
}

/**
 * 设置在app里面触发OnResume时重新reload页面
 */
$.setAppOnResumeReload=function(){
	if($.isAndroidApp()){
		webControl.setOnResumeReload();
	}else if($.isIphoneApp()){
		
	}
}

/**
 * 是否在APP里面
 */
$.downloadUrl=function(){
	 $.hmjstats1(1027,1);
	 window.location.href = DOWNLOAD_URL;
}

/**
 * 加减框
 * @param {type} inc_fun 加按钮回调
 * @param {type} dec_fun 减按钮回调
 * @param {type} is_zero 是否可以减到0
 * @returns {undefined}
 */
$.inc_dec_box = function(inc_fun,dec_fun,is_zero){
    $(".inc-btn") && $(".inc-btn").on("click",function(e){
        $result_text = $(this).siblings(".result-text");
        var _result = parseInt($result_text.html()) + 1;
        if(inc_fun){
            if(inc_fun(_result,e.target)){
                $result_text.html(_result);
            }
        }else{
            $result_text.html(_result);
        }
    });
    $(".dec-btn") && $(".dec-btn").on("click",function(e){
        $result_text = $(this).siblings(".result-text");
        var _result = parseInt($result_text.html()) - 1;
        if(_result > 0 || (is_zero && _result >= 0)){
            if(dec_fun){
                if(dec_fun(_result,e.target)){
                    $result_text.html(_result);
                }
            }else{
                $result_text.html(_result);
            }
        }
    });
}

/**
 * 获取本地缓存中购物车商品数量
 */
$.getCartnum = function(){
	return parseInt(localStorage.getItem('cartnum') ? localStorage.getItem('cartnum') : 0);
}

/**
 * 保存 购物车数量
 * @param {type} param1 数量
 * @param {type} param2 操作
 */
$.setCartnum = function(count,option)
{
	
    if(option){
        var _count = parseInt(localStorage.getItem('cartnum') ? localStorage.getItem('cartnum') : 0);
        switch(option){
            case 'dec':
            	localStorage.setItem('cartnum',_count - count>0?_count - count:0);
                break;
            case 'inc':
            	localStorage.setItem('cartnum',_count + count);
                break;
        }
    }else{
    	if(count<0){
    		count=0;
    	}
        localStorage.setItem('cartnum',count);
    }
}

$.getCookieDomain = function(){
	var cookieDomain ={  path: '/' };
	if(BASE_DOMAIN && DOMAIN.indexOf(BASE_DOMAIN)>0){
		cookieDomain.domain=BASE_DOMAIN;
	}
	return cookieDomain;
}

$.is_login = function(){
	return /token=\w+;?/.test(document.cookie);
}

$.getLoginUrl=function(params){
	var url = DOMAIN+"mobile/user/login";
	if(params){
		url += "/"+params;
	}
	return url;
}

$.jump_login = function(params){
	window.location.href = $.getLoginUrl(params);
};

$.setHerfUrlChechLogin = function(herfId,url){
	if(!$.is_login()){
		$("#"+herfId).attr('href',$.getLoginUrl());
	}else{
		if(url){
			$("#"+herfId).attr('href',url);
		}
	}
}

/**
 * 跳转url，需要检查是否登录，如果没有登录的话跳转到登录页面
 */
$.jumpUrlChechLogin = function(url){
	if($.is_login()){
		window.location.href = url;
	}else{
		$.jump_login();
	}
}

$.is_wx_browser = function(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
            return true;
    } else {
            return false;
    }
}

/** 返回上一页 */
$.goBack = function(){
	if($.isAndroidApp()){ // 如果是 android app
		webControl.goBack();
	}else if($.isIphoneApp()){
		window.location.href ="hmj://close_win";
	}else if($.is_wx_browser()){
		alert_debug_layer('window.history.length:'+window.history.length);
		if(window.history.length>1){ // 如果还能后退
			window.history.back();
		}else{
			//alert_debug_layer('返回首页');
			gotoIndex();
		}
	}else{
		alert_debug_layer('window.history.length:'+window.history.length);
		if(window.history.length>1){ // 如果还能后退
			window.history.go(-1);
		}else{
			//alert_debug_layer('返回首页');
			gotoIndex();
		}
	}
}

//后退
$(".back-arrow") && $(".back-arrow").on("click",function(){
	if(typeof pageGoBack != "undefined") {
		var isBreak = pageGoBack();
		if(isBreak){
			return;
		}
	}
	
	if($(".back-arrow").attr("clickCount")){
		gotoIndex();
		return;
	}else{
		$(".back-arrow").attr("clickCount",'1');
	}
	
	//alert('点击了后退');
	$.goBack();
});

//通用跳转
$("body").on("click",".adclick",function(){
	
	
    switch(parseInt(this.dataset.adclicktype)){
        //商品详情
        case 0:
        	$.hmjstats(1019,{f1:this.dataset.board_id,f2:this.dataset.adclicktype,f3:this.dataset.index,f4:this.dataset.productid,f5:this.dataset.id});
            window.location.href = DOMAIN+"?g=mobile&m=item&a=detail&from2=h5&id="+this.dataset.productid;
            break;
        case 1:
        	$.hmjstats(1019,{f1:this.dataset.board_id,f2:this.dataset.adclicktype,f3:this.dataset.index,f4:this.dataset.cateid,f5:this.dataset.id});
            window.location.href = DOMAIN+"?g=mobile&m=item&a=lists&from2=h5&cate_id="+this.dataset.cateid;
            break;
        case 2:
        	$.hmjstats(1019,{f1:this.dataset.board_id,f2:this.dataset.adclicktype,f3:this.dataset.index,f4:this.dataset.keywords,f5:this.dataset.id});
            window.location.href = DOMAIN+"?g=mobile&m=item&a=lists&from2=h5&keywords="+this.dataset.keywords;
            break;
        case 3:
        	{
	        	$.hmjstats(1019,{f1:this.dataset.board_id,f2:this.dataset.adclicktype,f3:this.dataset.index,f4:encodeURIComponent(this.dataset.html),f5:this.dataset.id});
	            window.location.href = this.dataset.html;
        	}
            break;
        case 4:
        	$.hmjstats(1019,{f1:this.dataset.board_id,f2:this.dataset.adclicktype,f3:this.dataset.index,f4:this.dataset.activityid,f5:this.dataset.id});
            window.location.href = DOMAIN+"?g=mobile&m=activity&a=index&from2=h5&id="+this.dataset.activityid;
            break;
        case 8:
        	$.hmjstats(1019,{f1:this.dataset.board_id,f2:this.dataset.adclicktype,f3:this.dataset.index,f4:this.dataset.brand_id,f5:this.dataset.id});
            window.location.href = DOMAIN+"?g=mobile&m=brand&a=detail&from2=h5&id="+this.dataset.brand_id;
            break;
    }
    
    
});


//打开商品页面
open_product = function(productid){
	window.location.href = DOMAIN+"?g=mobile&m=item&a=detail&from2=h5&id="+productid;
};

//通用加入购物车
 $("body").on("click",".common_add_to_cart",function(){
    if(typeof this.dataset.id != "undefined"){
        if(!$.is_login()){
        	confirm_layer("您还未登录，确定要登录吗?",function(){
        		layer.closeAll();
        		$.jump_login();
        	});
        	return;
        }
        var item_id = this.dataset.id;
        
        var data = 'data={"items":[{"item_id":"'+item_id+'","num":"1"}]}';
        $.hmjpost("cart/add_new",data,function(res){
            res.status = parseInt(res.status);
            if(res.status){
                var _count = parseInt($(".m-cart-count").html());
                if(res.data.cart_num){
                	$.setCartnum(res.data.cart_num);
                }else{
                	$.setCartnum(1,'inc');
                }
                
                layer.open({content: '已成功加入到购物车', time: 1});
                
                
            }else{
            	alert_layer(res.result);
            }
        });
    }
});

//webview 跳转 native
function hmj_jump(type){
    if(typeof webControl != "undefined"){
        webControl.hmjjump(type); //android
    }else if($.isIphoneApp()){
        hmjjump(type); //ios
    }else{
        //老版本
        switch(type){
            case "index":
                window.location.href = DOMAIN;
                break;
            case "login":
                window.location.href = APIDOMAIN+"mobile/user/login";
                break;
            case "user":
                window.location.href = APIDOMAIN +"mobilie/user";
                break;
            case "register":
                window.location.href = APIDOMAIN +"mobilie/user/register";
                break;
        }
    }
    return false;
}

function alert_debug_layer(content){
	if(!IS_SHOW_DEBUG_LAYER){
		return;
	}
	alert_layer(content);
}

function tips_layer(content,times,finishFun){
	var parseData = {
		    content: '<h1>'+content+'</h1>',
		    style: 'width:80%;'
		};
	
	if(finishFun){
		parseData.end = finishFun;
	}
	if(times){
		parseData.time=times;
	}
	if(typeof layer != "undefined"){
		layer.open(parseData);
	}
}

//消息提示
function alert_layer(content,yes_fun){
	var parseData = {
		    content: '<h1>'+content+'</h1>',
		    style: 'width:80%;',
		    btn: ['确定']
		};
	
	if(yes_fun){
		parseData.yes = yes_fun;
	}
	if(typeof layer != "undefined"){
		layer.open(parseData);
	}
}

//询问
function confirm_layer(content,yes_fun,okTitle,cancelTitle){
	if(!okTitle){ okTitle = '确认'; }
	if(!cancelTitle){ cancelTitle = '取消'; }
	if(typeof layer != "undefined"){
		layer.open({
		    content: '<h1>'+content+'</h1>',
		    style: 'width:80%;',
		    btn: [okTitle,cancelTitle],
		    shadeClose: false,
		    yes: yes_fun, 
		    no: function(){
		    }
		});
	}
}

/** 需要在新页面打开的链接 */
var openWindowUrls = 'm=user&a=login;user/login;m=item&a=lists;item/lists;m=item&a=detail;item/detail;m=order&a=preview;order/preview;m=order&a=lists;order/lists;m=activity&a=rush_item_list;activity/rush_item_list;m=index&a=search;index/search;m=credit&a=fund;credit/fund;m=user&a=coupons;user/coupons;m=user_partner&a=plan;user_partner/plan;m=user&a=dateuser;user/dateuser;m=user_partner&a=quanzi;user_partner/quanzi;m=user&a=setting;user/setting;m=brand&a=detail;brand/detail;m=brand&a=chars;brand/chars;m=activity&a=index;activity/index;m=pt_item&a=index;pt_item/index;m=sale_item&a=index;sale_item/index;m=optional&a=index;optional/index;m=sale_topic&a=off_index;sale_topic/off_index;m=sale_topic&a=gift_index;sale_topic/gift_index;m=dd_coupons&a=index;dd_coupons/index;m=user&a=dd_coupons;user/dd_coupons;m=dd_coupons&a=advertisement;dd_coupons/advertisement;m=turntable&a=index;turntable/index;m=sale_topic&a=save_index;sale_topic/save_index;m=topic&a=index;topic/index;m=dd_coupons&a=share_receive_coupon;dd_coupons/share_receive_coupon';
var needReloadUrls = 'm=shopcart&a=index;shopcart/index;m=user&a=index;user/index;m=turntable&a=index;turntable/index';

$(document).ready(function(){
	if($.isApp()){
		if($.isAndroidApp()){
			if(!window.initAndroidApp && webControl.setOpenWindowUrls){
				webControl.setOpenWindowUrls(openWindowUrls);
				if(webControl.setNeedReloadUrls){
					webControl.setNeedReloadUrls(needReloadUrls);
				}
				window.initAndroidApp=true;
			}
		}
	}
});

/**
 * 跳转
 */
to_item_href = function(url,id){
	window.location.href = url;
};

/**
 * 打开首页
 */
function gotoIndex(){
	if($.isApp()){
		$.goBack();
	}else{
		window.location.href = DOMAIN +"?g=mobile";
	}
}

/**
 * 在指定className的div里面执行倒计时
 * className:要执行倒计时的className
 * type 时间格式类型 1 unix时间戳（10位）
 */
$.startDjs = function(className,type){
	var endTimeYear,endTimeMonth,endTimeDay,endTimeHour,endTimeMinute,endTimeSecond;
	if(!type){
		type = 1;
	}
	$("."+className).each(function(index){
		if(type == 1){
			if(!this.dataset || !this.dataset.djs || this.dataset.djs == '0'){
				return;
			}
			if(isNaN(this.dataset.djs) || parseInt(this.dataset.djs)<=0){
				return;
			}
			var now=new Date(); // 当前时间
			var date = new Date(parseInt(this.dataset.djs)*1000);
			
			if(date.getTime()<now.getTime()){ // 如果已过期
				console.log('时间'+this.dataset.djs+'已过期');
				return;
			}
			endTimeYear = date.getFullYear();
	        endTimeMonth =  (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) ;
	        endTimeDay = date.getDate();
	        endTimeHour = date.getHours();
	        endTimeMinute = date.getMinutes();
	        endTimeSecond = date.getSeconds();
		}
		
		var is_show_day = false;
		if(this.dataset.is_show_day && this.dataset.is_show_day=='true' || this.dataset.is_show_day=='1'){
			is_show_day=true;
		}
		
        $(this).downCount({
            date: endTimeMonth + '/' + endTimeDay + '/' + endTimeYear + ' ' + endTimeHour + ':' + endTimeMinute + ':' + endTimeSecond,
            offset: +8,//时区
            is_show_day:is_show_day
        }, function () {
        	
        });
	});
};

/**
 * 分享数据
 * @param pid  分享id
 * @param type 分享类型 分享产品 type = "item" 其他 type = ""
 */
function shareProduct(pid, type) {
	if ($.isIphoneApp()) {
		window.location.href = "hmj://share_product/" + pid;
	} else if ($.isAndroidApp()) {
		window.location.href = "hmj://share_product/" + pid;
	} else if (is_weixin()) {
		data = 'data={"type":"' + type + '","id":"' + pid + '"}';
		$.hmjpost('share/index', data, function(result) {
			WeiXinApi.shareWeixin(result.data.title, result.data.img,
					result.data.normal_url, result.data.description,type, pid);
			WeiXinApi.showShareMask();
		});

		/***********************************************************************
		 * data = 'data={"type":"'+type+'","id":"'+pid+'"}'; $.post(APIDOMAIN
		 * +'api/share/index',encodeURI(data),function(result){
		 * WeiXinApi.shareWeixin(result.data.title,result.data.img,result.data.normal_url,result.data.description,pid);
		 * WeiXinApi.showShareMask(); });
		 **********************************************************************/
	}
}


/**
 * 分享数据
 * @param pid  分享id
 * @param type 分享类型 分享产品 type = "item" 其他 type = ""
 */
function shareByItemOrId(type,pid) {
	if(!pid || pid == "")pid = -1;
	if ($.isIphoneApp()) {
		window.location.href = "hmj://share_id/"+type +"/" + pid;
	} else if ($.isAndroidApp()) {
		window.location.href = "hmj://share_id/"+type +"/" + pid;
	} else if (is_weixin()) {
		data = 'data={"type":"' + type + '","id":"' + pid + '"}';
		$.hmjpost('share/index', data, function(result) {
			WeiXinApi.shareWeixin(result.data.title, result.data.img,
					result.data.normal_url, result.data.description,type, pid,function(plantform){
					onShareOk(type,pid,plantform);
					$.hmjstats1(1024,type);
				});
			WeiXinApi.showShareMask();
		});

		/***********************************************************************
		 * data = 'data={"type":"'+type+'","id":"'+pid+'"}'; $.post(APIDOMAIN
		 * +'api/share/index',encodeURI(data),function(result){
		 * WeiXinApi.shareWeixin(result.data.title,result.data.img,result.data.normal_url,result.data.description,pid);
		 * WeiXinApi.showShareMask(); });
		 **********************************************************************/
	}
}

/**
 * 分享拼团数据
 * 
 * @param pid
 *            分享id
 */

function sharePtIndex() {
	if ($.isIphoneApp()) {
		window.location.href = "hmj://share/pintuan_index";
	} else if ($.isAndroidApp()) {
		window.location.href = "hmj://share/pintuan_index";
	} else if (is_weixin()) {
		data = {
			"type" : "pintuan_index"
		};
		$.hmjpost('share/index', 'data=' + JSON.stringify(data), function(
				result) {
			WeiXinApi.shareWeixin(result.data.title, result.data.img,
					result.data.normal_url, result.data.description, 'pintuan_index');
			WeiXinApi.showShareMask();
		});
	}
}

/**
 * 分享拼团数据
 * @param pid  分享id
 */
function shareSaleIndex(){
	if($.isIphoneApp()){ 
		window.location.href ="hmj://share/sale_index";	
	}else if($.isAndroidApp()){ 
		window.location.href ="hmj://share/sale_index";	
    }else if(is_weixin()){
    		data = {
    			"type" : "sale_index"
    		};
    		$.hmjpost('share/index', 'data=' + JSON.stringify(data), function(
    				result) {
    			WeiXinApi.shareWeixin(result.data.title, result.data.img,
    					result.data.normal_url, result.data.description, 'sale_index');
    			WeiXinApi.showShareMask();
    		});
	}
}

function is_weixin(){
	var ua = navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i)=="micromessenger") {
		return true;
	} else {
		return false;
	}
}

function setToken(token){
	$.cookie('token', token, $.getCookieDomain());
	//layer.open({content:'token='+token, time: 2});
}

function getToken(){
	return $.cookie('token');
}

/** 
 * 对日期进行格式化， 
 * @param date 要格式化的日期 
 * @param format 进行格式化的模式字符串
 *     支持的模式字母有： 
 *     y:年, 
 *     M:年中的月份(1-12), 
 *     d:月份中的天(1-31), 
 *     h:小时(0-23), 
 *     m:分(0-59), 
 *     s:秒(0-59), 
 *     S:毫秒(0-999),
 *     q:季度(1-4)
 * @return String
 * @author yanis.wang
 * @see	http://yaniswang.com/frontend/2013/02/16/dateformat-performance/
 */
if(typeof template != "undefined"){
	template.helper('dateFormat', function (date, format) {
		
		if(!format){
			format = 'yyyy年MM月dd日 hh:mm:ss'
		}
		var date = new Date(parseInt(date)*1000);
		
		var map = {
	        "M": date.getMonth() + 1, //月份 
	        "d": date.getDate(), //日 
	        "h": date.getHours(), //小时 
	        "m": date.getMinutes(), //分 
	        "s": date.getSeconds(), //秒 
	        "q": Math.floor((date.getMonth() + 3) / 3), //季度 
	        "S": date.getMilliseconds() //毫秒 
	    };
	    format = format.replace(/([yMdhmsqS])+/g, function(all, t){
	        var v = map[t];
	        if(v !== undefined){
	            if(all.length > 1){
	                v = '0' + v;
	                v = v.substr(v.length-2);
	            }
	            return v;
	        }
	        else if(t === 'y'){
	            return (date.getFullYear() + '').substr(4 - all.length);
	        }
	        return all;
	    });
	    return format;
	});
}

function Log(msg){
	if(IS_DEBUG){
		if($.isAndroidApp()){
			
		}else if($.isIphoneApp()){
			
		}else{
			console.log(msg);
		}
	}
}

/**
 * 获取当前的年月日格式 yyyy-mm-dd
 */
$.getCurDate=function(){
	var myDate = new Date();
	return myDate.getFullYear() + "-" + (myDate.getMonth()+1) + "-" + myDate.getDate();
}

if(typeof $.cookie != "undefined"){
	if(!$.cookie('cookie_origin')){
		$.cookie('cookie_origin', getOrigin(), $.getCookieDomain());
	}
}

function setImei(imei){
	localStorage.setItem('cookie_imei',imei);
	$.cookie('cookie_imei', imei, $.getCookieDomain());
}

function setLocalStorage(key,value,setToCookie){
	localStorage.setItem(key,value);
	if(setToCookie){
		$.cookie(key, value, $.getCookieDomain());
	}
}

function setCheckboxCheck(thatDiv,isCheck){
	if($("input",thatDiv).attr("type") == 'radio'){ // 如果是单选按钮
		if(isCheck){
			$("input",thatDiv).attr("checked",isCheck);
		}else{
			$("input",thatDiv).removeAttr("checked");
		}
	}else{
		$("input",thatDiv).attr("checked",isCheck);
	}
	
	
	if(isCheck){
		$(".type_input",thatDiv).attr("src",$(thatDiv).attr("data-select"));
	}else{
		$(".type_input",thatDiv).attr("src",$(thatDiv).attr("data-nomail"));
	}
}

/**
 * 关闭打开页面的loading层
 */
function closeBoot(){
	var bootDiv = $("#boot_div");
	
	if(bootDiv && bootDiv.length){
		bootDiv.remove();
	}
}

function callKefuCenter(){
	var title = '在线咨询';
	var usernick = $.cookie('usernick');
	if(!usernick || usernick==null || usernick == 'undefined'){
		usernick = '';
	}
	var isRobot = true;
	var nowHour = (new Date()).getHours();
	if(nowHour>9&&nowHour<18){
		isRobot = 'false';
	}
	var jsonData = '{"type":1,"userNick":"'+usernick+'","wgId":"hmj_kefu","title":"'+title+'","msgCount":5,"autoReplyMsg":"","myd":false,"isRobot":'+isRobot;
	var userHead = $.cookie('userHead');
	if(userHead){
		jsonData = jsonData + ',"userHeaderUrl":"'+userHead+'"';
	}
	jsonData = jsonData + '}';
	
	if($.isAndroidApp()){ // 如果是android app
		webControl.fun1FromAndroid(jsonData);  
   		return false;  
	}else{
		if($.isIphoneApp()){ 
			//call_ios_kefu(jsonData); 
			
			var url="hmj://kefu/"+jsonData;
			document.location = url;
		}else{
			window.location.href="http://free.appkefu.com/AppKeFu/float/wap/chat.php?wg=hmj_kefu&title="+title+"&robot="+isRobot;	
		}
	}	
}

function jsReplaceByUrl(value){
	if(value == "" || value == null)return;
	window.location.replace(value);
}

//ios 调用方法
/** ios 注入此方法
function hmjjump(value){
	var len = arguments.length;
	var msg = "";
	for(var i = 0;i<len; i++){
		msg += arguments[i];
		if(i < len - 1)msg += "$@$&";
	}
	//layer.open({content:msg, time: 2});
	window.webkit.messageHandlers.appModel.postMessage(msg);
}
*/

/**
 * 判断是否支持CSS3的Transform特性
 */
function isSupportTransform(){
	if( 'MozTransform' in document.documentElement.style || 'WebkitTransform' in 
			document.documentElement.style || 'OTransform' in document.documentElement.style 
			|| 'msTransform' in document.documentElement.style){
		return true;
	}
	return false;
}

function onShareOk(type,id,plantform){
	if(type=='dd_coupons'){ // 如果分享的是dd快车券
		$.hmjstats1(1028,5,plantform);
	}else if(type=='turntable'){
		if(onTurntableShareOk){
			onTurntableShareOk();
		}
	}
}

/**
 * 选择图片回调
 * @param base64img
 * @returns
 */
function select_image_callback(base64img){
	
}

function full_browse_image(){
	var curSrc = $(this).attr("src");
	var initialIndex = 0;
	var imgs = [];
	
	$(".full_browse",$(this).parent().parent()).each(function(){
		var imgscr = $(this).attr("src");
		imgs.push(imgscr);
	});
	
	for(var i = 0;i<imgs.length;i++){
		if(imgs[i] == curSrc){
			if(i>0){
				initialIndex = i;
			}
			break;
		}
	}
	
	var layerHtml = '';
	
	layerHtml +='<div id="full_browse_swiper" class="swiper-container" style="position:static;" onclick="layer.closeAll()">';
	layerHtml +='<div class="swiper-wrapper">';
    for(var i = 0;i<imgs.length;i++){
		layerHtml +='   <div class="swiper-slide" style="">';
		layerHtml +='    	<img src="'+imgs[i]+'" style="width:100%;"/>';
		layerHtml +=' 	</div>';
    }        
	layerHtml +='</div>';
	layerHtml +='<div class="swiper-pagination" style="bottom: 50px;"></div>';
	layerHtml +='</div>';
	
	layer.open({
		type:1,
	    content: layerHtml,
	    style: 'width:100%;',
	    shadeClose: true
	});
	
	var swiper = new Swiper('#full_browse_swiper', {
		initialSlide:initialIndex,
        pagination: '.swiper-pagination',
        paginationType:'fraction',
        width:window.innerWidth,
        paginationClickable: false
    });
	
}

