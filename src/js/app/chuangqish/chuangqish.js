define('app/chuangqish/chuangqish',[],function(require,exports){
	var  $ = require("jquery");
	var music  = require("../../common/music");
	var ongingTask;
	var count = 1;

	function getRegularText(){
		count++;
		console.log("for free------totalRequestCount---------"+ count +"@----"+new Date()+"----------");
		
		$.ajax({
			url : "http://www.chuangqish.com/LoveBar/ShowAdvsServlet",
			type:"GET",
			success:function(data){
				//进行中
				var onT = data.indexOf("<div class=\"row no-gutter doing\"");
				// var onT = -1;
				if(onT > -1){
					ongingTask = 1;
					setTimeout(getRegularText,5000);
					return;
				}else{
					ongingTask = 0;
				}

				var t = data.indexOf("<div class=\"row no-gutter general\"");
				var t_end = data.indexOf("<div class=\"row no-gutter invite\"",t);
				var taskData = data.substring(t,t_end);

				var lastIndex = 0;
				var hasScript = true;

				var taskArray = [];

				while(hasScript){
				 	var id_start = taskData.indexOf("<div class=\"row no-gutter general\"",lastIndex);
				 	var id_end = taskData.indexOf(">",id_start);
				 	// var id_next = taskData.indexOf("剩余",id_end);
				 	if(id_start >= 0){
				 		var msgHtml = taskData.substring(id_start+47,id_end)
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
			    	setTimeout(getRegularText,5000);
			    }else{
			    	if(taskArray.length === 0){
			    		ongingTask = null;
			    		setTimeout(getRegularText,5000);
			    	}else{
			    		sentRequestForTask(taskArray[0],taskArray);
			    	}
			    }
			 },
			error:function(){
				setTimeout(getRegularText,5000);
			}
		})
	}

	//data-myurl   data-data
	function getInnerData(vHtml){
		var re = new RegExp("\"([^\"]*)\"","g");
		var matchArray = vHtml.match(re);
		matchArray =matchArray?matchArray:[];
		var innerText = new Array();
		for(var i = 0;i< matchArray.length;i++){
			var singleRe = /\"([^\"]*)\"/i;
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
			url : 'Taketask',
			data : {
				data:originArray[1]
			},
			success:function(data){
				try{
					if(data == "1"){
						console.log("抢到任务");
						ongingTask = task[0];
	        			music.sendMusic();
	        			setTimeout(getRegularText,5000);
					}else{
						setTimeout(getRegularText,5000);
					}
				}catch(e){
					setTimeout(getRegularText,5000);
				}
				
			},
			error:function(){
				setTimeout(getRegularText,5000);
			}
		})
	}


	exports.start = function(){
		getRegularText();
	}
})