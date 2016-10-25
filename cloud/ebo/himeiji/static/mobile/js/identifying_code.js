/**
 * 
 */

var callBackFun=null;
var curIndex = -1;

function getVcode(v_sms_code){
	if(!v_sms_code){
		v_sms_code=0;
	}
	var _tele = $("#tele").val();
	data = 'data={"tele":"'+_tele+'","type":1,"v_sms_code":'+v_sms_code+'}';
    $.hmjpost('sms/SmsCode',encodeURI(data),function(res){
        if(!parseInt(res.status)){
        	alert_layer(res.result);
        }else{
            daojishi.do(60);
        }
    });
}

function changeIdentifyingCode(tele){
	$('#identifying_img').attr('src',APIDOMAIN+"api/identifying_code/index?tele="+tele+"&r="+ Math.random());
}

function checkIdentifyingCode(){
	var code = $('#identifying_text').val();
	if(!code){
		alert_layer('请输入验证码');
		return;
	}
	
	if(curIndex>0){
		layer.close(curIndex);
	}else{
		layer.closeAll();
	}
	
	if(callBackFun){
		callBackFun(code);
	}
}

/**
 * 显示验证码
 */
function showIdentifyingCode(tele,okFun){
	callBackFun = okFun;
	var contentHtml = '';
	contentHtml += '<div style="width: 100%;">';
	
	contentHtml += '<div style="padding:0px;width: 100%;height: 40px;line-height: 40px;font-size: 0.875rem;display: -webkit-flex;    display: -ms-flexbox;display: flex;display: -webkit-box;">';
	contentHtml += '	<input style="-webkit-box-flex: 1;-moz-box-flex: 1;-webkit-flex: 1;-ms-flex: 1;flex: 1;display: -webkit-flex;display: -ms-flexbox;display: flex;display: -webkit-box;width: 100%;height: 100%;" id="identifying_text" type="text" size="4"/>';
	contentHtml += '	<img style="width:80px;height:40px;margin-left:10px;" id="identifying_img" src='+APIDOMAIN+'api/identifying_code/index?tele='+tele+'&r="'+ Math.random() +'" onclick="changeIdentifyingCode(\''+tele+'\')">';
	contentHtml += '</div>';
	contentHtml += '<div style="height: 40px;line-height: 40px;border-radius: 6px;margin-top:20px;background: #ff5555;color: #ffffff;text-align: center;" onclick="checkIdentifyingCode()">';
	contentHtml += '	输入验证码';
	contentHtml += '</div>';
	contentHtml += '</div>';
	
	curIndex=layer.open({
        title: [
            '请先输入验证码',
            'color: #ff5555; text-align: center; font-size: 1.125rem; font-weight: bold; padding-left: 45px;'
        ],
        content: contentHtml
    });
}