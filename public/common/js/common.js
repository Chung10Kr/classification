

/**
 * 함수 설명 : blockUi - 엑셀 다운로드용
 */
function startDownBlockUi(){
	startBlockUi("이미지 분류 중입니다.....<br/>잠시만 기다려 주시기 바랍니다.");
}

/**
 * 함수 설명 : blockUi - Ajax 조회용
 * @param msg  :  보여지는 메시지 글
 */
function startBlockUi(msg){
	if(msg == undefined) msg = '데이터 로딩중입니다.....<br/>잠시만 기다려 주시기 바랍니다.';
	$.blockUI({ message: msg,css: { 
        border: 'none', 
        padding: '15px', 
        backgroundColor: '#000', 
        '-webkit-border-radius': '10px', 
        '-moz-border-radius': '10px', 
        opacity: .5, 
        color: '#fff'
    } });
	/*$.blockUI({ message: null, overlayCSS: { backgroundColor: '#f5f5f5' ,opacity : 0.6}});*/
}
/**
 * 함수 설명 : blockUi 종료
 */
function stopBluckUi(){
	$.unblockUI();
}

var ajaxCallHtmlCnt = 0;
function ajaxCallHtml(url,params,sucessFun,errorFun, async){
	ajaxCallHtmlCnt += 1;
	//console.log(ajaxCallHtmlCnt)
  if(async == undefined) async = true;
  $.ajax({
	  	cache : false,
        type: "POST",
        url: url,
        data: params,
        async: async,
        dataType: 'html',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8", // AJAX contentType
        success: function(data){
        	var result = data;
        	try{
        		result = JSON.parse(data);
        	}catch(e){
        		result = data;
        	}
        	
          if(result.errorCode != undefined && result.errorCode == '401'){
                alert(result.message);
                location.href= "/web";
                if(typeof(errorFun) == 'function') errorFun(result);
                return;
            }
          if(result.message != undefined && result.message != ''){
            alert(result.message);
          }
          if(typeof(sucessFun) == 'function') sucessFun(result);
        }, 
        error : function(xhr, status, error){
            
            return;
        },
        beforeSend : function(){
        	startBlockUi();
		},
		complete : function(){
			ajaxCallHtmlCnt -= 1;
			//console.log("ajaxCallHtmlCnt : " + ajaxCallHtmlCnt);
			if(ajaxCallHtmlCnt == 0) stopBluckUi();
			//
		}
    });
}



/************************************************* Jquery를 좀더 쉽게 사용하기 위해 만든 공통 함수 Begin *************************************************/
/**
 * 함수 설명 : selectBox 값을 리턴함
 * @param ojbIdorNm  :  id 및 name값을 인자로 사용(필수)
 */
function gfnIdVal(ojbId){
	var retVal = "";
	if(ojbId != undefined) retVal = $("#"+ojbId).val(); 
	return gfnCheckNull(retVal);
}

/**
 * 함수 설명 : selectBox 값을 리턴함
 * @param ojbIdorNm  :  id 및 name값을 인자로 사용(필수)
 */
function gfnSelectBoxVal(ojbIdorNm){
	var retVal = "";
	if(ojbIdorNm != undefined) retVal = $("#"+ojbIdorNm+" option:selected").val(); 
	if(retVal == undefined) retVal = $("select[name="+getSelectBoxVal+"]").val();
	return gfnCheckNull(retVal);
}

/**
 * 함수 설명 : radio 값을 리턴함
 * @param ojbNm  :  name값을 인자로 사용(필수)
 */
function gfnRadioVal(ojbNm){
	var retVal = "";
	if(retVal == undefined) retVal = $("input:radio[name="+ojbNm+"]:checked").val();
	return gfnCheckNull(retVal);
}
/************************************************* Jquery를 좀더 쉽게 사용하기 위해 만든 공통 함수 End *************************************************/


/************************************************* 편리하기 사용하기 위해 만든 공통 유틸 javascript Begin *************************************************/
/**
 * 함수 설명 : null값을 다른 문자열로 대체, 대체문자열이 없을 경우 공백으로 리턴
 * @param data :  검사 데이터값(필수)
 * @param chr  :  대체문자 
 */
function gfnCheckNull(data , chr){
    if(chr == null || chr == undefined) chr ='';
    
    if(data == null || data == undefined || data== 'null'|| data === ''){
        return chr;
    }else{
        return data;
    }   
}

/**
 * 함수 설명 : null값을 '-' 바 형태의 문자열로 리턴
 * @param data :  검사 데이터값(필수)
 */
function gfnCheckNullToBar(data){
	return gfnCheckNull(data,'-');
}

/**
* 체크된 항목들 값을 취합해서 리턴
* @param itemName 체크박스명
* @param delim    구분자
*/
function gfnCheckBoxCheckedToString(itemName, delim){
	var obj = document.getElementsByName(itemName);
	var div = delim;
	if(div=="")
		div="|";
	var chkCnt=0;
	if(typeof(obj) == 'undefined'){
		return "";
	}
	var s="";
	var n=0;
	for(var i=0; i<obj.length; i++){
		if(obj[i].checked){
			if(n>0)
				s += div;
			s += obj[i].value;
			n++;
		}
	}
	return s;
}

/**
* 특정이름의 멀티체크박스를 체크 또는 체크해제한다.
* ex) <input type=checkbox name=IDS value='...'>
*     <script language='javascript'>
*		gfnToggleMultiChk(this.checked, 'IDS')
*	   </script>
*
* @param bCheck    true|false(체크할 상태)
* @param itemName  체크대상 체크박스이름
*/
function gfnToggleMultiChk(bCheck, itemName){
	var obj = document.getElementsByName(itemName);
	if(typeof(obj) == 'undefined'){
		return;
	}

	for(var i=0; i<obj.length; i++){
		obj[i].checked = bCheck;
	}
}

/**
* input 객체들 구분자로 문자열 반환
* @param obj 해당 객체들 
*/
function gfnObjToString(obj){
	var len = obj.length;
	var ele = obj;
	var str="";
	if(obj.length > 1){
		for(var i=0; i < len; i++){
			if (i > 0) {
				str += "|";
			}
			str += ele[i].value;
		}
	}else{
		str = obj.value;
	}
	return str;
}

/**
* 체크된 항목들 값을 취합해서 리턴
* @param itemName 체크박스명
* @param delim    구분자
*/
function gfnMultiCheckedString(itemName, delim){
	var obj = document.getElementsByName(itemName);
	var div = delim;
	if(div=="" || div == undefined)
		div="|";
	var chkCnt=0;
	if(typeof(obj) == 'undefined'){
		return "";
	}
	var s="";
	var n=0;
	for(var i=0; i<obj.length; i++){
		if(obj[i].checked){
			if(n>0)
				s += div;
			s += obj[i].value;
			n++;
		}
	}
	return s;
}

function gfntMultiNonCheckedString(itemName, delim){
	var obj = document.getElementsByName(itemName);
	var div = delim;
	if(div=="" || div == undefined)
		div="|";
	var chkCnt=0;
	if(typeof(obj) == 'undefined'){
		return "";
	}
	var s="";
	var n=0;
	for(var i=0; i<obj.length; i++){
		if(obj[i].checked){
			
		}else{
			if(n>0)
				s += div;
			s += obj[i].value;
			n++;
			
		}
	}
	return s;
}
