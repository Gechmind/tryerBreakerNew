define("app/atm/atm",[],function(require,exports){
'use strict';

	 var music  = require("../../common/music");
	 var paraMng = require("../../common/paraMng");

	 var $ = require("jquery");

	 paraMng.getPostData();
     localStorage.installed = "1";


	 var postData = localStorage.postData;
     localStorage["91atm"] = postData;
	 var token = localStorage.token;
     var user = localStorage.user;

     paraMng.getAtmAuth(token);

// 	ad_id: "a706b769e0c26b04bae4d695ec1c90f7"
// ad_url: "https://itunes.apple.com/app/id419805549"
// description: "1.长按虚线，复制“周公解梦”|<br />2.在App Store中，粘贴并搜索|<br />3.找到“万年历”（约第2位）|<br />4.下载后试用微信登录并试用3分钟，领取奖励"
// href_params: "ad_id=a706b769e0c26b04bae4d695ec1c90f7&ad_name=%E4%B8%87%E5%B9%B4%E5%8E%86&ad_url=https%3A%2F%2Fitunes.apple.com%2Fapp%2Fid419805549&snuid=23556&down=0&appid=0fad8ddbc037e37eb2c1342f43ff1f3f&deviceid=F2630697-3EDB-4218-B6D3-14C2A0EA973D&cid=IOS&activity_name=&lv=4.0.0A&number=200&money=%E7%A7%AF%E5%88%86&add_kj=true&active_time=30&app_package_name=com.xinchang.shiwantuan&pack_name=com.ireadercity.zhwll&befour_tips=00&setup_tips=%E8%AF%B7%3Cspan+style%3D%22color%3A%23999999%22%3E%E6%B3%A8%E5%86%8C%E5%90%8E%E4%BD%93%E9%AA%8C3%E5%88%86%E9%92%9F%3C%2Fspan%3E%EF%BC%8C%E5%8F%AF%E8%BD%BB%E6%9D%BE%E8%8E%B7%E5%BE%97%E5%A5%96%E5%8A%B1%EF%BC%81&cate=%E6%B3%A8%E5%86%8C&imsi=cn%26460%2601%26%E4%B8%AD%E5%9B%BD%E8%81%94%E9%80%9A&create_time=1445256320&token=a8ee25300c5b18b6a16a7093982b981d&open_time=1451402756758&log_id=6018a86a5bb02fee86ce0c8ba7f81df0&step=chicken&ad_url_type=wx5f3a0d4653cd3485%3A%2F%2F&openudid=4a7437d60b99ed2da33551e2c5272ab3597a0dfb&open_url_type=0&process_name=Calendar_New_UI&os_version=9.2&idfa=F2630697-3EDB-4218-B6D3-14C2A0EA973D&idfv=0A57512D-238C-4FD2-AB00-FBA8155ACEB9&mac=020000000000"
// icon: "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201510/0_a706b769e0c26b04bae4d695ec1c90f7_128_128.png"
// keywords: "周公解梦"
// money: "积分"
// name: "万年历"
// needConfirmInstall: 1
// number: 200
// pack_name: "com.ireadercity.zhwll"
// remain: "558"
// size: "64.0 MB"
// text: "注册后体验3分钟可得奖励"


// ad_id: "a706b769e0c26b04bae4d695ec1c90f7"
// ad_url: "https://itunes.apple.com/app/id419805549"
// description: "1.长按虚线，复制“周公解梦”|<br />2.在App Store中，粘贴并搜索|<br />3.找到“万年历”（约第2位）|<br />4.下载后试用微信登录并试用3分钟，领取奖励"
// expire_sec: 1744.386546
// href_params: "ad_id=a706b769e0c26b04bae4d695ec1c90f7&ad_name=%E4%B8%87%E5%B9%B4%E5%8E%86&ad_url=https%3A%2F%2Fitunes.apple.com%2Fapp%2Fid419805549&snuid=23556&down=0&appid=0fad8ddbc037e37eb2c1342f43ff1f3f&deviceid=F2630697-3EDB-4218-B6D3-14C2A0EA973D&cid=IOS&activity_name=&lv=4.0.0A&number=200&money=%E7%A7%AF%E5%88%86&add_kj=true&active_time=30&app_package_name=com.xinchang.shiwantuan&pack_name=com.ireadercity.zhwll&befour_tips=00&setup_tips=%E8%AF%B7%3Cspan+style%3D%22color%3A%23999999%22%3E%E6%B3%A8%E5%86%8C%E5%90%8E%E4%BD%93%E9%AA%8C3%E5%88%86%E9%92%9F%3C%2Fspan%3E%EF%BC%8C%E5%8F%AF%E8%BD%BB%E6%9D%BE%E8%8E%B7%E5%BE%97%E5%A5%96%E5%8A%B1%EF%BC%81&cate=%E6%B3%A8%E5%86%8C&imsi=cn%26460%2601%26%E4%B8%AD%E5%9B%BD%E8%81%94%E9%80%9A&create_time=1445256320&token=a8ee25300c5b18b6a16a7093982b981d&open_time=1451402957606&log_id=392f792f53d34ecd8bd0bb07ab5f5799&step=chicken&ad_url_type=wx5f3a0d4653cd3485%3A%2F%2F&openudid=4a7437d60b99ed2da33551e2c5272ab3597a0dfb&open_url_type=0&process_name=Calendar_New_UI&os_version=9.2&idfa=F2630697-3EDB-4218-B6D3-14C2A0EA973D&idfv=0A57512D-238C-4FD2-AB00-FBA8155ACEB9&mac=020000000000"
// icon: "http://tx-cdn.dianjoy.com/dev/upload/ad_url/201510/0_a706b769e0c26b04bae4d695ec1c90f7_128_128.png"
// keywords: "周公解梦"
// money: "积分"
// name: "万年历"
// needConfirmInstall: 1
// number: 200
// ongoing: 1
// pack_name: "com.ireadercity.zhwll"
// remain: "407"
// size: "64.0 MB"
// task_id: 163539
// text: "注册后体验3分钟可得奖励"
    //任务列表分析
    
    function fetchidProcess(fetchids){
        
        var length = fetchids.length;
        var startIndex  = length-1;

        var temp;
        if(fetchids.length > 1){
            for (var i = fetchids.length -1; i > 0; --i){
                for (var j = 0; j < i; ++j) {
                    if(fetchids[j].number > fetchids[j+1].number){
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

    function getTask(listDetails){
            var taskPool = fetchidProcess(listDetails);
            task(taskPool.current());

            function task(listDetail){

            var data = {
                 user: user,
                 ad_id: listDetail.ad_id,
                 ad_name: listDetail.name,
                 ad_icon: listDetail.icon,
                 price: listDetail.number
            }
            var formdata = new FormData();
            for (var key in data)
                formdata.append(key, data[key]);

            $.ajax({
                url:'http://api.91atm.com/trial/task/',
                method:"POST",
                data: formdata,
                beforeSend:function(xhr){
                    xhr.setRequestHeader("Authorization", "Token " + token);
                    xhr.setRequestHeader("User-Agent","Mozilla/5.0 (iPhone; CPU iPhone OS 9_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13C75 Safari/601.1"); 
                },
                contentType:false,
                processData:false,
                success:function(){
                    music.sendMusic();
                    // if(fetchidProcess.hasNext()){
                    //     task(listDetail.next())
                    // }else{
                    //     setTimeout(getList,2000);
                    // }
                    setTimeout(getList,2000);
                },
                error:function(){
                    setTimeout(getList,2000);
                }
            });
        }

     }

	 function getList(){
	 	if(!postData){
	 		console.log("cookie 配置失败");
	 		return;
	 	}
	 	var data = JSON.parse(postData);
	 	var formdata = new FormData();
        for (var key in data){
            formdata.append(key, data[key])
        }

	 	$.ajax({
                url: 'http://api.91atm.com/trial/',
                method: "POST",
                contentType:false,
                processData:false,
                beforeSend:function(xhr){
                	xhr.setRequestHeader("Authorization", "Token " + token);
                    xhr.setRequestHeader("User-Agent","Mozilla/5.0 (iPhone; CPU iPhone OS 9_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13C75 Safari/601.1"); 
                },
                data: formdata,
                success: function(data) {
                	console.log(data);
                    var  fetchList = [];

                	if(data.offers.length > 0){
                		var lists = data.offers;
                		var ongoing = false;
                        
                		for(var i = 0;i<lists.length;i++){
                			console.log("------任务名称:"+lists[i].name+"----------任务数量:"+lists[i].number);
                			if(lists[i].ongoing){
                				ongoing = true;
                			}

                            if(lists[i].remain && !lists[i].ongoing){
                                fetchList.push(lists[i]);
                            }
                		}
                	}
                    if(ongoing){
                        fetchList = [];
                    }
                    if(fetchList.length > 0 ){
                        getTask(fetchList);
                    }else{
                        setTimeout(getList,2000);
                    }
                    
                },
                error:function(){
                    setTimeout(getList,2000);
                }
         })
	 }


	 exports.start = function(){
			getList();
	 };


})