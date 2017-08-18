/**
 * @fileoverview
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
 *
 * @author 吴钦飞（wuqf@pkusoft.net）
 */
define( function( require ) {
    var
        SessionValidityManager,
        $ = require( "jquery" ),
        PlaceholderHandler = require( "placeholderHandler" )
    ;


    SessionValidityManager = {

        url: "{% system.user.getCurrentSysUser %}",

        pkuiLoginUrl: "{% system.login.pkuiLogin %}",

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
            var
                pkuiLoginUrl = PlaceholderHandler.process( this.pkuiLoginUrl )
            ;


            msg = msg || "由于您长时间未操作，导致会话过期，请您重新 <a href='" + pkuiLoginUrl + "' target='_self'>登陆</a>";

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

    // 初始化
    SessionValidityManager.init();

    return SessionValidityManager;
} );