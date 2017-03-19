/**
 * @fileOverview 应用入口
 * @author 吴钦飞(wuqf@pkusoft.net)
 * @module module:main
 * @requires jquery
 * @requires module:common/launchpad
 * @requires module:common/template
 * @requires module:page/app
 */
define( function ( require ) {
    var $ = require( "jquery" );
    var Launchpad = require( "./common/launchpad" );
    var App = require( "./page/app" );
    var Template = require( "./common/template" );

    if ( window.isIE8 ) {
        seajs.use( "./css/page/ie8-hack.css" );
    }

    // DOM树构建完毕后执行
    $( document ).ready( function () {

        // 设置模板引擎的参数
        Template.setOptions( { base: "./tpl/" } );

        // 启动 Launchpad
        Launchpad.init();

        // 启动 应用（App）系统
        App.init();
    } );
} );
