// seaJs init
'use strict';


seajs.config({
	base : "/js",
	alias : {
		"jquery":"sea-modules/jquery/1.10.1/jquery-debug.js"
	}
})

var breaker = seajs.require('/app/reloadNotions');

breaker.breakTry();