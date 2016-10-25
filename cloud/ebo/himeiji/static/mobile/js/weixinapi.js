/**
 * 微信分享接口
 * 首先引用：
 * <script language="text/javascript" src="js/weixinapi.js"></script>
 * 调用方法：
 * WeiXinApi.shareWeixin (title,imgurl,link,desc,sid)
 * title:分享标题
 * imgurl:分享图片
 * link：点击链接地址
 * desc：分享右边文字
 * sid：统计代码，可不填
 */
document.write('<script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>');

var x_xmlHttp = null;
//ajax和jquery。ajax函数名冲突
function xajax(url, callback, ldflag){
	x_xmlHttp = new XMLHttpRequest();
	x_xmlHttp.open("GET",url,true);
	x_xmlHttp.onreadystatechange=function(){
		if(x_xmlHttp.readyState==4)
	     {
	        if(x_xmlHttp.status==200)
	       {	
	        	callback(x_xmlHttp.responseText);
	       }else if( parseInt(x_xmlHttp.status) >= 400 ){
//		    	   alert("网络错误，请稍后重试！"+a_xmlHttp.status);
	       }
	     }
	};
	x_xmlHttp.send(null);	
}

var domain = window.location.origin;
//domain += "/himeiji";
var token_url = domain+'/weixin/weixin_front.php';
//默认分享图片
var default_icon = domain+'/static/mobile/images/logo_512.png';
//默认分享链接地址
var default_link = domain;
var wxconfig ={
			title:'嗨美极',
			pyqtitle:'嗨美极',
			imgurl: default_icon,
			link: default_link,
			desc:'嗨美极',
			gid:'1000',
			type:'',
			open_share_url: domain + "",
			open_success_url: domain + "",
			shareSuccessCallback:null,
		};

var WeiXinApi = {
		initmark:false,
		stats:false
};
WeiXinApi.init = function(){	
	if(WeiXinApi.initmark) return;
	var sinurl = encodeURIComponent(location.href.split('#')[0]);
	var url = token_url +'?sinurl=' + sinurl;
	xajax(url,function(responseText){
		var wxcfg = eval('('+responseText+')');//如果不加括号，就不能正常解析json数据，说有非法字符":";
        console.log(wxcfg);
    	 wx.config({
             debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
             appId: wxcfg.appId, // 必填，公众号的唯一标识
             timestamp: wxcfg.timestamp, // 必填，生成签名的时间戳
             nonceStr: wxcfg.nonceStr, // 必填，生成签名的随机串
             signature: wxcfg.signature,// 必填，签名，见附录1
         	jsApiList: [
         	         'checkJsApi',
                     'onMenuShareTimeline',
                     'onMenuShareAppMessage',
                     'onMenuShareQQ',
                     'onMenuShareWeibo',
                     'onMenuShareQZone',
                     'hideMenuItems',
                     'showMenuItems',
                     'hideAllNonBaseMenuItem',
                     'showAllNonBaseMenuItem',
                     'closeWindow',
                     'chooseWXPay',
              ]
         });
//按照微信的规范，应该是一个页面就需要一次签名，不能全局一个签名，所以每个页面都必须要做一次请求，就不用设置全局的INIT了。    	 
		wx.ready(function(){
			WeiXinApi.initmark = true;
	    	WeiXinApi.shareFriend();
	    	WeiXinApi.shareTimeline();
	    	WeiXinApi.shareQQ();
	    	WeiXinApi.shareTxWeibo();
	    	WeiXinApi.shareQZONE();
		});
	});	
};


WeiXinApi.shareWeixin = function (title,imgurl,link,desc,type,sid,callback){ 
	if(navigator.userAgent.toLowerCase().match(/MicroMessenger/i)=="micromessenger"){
		if(title) wxconfig.title = title;
		if(title) wxconfig.pyqtitle = title;
		if(imgurl) wxconfig.imgurl = imgurl;
		if(link) wxconfig.link = link+"&is_share=1";
		if(desc) wxconfig.desc = desc;
		if(type) wxconfig.type = type;
		if(sid) wxconfig.gid = sid;
		if(callback){
			wxconfig.shareSuccessCallback = callback;
		}else{
			wxconfig.shareSuccessCallback = null;
		}
		if(WeiXinApi.initmark){
			WeiXinApi.shareFriend();
			WeiXinApi.shareTimeline();
			WeiXinApi.shareQQ();
			WeiXinApi.shareTxWeibo();
			WeiXinApi.shareQZONE();
		}else{
			WeiXinApi.init();
		}
	}	
};

WeiXinApi.closeWxWeb=function(){	
	var sinurl = encodeURIComponent(location.href.split('#')[0]);
	var url = token_url +'?sinurl=' + sinurl;
	ajax(url,function(responseText){
		var wxcfg = eval('('+responseText+')');//如果不加括号，就不能正常解析json数据，说有非法字符":";
        console.log(wxcfg);
    	 wx.config({
             debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
             appId: wxcfg.appId, // 必填，公众号的唯一标识
             timestamp: wxcfg.timestamp, // 必填，生成签名的时间戳
             nonceStr: wxcfg.nonceStr, // 必填，生成签名的随机串
             signature: wxcfg.signature,// 必填，签名，见附录1
//             jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
         	jsApiList: [
         	         'checkJsApi',
                     'onMenuShareTimeline',
                     'onMenuShareAppMessage',
                     'onMenuShareQQ',
                     'onMenuShareWeibo',
                     'onMenuShareQZone',
                     'hideMenuItems',
                     'showMenuItems',
                     'hideAllNonBaseMenuItem',
                     'showAllNonBaseMenuItem',
                     'closeWindow',
              ]
         });
//按照微信的规范，应该是一个页面就需要一次签名，不能全局一个签名，所以每个页面都必须要做一次请求，就不用设置全局的INIT了。    	 
		wx.ready(function(){
			wx.closeWindow({
			    success : function(resp){
//			    alert('关闭窗口成功！');
			    },
			    fail : function(resp){
//			    alert('关闭窗口失败');
			    }
			  });
		});
	});	
};

