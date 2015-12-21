define("app/itry/itry",[],function(require,exports){

	var hack = require("./hack");
	var redirect = require("../../common/redirect");
	var music  = require("../../common/music");
	var $ = require("jquery");
	var paraMng = require("../../common/paraMng");

	//用户信息
	 
	if(!localStorage["itryUsrid"] || localStorage["itryUsrid"] == "null"){
		paraMng.getUserId();
	}

	var usr_id  = localStorage["itryUsrid"];
	var oid_md5 = localStorage["itry.shokey.param"];
	oid_md5 = oid_md5.substring(1,oid_md5.length-1);
	
	var listObject = {
		pname          : "试客",
	 	triggerPatten  : "[href='/itry/appList']",//通过点击来刷新
	 	taskPattern    : "#appList div.trial_price span",//".Click_bj.app_j"
	 	fetchTrigger   : "#appList div a.Click_bj",//#appList div a.Click_bj div:first  $("#cantPlayList div a.Click_bj div:first")
	 	fininishTag    : "#cantPlayList"//必须全部加载出来了才能刷新 warm_prompt Click_bj
	};

	var detailObject = {
	 	triggerPatten  : "[href='/itry/appList']"
	};

	var ajaxRefresh = localStorage.ajaxRefresh || "ajax";

	exports.name = "ps";

		//导出调用方法
	exports.start = function(path){
		console.log(exports.name);
		//tell  the page through path
		var pattern = new RegExp(path);

		if(pattern.test("/shike/appList")){
			//刷新模式
			if(ajaxRefresh == "ajax"){//ajax 刷新
				itryAssertAjax(fetchCallBackAjax);
			}else{
				itryAssert(listObject,fetchCallBack);
			}
			
		}
		// else if(pattern.test("/itry/appList")){
		// 	//导向list页面
		// 	setTimeout(itryError,1000);

		// }
		else if(path.indexOf("/shike/appDetails") > -1){
			//关键词copy之后跳转
			itryGet(detailObject,detailCopyCallBack);

		}
	};
	//计数
	function itryAssert(tryerUse,callback){

		console.log("-------try Sniffer-----------");

		var ls = 0 ;

		var count = 5;

		var waitingInterval = setInterval(function(){

			if ( count == 0 || $(tryerUse.fininishTag).children().length  > 0 || $(tryerUse.taskPattern).children().length > 0){//如果先task先加载出来了，直接结束

				clearInterval(waitingInterval);

				$(tryerUse.fetchTrigger).each(function(){

					if($(this).find("p span:last").text() != '剩余0个' &&  !$(this).find("div.app_name h3 font").length > 0){
						ls++;
					}
				})
				
				console.log("-------count-----------" + count);
				//模式切换
				if(ls == 0){
					paraMng.modelSwitch();
				}

				callback(tryerUse,ls);

			} else{

				count--;
			}

		},200);

		
	}
	//获取任务跳转
	function itryFetch(tryerUse){
		//小兵的可玩列表实在加载到本地之后，js把price改为进行中的，把进行中的排除即可
	    //剩余0个判断方法
		if($(tryerUse.taskPattern).length > 0 ){
			//获取页面元素的内容，从innerHTML中提取参数
			$(tryerUse.fetchTrigger).each(function(){
				if($(this).find("p span:last").text() != '剩余0个' &&  !$(this).find("div.app_name h3 font").length > 0){
					var onclickMethod = $(this)[0].getAttribute("onclick").toString();
		    		var startindex = onclickMethod.indexOf('(');
		    		var endIndex   = onclickMethod.indexOf(')');
		    		var arguments  = onclickMethod.substr(startindex+1,endIndex)
		    		var regExp = /'/g
		    		var newArgs = arguments.replace(regExp,'');
		    		var argArray = newArgs.split(',');
		    		music.musicAndEmail(1);
		    		hack.hack_btnStatus.apply(null,argArray);
				}
			});
	    };
	}
	//计数完成后回调
	function fetchCallBack(tryerUse,ls,count,time){
		//提示音邮件通知
		music.musicAndEmail(ls);

		//再抓取
		itryFetch(tryerUse);

		//跳转
		redirect.start(tryerUse.triggerPatten,false,count,time);
	}

	//ajax计数并跳转
	function itryAssertAjax(callback){
		//直接ajax分析applist,有任务直接跳转
		hack.getApp(usr_id,oid_md5,callback);
	}
	//ajax计数获取任务的callBack
	function fetchCallBackAjax(ls){
		//提示音
		music.musicAndEmail(ls);
		//不用刷新，如果任务获取失败，继续获取applist即可
	}


	//拷贝复制关键词后回调
	function detailCopyCallBack(tryerUse){

		redirect.start(tryerUse.triggerPatten,true);
	}

	//错误页面刷新
	function itryError(){
		window.location.href = "http://itry.com/shike/appList";
	}

	//关键词获取
	function itryGet(tryerUse,callback){
		//小兵的可玩列表实在加载到本地之后，js把price改为进行中的，把进行中的排除即可
		var  tryCount = 20;

		var  intervalFunc = function(){
		//修改后的只能执行一个任务
			if($("#copy_key").length > 0){
				//暴力分析页面内容，获取copy方法内容
				var script = $("script");
				var length = script.length -1;
				var scriptContext = $("script")[length].innerText;

				var startIndext = scriptContext.indexOf("{appid:");
				var endIndex = scriptContext.indexOf("exec_type") + 20;

				var tempString = scriptContext.substring(startIndext,endIndex);

				var tempobj = eval('('+tempString+')');

				hack.h_download_app(tempobj.appid,tempobj.user_id,tempobj.order_Id,tempobj.type,tempobj.v_str,tempobj.search_word,tempobj.exec_type);
				// var object

				clearInterval(tryFetch);
	    		callback(tryerUse);

		    }else if(tryCount == 0){

				clearInterval(tryFetch);
			}else{
				tryCount --
			}
	    }

	    var tryFetch = setInterval(intervalFunc,300);
	}

});
