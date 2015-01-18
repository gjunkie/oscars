module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concurrent: {
      dev: ['uglify', 'shell']
    },
    uglify: {
      my_target: {
        files: {
          'dist/scripts.min.js': [
            'app/www/public/scripts/add.js',
           ]
        }
      }
    },
    nodemon: {
      dev: {
        script: 'index.js'
      }
    },
    shell: {
      mongodb: {
        command: 'sh startMongoIfNotRunning.sh',
        options: {
          stdin: false,
        }
      }
    },
    watch: {
      scripts: {
        files: ['app/www/public/scripts/*.js'],
        tasks: ['uglify'],
        options: {
          spawn: false,
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-shell-spawn');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');

  // Default task(s).
  grunt.registerTask('default', ['concurrent:dev', 'nodemon', 'watch']);

};
