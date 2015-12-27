define("common/paraMng",[],function(require,exports){

	//轮训初始化设置
	!function () {

	// var startTime =  new Date();

		var normalInterval = localStorage.normalInterval || 2000;
		

		if(!localStorage.hasTask){

			localStorage.hasTask = 0;
			localStorage.circle = 0;

		};
		
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
				localStorage.multiTask = multiTask;
			}

		}
	});

	//cookie setting
	chrome.runtime.sendMessage({type:"cookie"},function(response){
		console.log("set cookie " + response);
	});

	exports.getUserId = function(){
		chrome.runtime.sendMessage({type:"queryItryId"},function(response){
			console.log("-----queryItryId-----" + response);
			localStorage.itryUsrid = response;
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