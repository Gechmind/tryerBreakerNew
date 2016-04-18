define("app/taobao/taobao",[],function(require,exports){
'use strict';
	var $ = require("jquery");


	function  getTryList(){
		$.ajax({
			url:"https://try.taobao.com/json/ajax_get_recommend_item_list.htm?tab=1&page=1&t=1460992561486&_input_charset=utf-8",
			type:'get',
			success:function(data){
				data = JSON.parse(data);
				console.log(data);
			},
			error:function(){

			}
		})
	}

	exports.start = function(){
		getTryList();
	}

})