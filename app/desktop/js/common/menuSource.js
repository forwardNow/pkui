/**
 * @fileOverview 菜单数据源
 * @author 吴钦飞（wuqf@pkusoft.net）
 *
 * @module module:common/menuSource
 * @requires module:jquery
 */
define( function ( require ) {
    "use strict";
    var $ = require( "jquery" ),
        Menu = {},
        layer = window.layer
        ;

    require( "../config/systemUrl" );

    Menu.opts = {
        url: "{% system.menu.sysMenuListData %}"
    };

    Menu.originData = null;
    Menu.originSet = null;

    Menu.init = function ( options ) {
        this.opts = $.extend( true, {}, this.opts, options );
        this._getData();
        return this;
    };

    /**
     * 同步请求获取菜单数据
     * @private
     */
    Menu._getData = function () {
        var _this = this
            ;
        $.ajax( {
            url: this.opts.url,
            async: false
        } ).done( function ( gridResult ) {
            if ( gridResult && ( gridResult.success || gridResult.totalRecords >= 0  ) ) {
                if ( !gridResult.data || gridResult.data.length === 0 ) {
                    console.error( "菜单数据为空。" );
                    return;
                }
                _this.originData = gridResult.data;
            }
            else {
                layer.alert( '请求菜单数据失败：服务器内部错误。', { icon: 0 } );
            }
        } ).fail( function () {
            layer.alert( '请求菜单数据失败。', { icon: 0 } );
        } );
    };


    /**
     * 返回数组副本
     * @param isIncludeInvisibleMenu {Boolean?} 是否包含不可用的菜单
     * @returns {Array}
     */
    Menu.getList = function ( isIncludeInvisibleMenu ) {
        var
            list
        ;
        list = [];

        if ( ! this.originData ) {
            this._getData();
        }

        $.each( this.originData, function ( index, sysMenu ) {
            var copy = $.extend( true, {}, sysMenu );
            if ( isIncludeInvisibleMenu ) {
                list.push( copy );
            } else if ( sysMenu[ "visiable" ] === "1" || sysMenu[ "visiable" ] === 1 ) {
                list.push( copy );
            }
        } );
        return list;
    };

    /**
     * 返回集合副本
     * @param isIncludeInvisibleMenu {Boolean?} 是否包含不可用的菜单
     * @returns {*}
     *
     */
    Menu.getSet = function ( isIncludeInvisibleMenu) {
        var
            set
            ;
        set = {};

        if ( ! this.originData ) {
            this._getData();
        }
        $.each( this.originData, function ( index, sysMenu ) {
            var
                copy = $.extend( true, {}, sysMenu ),
                menuId = copy.menuId
            ;
            if ( isIncludeInvisibleMenu ) {
                set[ menuId ] = copy;
            } else if ( sysMenu[ "visiable" ] === "1" || sysMenu[ "visiable" ] === 1 ) {
                set[ menuId ] = copy;
            }
        } );
        return set;
    };

    /**
     * 根据菜单ID获取菜单对象
     * @param menuId {string|number}
     * @param isClone {boolean?} 是否为副本
     * @returns {{}|null}
     */
    Menu.getSysMenuById = function ( menuId, isClone ) {
        var
            sysMenu
        ;
        if ( ! this.originSet ) {
            this.originSet = this.getSet( true );
        }
        sysMenu = this.originSet[ menuId ];
        if ( ! sysMenu ) {
            return null;
        }
        if ( isClone ) {
            return $.extend( true, {}, sysMenu );
        }
        return sysMenu;
    };

    /**
     * 根据ID获取name
     * @param menuId {string|number}
     */
    Menu.getSysMenuNameById = function ( menuId ) {
        var
            sysMenu = this.getSysMenuById( menuId )
        ;
        if ( !sysMenu ) {
            return "";
        }
        return sysMenu.menuName || "";
    };

    Menu.init();

    PKUI.MenuSource = Menu;

    return Menu;
} );
