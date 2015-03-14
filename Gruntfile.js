module.exports = function(grunt) {
    'use strict';
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        eslint: {
            all: ['Gruntfile.js', 'src/WaveDrom.js', 'src/Save.js']
        },
        concat: {
            dist: {
                src: ['src/JsonML.js', 'src/WaveDrom.js', 'src/Save.js'],
                dest: 'wavedrom.max.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'wavedrom.max.js',
                dest: 'WaveDrom.js'
            }
        },
        clean: {
            build: ['build'],
            node: ['node_modules']
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task(s).
    grunt.registerTask('default', ['eslint', 'concat', 'uglify']);
};
