module.exports = function(grunt) {

    var pkuiConfig
        ;

    pkuiConfig = {
        // 清空 dist 目录
        clean: {
            init: {
                files: [
                    { src: 'dist/pkui/**' },
                    { src: 'dist/temp/**' }
                ]
            },
            temp: {
                files: [
                    { src: 'dist/temp/**/*.scss' },
                    { src: 'dist/temp/**/*.css' },
                    { src: 'dist/temp/**/*.js' }
                ]
            },
            destory: {
                files: [
                    { src: 'dist/temp/**' }
                ]
            }
        },
        copy: {
            pkui: {
                files: [
                    {
                        cwd: 'src',
                        src: [ '**' ],
                        dest: 'dist/temp',
                        expand: true
                    }
                ]
            }
        },
        // 压缩JS（参考：http://www.cnblogs.com/artwl/p/3449303.html）
        uglify: {
            buildall: {//按原文件结构压缩js文件夹内所有JS文件
                files: [{
                    expand:true,
                    cwd:'src',//dist目录下
                    src:'**/*.js',//所有js文件
                    dest: 'dist/pkui'//输出到此目录下
                }]
            }
        },

        // 压缩css
        cssmin: {
            buildall: {
                files: [{
                    expand:true,
                    cwd:'src',//dist目录下
                    src:'**/*.css',//所有js文件
                    dest: 'dist/pkui'//输出到此目录下
                }]
            }
        }

    };


    // Project configuration.
    grunt.initConfig(pkuiConfig);

    // 加载插件。
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    // grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    // grunt.loadNpmTasks('grunt-shell');


    grunt.registerTask('pkui', [
        'clean:init', // 清理
        'copy:pkui', // 拷贝
        "clean:temp",
        'uglify:buildall', // 压缩js到临时目录
        'cssmin:buildall', // 压缩css到临时目录
        'clean:destory'
    ] );

    // 默认被执行的任务列表。
    //grunt.registerTask('default', [ 'framework']);
};