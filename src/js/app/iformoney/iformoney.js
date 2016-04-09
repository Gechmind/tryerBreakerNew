define("app/iformoney/iformoney",[],function(require,exports){
	'use strict';
	var  $ = require("jquery"); 
	var music  = require("../../common/music");
	var ongingTask;
	var count = 1;

	function getRegularText(){
		count++;
		console.log("------totalRequestCount---------"+ count +"@----"+new Date()+"----------");
		
		$.ajax({
			url : "http://iformoney.com/weixinnew/rw.php",
			type:"GET",
			success:function(data){
				//进行中
				var onT = data.indexOf("<section class=\"l_section\" database=\"over\">");

				if(onT > -1){
					ongingTask = 1;
					setTimeout(getRegularText,2000);
					return;
				}else{
					ongingTask = 0;
				}

				var t = data.indexOf("<section class=\"l_section\" database=\"ok\">");
				var t_end = data.indexOf("<section class=\"l_section\" database=\"gray\">",t);
				var taskData = data.substring(t,t_end);

				var lastIndex = 0;
				var hasScript = true;

				var taskArray = [];

				while(hasScript){
				 	var id_start = taskData.indexOf("<div class=\"hide_msg\">",lastIndex);
				 	var id_end = taskData.indexOf("</div>",id_start);
				 	// var id_next = taskData.indexOf("剩余",id_end);
				 	if(id_start > 0){
				 		var msgHtml = taskData.substring(id_start+22,id_end)
				 		var taskMesg = getInnerData(msgHtml);
				 		// if(taskData.substring(id_next+2,id_next+3) == "0"){
				 		// 	lastIndex = id_next;
				 		// 	continue;
				 		// }
				 		taskArray.push(taskMesg);
				 		lastIndex = id_end;
				 	}else{
				 		break;
				 	}
			    }

			    if(ongingTask !== 0 && taskArray.indexOf(ongingTask) > -1 ){
			    	setTimeout(getRegularText,2000);
			    }else{
			    	if(taskArray.length === 0){
			    		ongingTask = null;
			    		setTimeout(getRegularText,2000);
			    	}else{
			    		sentRequestForTask(taskArray[0],taskArray);
			    	}
			    }
			 },
			error:function(){
				setTimeout(getRegularText,2000);
			}
		})
	}

	function getInnerData(vHtml){
		var re = new RegExp("<[^<]*>([^<]*)<\\/[^<]*>","g")
		var matchArray = vHtml.match(re);
		matchArray =matchArray?matchArray:[];
		var innerText = new Array();
		for(var i = 0;i< matchArray.length;i++){
			var singleRe = /<[^<]*>([^<]*)<\/[^<]*>/i;
			var tempArray = matchArray[i].match(singleRe);
			innerText.push(tempArray[1]);
		}
		return innerText;
	}

	function sentRequestForTask(task,originArray){
		originArray.shift();
		//任务批量分析
		$.ajax({
			type : 'get',
			url : 'qidong.php',
			data : {
				"appid" : task[0],
				"openid" : task[1],
                "bid" : task[2],
                "Shangjia" : task[3],
			},
			datatype : 'json',
			success:function(data){
				try{
					data = JSON.parse(data);
					if(data.code == 1){
						console.log("抢到任务");
						ongingTask = task[0];
	        			music.sendMusic();
	        			setTimeout(getRegularText,2000);
					}else{
						setTimeout(getRegularText,2000);
					}
				}catch(e){
					setTimeout(getRegularText,2000);
				}
				
			},
			error:function(){
				setTimeout(getRegularText,2000);
			}
		})
	}


	exports.start = function(){
		getRegularText();
	}
})