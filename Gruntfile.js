'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    connect: {
      options: {
        port: 9999,
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: 'docs'
        }
      }
    },
    watch: {
      update: {
        files: ['src/**/*.css', 'src/**/*.md', 'src/template.html'],
        tasks: ['newer:copy:docs', 'newer:markdown']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: ['docs/**/*.html', 'docs/css/index.css'],
      }
    },

    clean: {
      docs:  ['docs/**/*.css', 'docs/**/*.html']
    },
    copy: {
      docs: {
        expand: true,
        cwd: 'src/',
        src: '**/*.css',
        dest: 'docs/'
      }
    },
    markdown: {
      all: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: '**/*.md',
            dest: 'docs/',
            ext: '.html'
          }
        ],
        options: {
          template: 'src/template.html',
          markdownOptions: {
            gfm: true,
            highlight: 'manual'
          },
          postCompile : function(html, templateContext) {
            var $ = require('cheerio').load(html);
            templateContext.rooturl = '.';
            templateContext.title = $('h1').first().text() || $('h2').first().text() || $('h3').first().text();
            return html;
          }
        }
      }
    }
  });

  grunt.registerTask('build', [
    'clean:docs', 
    'copy:docs', 
    'markdown'
  ]);

  grunt.registerTask('default', [
    'build',
    'connect:livereload',
    'watch'
  ]);
};
