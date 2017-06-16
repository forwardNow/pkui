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
    var
        $ = require( "jquery" ),
        Launchpad = require( "./common/launchpad" ),
        App = require( "./page/app" ),
        Template = require( "template" ),
        Search = require( "./common/search" )
    ;

    if ( window.isIE8 ) {
        seajs.use( "./css/page/ie8-hack.css" );
    }

    // DOM树构建完毕后执行
    $( document ).ready( function () {

        // 启动 Launchpad
        Launchpad.init();

        // 启动 应用（App）系统
        App.init();

        // 启动搜索功能
        new Search( $( "#topbar-toolbar-search" ),
            { menuUrl: "__CTX__/admin/sysMenuListData" } );

    } );
} );
