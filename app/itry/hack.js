define("app/itry/hack",[],function(require,exports){

	var $ = require("jquery");
	var paraMng = require("../../common/paraMng");
	var  totalRequestCount = 0;

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
    }
    getAppDetail.refresh = function(){
    	that = this;
    	exports.getApp(that.user_id,that.oid_md5,that.callback);
    }

   exports.hack_btnStatus = function(user_id,order_id,appid,detail_url,leave_num){
    	if(leave_num<=0){
        	$('#played_msg').html('<p>哎呀～暂时被抢光了!等等看吧</p>');
      		$(".msg_played").css("display","block");
      		if(listHandleProcess.count == 1){
                     setTimeout(getAppDetail.refresh,2000);
             	}else{
                     listHandleProcess.setCount(listHandleProcess.count - 1);
        	}
      		return;
    	}

		$.ajax({
	        type : "post",
	        url : "/shike/user_click_record",
	        data : {appid:appid,user_id:user_id,order_Id:order_id,type:"app",exec_type:'list'},
	        dataType: 'text',
	        async : false,
	        success : function(num){
	        	if(num=="-1"){
	        		$('.prompt_play').html('<p>哎呀~已经被抢光了!等等看吧</p>');
	        		$(".msg_played").show();
	        		if(listHandleProcess.count == 1){
	                              setTimeout(getAppDetail.refresh,2000);
	                     	}else{
	                             listHandleProcess.setCount(listHandleProcess.count - 1);
	                	}
	        	}else{
	        		location.href = getwxurl(detail_url);
	        	}
	        },
	        error: function(xhr,msg,error){
	        	console.log(msg);
	        	window.location.reload(true);
	        }
	    });		
    }
    

     exports.h_download_app = function(appid,user_id,order_Id,type,v_str,search_word,exec_type){
		$.ajax({
	        type : "post",
	        url : "/shike/user_click_record",
	        data : {appid:appid,user_id:user_id,order_Id:order_Id,type:type,v_str:v_str,search_word:search_word,exec_type:exec_type},
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

    exports.getApp =  function(user_id,oid_md5,callback){

    	getAppDetail.user_id = user_id;
    	getAppDetail.oid_md5 = oid_md5;
    	getAppDetail.callback = callback;

    	var hackMethod = exports.hack_btnStatus;
    		
        function insideGet(){
        		
			$.ajax({
			 type:"post",
			 url:"/shike/getApplist/"+user_id+"/"+oid_md5,
			 data:{r:+new Date()},
			 async:false,
			 success:function (back) {

		    	 console.log(back);

		    	 var simpleTasks = [];
		         if(back != null && back.length >0 && "object" == typeof back){
		         	
		         	for(var i = 0;i<back.length;i++){
		         		
		         		if(back[i].status!=0 && back[i].status !=-9){
		         			//直接跳转到详情页面
		         			simpleTasks.push(back[i]);

		         		}
		         	}
		         }

		         if(simpleTasks.length > 0 ){
		         	//模式切换
		         	// paraMng.modelSwitch();
		         	//提示音
		         	callback(simpleTasks.length);
		         	//回调页面跳转
		         	backDis(simpleTasks);
		         }else{
		         	setTimeout(insideGet,2000);
		         }

		     },
		     error:function(){
		     	window.location.reload(true);
		     }
		 });

			totalRequestCount++;
        	console.log("-----------count----------"+totalRequestCount);
    	}

         function backDis(simpleTasks){
         	listHandleProcess.setLength(simpleTasks.length);
         	listHandleProcess.setCount(simpleTasks.length);
         	
         	$.each(simpleTasks,function(index,simpleTask){
	         	var user_id = user_id;
	         	var order_id = simpleTask.order_id;
	         	var appid = simpleTask.appid;
	         	var detail_url = simpleTask.details_url;
	         	var leave_num  = simpleTask.order_status_disp;
	         	hackMethod(user_id,order_id,appid,detail_url,leave_num);
         	})
         }

         insideGet();
 	};

});
