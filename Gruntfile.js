module.exports = function(grunt){
'use strict';
	
	var contentCtrl = {
		path : ['atm','domob','itry','panda','qianka','miidi'],
		pathInclude :[],
		itry:   ['\"js/app/itry/hack.js\",','\"js/app/itry/itry.js\",'],
        qianka: ['\"js/app/qianka/qianka.js\",'],
        domob :['\"js/app/domob/domob.js\",'],
        atm   :['\"js/app/atm/atm.js\",'],
        panda :['\"js/app/panda/panda.js\",'],
        miidi :['\"js/app/miidi/miidi.js\",']
	};

	grunt.initConfig({
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
		          dest: 'build/',   
		          // Destination path prefix.
		          ext: '.js',   // Dest filepaths will have this extension.
		          extDot: 'last'   // Extensions in filenames begin after the first dot
		        },
		      ],
		    }
		},
		clean: {
			dist:{
				src:['build/*']
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
				 dest: 'build/'
				}]
			}
		},
		copy:{
			options:{
				noProcess:['src/images/*','src/css/*','src/html/Jplayer.swf'],//支持通配符
				process:function(content, srcpath){
						
						if(srcpath.indexOf("manifest") > -1){
							grunt.log.writeln("process:" + srcpath);
							var t = content;
							for(var i = 0;i< contentCtrl.path.length;i++){
								contentCtrl[contentCtrl.path[i]].forEach(function(value){

									grunt.log.writeln(contentCtrl.path[i]);

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
			src:{
				files:[{
				 expand:true,
				 cwd:'src/images/',
				 src: ['**/*'],
				 dest: 'build/images'
				},{
				 expand:true,
				 cwd:'src/css/',
				 src: ['**/*'],
				 dest: 'build/css'
				}]
			},
			manifest:{
				src:"src/manifest.json",
				dest:"build/manifest.json"
			},
			swf:{
				src:"src/html/Jplayer.swf",
				dest:"build/html/Jplayer.swf"
			}
		},
		compress: {
			  main: {
			    options: {
			      // mode: 'zip',
			      archive:'build.zip'
			    },
			    expand: true,
			    cwd: 'build',
			    src: ['**/*'],
			    dest:'build'

			   }
		},
		zip_to_crx:{
			options:{
				privateKey:"tryerBreakerNew.pem"
			},
			build:{
				src :"build.zip",
				dest :"build.crx"
			}
		},
		crx:{
			breaker: {
				options:{
					privateKey:"dist/tryerBreakerNew.pem",
				},
				src:"dist/build/**",
				dest:"dist/",
				filename:"breaker"
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
};