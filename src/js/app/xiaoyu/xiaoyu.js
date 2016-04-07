define("app/xiaoyu/xiaoyu",[],function(require,exports){
'use strict';
	var  $ = require("jquery"); 
	var music  = require("../../common/music");
	var ongingTask;
	var count = 1;

	function getRegularText(){
		count++;
		console.log("------totalRequestCount---------"+ count +"@----"+new Date()+"----------");
		
		$.ajax({
			url : "http://www.xiaoyuzhuanqian.com/task/list/",
			type:"GET",
			success:function(data){
				//进行中
				var onT = data.indexOf("<div class=\"btn_jx \">进行中</div>");

				if(onT > -1){
					ongingTask = 1;
					setTimeout(getRegularText,2000);
					return;
				}else{
					ongingTask = 0;
				}

				var t = data.indexOf("<div class=\"main\">");
				var t_end = data.indexOf("<div>剩<span class=\"balance\">0</span>份</div>",t);
				var taskData = data.substring(t,t_end);

				var lastIndex = 0;
				var hasScript = true;

				var taskArray = [];

				while(hasScript){
				 	var id_start = taskData.indexOf("getTask('",lastIndex);
				 	var id_end = taskData.indexOf("'",id_start+9);
				 	// var id_next = taskData.indexOf("剩余",id_end);
				 	if(id_start > 0){
				 		var taskid = taskData.substring(id_start+9,id_end);
				 		// if(taskData.substring(id_next+2,id_next+3) == "0"){
				 		// 	lastIndex = id_next;
				 		// 	continue;
				 		// }
				 		taskArray.push(taskid);
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

	function sentRequestForTask(taskId,originArray){
		originArray.shift();
		//任务批量分析
		$.ajax({
			url:"/task/apply/",
			data:{ appid: taskId },
			type:"POST",
			success:function(data){
				try{
					data = JSON.parse(data);
					if(data.code == 1){
						console.log("抢到任务");
						ongingTask = taskId;
	        			music.sendMusic();
	        			setTimeout(getRegularText,2000);
					}else if(data.status === -2){
						if(originArray.length > 0){
							sentRequestForTask(originArray[0],originArray);
						}else{
							setTimeout(getRegularText,2000);
						}
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