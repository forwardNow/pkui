/**
 * @fileOverview 应用入口
 * @author 吴钦飞(wuqf@pkusoft.net)
 * @module module:main
 * @requires jquery
 * @requires module:common/launchpad
 * @requires module:common/app
 */
define( function ( require ) {
    "use strict";

    // 载入系统功能URL配置文件
    require( "./config/systemUrl" );
    // 载入通用功能URL配置文件
    require( "./config/commonUrl" );
    // 载入通用功能URL配置文件
    require( "./config/serviceUrl" );

    // 载入全局设置的配置文件
    require( "./config/globalSetting" );

    // 载入配置文件
    require( "./config/shortcut" );

    // 菜单数据源
    require( "./common/menuSource" );

    // 预载入
    require( "template" );

    var
        $ = require( "jquery" ),
        App = require( "./common/app" )

    ;

    require( "placeholderHandler" );

    if ( window.PKUI.isIE8 ) {
        require.async( "../css/page/ie8-hack.css" );
    }




    // DOM树构建完毕后执行
    $( document ).ready( function () {

        // 会话有效性验证（自动初始化）
        require.async( "./page/sessionValidityManager" );

        // 启动 应用（App）系统
        App.init();


        // 页面一打开就显示某个“app”
        new App(null, {
            "icon": "fa fa-users",
            "title": "用户管理",
            "src": "__CTX__/static/desktop/tpl/system/index.html",
            "menuId": 3,
            "mode": "default"
        });




    } );

    // 处理离开网页的情况
    // 当IE8注册“beforeunload”后，点击任何链接，都会提示“是否离开”。
    if ( ! window.PKUI.isIE8 ) {
        $( window ).on( "beforeunload", function () {
            return "确认要离开?";
        } );
    }


} );
