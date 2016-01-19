'use strict'
module.exports = function (grunt) {
  grunt.initConfig({
    jsdoc2md: {
      oneOutputFile: {
        src: 'api/bucket.js',
        dest: 'artifacts/documentation.md'
      }
    }
  });

  grunt.loadNpmTasks('grunt-jsdoc-to-markdown')
  grunt.registerTask('default', 'jsdoc2md')
}