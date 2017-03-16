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
            var _this = this
            ;
            $.ajax( {
                url: this.options.url,
                type: "GET",
                cache: false,
                dataType: "text"
            } ).done( function ( gridResult ) {
                gridResult = window.PKUI.handleGridResult( gridResult );
                if ( gridResult.success == false ) {
                    $.error( "/(ㄒoㄒ)/~~[ 500 ]后台错误！" );
                }
                _this._originData = gridResult.data;
                _this._fmtData = window.PKUI.getTreeList( {
                    data: this._originData
                } );
            } ).fail( function ( jqXHR, textStatus ) {
                $.error( "/(ㄒoㄒ)/~~[ " + textStatus + " ]菜单数据获取失败！" );
            } );
        }
    };
    Menu.defaults = {
        /** 获取菜单数据的URL */
        url: "http://192.168.1.151:8080/pkui/admin/allSysMenuListData",
        /** 图标的基础路径 */
        iconBasePath: "http://localhost:6333/pkui/app/desktop/images/default/small/"
    };

    return Menu;
} );
