module.exports = function(grunt){
'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {	
			dynamic_mappings: {
      		// Grunt will search for "**/*.js" under "lib/" when the "uglify" task
      		// runs and build the appropriate src-dest file mappings then, so you
      		// don't need to update the Gruntfile when files are added or removed.
		      files: [
		        {
		          expand: true,     // Enable dynamic expansion.
		          cwd: 'src/',      // Src matches are relative to this path.
		          src: ['**/*.js'], // Actual pattern(s) to match.
		          dest: 'build/',   // Destination path prefix.
		          ext: '.min.js',   // Dest filepaths will have this extension.
		          extDot: 'first'   // Extensions in filenames begin after the first dot
		        },
		      ],
		    }
		},
		clean: {
			dist:{
				src:['build/llls.js']
			},
			options:{
				'no-write':true
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default',['uglify']);
	grunt.registerTask('clean',['clean']);
};