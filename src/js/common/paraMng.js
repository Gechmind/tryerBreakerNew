define("common/paraMng",[],function(require,exports){
'use strict';
	//轮训初始化设置
	!function () {

	// var startTime =  new Date();

		var normalInterval = localStorage.normalInterval || 2000;
		

		if(!localStorage.hasTask){

			localStorage.hasTask = 0;
			localStorage.circle = 0;

		}
		
		if(!localStorage.ajaxRefresh){
			localStorage.ajaxRefresh = "refresh";
		}

		var circle = localStorage.circle || 0 ;
	}();

	//插件参数监听
	chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){

		if(message.type == "circleChange"){

			var oldCircle = localStorage.circle || "0";

			localStorage.circle = message.circle;

			sendResponse("Message got,reload right now");

			if(oldCircle == "1" && message.circle == "0"){

				window.location.reload(true);
			}
		}else if(message.type == "setMutiTask"){
			var multiTask = message.mutiTask;
			if(multiTask == "0" || multiTask == "1"){
				var ins = multiTask == "0"?"关闭":"开启";
				console.log("试客多任务开关"+"------------"+ins+"------------");
				localStorage.multiTask = multiTask;
			}

		}
	});

	//cookie setting
	chrome.runtime.sendMessage({type:"cookie"},function(response){
		console.log("set cookie " + response);
	});
	exports.authDomob = function(uid){
		chrome.runtime.sendMessage({type:"authDomob",auth:uid},function(response){
			if(response == "1"){
				localStorage.auth  = "1";
			}else if(response.indexOf(uid) < 0 ){
				localStorage.auth  = "0";
			} 
		});
	}

	exports.authIt = function(uid){
		chrome.runtime.sendMessage({type:"authIt",auth:uid},function(response){
			if(response.indexOf(uid) < 0){
			}
		});
	}

	exports.getQauth = function(uid){
		chrome.runtime.sendMessage({type:"authQk",auth:uid},function(response){
			if(response.indexOf(uid) < 0){
			}
		});
	}

	exports.getAtmAuth = function(token){
		chrome.runtime.sendMessage({type:"authATM",auth:token},function(response){
			if(response.indexOf(token) < 0){
				localStorage.postData = "";
			}
		});
	}
	exports.getPostData = function(){
		chrome.runtime.sendMessage({type:"queryPostdata"},function(response){
			console.log("-----queryPostdata-----" + response);
			localStorage.postData = response;
		});
	}

	exports.getUserId = function(){
		chrome.runtime.sendMessage({type:"queryItryId"},function(response){
			console.log("-----queryItryId-----" + response);
			localStorage.itryUsrid = response.itryUsrid;
			localStorage.itryToken = response.itryToken;
		});
	}
	


	//模式切换
	exports.modelSwitch = function(){
		if(localStorage.ajaxRefresh == "refresh"){
			localStorage.ajaxRefresh = "ajax";
		}else if(localStorage.ajaxRefresh == "ajax"){
			localStorage.ajaxRefresh = "refresh";
		}
	};

});