module.exports = function(grunt){
'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		dirs: {
			qinaka:'./app/qianka'
			itry: './app/itry',
			comob: './app/comob'
		},

		uglify: {	
			options: {
				stripBanners : true,
				banner : '/* !<%=pkg.name%> - <%=pkg.version%>.js  <%= grunt.template.today("yyyy mm dd")%>'
			},
			build: {
				src: 'src/content-script.js',
				dest: 'build/<%=pkg.name%>-<%=pkg.version%>.js.min.js'
			}
		},
		jshint: {
			testsx: ['Gruntfile.js','src/*.js'],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		watch: {
			build: {
				files: ['src/js/*.js'],
				tasks: ['jshint','uglify'],
				options: {spwan: false}
			}
		},
		transport: {

		},
		concat: {
			common: {
				files: {
					src:
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');


	grunt.registerTask('default',['jshint','uglify','watch']);
};