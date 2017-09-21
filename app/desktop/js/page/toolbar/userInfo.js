/**
 * @fileOverview
 *      获取用户相关信息，并注入指定元素内。
 *      如果执行 UserInfo.inject() 时，还未获取SysUser对象，
 *      则缓存传入inject()方法的参数列表，待获取SysUser对象后，立马根据缓存的参数列表挨个执行inject()。
 * @author 吴钦飞（wuqf@pkusoft.net）
 */
define( function ( require ) {
    "use strict";
    var
        $ = require( "jquery" ),
        UserInfo = {}
    ;

    UserInfo.defaults = {
        url: "{% system.user.getCurrentSysUser %}"
    };

    /**
     * 用户对象
     * @type {{}}
     */
    UserInfo.sysUser = null;

    /**
     * 缓存的 inject() 的参数列表，元素类型为 arguments
     * @type {Array}
     * @private
     */
    UserInfo._argumentList = [];

    /**
     * 初始化方法
     * @private
     */
    UserInfo._init = function () {
        this.getCurrentUser();
    };

    /**
     * 获取用户对象
     * @param callback {Function?}
     * @private
     */
    UserInfo.getCurrentUser = function ( callback ) {
        var
            _this = this,
            i, len
        ;

        if ( UserInfo.sysUser ) {
            $.isFunction( callback ) && callback( UserInfo.sysUser );
            return;
        }

        $.ajax( {
            url: this.defaults.url
        } ).done( function( jsonResult ) {
            if ( jsonResult && jsonResult.success === true ) {
                UserInfo.sysUser = jsonResult.data;
                $.isFunction( callback ) && callback( UserInfo.sysUser );
                // 如果缓存有值，则执行。
                if ( _this._argumentList.length > 0 ) {
                    for ( i = 0, len = _this._argumentList.length; i < len; i++ ) {
                        _this.inject.apply( _this, _this._argumentList.pop() );
                    }
                }
            } else {
                throw "获取当前用户对象失败！"
            }
        } );
    };

    /**
     * 将 UserInfo.sysUser 的某个属性的值 注入 到指定目标。可以指定字典对值进行翻译
     * @param target {jQuery|String|Element} 目标元素，可以为CSS选择器、jQuery对象、DOM对象
     * @param sysUserPropertyName {String}
     * @param dicName {String?}
     */
    UserInfo.inject = function ( target, sysUserPropertyName, dicName ) {
        var
            $target,
            value
        ;

        if ( ! target ) {
            console.error( "目标原始为空！" );
            return;
        } else if ( typeof target === "string" ) {
            $target = $( target );
        } else if ( target[ "jquery" ] ) {
            $target = target;
        } else {
            $target = $( target );
        }

        // 如果获取到值，则进行缓存
        if ( ! UserInfo.sysUser ) {
            this._argumentList.push( arguments );
            return;
        }

        if ( ! UserInfo.sysUser.hasOwnProperty( sysUserPropertyName ) ) {
            throw "UserInfo.sysUser 不存在属性：" + sysUserPropertyName;
        }

        value = UserInfo.sysUser[ sysUserPropertyName ];

        if ( dicName ) {
            require.async( "dataSource", function ( DataSource ) {
                value = DataSource.getDicValue( dicName, value );
                $target.html( value );
            } );
        } else {
            $target.html( value );
        }

    };

    // 初始化
    UserInfo._init();

    return UserInfo;
} );