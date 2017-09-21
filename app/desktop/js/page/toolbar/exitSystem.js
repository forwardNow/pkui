/**
 * @fileOverview 退出系统
 * @author 吴钦飞（wuqf@pkusoft.net）
 */
define( function ( require ) {
    "use strict";
    var
        $ = require( "jquery" ),
        ExitSystem = {}
    ;

    /**
     * 默认参数
     * @type {{}}
     */
    ExitSystem.defaults = {
        doLogoutUrl: "{% system.login.doLogout %}",
        loginPageUrl: "{% system.login.pkuiLogin %}",
        exitSuccessMsg: "成功退出系统！",
        exitSuccessAndGotoLoginMsg: "成功退出系统！3秒后返回登陆页。",
        exitErrorMsg: "退出系统失败！"
    };

    /**
     * 注销
     * @param isPopConfirm {Boolean?} 是否弹出确认框，以确认是否执行注销操作
     * @param successCallback {Function?}
     * @param failCallback {Function?}
     */
    ExitSystem.logout = function ( isPopConfirm, successCallback, failCallback ) {
        if ( isPopConfirm ) {
            // 进行确认
            window.layer.confirm(
                "是否退出登录？",
                {
                    btn: ['退出登录','继续操作'] //按钮
                },
                // 确认
                function( index ){
                    operate();
                    layer.close( index );
                },
                // 取消
                function(){
                    // do something
                }
            );
        } else {
            operate();
        }

        function operate() {
            $.ajax( {
                url: ExitSystem.defaults.doLogoutUrl
            } ).done( function( jsonResult ) {
                var
                    isSuccess = true
                ;
                // 如果是 com.pkusoft.framework.model.JsonResult
                if ( typeof jsonResult === "object" ) {

                    if ( jsonResult.success === true ) {
                        // isSuccess = true
                    } else {
                        isSuccess = false;
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

                if ( isSuccess === true ) {
                    $.isFunction( successCallback ) && successCallback();
                    console.info( ExitSystem.defaults.exitSuccessMsg );
                } else {
                    $.isFunction( failCallback ) && failCallback();
                    console.error( ExitSystem.defaults.exitErrorMsg );
                }

            } ).error( function( xhr ) {
                console.error( "处理失败：" + xhr.status + " (" + xhr.statusText + ")" );
                $.isFunction( failCallback ) && failCallback();
            } );
        }

    };

    /**
     * 注销后跳转到登陆页
     * @param isPopConfirm {Boolean?} 是否弹出确认框，以确认是否执行注销操作
     * @param successCallback {Function?}
     * @param failCallback {Function?}
     */
    ExitSystem.exitAndGotoLoginPage = function ( isPopConfirm, successCallback, failCallback) {

        ExitSystem.logout( isPopConfirm,
            function () {
                $.isFunction( successCallback ) && successCallback();
                window.layer.msg( ExitSystem.defaults.exitSuccessAndGotoLoginMsg, {
                    icon: 1,
                    time: 3000,
                    end: function() {
                        require.async( "placeholderHandler", function ( PlaceholderHandler ) {
                            window.location = PlaceholderHandler.process( ExitSystem.defaults.loginPageUrl );
                        });
                    }
                } );
            },
            function () {
                $.isFunction( failCallback ) && failCallback();
            }
        );

    };

    return ExitSystem;
} );