module.exports = function(grunt){
'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {	
			dynamic_mappings: {
      		// Grunt will search for "**/*.js" under "lib/" when the "uglify" task
      		// runs and build the appropriate src-dest file mappings then, so you
      		// don't need to update the Gruntfile when files are added or removed.
      		  options:{
      		  	mangle:true
      		  },
		      files: [
		        {
		          expand: true,     // Enable dynamic expansion.
		          cwd: 'src/',      // Src matches are relative to this path.
		          src: ['**/*.js','!*.min.js'], // Actual pattern(s) to match.
		          dest: 'build/',   // Destination path prefix.
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
			src :{
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
			auth:{
				src:'src/template/auth',
				dest:'build/template/auth'
			},
			manifest:{
				src:"src/manifest.json",
				dest:"build/manifest.json"
			},
			swf:{
				src:"src/html/Jplayer.swf",
				dest:"build/html/Jplayer.swf"
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');

	grunt.registerTask('default',['clean','uglify','htmlmin','copy','uglify']);
	// grunt.registerTask('clean',['clean']);
};