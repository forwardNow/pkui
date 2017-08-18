/**
 * @fileoverview 任务栏上的用户下拉菜单
 * @author 吴钦飞（wuqf@pkusoft.net）
 */
define( function( require ) {

    var
        ToolbarUserDropdown,
        $ = require( "jquery" ),
        PlaceholderHandler = require( "placeholderHandler" ),
        Template = require( "template" )
    ;

    ToolbarUserDropdown = {
        $target: null,
        $userName: null,
        $existSystem: null,
        $modifyPassword: null,

        namespace: "toolbar.userDropdown",

        getCurrentSysUserUrl: "{% system.user.getCurrentSysUser %}",
        doLogoutUrl: "{% system.login.doLogout %}",
        loginPageUrl: "{% system.login.pkuiLogin %}",

        modifyPasswordTplUrl: window.PKUI.ctxPath + "/static/desktop/tpl/system/user/modifyPassword.html",

        init: function () {
            this.render();
            this.bindEvent();
        },
        render: function () {
            this.$target = $( "#toolbarUserDropdown" );
            this.$userName = $( "#toolbarUserDropdown-userName" );
            this.$existSystem = $( "#toolbarUserDropdown-existSystem" );
            this.$modifyPassword = $( "#toolbarUserDropdown-modifyPassword" );

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

            // 添加“修改密码”功能
            this.$modifyPassword.on( "click." + namespace, function () {
                _this.modifyPassword();
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
        modifyPassword: function () {
            var
                _this = this,
                viewUrl = this.modifyPasswordTplUrl,
                modelUrl = this.getCurrentSysUserUrl,
                $layerContent,
                layerIndex
            ;

            layerIndex = layer.open( {
                id: "modifySysUserPassword",
                title: "修改用户密码",
                type: 1,
                skin: 'layui-layer-rim', //加上边框
                area: ['600px', '420px'], //宽高
                content: '',
                success: function ( layero ) {

                    $layerContent = layero.find( ".layui-layer-content" );

                    // 开启loading
                    $layerContent.isLoading();

                    Template.getModelAndView( viewUrl, modelUrl, function ( htmlString ) {
                        if ( ! $layerContent ) {
                            return;
                        }
                        // 关闭 loading
                        $layerContent.isLoading( "hide" );

                        $layerContent.html( htmlString );
                    } );

                },
                end: function () {
                    $layerContent = null;
                }
            } );

            $( document ).one( "modifySysUserPasswordSuccess", function () {
                layer.close( layerIndex );
                window.location = PlaceholderHandler.process( _this.loginPageUrl );
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

    //
    $( document ).ready( function() {
        ToolbarUserDropdown.init();
    } );

    return ToolbarUserDropdown;
} );