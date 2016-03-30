define("app/itry/hack",[],function(require,exports){
'use strict';
	var $ = require("jquery");
	var paraMng = require("../../common/paraMng");
	var music  = require("../../common/music");
	var  totalRequestCount = 0;
	var hasTask = false;
	var multiTask = "0";//多任务
	var authed = true;//authed = true


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
    }

    listHandleProcess.setCount = function(count){
        this.count = count;
    }

    listHandleProcess.setLength = function(length){
        this.length = length;
    }

    var  getAppDetail = {
    };

    var dRefresh = function(){
    	exports.getApp(getAppDetail.user_id,getAppDetail.oid_md5);
    };

    //4、拷贝关键字
	exports.h_download_app = function(appid,user_id,order_Id){
		$.ajax({
	        type : "post",
	        url : "/shike/copy_keyword",
	        data : {appid:appid,user_id:user_id,order_Id:order_Id},
	        dataType: 'text',
	        async : false,
	        success : function(num){
	        	if(num=="-1"){
	        		$('.prompt_play').html('<p>哎呀~已经被抢光了!等等看吧</p>');
	        		$(".msg_played").show();
	        	}else{
	            	if(/micromessenger/i.test(navigator.userAgent)){
	        			$(".safari_top").show();
	        	        $(".Keyword_name").css({position: "absolute"});
	        	        $(".Keyword_name").css('height','0px');
	        	        $(".Keyword_name").css('width','0px');
	        	        $(".Keyword_name").css('top','-100px');
	        	        $(".Keyword_name").css('left','-100px');
	        	        return;
	            	}
	            	// download_start();
	        	}
	        }
	    });
	}
    //3、获取详细信息
   function getDetailPage(detail_url){

   	      	$.ajax({
	        type : "get",
	        url : detail_url+"?ds=r0",
	        dataType: 'text',
	        async : false,
	        success : function(backPage){
	        	var startIndext;
	        	if(backPage && backPage.length > 0 &&( startIndext = backPage.indexOf("function download_app"),startIndext > 0)){
					var miniString = backPage.substring(startIndext);
					startIndext = miniString.indexOf("{appid:");
					var endIndex = miniString.indexOf("},",startIndext);
					var tempString = miniString.substring(startIndext,endIndex+1);

					var tempobj = eval("("+tempString+")");
					exports.h_download_app(tempobj.appid,tempobj.user_id,tempobj.order_Id);

					// exports.h_download_app(tempobj.appid,tempobj.user_id,tempobj.order_Id,tempobj.type,tempobj.v_str,tempobj.search_word,tempobj.exec_type);
					// var object
	        	}
	        	//消费
	        	if(listHandleProcess.count <= 1){
                     setTimeout(dRefresh,2000);
             	}else{
                     listHandleProcess.setCount(listHandleProcess.count - 1);
        		}
	        },
	        error: function(xhr,msg,error){
	        	console.log(msg);
	        	if(listHandleProcess.count <= 1){
                     setTimeout(dRefresh,2000);
             	}else{
                     listHandleProcess.setCount(listHandleProcess.count - 1);
        		}
   	        }
	    });		
   }
   // 2、抢任务
   exports.hack_btnStatus = function(user_id,order_id,appid,detail_url,leave_num){
    	if(leave_num<=0){
        	// $('#played_msg').html('<p>哎呀～暂时被抢光了!等等看吧</p>');
        	// console.log("哎呀～暂时被抢光了!等等看吧")
      		// $(".msg_played").css("display","block");
      		if(listHandleProcess.count <= 1){
                     setTimeout(dRefresh,2000);
             	}else{
                     listHandleProcess.setCount(listHandleProcess.count - 1);
        	}
      		return;
    	}

		$.ajax({
	        type : "post",
	        url : "/shike/user_click_record",
	        data : {appid:appid,user_id:user_id,order_Id:order_id,type:"app"},
	        dataType: 'text',
	        async : false,
	        success : function(num){
	        	if(num=="-1"){
	        		// console.log("哎呀～暂时被抢光了!等等看吧")
	        		// $('.prompt_play').html('<p>哎呀~已经被抢光了!等等看吧</p>');
	        		// $(".msg_played").show();
	        		if(listHandleProcess.count == 1){
                     	setTimeout(dRefresh,2000);
		             }else{
		                listHandleProcess.setCount(listHandleProcess.count - 1);
		        	}

	        	}else{//获取详细信息
	        		console.log("抢到任务");
	        		music.sendMusic();
	        		getDetailPage(detail_url);
	        	}

	        },
	        error: function(xhr,msg,error){
	        	console.log(msg);
	        	if(listHandleProcess.count <= 1){
                     setTimeout(dRefresh,2000);
             	}else{
                     listHandleProcess.setCount(listHandleProcess.count - 1);
        		}
	        }
	    });		
    }
    

    // 1、获取列表
    exports.getApp =  function(user_id,oid_md5){

    	getAppDetail.user_id = user_id;
    	getAppDetail.oid_md5 = oid_md5;

    	var hackMethod = exports.hack_btnStatus;
    		
        function insideGet(){

        	if(!authed){
        		paraMng.authIt(user_id);
        		authed = true;
        	}
        		
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
		         		
		         		if(back[i].status!=0 && back[i].status !=-9){
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
		     	var user_id = getAppDetail.user_id;
		     	var order_id = simpleTask.order_id;
		     	var appid = simpleTask.appid;
		     	var detail_url = simpleTask.details_url;
		     	var leave_num  = simpleTask.order_status_disp;
		     	hackMethod(user_id,order_id,appid,detail_url,leave_num);
		 	});
         }

         insideGet();
 	};

});
