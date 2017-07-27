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

    // 菜单数据源
    require( "./common/menuSource" );

    //
    require( "template" );

    var
        $ = require( "jquery" ),
        Launchpad = require( "./common/launchpad" ),
        App = require( "./common/app" ),
        AppSearch = require( "./common/app-search" ),
        AppSidebar = require( "./common/app-sidebar" ),
        PlaceholderHandler = require( "placeholderHandler" ),
        ToolbarUserDropdown
    ;

    if ( window.isIE8 ) {
        require( "../css/page/ie8-hack.css" );
    }


    /**
     * 任务栏上的用户下拉菜单
     */
    ToolbarUserDropdown = {
        $target: null,
        $userName: null,
        $existSystem: null,

        namespace: "toolbar.userDropdown",

        getCurrentSysUserUrl: "{% system.user.getCurrentSysUser %}",
        doLogoutUrl: "{% system.login.doLogout %}",
        loginPageUrl: "{% system.login.login %}",

        init: function () {
            this.render();
            this.bindEvent();
        },
        render: function () {
            this.$target = $( "#toolbarUserDropdown" );
            this.$userName = $( "#toolbarUserDropdown-userName" );
            this.$existSystem = $( "#toolbarUserDropdown-existSystem" );

        },
        bindEvent: function () {
            var
                _this = this,
                namespace = this.namespace
            ;

            // 当第一次打开dropdown时，对用户名进行初始化
            this.$target.one( "click." + namespace, function () {
                _this._injectUserName();
            } );

            // 取消 <a href="..."> 的默认行为
            this.$target.find( "a[href]" ).on( "click." + namespace, function ( event ) {
                event.preventDefault();
            } );

            // 添加“退出系统”功能
            this.$existSystem.on( "click." + namespace, function () {
                _this.existSystem();
            } );

        },
        existSystem: function () {
            var
                _this = this
            ;
            $.ajax( {

                url: this.doLogoutUrl

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
                            window.location = PlaceholderHandler.process( _this.loginPageUrl );
                        }
                    } );

                } else {
                    layer.msg( errorMsg, { icon: 2 } );
                }

            } ).error( function( xhr ) {
                layer.msg( "处理失败：" + xhr.status + " (" + xhr.statusText + ")", { icon: 0 } );
            } );
        },
        _injectUserName: function () {
            var
                _this = this
            ;
            $.ajax( {
                url: _this.getCurrentSysUserUrl
            } ).done( function( jsonResult ) {
                var
                    sysUser
                ;
                if ( jsonResult && jsonResult.success === true ) {
                    sysUser = jsonResult.data;
                }
                if ( ! sysUser || ! sysUser.hasOwnProperty( "userName" )) {
                    _this.$userName.html( "unknown response" );
                    return;
                }
                _this.$userName.html( sysUser.userName );

            } ).error( function() {
                _this.$userName.html( "[error]view console!" )
            } );
        }

    };


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

        // 右下角下拉菜单功能
        ToolbarUserDropdown.init();

    } );

} );
