/**
 * @fileOverview 应用入口
 * @author 吴钦飞(wuqf@pkusoft.net)
 * @module module:main
 * @requires jquery
 * @requires module:common/launchpad
 * @requires module:common/template
 * @requires module:common/app
 */
define( function ( require ) {
    var
        $ = require( "jquery" ),
        Launchpad = require( "./common/launchpad" ),
        App = require( "./common/app" ),
        Template = require( "template" ),
        AppSearch = require( "./common/app-search" ),
        AppSidebar = require( "./common/app-sidebar" )
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
        new AppSearch( {
            targetSelector: "#topbar-toolbar-search",
            menuUrl: "__CTX__/admin/sysMenuListData"
        } );

        // 启动应用侧边栏
        new AppSidebar( {
            toggleSelector: "#topbar-history",
            sidebarSelector: "#daSidebar",
            menuUrl: "__CTX__/admin/sysMenuListData",
            oftenUsedUrl: "__CTX__/admin/oftenUsedSysMenu",
            recentUsedUrl: "__CTX__/admin/recentUsedSysMenu",
            saveUsedMenuUrl: "__CTX__/admin/saveUsedMenu"
        } );

    } );
} );
