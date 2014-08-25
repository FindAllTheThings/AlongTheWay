module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    jshint: {
      dev: ['Gruntfile.js', 'app/js/**/*.js']
    },
    clean: {
      dev: {
        src: ['dist/']
      }
    },
    copy: {
      dev: {
        expand: true,
        cwd: 'app/',
        src: ['*.html', 'css/**/*.css', 'js/**/*.js'],
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
    }
  });
  grunt.registerTask('build:dev', [ 'jshint:dev', 'clean:dev', 'copy:dev']);
  grunt.registerTask('build:d', ['clean:dev', 'copy:dev']);

};