WeiXinApi.shareFriend = function() {
	wx.onMenuShareAppMessage({
        imgUrl: wxconfig.imgurl,
        type:'link',
        link: wxconfig.link+'&pid=22',
        desc: wxconfig.desc,
        title: wxconfig.title,
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
        	//$.hmjstats1(1024,wxconfig,type);
        	if(wxconfig.shareSuccessCallback){
        		wxconfig.shareSuccessCallback('wx_friend');
        	}
        	if(WeiXinApi.stats){
		    	var successurl = open_success_url + wxconfig.gid;
		    	ajax(successurl,function(){});
		    	
		    	var openurl = wxconfig.open_share_url + wxconfig.gid;
		    	ajax(openurl,function(){});
        	}
	    },
	    cancel: function () { 
	    	if(WeiXinApi.stats){
		    	var url = wxconfig.open_share_url + wxconfig.gid;
		    	ajax(url,function(){});
	    	}
	    }
    });
};

WeiXinApi.shareTimeline = function() {
	wx.onMenuShareTimeline({
	    title: wxconfig.pyqtitle, // 分享标题
	    link: wxconfig.link+'&pid=23', // 分享链接
	    imgUrl: wxconfig.imgurl, // 分享图标
	    success: function () {
	    	//$.hmjstats1(1024,wxconfig,type);
        	if(wxconfig.shareSuccessCallback){
        		wxconfig.shareSuccessCallback('wx');
        	}
	    	if(WeiXinApi.stats){
        		
		    	var successurl = open_success_url + wxconfig.gid;
		    	ajax(successurl,function(){});
		    	
		    	var openurl = wxconfig.open_share_url + wxconfig.gid;
		    	ajax(openurl,function(){});
        	}
        	
	    },
	    cancel: function () { 
	    	if(WeiXinApi.stats){
		    	var url = wxconfig.open_share_url + wxconfig.gid;
		    	ajax(url,function(){});
	    	}
	    }
	});
};

WeiXinApi.shareTxWeibo=function() {
	wx.onMenuShareWeibo({
		title: wxconfig.title, // 分享标题
	    desc: wxconfig.desc, // 分享描述
	    link: wxconfig.link+'&pid=2', // 分享链接
	    imgUrl: wxconfig.imgurl, // 分享图标
	    success: function () {  
        	if(WeiXinApi.stats){
		    	var successurl = open_success_url + wxconfig.gid;
		    	ajax(successurl,function(){});
		    	
		    	var openurl = wxconfig.open_share_url + wxconfig.gid;
		    	ajax(openurl,function(){});
        	}
	    },
	    cancel: function () { 
	    	if(WeiXinApi.stats){
		    	var url = wxconfig.open_share_url + wxconfig.gid;
		    	ajax(url,function(){});
	    	}
	    }
	});
};

WeiXinApi.shareQQ=function(){
	wx.onMenuShareQQ({
	    title: wxconfig.title, // 分享标题
	    desc: wxconfig.desc, // 分享描述
	    link: wxconfig.link+'&pid=24', // 分享链接
	    imgUrl: wxconfig.imgurl, // 分享图标
	    success: function () {  
        	if(WeiXinApi.stats){
		    	var successurl = open_success_url + wxconfig.gid;
		    	ajax(successurl,function(){});
		    	
		    	var openurl = wxconfig.open_share_url + wxconfig.gid;
		    	ajax(openurl,function(){});
        	}
	    },
	    cancel: function () { 
	    	if(WeiXinApi.stats){
		    	var url = wxconfig.open_share_url + wxconfig.gid;
		    	ajax(url,function(){});
	    	}
	    }
	});
};


WeiXinApi.shareQZONE=function(){
	wx.onMenuShareQZone({
	    title: wxconfig.title, // 分享标题
	    desc: wxconfig.desc, // 分享描述
	    link: wxconfig.link+'&pid=24', // 分享链接
	    imgUrl: wxconfig.imgurl, // 分享图标
	    success: function () {  
        	if(WeiXinApi.stats){
		    	var successurl = open_success_url + wxconfig.gid;
		    	ajax(successurl,function(){});
		    	
		    	var openurl = wxconfig.open_share_url + wxconfig.gid;
		    	ajax(openurl,function(){});
        	}
	    },
	    cancel: function () { 
	    	if(WeiXinApi.stats){
		    	var url = wxconfig.open_share_url + wxconfig.gid;
		    	ajax(url,function(){});
	    	}
	    }
	});
};

/**
 * 点击分享按钮，显示指向右上角的分享按钮
 */
WeiXinApi.showShareMask=function(){
	var maskbg = document.createElement("div");
	maskbg.style.cssText = "position:fixed;top:0px;left:0px;text-align:right;width:100%;height:3000px;background-color: rgba(0,0,0,0.55);z-index: 2000;";
	maskbg.innerHTML ='<img style="width:100%;" src="'+domain+'/static/mobile/images/share_arrow1.png" style="margin-top:0px;margin-right:35px;"/>';
	maskbg.onclick=function(){
		this.style.display="none";
		document.body.removeChild(this);
	};
	document.body.appendChild(maskbg);
};

