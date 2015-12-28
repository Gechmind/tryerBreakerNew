'use strict';
$("a").each(function(index,value){
		$(this).on("click",function(event){
			event.preventDefault();
			var url = this.href;
			$.ajax({
				url : url,
				type : "get",
				success : function(data){
					$("#content")[0].innerHTML = data;
				}

			})
		})
});
$("#global").click();

function setCookie(hostUrl,hostDomain,cookieContent){
	chrome.runtime.sendMessage({type:"setCookie",url:hostUrl,domain:hostDomain,cookieContent:cookieContent},function(response){
		console.log(response);
		alert(response);
	})
}

document.getElementById('save').onclick = function(){
	var setType = document.getElementById("setType").value;
	var circle = document.getElementById("circle").value;
	var circleInterval = 2000;
	var hostUrl;
	var hostDomain;
	var cookieContent;
	var setItryCircle = false;
	var setDomobCircle = false;
	var setQiankaCircle = false;
	var setQuanmingCircle = false;


	if(setType == "itry"){
		hostUrl = "http://itry.com/itry/appList";
		hostDomain = "itry.com";
		cookieContent  = document.getElementById("cookie").value;
		var mutiTask = document.getElementById("mutiTask").value;
		if(cookieContent.length > 0){
			setCookie(hostUrl,hostDomain,cookieContent);
		}
		
		if(circle){
			setItryCircle = true;
		}

		if(mutiTask == "1" || mutiTask == "0"){
			chrome.tabs.query({url: "http://itry.com/*"}, function(tabs) {

		 		chrome.tabs.sendMessage(tabs[0].id, {type:"setMutiTask",mutiTask:mutiTask}, function(response) { 
		 				console.log(response);     
		 			}); 

			});
		}
		
		var usrid = document.getElementById("usrid").value;
		if(usrid){
			chrome.runtime.sendMessage({type:"setItryId",usrid:usrid},function(response){
				console.log(response);
			});
		}
		circleInterval = document.getElementById("normalInterval").value;
	}else if(setType == "qianka"){
		hostUrl = "http://m.qianka.com/fe/authority/#/welcome"
		hostDomain = "m.qianka.com";
		cookieContent = document.getElementById("cookie").value;
		if(cookieContent.length > 0){
			setCookie(hostUrl,hostDomain,cookieContent);
		}
		//轮询设置
		if(circle){
			setQiankaCircle = true;
		}
		circleInterval = document.getElementById("normalInterval").value;
	}else if(setType == "global"){
		var mailPush = document.getElementById("mailPush").value;
		var mailAd = document.getElementById("mailAd").value;
		if(circle){
			 setItryCircle = false;
			 setDomobCircle = false;
			 setQiankaCircle = false;
		}
	}else if(setType == "domob"){
		circleInterval = document.getElementById("normalInterval").value;
		if(circle){
			setDomobCircle = true;
		}
	}

	

	
	
	console.log("sucess save");

	//通知background 修改 deprecate 
	// chrome.runtime.sendMessage({type:"option",circle:circle,circleInterval:circleInterval}, function(response){
	//     console.log(response);
	// });



	// if(circle == "1" && message.circle == "0"){

	!setItryCircle || chrome.tabs.query({url: "http://itry.com/*"}, function(tabs) { 

 		chrome.tabs.sendMessage(tabs[0].id, {type:"circleChange",circle:circle}, function(response) { 
 				console.log(response);     
 			}); 

	});

	!setDomobCircle || chrome.tabs.query({url: "http://r.ow.domob.cn/*"}, function(tabs) { 

 		chrome.tabs.sendMessage(tabs[0].id, {type:"circleChange",circle:circle}, function(response) {    
 			console.log(response);  
 		}); 

	});

	!setQiankaCircle || chrome.tabs.query({url: "http://m.qianka.com/*"}, function(tabs) { 

 		chrome.tabs.sendMessage(tabs[0].id, {type:"circleChange",circle:circle}, function(response) {    
 			console.log(response);  
 		}); 

	});

	!setQuanmingCircle || chrome.tabs.query({url: "http://ow.miidi.net/ow*"}, function(tabs) { 

 		chrome.tabs.sendMessage(tabs[0].id, {type:"circleChange",circle:circle}, function(response) {    
 			console.log(response);  
 		}); 

	});
		// }
}


