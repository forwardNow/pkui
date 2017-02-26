/**
 * @fileOverview 应用（App）—— 窗口（AppWindow）
 * @author 吴钦飞(wuqf@pkusoft.net)
 *
 * @module module:page/app-window
 * @requires jquery
 * @requires jquery-ui
 * @requires module:common/dialog
 */
define( function ( require ) {
    var $,
        Dialog
        ;

    $ = require( "jquery" );
    Dialog = require( "../common/dialog" );

    /**
     * @classDesc 窗口（AppWindow）类
     * @exports module:page/app-window
     * @alias AppWindow
     * @constructor
     * @param {Object} options 参数
     */
    function AppWindow( options ) {
        /** App示例的引用 */
        this.appInstance = null;
        /** 参数 */
        this.options = null;
        /** 弹窗的实例的引用 */
        this.dialogInstance = null;
        /** 窗体标题 */
        this.windowTitle = null;
        /** 窗体内容 */
        this.windowContent = null;
        /** 弹框的容器 */
        this.$dialogContainer = null;
        /** 弹框容器内窗体部分 .pkui-dialog */
        this.$windowContainer = null;

        // 初始化
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
        windowWidth: 800,
        windowHeight: 480,
        windowContent: "<i class='pkui-content-loading-ring'></i>"
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

            _this.dialogInstance = Dialog.create( {
                pku_isNotCenter: true,
                title: _this.windowTitle,
                content: _this.windowContent,
                width: _this.options.windowWidth,
                height: _this.options.windowHeight
            } );

            _this.$dialogContainer = $( _this.dialogInstance.node );
            _this.$windowContainer = _this.$dialogContainer.find( ".pkui-dialog" );

            // 显示
            this.dialogInstance.show();
            // 居中
            this.dialogInstance.__center();
            // 可拖拽改变大小
            Dialog.setResizable( this.dialogInstance );


            return this;
        },

        /**
         * 显示窗口（AppWindow）。
         * @return {AppWindow} 链式调用
         */
        show: function () {
            this.dialogInstance.show();
            return this;
        },
        /**
         * 销毁AppWindow。
         * @returns {AppWindow}
         */
        destroy: function () {

            this.dialogInstance.remove();
            this.appInstance.isAppWindowDestroy = true;

            this.options = null;
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

            iconHtml = icon ? '<img class="pkui-dialog-title-icon" src="' + icon + '">' : "";

            return iconHtml + text;
        },
        /**
         * 给页签（AppWindow）绑定事件
         * @private
         * @return {AppWindow} 链式调用
         */
        _bindEvent: function () {


            return this;
        }
    } );

    return AppWindow;
} );
