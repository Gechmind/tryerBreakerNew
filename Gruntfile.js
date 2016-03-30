module.exports = function(grunt){
'use strict';
	
	var contentCtrl = {
		path : ['atm','domob','itry','panda','qianka','miidi','lanmao'],
		pathInclude :[],
		itry:   ['\"js/app/itry/hack.js\",','\"js/app/itry/itry.js\",'],
        qianka: ['\"js/app/qianka/qianka.js\",'],
        domob :['\"js/app/domob/domob.js\",'],
        atm   :['\"js/app/atm/atm.js\",'],
        panda :['\"js/app/panda/panda.js\",'],
        miidi :['\"js/app/miidi/miidi.js\",'],
        lanmao :['\"js/app/lanmao/lanmao.js\",'],
        authcontent:{},
        personName:""
	};

	grunt.initConfig({
		personName:contentCtrl.personName,
		pkg: grunt.file.readJSON('package.json'),

		uglify: {	
			dynamic_mappings: {
      		// Grunt will search for "**/*.js" under "lib/" when the "uglify" task
      		// runs and build the appropriate src-dest file mappings then, so you
      		// don't need to update the Gruntfile when files are added or removed.
      		  options:{
      		  	mangle:true,
      		  	noProcess:["src/js/app/atm/*"]
      		  },
		      files: [
		        {
		          expand: true,     // Enable dynamic expansion.
		          cwd: 'src/',      // Src matches are relative to this path.
		          src: ['**/*.js','!*.min.js'], // Actual pattern(s) to match.
		          filter:function(filepath){

		          		for(var i =0;i<contentCtrl.path.length;i++){
		          			
		          			if(filepath.indexOf(contentCtrl.path[i]) > -1 && contentCtrl.pathInclude.indexOf(contentCtrl.path[i]) === -1){
		          				return false;
		          			}
		          		}
		          		return true;
		          },
		          dest: 'dist/build/',   
		          // Destination path prefix.
		          ext: '.js',   // Dest filepaths will have this extension.
		          extDot: 'last'   // Extensions in filenames begin after the first dot
		        },
		      ],
		    }
		},
		clean: {
			dist:{
				src:['dist/build/*']
			}
		},
		htmlmin:{
			options:{
				removeComments: true,
				collapseWhitespace: true
			},
			html:{
				files:[
				{expand:true,
				 cwd:'src/',
				 src: ['**/*.html'],
				 dest: 'dist/build/'
				}]
			}
		},
		copy:{
			src:{
				files:[{
				 expand:true,
				 cwd:'src/images/',
				 src: ['**/*'],
				 dest: 'dist/build/images'
				},{
				 expand:true,
				 cwd:'src/css/',
				 src: ['**/*'],
				 dest: 'dist/build/css'
				}]
			},
			manifest:{
				options:{
					// noProcess:['src/images/*','src/css/*','src/html/Jplayer.swf'],//支持通配符
					process:function(content, srcpath){
							
							if(srcpath.indexOf("manifest") > -1){
								var t = content.replace("breaker",contentCtrl.personName);
								for(var i = 0;i< contentCtrl.path.length;i++){
									contentCtrl[contentCtrl.path[i]].forEach(function(value){


										if(contentCtrl.pathInclude.indexOf(contentCtrl.path[i]) > -1)return;
										
										var pattern = new RegExp(value,"g");

										
										// grunt.log.writeln(pattern.test(t));
										t =  t.replace(pattern,"");
									})
								}
								return t;
							}else{
								return content;
							}
					}
				},
				src:"src/manifest.json",
				dest:"dist/build/manifest.json"
			},
			swf:{
				src:"src/html/Jplayer.swf",
				dest:"dist/build/html/Jplayer.swf"
			},
			auth:{
				options:{
					process:function(content,srcpath){
						return content = JSON.stringify(contentCtrl.authcontent);
					}
				},
				src:"src/template/auth.json",
				dest:"dist/build/template/auth.json"
			}
		},
		compress: {
			  main: {
			    options: {
			      // mode: 'zip',
			      archive:'build.zip'
			    },
			    expand: true,
			    cwd: 'dist/build',
			    src: ['**/*'],
			    dest:'dist/build'

			   }
		},
		zip_to_crx:{
			options:{
				privateKey:"buss/tryerBreakerNew.pem"
			},
			build:{
				src :"build.zip",
				dest :"build.crx"
			}
		},
		crx:{
			breaker: {
				options:{
					privateKey:"buss/tryerBreakerNew.pem",
				},
				src:"dist/build/**",
				dest:"dist/"
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-zip-to-crx');
	grunt.loadNpmTasks('grunt-crx');

	grunt.registerTask('default',"test",function(){
		if(arguments.length > 0){
			var  t = [];
			var  x =  Array.prototype.slice.call(arguments,0);
			grunt.log.writeln(x);

			for(var i=0;i<x.length;i++){
				if(contentCtrl.path.indexOf(x[i]) > -1){
					t.push(x[i]);
				}
			}
			contentCtrl.pathInclude = t;
    	}else{
    		contentCtrl.pathInclude = contentCtrl.path;
    	}
    	grunt.task.run(['clean','uglify','htmlmin','copy','uglify','compress']);
	});

	grunt.registerTask('person','grunt use person name',function(personName){
		var allPerson =grunt.file.readJSON('buss/buyerDetail.json',{encoding:"UTF-8"});
		var personDetail = allPerson[personName];
		// console.log(allPerson)
		if(!personDetail){
			console.log("不存在该用户");
			return
		}
		var pdList = [];
		if(personDetail.iolSd.length > 0){
			pdList.push("itry");
		}
		if(personDetail.qkxguid.length > 0){
			pdList.push("qianka");
		} 
		if(personDetail.atsmTo.length > 0){
			pdList.push("atm");
		}
		if(personDetail.domob.length > 0){
			pdList.push("domob");
		}
		if(personDetail.lanmao.length > 0){
			pdList.push("lanmao");
		}
		contentCtrl.personName = personDetail.nickname+"/breaker";
		contentCtrl.authcontent = personDetail;
		contentCtrl.pathInclude = pdList;
		// grunt.task.run("copy:auth");
		grunt.task.run(['clean','uglify','htmlmin','copy','uglify','crx']);
	})
};