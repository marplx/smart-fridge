'use strict';

module.exports = function (grunt) {

    // Read tasks from all dependencies defined in package.json
    require('load-grunt-tasks')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        clean: {
            dist: {
                files: [{
                        dot: true,
                        src: ['dist/*', '.tmp']
                }]
            }
        },

        browserify: {
            options: {
                transform: [['babelify', { presets: ['es2015'] }]]
            },
            dist: {
                files: {
                    // if the source file has an extension of es6 then
                    // we change the name of the source file accordingly.
                    // The result file's extension is always .js
                    'dist/app.js': ['src/scripts/app.js', 'src/scripts/**/*.js', '.tmp/app.constants.js']
                }
            }
        },

        compass: {
            dist: {
                options: {
                    sassDir: 'src/styles',
                    cssDir: 'dist',
                    importPath: [
                        'node_modules/bootstrap-sass/assets/stylesheets/',
                        'node_modules/mdi/scss/'
                    ]
                }
            }
        },

        connect: {
            options: {
                hostname: 'localhost',
                port: 9000,
                livereload: 35729
            },
            proxies: [
                {
                    context: '/api',
                    host: 'localhost',
                    port: 5000,
                    https: false,
                    xforward: false
                }
            ],
            dist: {
                options: {
                    open: 'http://localhost:9000/',
                    base: 'dist',
                    middleware: function (connect, options) {
                        if (!Array.isArray(options.base)) {
                            options.base = [options.base];
                        }

                        // Setup the proxy
                        var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];

                        // Serve static files.
                        options.base.forEach(function (base) {
                            middlewares.push(require('st')({ path: base, url: '/', index: 'index.html', passthrough: true, gzip: false, cache: false }));
                        });

                        return middlewares;
                    }
                }
            }
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['> 5%', 'last 2 versions']
            },
            dist: {
                files: [{
                        expand: true,
                        cwd: 'dist/',
                        src: 'app.css',
                        dest: './dist/'
                }]
            }
        },
        ngtemplates: {
            dist: {
                cwd: 'src/scripts/',
                src: ['**/*.html'],
                dest: 'dist/templates.js',
                options: {
                    module: 'aviatarFridge',
                    htmlmin: { collapseWhitespace: true, collapseBooleanAttributes: true }
                }
            }
        },

        copy: {
            dist: {
                files: [
                    {
                        src: 'index.html',
                        dest: 'dist/index.html'
                    },
                    {
                        cwd: 'node_modules/requirejs/',
                        src: 'require.js',
                        dest: 'dist/requirejs',
                        expand: true
                    },
                    {
                      cwd: 'src/',
                      src: 'assets/**/*',
                      dest: 'dist/',
                      expand: true
                    },
                    {
                      cwd: 'node_modules/mdi/fonts/',
                      src: '*',
                      dest: 'dist/assets/',
                      expand: true
                    }
                ]
            }
        },

        // Configure the server to auto reload on file changes.
        watch: {
            styles: {
                files: ['src/**/*.scss'],
                tasks: ['compass:dist', 'autoprefixer'],
                options: { livereload: true }
            },
            templates: {
                files: ['src/scripts/**/*.html'],
                tasks: ['ngtemplates:dist'],
                options: { livereload: true }
            },
            javascripts: {
                files: ['src/scripts/**/*.js'],
                tasks: ['browserify:dist'],
                options: { livereload: true }
            },
            index: {
                files: ['index.html'],
                tasks: ['copy:dist'],
                options: { livereload: true }
            }
        },

    });


    grunt.registerTask('serve', function () {
        return grunt.task.run([
          'clean',
          'ngtemplates',
          'compass:dist',
          'autoprefixer',
          'browserify:dist',
          'copy:dist',

          'configureProxies:server',
          'connect:dist',
          'watch'
        ]);
    });


    grunt.registerTask('build', [
      'clean',
      'ngtemplates',
      'compass:dist',
      'autoprefixer',
      'browserify:dist',
      'copy:dist'
  ]);

};
