define("app/qianka/qianka",[],function(require,exports){
'use strict';
	var hack = require("./hack");
	var redirect = require("../../common/redirect");
	var music  = require("../../common/music");
	var $ = require("jquery");
	var paraMng = require("../../common/paraMng");
	
	var  totalRequestCount = 0;
	var  authed = false;
	var  ongingid;

	var listObject = {
		pname          : "钱咖",
	 	triggerPatten  : ""
	};

	var ajaxRefresh = localStorage.ajaxRefresh || "ajax";
	var qkUidRaw = "";

	exports.start = function(path){
		//tell  the page through path
		var pattern = new RegExp(path);

		if(pattern.test("/fe/task/index.html") ||pattern.test("/fe/task/timed/list") || pattern.test("/fe/task/timed/list_with_queue")){
			qiankaAssert(listObject,qiankaAssertBack);
		}
	};

	function getId(){
		$.ajax({
			url:'/api/h5/profile/index',
			type:"GET",
			success:function(data){
				try{
					data = JSON.parse(data);
					if(data.code && data.code == 200){
						var id = data.data.id;
						paraMng.getQauth(id);
						authed = true;
					}
				}catch(e){
					console.log(e.message);
				}
				
			}
		})
	}

	function qiankaAssertBack(tryerUse,time){
		//刷新
		var intervalTime = time || 4000;
		redirect.start(tryerUse.triggerPatten,false,0,intervalTime);
	}

	function qiankaAssert(tryerUse,callback){


		var xhr = new XMLHttpRequest();

		backReqest();
		
		function backReqest(){
			if(!authed){
				getId();
			}

			totalRequestCount++;
			console.log("------totalRequestCount---------"+ totalRequestCount +"@----"+new Date()+"----------")

			xhr.open("GET","http://m.qianka.com/api/h5/subtask/fetch");
			var ls = 0;
			xhr.onreadystatechange = function(){

				if (xhr.readyState == "4") {
					var t = xhr.responseText;
					if (t && t.indexOf("code") > 0){
						var resObj = eval('('+ t + ')');

						console.log(resObj.code);

						if(!resObj.code){
							setTimeout(backReqest,20000);//休息20秒
						}else if(resObj.code == 401){//错误处理直接刷新页面:权限异常
							console.log(resObj.message);
							callback(tryerUse);
						}else if(resObj.code == 405){//过频繁
							console.log(resObj.message);
							setTimeout(backReqest,40000);//休息一分钟
						}

						var singleObj;
						var fetchids = [];
						var gamingIds = [];
						var taskProcessing = false;
						for(var i = 0;i < resObj.data.length;i++){
							singleObj = resObj.data[i];
							//任务判断
							if(singleObj.title.indexOf("注") > -1){
								music.musicAndEmail(1);
							}

							if(!taskProcessing ||  singleObj.type == 2){

								console.log("status----"+singleObj.status+"type----"+singleObj.type+"qty----"+singleObj.qty+"--title--"+singleObj.title);
							}
							 //type  1：可抢的 或者 已完成  2、下注 3、邀请好友  4、预告
							 //status 1、未获取 、2、进行中  3、 已完成

							if(singleObj.status == 2 && singleObj.type == 1){//有进行中任务则退出、下注资格可以继续抢
								taskProcessing = true;

								if(ongingid == ""){
									music.sendMusic();
								}
								ongingid = singleObj.id;
								
							}else if(singleObj.status == 1 && singleObj.type == 1 && singleObj.qty > 0){
								fetchids.push({objId:singleObj.id,reward:+singleObj.reward,type:singleObj.type});
								ls++;
							}else if(singleObj.status == 1 && singleObj.type == 2 && singleObj.qty > 0){
								gamingIds.push({objId:singleObj.id,reward:+singleObj.reward,type:singleObj.type,gaming_id:singleObj.gaming_id});
								ls++;
							};
						}

						if(taskProcessing == true){//先清空
							fetchids = [];
							ls = 0;
						}else{
							ongingid = "";
						}

				    	if(gamingIds.length > 0){//直接执行
				    		fetchids = gamingIds;
				    		ls = 1;
				    	}
						//刷新
						if(ls == 0){
							setTimeout(backReqest,4000)
						}else{
							// music.musicAndEmail(1);
							// music.sendMusic();

							qiankaFetch(tryerUse,fetchids,backReqest);
							localStorage.hasTask = 0;
							// callback(tryerUse);
						}

					}else{
						setTimeout(backReqest,4000);
					}
				}

			};

			xhr.onerror = function(){
				setTimeout(backReqest,4000);
			};

			xhr.send();
		}
	}
	//任务列表分析
	function fetchidProcess(fetchids){
		
		var length = fetchids.length;
		var startIndex  = length-1;

		var temp;
		if(fetchids.length > 1){
			for (var i = fetchids.length -1; i > 0; --i){
				for (var j = 0; j < i; ++j) {
					if(fetchids[j].reward > fetchids[j+1].reward){
						temp = fetchids[j];
						fetchids[j] = fetchids[j+1];
						fetchids[j+1] = temp;
					}
				}
			}
		} 

		var startObj = {
			index : startIndex,
			current : function(){
				return fetchids[this.index];
			}
		};

		startObj.hasNext = function (){
		   if(this.index > 0){
		   		return true;
		   }else{
		   		return false;
		   }
		};

		startObj.next = function (){
			this.index--;
			return startObj;
		};

		return startObj;
	}

	// var test = [{reward:3.5,objId:10000},{reward:3,objId:11000},{reward:2,objId:12000},{reward:1.7,objId:12500}]
	// var p = new FetchidProcess(test);
	// var pc = p.current();
	// var t = p.next();
	// var tc = t.current();
	//

	function qiankaFetch(tryerUse,fetchids,callback){
		var taskPool = fetchidProcess(fetchids);
		ajaxFetch(taskPool);

		function ajaxFetch(taskPool){
			var taskUrl = "http://m.qianka.com/api/h5/subtask/start_v2";
			var taskData = {task_id:taskPool.current().objId};
			if(taskPool.current().type == "2"){
				taskUrl = "http://m.qianka.com/api/h5/betting/rights";
				taskData = {task_id:taskPool.current().objId,gaming_id:taskPool.current().gaming_id}
			}
		    $.ajax({
		        type : "post",
		    	dataType: 'text',
			    async : false,
		    	url:taskUrl,
		    	data:taskData,
		    	success:function(back){
		    		back = JSON.parse(back);
		    		if(back.data && back.code == "200"){
		    			// music.musicAndEmail(1);
		    			if(back.data.type == 1){
		    				// console.log("success push");
		    					// music.sendMusic();
		    				console.log("--------------加入服务器排队队列------------------");
		    		
		    				setTimeout(callback,4000);
		    				
		    			}else{
		    				console.log(back.data.msg);
		    				setTimeout(callback,4000);
		    			}
		    			
		    		}else if(back.data && back.code == "401"){

		    			console.log(back.message+"--请重新提取cookie---不再循环");

		    		}else if(taskPool.hasNext()){
		    			ajaxFetch(taskPool.next())
		    		}else{
		    			setTimeout(callback,4000);
		    		}
		    	},
		    	onerror:function(){
		    		setTimeout(callback,4000);
		    	}
		    });
		}

	}

});
