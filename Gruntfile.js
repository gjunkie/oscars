module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    shell: {
      mongodb: {
        command: 'sh startMongoIfNotRunning.sh',
        options: {
          stdin: false,
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-shell-spawn');

  // Default task(s).
  grunt.registerTask('default', ['shell']);

};
