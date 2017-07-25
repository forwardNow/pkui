module.exports = function ( grunt ) {

    var pkuiConfig
        ;

    pkuiConfig = {

        // 清空 dist 目录
        clean: {
            dist_pkui: [ "dist/pkui/**" ],
            dist_pkui_scss: [ "dist/pkui/**/*.scss" ],
            dist_pkui_js: [ "dist/pkui/**/*.js" ],
            dist_pkui_css: [ "dist/pkui/**/*.css" ],

            app_desktop_doc__js: [ "app/desktop/doc/_js/**" ],

            dist_desktop: [ "dist/desktop/**" ],
            dist_desktop_scss: [ "dist/desktop/**/*.scss" ],
            dist_desktop_js: [ "dist/desktop/**/*.js" ],
            dist_desktop_css: [ "dist/desktop/**/*.css" ],
        },
        copy: {
            srcToDist: {
                files: [
                    {
                        cwd: 'src',
                        src: [ "**" ],
                        dest: 'dist/pkui',
                        expand: true
                    }
                ]
            },
            desktopToDist: {
                files: [
                    {
                        cwd: 'app/desktop',
                        src: [ "**" ],
                        dest: 'dist/desktop',
                        expand: true
                    }
                ]
            }
        },
        // 压缩JS（参考：http://www.cnblogs.com/artwl/p/3449303.html）
        uglify: {
            srcToDist: {//按原文件结构压缩js文件夹内所有JS文件
                files: [ {
                    expand: true,
                    cwd: 'src',//dist目录下
                    src: '**/*.js',//所有js文件
                    dest: 'dist/pkui'//输出到此目录下
                } ]
            },
            desktopToDist: {
                files: [ {
                    expand: true,
                    cwd: 'app/desktop',//dist目录下
                    src: '**/*.js',//所有js文件
                    dest: 'dist/desktop'//输出到此目录下
                } ]
            }
        },

        // 压缩css
        cssmin: {
            srcToDist: {
                files: [ {
                    expand: true,
                    cwd: 'src',//dist目录下
                    src: '**/*.css',//所有js文件
                    dest: 'dist/pkui'//输出到此目录下
                } ]
            },
            desktopToDist: {
                files: [ {
                    expand: true,
                    cwd: 'app/desktop',//dist目录下
                    src: '**/*.css',//所有js文件
                    dest: 'dist/desktop'//输出到此目录下
                } ]
            }
        },
        jsdoc: {
            desktopApp: {
                src: [
                    "app/desktop/js/base/*.js",
                    "app/desktop/js/common/*.js",
                    "app/desktop/js/page/*.js",
                    "app/desktop/js/*.js"
                    //"app/desktop/js/base/utils.js"
                ],
                options: {
                    destination: 'app/desktop/doc/_js',
                    // template: "node_modules/minami"
                    // template : "node_modules/ink-docstrap/template"
                    template: "node_modules/docdash"
                }
            }
        },
        concat: {
            pkuiConfig: {
                src: [
                        // 'src/lib/sea-modules/seajs/3.0.0/sea.js',
                        'src/lib/sea-modules/seajs/2.3.0/sea.js',
                        // 'src/lib/sea-modules/seajs/2.3.0/sea-debug.js',
                        "src/lib/sea-modules/seajs-preload/1.0.0/seajs-preload.js",
                        "src/lib/sea-modules/seajs-css/1.0.0/seajs-css.js",
                        "src/lib/sea-modules/seajs-text/1.1.1/seajs-text.js",
                        'src/_config.js'
                        // 'src/lib/jquery/1.11.3.x/jquery.js',
                        //'src/_pkui.js'
                ],
                dest: 'src/pkui.js'
            }
        },
        shell: {
            copyToEclipse: {
                command: [
                    // $EclipseWorkspace$/pkui/WebContent/static
                    "cd /Users/forwardNow/develop/workspace/pkui/WebContent/static",
                    "rm -Rf ./pkui/*",
                    "rm -Rf ./desktop/*",
                    "cp -R /Users/forwardNow/develop/work/pkusoft/pkui/src/* ./pkui/",
                    "cp -R /Users/forwardNow/develop/work/pkusoft/pkui/app/desktop/* ./desktop/",
                    // sed -i '' 's/..\/..\/src\/pkui.js/..\/pkui\/pkui.js/g' ./desktop/index.html
                    "sed -i '' 's/..\\/..\\/src\\/pkui.js/..\\/pkui\\/pkui.js/g' ./desktop/index.html"
                ].join('&&')
            }
        }

    };


    // Project configuration.
    grunt.initConfig( pkuiConfig );

    // 加载插件。
    grunt.loadNpmTasks( 'grunt-contrib-clean' );
    grunt.loadNpmTasks( 'grunt-contrib-copy' );
    // grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks( 'grunt-jsdoc' );
    grunt.loadNpmTasks('grunt-contrib-concat');


    grunt.registerTask( 'build_pkui', [
        "clean:dist_pkui",
        "copy:srcToDist",
        "clean:dist_pkui_scss",

        "clean:dist_pkui_js",
        "uglify:srcToDist",

        "clean:dist_pkui_css",
        "cssmin:srcToDist"
    ] );

    grunt.registerTask( 'build_desktop', [
        "clean:dist_desktop",
        "copy:desktopToDist",
        "clean:dist_desktop_scss",

        "clean:dist_desktop_js",
        "uglify:desktopToDist",

        "clean:dist_desktop_css",
        "cssmin:desktopToDist"
    ] );


    grunt.registerTask( 'concat-pkui-config', [
        'concat:pkuiConfig'
        // "uglify:buildPkui"
    ] );

    grunt.registerTask( 'build_eclipse', [
        'shell:copyToEclipse'
        // "uglify:buildPkui"
    ] );

    // 默认被执行的任务列表。
    //grunt.registerTask('default', [ 'framework']);
};