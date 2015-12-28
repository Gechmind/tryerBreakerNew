define("app/itry/hack",[],function(require,exports){
'use strict';
	var $ = require("jquery");
	var paraMng = require("../../common/paraMng");
	var music  = require("../../common/music");
	var  totalRequestCount = 0;
	var hasTask = false;
	var multiTask = "1";//多任务

	if(localStorage.multiTask == "1"){//开启多任务
		multiTask = "1";
	}

	function getwxurl(url){
		 if(/micromessenger/i.test(navigator.userAgent)){
			 return url+(url.indexOf('?')>0?'&':'?')+'&micromessage=true';
		 }else{
			 return (location.origin + url);
		 }
 	}

    var listHandleProcess = {
        count : 0,
        length : 0
    };

    listHandleProcess.setCount = function(count){
        this.count = count;
    };

    listHandleProcess.setLength = function(length){
        this.length = length;
    };

    var  getAppDetail = {
    };

    var dRefresh = function(){
    	exports.getApp(getAppDetail.user_id,getAppDetail.oid_md5);
    };

    // 1、获取列表
    exports.getApp =  function(user_id,oid_md5){

    	getAppDetail.user_id = user_id;
    	getAppDetail.oid_md5 = oid_md5;
    		
        function insideGet(){
        		
			$.ajax({
			 type:"post",
			 url:"/shike/getApplist/"+user_id+"/"+oid_md5,
			 data:{r:+new Date()},
			 async:false,
			 success:function (back) {

		    	 console.log(back);
		    	 hasTask = false;//初始化

		    	 var simpleTasks = [];
		         if(back != null && back.length >0 && "object" == typeof back){

		         	
		         	for(var i = 0;i<back.length;i++){
		         		
		         		if(back[i].status != 0 && back[i].status !=-9){
		         			//直接跳转到详情页面
		         			simpleTasks.push(back[i]);

		         		}else{
		         			if(multiTask == "0"){
		         				hasTask = true;
		         				break;
		         			}
		         		}
		         	}
		         }
		         
		         if(hasTask){
		         	simpleTasks = [];
		         }

		         if(simpleTasks.length > 0 ){
		         	//模式切换
		         	// paraMng.modelSwitch();
		         	//提示音
		         	// callback(simpleTasks.length);
		         	//回调页面跳转
		         	backDis(simpleTasks);
		         }else{
		         	setTimeout(insideGet,2000);
		         }

		     },
		     error:function(){
		     	if(listHandleProcess.count <= 1){
                     setTimeout(dRefresh,2000);
             	}else{
                     listHandleProcess.setCount(listHandleProcess.count - 1);
        		}
		     }
		 });

			totalRequestCount++;
        	console.log("-----------count----------"+totalRequestCount+"-------time@----------"+new Date());
    	}

         function backDis(simpleTasks){
         	listHandleProcess.setLength(simpleTasks.length);
         	listHandleProcess.setCount(simpleTasks.length);
         	
         	$.each(simpleTasks,function(index,simpleTask){
		 		console.log("任务名称："+simpleTask.search_word+"-------任务数："+simpleTask.order_status_disp);
	        	if(listHandleProcess.count <= 1){
                     setTimeout(dRefresh,2000);
             	}else{
                     listHandleProcess.setCount(listHandleProcess.count - 1);
        		}
		 	});
         }

         insideGet();
 	};

});