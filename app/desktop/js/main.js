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
        AppSidebar = require( "./common/app-sidebar" ),
        PlaceholderHandler = require( "placeholderHandler" ),
        ToolbarUserDropdown,
        SessionValidityManager
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

    /**
     * 用于判断当前用户登录（session）是否失效
     *
     *      1. 页面载入后，校验一次。
     *      2. 每隔10分钟，可校验一次，标志 canCheck=true；
     *         但为了避免频繁请求，造成session“永不过期”，需要在以下时机发送请求进行校验：
     *
     *         1）页面发生 “click” 事件，
     *         2）页面发生 “focus” 事件。
     *
     *         也就是说，在发生 “click”、“focus” 事件后，如果 canCheck==true 则进行校验
     */
    SessionValidityManager = {

        url: "{% system.user.getCurrentSysUser %}",

        currentSysUser: null,

        canCheck: true,

        timerId: null,
        // 检测间隔
        checkInterval: 10 * 60 * 1000,

        namespace: "SessionValidityManager",

        init: function () {
            this._bind();
        },
        _bind: function () {
            var
                _this = this
            ;
            $( document ).on( "focus." + this.namespace + " click." + this.namespace, function () {

                if ( ! _this.canCheck ) {
                    return;
                }

                _this.canCheck = false;

                window.setTimeout( function() {

                    _this.doCheck();

                }, 10000 );

            } );

            // 每隔10分钟，重置一次
            _this.timerId = window.setTimeout( function () {

                _this.canCheck = true;

            }, _this.checkInterval );

        },
        doCheck: function () {
            var
                _this = this
            ;
            $.ajax( {
                url: this.url
            } ).done( function( jsonResult ) {

                // 能执行到这里，说明 session 是有效的

                if ( jsonResult && jsonResult.success === true ) {
                    _this.currentSysUser = jsonResult.data;
                }
                if ( ! _this.currentSysUser || ! _this.currentSysUser.hasOwnProperty( "userName" )) {
                    console.error( "unknow response, please return JsonResult{ \"success\": Boolean, \"data\": {SysUser} }" );
                }

                // _this.canCheck = true;

                console.info( "会话有效性校验成功！" );

            } ).fail( function( xhr ) {
                var
                    statusCode = xhr.status
                ;
                // 登陆已经失效
                if ( statusCode === 200 || statusCode === 404 ) {
                    _this.showAlert();
                }
                else if ( statusCode === 0 )  {
                    /*
                    可能原因
                        1、url不存在
                        2、url不可达
                        3、发送了跨域请求
                        4、数据格式错
                        5、ajax在完成之前请求已经被取消（ajax请求没有发出），
                           例如：页面已经跳转或跳转太快、浏览器输入新的url、按钮立即新的点击等
                     */
                }
            } );
        },
        showAlert: function ( msg ) {
            msg = msg || "由于您长时间未操作，导致会话过期，请您重新 <a href='" + window.PKUI.ctxPath + "' target='_self'>登陆</a>";

            if ( $( "#" + this.namespace ).size() > 0 ) {
                return;
            }

            $( document.body ).append(
                '<div id="' + this.namespace + '" class="alert alert-warning text-center" style="position:fixed; z-index: 99999; top: 0; left: 0; width: 100%;">'
                +     msg
                + '</div>'
            );
        }
    };

    // 会话过期校验
    SessionValidityManager.init();


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
