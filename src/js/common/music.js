define("common/music",[],function(require,exports){
'use strict';

	function message(){
 		chrome.runtime.sendMessage({type:"triggerMusic",switcher:"on"},function(response){

		 	console.log(response); 
		
		});
 	}

 	function email(){

	    var xhr = new XMLHttpRequest();

        xhr.open("POST","http://localhost:18080/apptry");
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");

        xhr.onreadystatechange = function(){
        	if(xhr.readyState == 4){
        		var resp = ("(" + xhr.responseText + ")")
        		console.log(resp);
        	}
        }

    	xhr.send("pname=" + tryerUse.pname);
 	}

 	exports.sendEmail = email;

 	exports.sendMusic = message;

	exports.musicAndEmail = function(ls){

		var cirleInterval = +localStorage.hasTask;

		console.log("ls------"+ls);

		console.log("cirleInterval-------"+cirleInterval);

		if (ls > 0){
		        // alert("有任务");

		        //判断是否已做过提醒
		        if( cirleInterval == 0){

		        	localStorage.hasTask = 1;

		         	//触发背景音乐
		         	
		         	setTimeout(message,0);

				}
		 }else{
		//         location.reload();
				if(cirleInterval == 1 ){//重置提醒记录

					localStorage.hasTask = 0;

				}
		 }
	}
});