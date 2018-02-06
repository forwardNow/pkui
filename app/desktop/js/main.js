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
        Launchpad = require( "./common/launchpad" ),
        App = require( "./common/app" ),
        AppSearch = require( "./common/app-search" ),
        AppSidebar = require( "./common/app-sidebar" )

    ;

    require( "placeholderHandler" );

    if ( window.PKUI.isIE8 ) {
        require.async( "../css/page/ie8-hack.css" );
    }




    // DOM树构建完毕后执行
    $( document ).ready( function () {

        // 会话有效性验证（自动初始化）
        require.async( "./page/sessionValidityManager" );

        // 此行代码置于 “Launchpad.init();” 之上
        $( ".launchpad-container" ).on( "launchpadInited.pkui shortcutLoaded.pkui",
            /**
             * @description 处理快捷方式溢出容器的情况
             * @param event
             */
            function handleShortcutOverflow( event ) {
                var
                    $launchpadViewPageList,
                    containerHeight,
                    $launchpadShortcutpad,
                    conentHeight,
                    $newLaunchpadViewageItem,
                    $newLaunchpadShortcutpad,
                    newSlide
                ;

                if ( event.type === "launchpadInited" ) {
                    handleShortcutOverflow[ "launchpadInited" ] = true;
                }
                if ( event.type === "shortcutLoaded" ) {
                    handleShortcutOverflow[ "shortcutLoaded" ] = true;
                }

                if ( ! handleShortcutOverflow[ "launchpadInited" ] ||
                    ! handleShortcutOverflow[ "shortcutLoaded" ] ) {
                    return;
                }

                $launchpadViewPageList = $( ".launchpad-view-pageList" );
                containerHeight = $launchpadViewPageList.height();
                $launchpadShortcutpad = $( ".launchpad-shortcutpad" ).last();
                conentHeight = $launchpadShortcutpad.height();

                if ( conentHeight <= containerHeight ) {
                    return;
                }

                $newLaunchpadViewageItem = $(
                    "<div class=\"launchpad-view-pageItem swiper-slide\">" +
                    "<div class=\"launchpad-shortcutpad\"></div>" +
                    "</div>" );
                $newLaunchpadShortcutpad = $newLaunchpadViewageItem.find( ".launchpad-shortcutpad" );

                while( conentHeight > containerHeight ) {

                    $newLaunchpadShortcutpad.prepend(
                        $launchpadShortcutpad.children( ".launchpad-shortcut" ).last()
                    );

                    conentHeight = $launchpadShortcutpad.height();
                }

                newSlide = Launchpad.swiper.createSlide( $newLaunchpadViewageItem.html(), "launchpad-view-pageItem swiper-slide" );
                Launchpad.swiper.insertSlideAfter( $launchpadShortcutpad.parent().index(), newSlide );

                handleShortcutOverflow( {} );
            }
        );

        // 启动 Launchpad
        Launchpad.init();

        // 启动 应用（App）系统
        App.init();

        // 启动搜索功能
        new AppSearch( {
            targetSelector: "#da-top-search"
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
        // require( "./page/toolbarUserDropdown" );

        require.async( [
            "./page/toolbar/userInfo",
            "./page/toolbar/exitSystem",
            "./page/toolbar/modifyPassword"
        ], function ( UserInfo, ExitSystem, ModifyPassword ) {
            // 所属单位
            UserInfo.inject( "#daTopDeptName", "deptId", "DIC_DEPT" );

            // 用户名
            UserInfo.inject( "#daTopUsername", "userName" );

            // 退出
            $( "#da-top-exit" ).on( "click.exit", function () {
                ExitSystem.exitAndGotoLoginPage( true );
            } );

            // 修改密码
            $( "#da-top-modifyPassword" ).on( "click.modifyPassword", function () {
                ModifyPassword.open();
            } );
        } );

    } );

    // 处理离开网页的情况
    // 当IE8注册“beforeunload”后，点击任何链接，都会提示“是否离开”。
    if ( ! window.PKUI.isIE8 ) {
        $( window ).on( "beforeunload", function () {
            return "确认要离开?";
        } );
    }


} );
