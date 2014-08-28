module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.initConfig({
    jshint: {
      dev: ['Gruntfile.js', 'app/js/**/*.js']
    },
    clean: {
      dev: {
        src: ['dist/']
      }
    },
    concat: {
      dev: {
        src: ['app/css/**/*.css'],
        dest: 'dist/bundle.css'
      },
    },
    copy: {
      dev: {
        expand: true,
        cwd: 'app/',
        src: ['*.html', 'js/**/*.js', 'icons/**/*.*','*.png' ],
        dest: 'dist/',
        filter: 'isFile'
      }
    },
    browserify: {
      dev: {
        options: {
          transform: ['debowerify', 'hbsfy'],
          debug: true
        },
        src: ['app/js/**/*.js'],
        dest: 'dist/bundle.js'
      }
    },

  });

  grunt.registerTask('build:dev', [ 'jshint:dev', 'clean:dev', 'copy:dev']);
  grunt.registerTask('build:d', ['clean:dev', 'copy:dev', 'concat:dev', 'browserify']);

};
