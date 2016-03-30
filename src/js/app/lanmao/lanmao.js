define("app/lanmao/lanmao",[],function(require,exports){
'use strict';
	var  $ = require("jquery");
	var music  = require("../../common/music");
	var ongingTask;
	var count = 1;

	function getRegularText(){
		count++;
		console.log("------totalRequestCount---------"+ count +"@----"+new Date()+"----------");
		
		$.ajax({
			url : "http://www.cattry.com/index/index",
			type:"GET",
			success:function(data){

				var t_hasCurr = data.indexOf("TASK_ING_TASKID = \"");
				var task = data.substring(t_hasCurr+19,t_hasCurr+23);

				try{
					 ongingTask = parseInt(task);
					if(typeof(ongingTask) == "number"){
						ongingTask = ongingTask+"";
					}
				}catch(e){
					ongingTask = null;
				}

				console.log("当前任务id:"+ongingTask+"----啦啦啦---null就是没问题的意思")
				console.log("一直显示登录那就是用户信息不对，重新提取cookie嘛，截图很浪费流量的，求人不如求己")

				var t = data.indexOf("<div id=\"fasttask\">");
				var t_end = data.indexOf("<div id=\"union-dianle\">",t);
				var taskData = data.substring(t,t_end);

				var lastIndex = 0;
				var hasScript = true;

				var taskArray = [];

				while(hasScript){
				 	var id_start = taskData.indexOf("taskid",lastIndex);
				 	var id_end = taskData.indexOf("\"",id_start+8);
				 	// var id_next = taskData.indexOf("剩余",id_end);
				 	if(id_start > 0){
				 		var taskid = taskData.substring(id_start+8,id_end);
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


	//GET http://www.cattry.com/task/starttask.html?taskid=2335  {"data":"2335","status":1,"info":"\u62a2\u593a\u4efb\u52a1\u6210\u529f"}
	function sentRequestForTask(taskId,originArray){
		originArray.shift();
		//任务批量分析
		$.ajax({
			url:"http://www.cattry.com/task/starttask.html?taskid=" + taskId,
			success:function(data){
				if(data.status == 1){
					if(data.data === taskId){
						console.log("抢到任务");
						ongingTask = taskId;
	        			music.sendMusic();
	        			setTimeout(getRegularText,2000);
					}
				}else{
					if(data.status === 0){
						if(originArray.length > 0){
							sentRequestForTask(originArray[0],originArray);
						}else{
							setTimeout(getRegularText,2000);
						}
					}else{
						setTimeout(getRegularText,2000);
					}
				}
			},
			error:function(){
				setTimeout(getRegularText,2000);
			}
		})
	}

	exports.start = function(path){
		$("script")[4] = "";

		//ajax重新获取页面数据，替换原先document页面
		$.ajax({
			url : "http://www.cattry.com/index/index",
			type:"GET",
			success:function(data){
			var lastIndex = 0;
			var hasScript = true;

			 while(hasScript){
			 	var t = data.indexOf("<script",lastIndex);
				if(t < 0){
					break;
				}
				var t_end = data.indexOf("</script>",t);
				lastIndex = t;
				data = data.substring(0,t) + data.substring(t_end + 9)
			 }
			 document.getElementsByTagName("html")[0].innerHTML = data;
			 getRegularText();
		   }
		})

	}
});