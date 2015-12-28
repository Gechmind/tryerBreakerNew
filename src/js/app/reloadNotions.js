define("app/reloadNotions",[],function(require,exports){
'use strict';
	 exports.breakTry = function(){
	 	var urlDefine = require("./urlDefine");

		var paraMng = require("../common/paraMng");

		var tryer = {
			itry :  "itry.com",
			domob : "r.ow.domob.cn",
			quanming : "ow.miidi.net",
			qianka : "m.qianka.com"
		}

		var domain = window.location.host;
		var path = window.location.pathname;

		var pattern = new RegExp(domain);
		var breaker;

		if(pattern.test("itry.com")){
			breaker = require("./itry/itry");
		}else if(pattern.test("r.ow.domob.cn")){
			breaker = require("./domob/domob");
		}else if(pattern.test("ow.miidi.net")){
			breaker = require("./miidi/miidi");
		}else if(pattern.test("m.qianka.com")){
			breaker = require("./qianka/qianka");
		}else if(pattern.test("xb.shiwan123.com")){
			breaker = require("./panda/panda");
		}

		breaker.start(path);
	 }	

});