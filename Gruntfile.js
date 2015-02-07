module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'js/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';'
      },
      dist: {
        // the files to concatenate
        src: ['js/qrcode.js', 'js/grid.js', 'js/version.js', 'js/detector.js', 'js/formatinf.js', 'js/errorlevel.js', 'js/bitmat.js', 'js/datablock.js', 'js/bmparser.js', 'js/datamask.js', 'js/rsdecoder.js', 'js/gf256poly.js', 'js/gf256.js', 'js/decoder.js', 'js/findpat.js', 'js/alignpat.js', 'js/databr.js', 'js/main.js', 'js/iban.js'],
        // the location of the resulting JS file
        dest: 'js/<%= pkg.name %>.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify']);

};