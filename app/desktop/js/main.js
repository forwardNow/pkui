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
    "use strict";


    // 载入系统功能URL配置文件
    require( "./config/systemUrl" );

    // 载入全局设置的配置文件
    require( "./config/globalSetting" );

    // 载入配置文件
    require( "./config/shortcut" );

    var
        $ = require( "jquery" ),
        Launchpad = require( "./common/launchpad" ),
        App = require( "./common/app" ),
        Template = require( "template" ),
        AppSearch = require( "./common/app-search" ),
        AppSidebar = require( "./common/app-sidebar" ),
        menuSource = require( "./common/menuSource" ),
        PlaceholderHandler = require( "placeholderHandler" )
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

    } );

    // 退出系统
    if ( ! $.isFunction( window.existSystemAndGoToLogin ) ) {
        /**
         * 注销后，返回登陆页
         * @param existUrl {string?}
         * @param loginUrl {string?}
         */
        window.existSystemAndGoToLogin = function( existUrl, loginUrl ) {

            existUrl = existUrl || "{% system.login.doLogout %}";
            loginUrl = loginUrl || PlaceholderHandler.process( "{% system.login.login %}" );

            $.ajax( {
                url: existUrl
            } ).done( function( jsonResult ) {
                var
                    isSuccess = true,
                    successMsg = "成功退出系统！3秒后返回登陆页。",
                    errorMsg = "退出系统失败！"
                ;
                // 如果是 com.pkusoft.framework.model.JsonResult
                if ( typeof jsonResult === "object" ) {

                    if ( jsonResult.success === true ) {
                        // isSuccess = true
                    } else if ( jsonResult.success === false ) {
                        isSuccess = false;
                    } else {
                        throw "unknown response";
                    }

                }
                // 否则，直接判断
                else {

                    if ( jsonResult ) {
                        // isSuccess = true
                    } else {
                        isSuccess = false;
                    }
                }

                // 根据结果，进行提示
                if ( isSuccess ) {

                    layer.msg( successMsg, {
                        icon: 1,
                        time: 3000,
                        end: function() {
                            window.location = loginUrl;
                        }
                    } );

                } else {
                    layer.msg( errorMsg, { icon: 2 } );
                }

            } ).error( function( xhr ) {
                layer.msg( "处理失败：" + xhr.status + " (" + xhr.statusText + ")", { icon: 0 } );
            } );
        };
    }

    if ( ! $.isFunction( window.handleUserDropdown ) ) {

        window.handleUserDropdown = function ( target ) {
            var
                $target = $( target ),
                currentSysUserUrl = $target.attr( "data-current-sysuser-url" ),
                $currentSysUserUserName = $( "#currentSysUserUserName" )
            ;
            if ( ! $currentSysUserUserName.attr( "inited" ) ) {

                $.ajax( {
                    url: currentSysUserUrl
                } ).done( function( jsonResult ) {
                    var
                        sysUser
                    ;
                    if ( jsonResult && jsonResult.success === true ) {
                        sysUser = jsonResult.data;
                    }
                    if ( ! sysUser ) {
                        $currentSysUserUserName.html( "unknown response" );
                        return;
                    }
                    $currentSysUserUserName.html( sysUser.userName || "sysUser.userName" );
                    $currentSysUserUserName.attr( "inited", true );
                } ).error( function() {
                    $currentSysUserUserName.html( "[error]view console!" )
                } );

            }

        };

    }


} );
