$.ajax({
	url:chrome.extension.getURL("/")+"template/auth",
	type:"GET",
	dataType:"json",
	sucess:function(data){
		localStorage.authData = data;
		var OD = data.od;
		var GUID = data.guid;
		if(OD.length > 0){
			localStorage.od = OD;
		};
		if(GUID.length > 0){
			localStorage.guid = GUID;
		};
	}
})
//背景项用来控制页面轮训
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	//default circle
	var circle = localStorage.cirle || 0;
	console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension")
	console.log(message);
	// sendResponse(xp:"1", method: "getText"});
	// sendResponse({xp:"1"});
	if (message.type == "option") {

		localStorage.cirle = message.circle;
		localStorage.circleInterval = message.circleInterval || localStorage.circleInterval;
		sendResponse("sucess set");
		//如果原先circle为0，需要传递消息使其自动刷新

	}else if(message.type == "query"){

		sendResponse({circle: circle});

	}else if(message.type == "triggerMusic"){

	  if(message.switcher == "on"){

	  		triggerMusic();
	  		sendResponse("music is on");

	  }else if(message.switcher == "pause"){

	  		triggerMusicPause();
	  		sendResponse("music is off");
	  }
		
	}else if(message.type == "cookie"){
	
	}else if(message.type == "setCookie"){
		var exp = (new Date().getTime()/1000) + 3600*24*30;
		var cookiesObj = message.cookieContent;
		var domain = message.domain;
		var url =  message.url;
		var cookies = cookiesObj.split(";");
		for(var i = 0 ;i < cookies.length;i++){
			var cookiesPair = cookies[i].split("=");
			if(cookiesPair[0].trim() == "qk:guid" &&  localStorage.guid.indexOf(cookiesPair[1])>-1) break;
			if(cookiesPair[0].trim() == "OD" &&  localStorage.od.indexOf(cookiesPair[1])>-1) break;
			chrome.cookies.remove({url:url,
				name:cookiesPair[0].trim()
			});
			chrome.cookies.set({url:url,
					name:cookiesPair[0].trim(),
					domain:domain,
					path:"/",
					value:cookiesPair[1],
					expirationDate:+exp
			});
		};
		sendResponse("it's done");
	}else if(message.type == "setItryId"){
		var usrid = message.usrid.trim();
		localStorage.usrid = usrid;
	}else if(message.type == "queryItryId"){
		sendResponse(localStorage["usrid"]);
	};
})

//控制音乐播放

var triggerMusic = function(){
	
	$(".icon-play.jp-play").click();
	//30秒钟之后自动关闭音乐
	setTimeout(triggerMusicPause,30000);
}

var triggerMusicPause = function(tab){
	
	$(".icon-pause.jp-pause").click();

}

chrome.browserAction.onClicked.addListener(function(){
	triggerMusicPause();

	chrome.tabs.getCurrent(function(tab){
		console.log(tab);
	});
});
