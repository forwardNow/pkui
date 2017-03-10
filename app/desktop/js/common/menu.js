/**
 * @fileOverview 菜单类
 * @author 吴钦飞（wuqf@pkusoft.net）
 *
 * @module module:common/menu
 * @requires module:jquery
 */
define( function ( require ) {
    var $,
        Menu
        ;
    $ = require( "jquery" );
    /**
     * 菜单类
     * @exports module:common/menu
     */
    Menu = {
        /** 参数 */
        options: null,
        /** 原始数据 */
        _originData: null,
        /** 基于原始数据，格式化后的数据 */
        _fmtData: null,
        /**
         * 初始化
         * @memberOf module:common/menu#
         * @param options {*} 参数
         * @returns {*} 链式调用
         */
        init: function ( options ) {
            this.options = $.extend( {}, this.defaults, options );
            this._getData();
            return this;
        },
        /**
         * 获取菜单数据
         * @private
         */
        _getData: function () {

        }
    };
    Menu.defaults = {
        /** 获取菜单数据的URL */
        url: ""
    };

    return Menu;
} );
