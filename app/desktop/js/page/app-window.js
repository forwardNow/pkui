/**
 * @fileOverview 应用（App）—— 窗口（AppWindow）
 * @author 吴钦飞(wuqf@pkusoft.net)
 *
 * @module module:page/app-window
 * @requires jquery
 * @requires layer
 */
define( function ( require ) {
    var $,
        layer
        ;

    $ = require( "jquery" );
    layer = require( "layer" );

    /**
     * @classDesc 窗口（AppWindow）类
     * @exports module:page/app-window
     * @alias AppWindow
     * @constructor
     * @param {Object} options 参数
     */
    function AppWindow( options ) {
        this._init( options );
    }

    /**
     * 窗口（AppWindow）实例的默认参数
     * @type {object}
     * @property {string} icon 窗口（AppWindow）图标的URL（推荐使用绝对路径）
     * @property {string} title 窗口（AppWindow）的标题
     */
    AppWindow.prototype.defaults = {
        icon: "",
        title: ""
    };


    // @public
    $.extend( AppWindow.prototype, /** @lends AppWindow.prototype */ {
        /**
         * 显示窗口（AppWindow）。
         * @return {AppWindow} 链式调用
         */
        show: function () {

            var title,
                titleIcon,
                titleText
            ;

            titleIcon = this.options.icon;
            titleText = this.options.title;

            title = '<img src="'+titleIcon+'" style="margin: -1px 10px 0 0;height: 16px; vertical-align: middle;">' + titleText;

            layer.open( {
                type: 1,//Page层类型
                area: [ '500px', '300px' ],
                title: title, // '你好，layer。',
                shade: 0, //遮罩透明度
                maxmin: true, //允许全屏最小化
                anim: 1, //0-6的动画形式，-1不开启
                content: '<div style="padding:50px;">content...</div>'
            } );

            return this;
        }
    } );

    // @private
    $.extend( AppWindow.prototype, /** @lends AppWindow.prototype */ {
        /**
         * 初始化窗口（AppWindow）实例
         * @private
         * @param {Object} options 参数
         * @return {AppWindow} 链式调用
         */
        _init: function ( options ) {
            // 1. 参数
            this.options = $.extend( {}, this.defaults, options );

        }
    } );

    return AppWindow;
} );
