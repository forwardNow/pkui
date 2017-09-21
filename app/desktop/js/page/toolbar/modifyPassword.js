/**
 * @fileOverview 修改密码功能
 * @author 吴钦飞（wuqf@pkusoft.net）
 */
define( function ( require ) {
    "use strict";
    var
        $ = require( "jquery" ),
        UserInfo = require( "./userInfo" ),
        ModifyPassword = {}
    ;

    /**
     * 默认参数
     */
    ModifyPassword.defaults = {
        loginPageUrl: "{% system.login.pkuiLogin %}",
        templateUrl: window.PKUI.ctxPath + "/static/desktop/tpl/system/user/modifyPassword.html",
    };

    /**
     * 打开弹框修改密码
     * @param loginPageUrl
     * @param templateUrl
     */
    ModifyPassword.open = function ( loginPageUrl, templateUrl ) {
        var
            layerIndex,
            $layerContent
        ;
        loginPageUrl = loginPageUrl || ModifyPassword.defaults.loginPageUrl;
        templateUrl = templateUrl || ModifyPassword.defaults.templateUrl;

        UserInfo.getCurrentUser( function ( sysUser ) {

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

                    require.async( "template", function ( Template ) {

                        Template.getModelAndView( templateUrl, sysUser, function ( htmlString ) {
                            if ( ! $layerContent ) {
                                return;
                            }
                            // 关闭 loading
                            $layerContent.isLoading( "hide" );

                            $layerContent.html( htmlString );
                        } );
                    } );


                },
                end: function () {
                    $layerContent = null;
                }
            } );


        } );

        $( document ).one( "modifySysUserPasswordSuccess", function () {
            layer.close( layerIndex );
            require.async( "placeholderHandler", function ( PlaceholderHandler ) {
                window.location = PlaceholderHandler.process( loginPageUrl );
            } );
        } );
    };


    return ModifyPassword;
} );