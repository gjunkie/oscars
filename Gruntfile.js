module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concurrent: {
      dev: ['uglify', 'less', 'shell', 'nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },
    uglify: {
      target: {
        files: {
          'dist/scripts/common.min.js': [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/notifly.js/notifly.js',
            'bower_components/formjax/dist/formjax.js'
          ],
          'dist/scripts/home.min.js': [
            'app/www/public/scripts/plugins/countdown.min.js',
            'app/www/public/scripts/home.js'
          ],
          'dist/scripts/profile.min.js': [
            'bower_components/jquery-simplecolorpicker/jquery.simplecolorpicker.js',
            'app/www/public/scripts/profile.js'
          ],
          'dist/scripts/add.min.js': [
            'app/www/public/scripts/add.js'
          ],
          'dist/scripts/vote.min.js': [
            'app/www/public/scripts/vote.js'
          ]
        }
      }
    },
    less: {
      dev: {
        files: {
          "dist/styles/common.css": [
            "app/www/public/styles/reset.less",
            "app/www/public/styles/common.less",
            "app/www/public/styles/typography.less",
            "app/www/public/styles/icon-fonts.less"
          ],
          "dist/styles/home.css": "app/www/public/styles/home.less",
          "dist/styles/add.css": "app/www/public/styles/add.less",
          "dist/styles/vote.css": "app/www/public/styles/vote.less",
          "dist/styles/profile.css": [
            "app/www/public/styles/profile.less",
            "app/www/public/styles/simplecolorpicker.less"
          ],
        }
      }
    },
    nodemon: {
      dev: {
        script: 'index.js'
      }
    },
    shell: {
      make_dir: {
        command: 'mkdir -p db'
      },
      /*
      mongodb: {
        command: 'mongod --dbpath db/',
      }
      */
      mongodb: {
        command: './startMongoIfNotRunning.sh',
        options: {
          stdin: false,
        }
      }
    },
    watch: {
      scripts: {
        files: [
          'app/www/public/scripts/*.js',
          'app/www/public/styles/*.less'
        ],
        tasks: ['uglify', 'less'],
        options: {
          spawn: false,
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-shell-spawn');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');

  // Default task(s).
  grunt.registerTask('default', ['concurrent:dev']);

};
