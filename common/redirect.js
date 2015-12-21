//刷新
define("common/redirect",[],function(require,exports){
	var $ = require('jquery');

	exports.start =  function(triggerPatten,directRefresh,count,time){

		var intervalTime = time || 2000;

		console.log("intervalTime------"+intervalTime);

	    //延时刷新器
	    if(localStorage.circle == 0){

	    	if(directRefresh){//directRefresh == true 直接刷新

				if(triggerPatten == ""){

					window.location.reload(true);
				}else if($(triggerPatten).length == 0){
					window.location.reload(true);
				}else{

					$(triggerPatten).children().click();
				}
			}else{
				setTimeout(function(){
						
		        		if(triggerPatten == ""){

							window.location.reload(true);
						}else if($(triggerPatten).length == 0){
							window.location.reload(true);
						}else{

							$(triggerPatten).children().click();
						}

		    	},intervalTime);
			}

	    }
	}
});
