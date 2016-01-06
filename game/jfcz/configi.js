if(request("title") != undefined)
{
	document.title = request("title");
}
 function request(strParame) {
	            var args = new Object();
	            var query = location.search.substring(1);

	            var pairs = query.split("&"); // Break at ampersand 
	            for (var i = 0; i < pairs.length; i++) {
	                var pos = pairs[i].indexOf('=');
	                if (pos == -1) continue;
	                var argname = pairs[i].substring(0, pos);
	                var value = pairs[i].substring(pos + 1);
	                value = decodeURIComponent(value);
	                args[argname] = value;
	            }
	            return args[strParame];
	        }

if(request("imgurl") != undefined)
{
    document.write("<div style=\"display:none;\";>");
    document.write("<img src=\"" + request("imgurl") + "\">");
    document.write("</div>");
}  

window.onload = function () {

    var miaov = {};
    miaov.Dhw = function () {
        var oUl = document.getElementById('ul1');
        var oImgList = document.getElementById('imgList');
        var aDiv = oImgList.getElementsByTagName('div');
        var oNum = document.getElementById('num');
        var aNum = oNum.getElementsByTagName('span');
        var iTimer = null;
        var iCur = 0;
        oImgList.innerHTML += oImgList.innerHTML;
        oNum.innerHTML += oNum.innerHTML;

        for (var i = 0; i < aNum.length; i++) {
            aNum[i].index = i;
            aNum[i].onmouseover = function () {
                iCur = this.index;
                play();
            }
        }

        oUl.onmouseover = function () {
            clearInterval(iTimer);
        }
        oUl.onmouseout = function () {
            autoPlay();
        }

        function play() {
            if (iCur == aDiv.length) {
                iCur = 0;
            }
            for (var i = 0; i < aNum.length; i++) {
                aNum[i].className = '';
            }
            aNum[iCur].className = 'current';
            //startMove(oImgList, 'top', -aDiv[0].offsetHeight * aNum[iCur].index);

        }

        function autoPlay() {
            clearInterval(iTimer);
            iTimer = setInterval(function () {
                iCur++;
                if (iCur == 5) {
                    oImgList.style.top = 0 + "px";
                    iCur = 1;
                }

                play()
            }, 5000);
        }
        autoPlay();
    }


    miaov.Dhw();

}
function startMove(obj, attr, iTarget) {
    clearInterval(obj.iTimer);
    var iCur = 0;
    var iSpeed = 0;
    obj.iTimer = setInterval(function () {
        iCur = parseInt(css(obj, attr));
        iSpeed = (iTarget - iCur) / 4;
        iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
        if (iTarget == iCur) {
            clearInterval(obj.iTimer);
        } else {
            obj.style[attr] = iCur + iSpeed + 'px';
        }
    }, 30);
}
function css(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    } else {
        return getComputedStyle(obj, false)[attr];
    }
}

document.writeln("<style type=\"text/css\">");
document.writeln("img{ border:0;}");
document.writeln("");
document.writeln(".box_kuang{width:350px; height:50px;}");
document.writeln(".box_kuang ul { width:350px; height:50px;  position: relative; overflow: hidden; margin:0;}");
document.writeln(".box_kuang ul li { float:left; list-style: none; margin: 0; padding: 0; }");
document.writeln("li#imgList { position: absolute; left: 0; top: 0; }");
document.writeln("li#imgList div{width:350px; height:50px;}");
document.writeln("li#imgList div ul{ padding:0; margin:0;}");
document.writeln("li#imgList div ul li{ float:left; width:350px; height:50px; overflow:hidden; display:inline;}");
document.writeln("li#imgList div img{ float:left;  width:350px; height:50px; float:left; border:none; display:block;}");
document.writeln("");
document.writeln("li#num { position: absolute; right: 7px; bottom: 10px; display:none;}");
document.writeln("li#num span { padding: 3px 8px; background: #FFF; opacity: 0.8; cursor: pointer; }");
document.writeln("li#num span.current { background: #F60; color: #FFF; font-weight: bold; }");
document.writeln("");
document.writeln("</style>");

document.writeln("<div class=\"box_kuang\"  style='text-align: center; display: block; font-size: 0px; width: 100%; height: 50.650000000000006px; position: fixed; bottom: 0px; background:rgba(0,0,0,0.9) none repeat scroll !important; background:#000; filter:Alpha(opacity=90);z-index: 2147483646;'>");
document.writeln("<ul id=\"ul1\">");
document.writeln("    	<li id=\"imgList\">");

document.writeln("          ");
document.writeln("        </li>");
document.writeln("        <li id=\"num\">");
document.writeln("        	<span class=\"current\">1</span>");
document.writeln("        	<span>2</span>");
document.writeln("        	<span>3</span>");
document.writeln("        </li>");
document.writeln("    </ul>");
document.writeln("    </div>");

document.writeln("<scr"+"ipt type=\"text/javascript\">");
document.writeln("    var cpro_id = \"u2465123\";");
document.writeln("</scr"+"ipt>");
document.writeln("<scr"+"ipt src=\"http://cpro.baidustatic.com/cpro/ui/cm.js\" type=\"text/javascript\"></scr"+"ipt>");


