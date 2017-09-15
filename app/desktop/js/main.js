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
        Launchpad = require( "./common/launchpad" ),
        App = require( "./common/app" ),
        AppSearch = require( "./common/app-search" ),
        AppSidebar = require( "./common/app-sidebar" )

    ;

    require( "placeholderHandler" );

    if ( window.isIE8 ) {
        require( "../css/page/ie8-hack.css" );
    }




    // DOM树构建完毕后执行
    $( document ).ready( function () {

        // 会话有效性验证（自动初始化）
        require( "./page/sessionValidityManager" );

        // 启动 Launchpad
        Launchpad.init();

        // 启动 应用（App）系统
        App.init();

        // 启动搜索功能
        new AppSearch( {
            targetSelector: "#topbar-toolbar-search"
        } );

        // 启动应用侧边栏
        new AppSidebar( {
            toggleSelector: "#topbar-history",
            sidebarSelector: "#daSidebar",
            sidebarBodySelecotr: "#da-sidebar-body",
            oftenUsedUrl: "__CTX__/admin/oftenUsedSysMenu",
            recentUsedUrl: "__CTX__/admin/recentUsedSysMenu",
            saveUsedMenuUrl: "__CTX__/admin/saveUsedMenu",

            maxOftenUsedItemNum: 6,
            maxRecentUsedItemNum: 10
        } );

        // 右下角下拉菜单功能（自动初始化）
        require( "./page/toolbarUserDropdown" );


        // 顶部用户信息
        var
            $daTopUsername = $( "#daTopUsername" ),
            $daTopDeptName = $( "#daTopDeptName" )
        ;
        $.ajax( {
            url: "{% system.user.getCurrentSysUser %}"
        } ).done( function( jsonResult ) {
            var
                sysUser,
                msg
            ;
            if ( jsonResult && jsonResult.success === true ) {
                sysUser = jsonResult.data;
            }
            if ( ! sysUser || ! sysUser.hasOwnProperty( "userName" )) {
                msg = "unknown response";
                $daTopUsername.html( msg );
                $daTopDeptName.html( msg );
                return;
            }
            $daTopUsername.html( sysUser.userName );

            if ( ! sysUser.deptName && sysUser.deptId ) {
                require.async( "dataSource", function ( DataSource ) {
                    $daTopDeptName.html( DataSource.getDicValue( "DIC_DEPT", sysUser.deptId ) );
                } );
            } else {
                $daTopDeptName.html( sysUser.deptName );
            }

        } ).error( function() {
            $daTopUsername.html( "[error]view console!" )
            $daTopDeptName.html( "[error]view console!" )
        } );
    } );

    // 处理离开网页的情况
    $( window ).on( "beforeunload", function () {
        return "确认要离开?";
    } );

} );
