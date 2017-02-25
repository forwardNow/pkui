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
        this.appInstance = null;
        this.options = null;
        // layer弹窗对应的index
        this.windowIndex = null;
        this.windowContainer = null;
        this.windowTitle = null;
        this.windowContent = null;
        this._init( options );
    }

    /**
     * 窗口（AppWindow）实例的默认参数
     * @type {object}
     * @property {string} icon 窗口（AppWindow）图标的URL（推荐使用绝对路径）
     * @property {string} title 窗口（AppWindow）的标题
     * @property {string} windowWidth 窗口（AppWindow）的宽度
     * @property {string} windowHeight 窗口（AppWindow）的高度
     * @property {string} windowContent 窗口（AppWindow）的内容
     */
    AppWindow.prototype.defaults = {
        icon: "",
        title: "",
        windowWidth: "500px",
        windowHeight: "300px",
        windowContent: "<i class='pkui-content-loading'></i>",
    };


    // @public
    $.extend( AppWindow.prototype, /** @lends AppWindow.prototype */ {
        /**
         * 创建窗口（AppWindow）。
         * @return {AppWindow} 链式调用
         */
        create: function () {
            var _this
                ;

            _this = this;

            layer.open( {
                area: [ this.options.windowWidth, this.options.windowHeight ],
                title: this.windowTitle,
                content: this.windowContent,
                type: 1,//Page层类型
                shade: 0, //遮罩透明度
                maxmin: true, //允许全屏最小化
                anim: 1, //0-6的动画形式，-1不开启
                zIndex: layer.zIndex,
                success: function ( windowContainer, index ) {
                    // 初始化 windowContainer
                    _this.windowContainer = windowContainer;
                    // 初始化 windowIndex
                    _this.windowIndex = index;
                    // 置顶弹窗
                    layer.setTop( windowContainer );
                },
                end: function () {
                    //_this.windowIndex = null;
                    console.info( "close!" );
                }
            } );

            return this;
        },

        /**
         * 显示窗口（AppWindow）。
         * @return {AppWindow} 链式调用
         */
        show: function () {
            layer.setTop( this.windowContainer );
            return this;
        },
        /**
         * 销毁AppWindow。
         * @returns {AppWindow}
         */
        destroy: function () {

            this.windowIndex && layer.close( this.windowIndex );

            this.appInstance.isAppWindowDestroy = true;

            this.options = null;
            this.windowIndex = null;
            this.windowContainer = null;
            this.windowTitle = null;
            this.windowContent = null;


            this.appInstance = null;
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

            // 2. 初始化实例属性
            this.windowTitle = this._getTitle();
            this.windowContent = this.options.windowContent;

            // 3. 创建窗口
            this.create();

            // 4. 绑定事件
            this._bindEvent();

            return this;
        },
        /**
         * 根据 this.options 生成窗口的title，并返回
         * @private
         * @return {string} title的HTML字符串
         */
        _getTitle: function () {
            var icon,
                iconHtml,
                text
                ;

            icon = this.options.icon || "";
            text = this.options.title || "";

            iconHtml = icon ? '<img class="layerui-layer-title-icon" src="' + icon + '">' : "";

            return iconHtml + text;
        },
        /**
         * 绑定事件
         * @private
         * @return {AppWindow} 链式调用
         */
        _bindEvent: function () {
            var _this
                ;
            _this = this;
            $( this.windowContainer ).find( ".layui-layer-close" )
                .on( "click.close.appwindow", function () {
                    _this.appInstance.destroy();
            } );
            return this;
        }
    } );

    return AppWindow;
} );
