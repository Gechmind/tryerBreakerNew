define("app/domob/domob",[],function(require,exports){
    // var hack = require("./hack");
    var redirect = require("../../common/redirect");
    var music  = require("../../common/music");
    var $ = require("jquery");
    var paraMng = require("../../common/paraMng");

    var fakeGlabalVar = {};

    var  getAdDetail =  {
            url: "/wx/ceo/detail",
            type: "get"
    };
    var  getTaskList = {
            url: "/wx/ceo/ads",
            type: "get"
    };

    var totalRequestCount = 0;

    function getCurTime() {
        var a = (new Date).valueOf();
        return Math.floor(a / 1e3)
    }

    function getValueFromSearch(a) {
        var b = window.location.search;
        if (b.length > 1) {
            b = b.substring(1);
            for (var c = b.split("&"), d = c.length, e = 0; d > e; e++) {
                var f = c[e].split("=");
                if (f && 2 == f.length && f[0] == a)
                    return decodeURIComponent(f[1])
            }
        }
        return ""
    }
    function getUrlParams() {
        fakeGlabalVar.ipb = getValueFromSearch("ipb"),
        fakeGlabalVar.openId = getValueFromSearch("openid"),
        fakeGlabalVar.prv = getValueFromSearch("prv"),
        fakeGlabalVar.sign = getValueFromSearch("sign")
    }

    function getCommonParams() {
        var a = "?";
        return a += "ipb=" + encodeURIComponent(fakeGlabalVar.ipb),
        a += "&openid=" + encodeURIComponent(fakeGlabalVar.openId),
        a += "&prv=" + encodeURIComponent(fakeGlabalVar.prv),
        a += "&sign=" + encodeURIComponent(fakeGlabalVar.sign),
        a += "&vs=" + fakeGlabalVar.Version
    }

    function getCommonReqData() {
        return {
            ipb: fakeGlabalVar.ipb,
            openid: fakeGlabalVar.openId,
            ts: getCurTime(),
            prv: fakeGlabalVar.prv,
            myRand: Math.random(),
            sign: fakeGlabalVar.sign
        }
    }

    function checkReply(a) {
        if (!a){
            // return myAlert("哎呀，出错了", "返回值为空，请稍后再试"),!1;
            getList();
        }
            
        if ("string" == typeof a){
            try {
                a = JSON.parse(a)
            } catch (b) {
                // return myAlert("哎呀，出错了", "返回值为非法字符串，请稍后再试"),!1;
                getList();
            }
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

    //获取明细

    function getAdTaskDetail(taskifo, claimTask) {
        $.ajax({
            url: getAdDetail.url,
            type: getAdDetail.type,
            data: $.extend(getCommonReqData(), {
                id: taskifo.id,
                type: 0
            }),
            success: function(taskDeail) {
                if(typeof taskDeail == "object" &&  !!taskDeail.crp_url){
                    claimTask(taskDeail)
                }else{
                    if(listHandleProcess.count == 1){
                         setTimeout(listInternal,2000);
                     }else{
                        listHandleProcess.setCount(listHandleProcess.count - 1);
                     }
                }
                // window.getAdDetailIng = !1,
                // taskDeail = checkReply(taskDeail),
               
            },
            error: function() {
                if(listHandleProcess.count == 1){
                     setTimeout(listInternal,2000);
                 }else{
                    listHandleProcess.setCount(listHandleProcess.count - 1);
                 }
                // window.getAdDetailIng = !1,
                // noNetwork()
            }
        })
    }

    //send claim request
    function claimTask(taskDeail){
        var url = taskDeail.crp_url;
        if(url){
            url += url.indexOf("?") > 0 ? getCommonParams().substring(1) + "&ts=" + getCurTime() : getCommonParams() + "&ts=" + getCurTime(),
            e = !0,
            $.ajax({
                url: taskDeail.crp_url,
                data: url,
                type: "post",
                success: function(back) {
                    if (e = !1, "string" == typeof back)
                        try {
                            
                            back = JSON.parse(back);
                           
                        } catch (f) {
                            // return noNetwork(),
                            return !1
                        }

                    if(back && 0 == back.status){
                        //提示
                        music.musicAndEmail(1);

                        if(listHandleProcess.count == 1){
                             setTimeout(listInternal,2000);
                         }else{
                            listHandleProcess.setCount(listHandleProcess.count - 1);
                         }
                    }else{
                        setTimeout(listInternal,2000);
                    }
                         
                    // window.receiveSuccess = !0,
                    // window.detailLayerTaskIndex = taskid,
                    // window.needCountDomNode.push(taskid)
                },
                error: function() {

                    if(listHandleProcess.count == 1){
                         setTimeout(listInternal,2000);
                     }else{
                        listHandleProcess.setCount(listHandleProcess.count - 1);
                     }
                    // e = !1,
                    // noNetwork()
                }
            })
        }else{
            setTimeout(listInternal,2000);
        }
    }

    //获取列表信息
    function getList(getDetailCallback,claimTaskCallBack) {

        totalRequestCount++;
        console.log("-----------count----------"+totalRequestCount);

                $.ajax({
                url: getTaskList.url,
                type: getTaskList.type,
                data: getCommonReqData(),
                success: function(back) {
                    var list = [];

                    if(!back || (!back.list || (list = back.list),list.length == 0)){
                        setTimeout(listInternal,2000);
                    }else{
                        listHandleProcess.setCount(list.length);
                        listHandleProcess.setLength(list.length);

                        //多任务需要处理，否则请求数以级数放大
                        $.each(list,function(index,value){
                            console.log("--------------------任务名称:"+value.name+"-----------------任务价格："+value.price+"------");


                            if(!value.received && value.restNum != 0){
                            //获取任务明细
                                getDetailCallback(value,claimTaskCallBack);
                            }else{
                                if(listHandleProcess.count == 1){
                                     setTimeout(listInternal,2000);
                                 }else{
                                    listHandleProcess.setCount(listHandleProcess.count - 1);
                                 }
                            }
                         })
                    }
                    
                },
                error: function() {
                    setTimeout(listInternal,2000);
                }
            })     
    }

    function listInternal(){
        getList(getAdTaskDetail,claimTask);
    }

    exports.start = function(){
        getUrlParams();
        listInternal();
    }

})
