/**
 * @fileOverview 应用（App）—— 窗口（AppWindow）
 * @author 吴钦飞(wuqf@pkusoft.net)
 *
 * @module module:page/app-window
 * @requires jquery
 * @requires jquery-ui
 * @requires module:common/dialog
 * @requires module:common/template
 */
define( function ( require ) {
    var $,
        Dialog,
        Template
        ;

    $ = require( "jquery" );
    Dialog = require( "../common/dialog" );
    Template = require( "../common/template" );

    /**
     * @classDesc 窗口（AppWindow）类
     * @exports module:page/app-window
     * @alias AppWindow
     * @constructor
     * @param {Object} options 参数
     */
    function AppWindow( options ) {
        /** App实例的引用 */
        this.appInstance = null;
        /** 参数 */
        this.options = null;
        /** 弹窗的实例的引用 */
        this.artDialog = null;
        /** 窗体标题 */
        this.title = null;
        /** 窗体内容 */
        this.content = null;


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
     * @property {string} defaultContent 窗口（AppWindow）的内容
     */
    AppWindow.prototype.defaults = {
        /** 从 APP 中继承 */
        icon: "",
        /** 从 APP 中继承 */
        title: "",
        /** 从 APP 中继承 */
        src: "",

        width: 200,
        height: 180,
        content: "<i class='pkui-content-loading-ring'></i>"
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

            _this.artDialog = Dialog.create( {
                title: _this.title,
                content: _this.content,
                width: _this.options.width,
                height: _this.options.height,
                onclose: function () {
                    // 点击右上角最小化按钮，最小化后，使dock也隐藏
                    _this.appInstance.appDock.hide();
                }
            } );

            // 显示
            this.artDialog.show();
            // 居中
            this.artDialog.__center();


            return this;
        },

        /**
         * 显示窗口（AppWindow）。
         * @return {AppWindow} 链式调用
         */
        show: function () {
            // 显示（ show() 里有调用了focus() 方法 ）
            this.artDialog.show();
            // 置顶
            // Dialog.setTop( this.artDialog );
            return this;
        },
        /**
         * 隐藏窗口（AppWindow）。
         * @return {AppWindow} 链式调用
         */
        hide: function () {
            this.artDialog.close();
        },
        /**
         * 销毁AppWindow。
         * @returns {AppWindow}
         */
        destroy: function () {

            this.artDialog && this.artDialog.remove();
            this.appInstance && ( this.appInstance.isAppWindowDestroy = true );

            this.options = null;
            this.title = null;
            this.content = null;


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
            this.title = this._getTitle();
            this.content = this._getContent();

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
         * 获取窗口内容，通过"src"。
         * @returns {string|string|null|*}
         * @private
         */
        _getContent: function () {
            var _this,
                url
                ;
            _this = this;
            url = this.options.src;

            if ( ! url ) {
                return "<h1>+_+ 请设置src，如下：</h1>"
                    + "<pre>&lt;div data-pkui-app=\"true\" \n"
                    + "     data-pkui-app-options='{ \n"
                    + "         \"icon\": \"./images/apps/app_01.png\", \n"
                    + "         \"title\": \"执法监督综合应用门户\", \n"
                    + "         \"src\": \"./tpl/system/manage.html\" }'></pre>";
            }


            $.ajax( {
                type: "GET",
                cache: false,
                dataType: "text",
                url: url
            } ).done( function ( data ) {
                var html
                    ;
                html = data;
                _this.options.content = html;
                _this.artDialog.content( html );
            } ).fail( function ( jqXHR, textStatus ) {
                throw "/(ㄒoㄒ)/~~[ " + textStatus + " ]获取数据失败";
            } );

            return this.options.content;
        },
        /**
         * 给页签（AppWindow）绑定事件
         * @private
         * @return {AppWindow} 链式调用
         */
        _bindEvent: function () {
            var _this
                ;
            _this = this;
            // 点击弹框关闭按钮后，进行摧毁，执行此回调销毁应用
            this.artDialog.addEventListener( "remove", function () {
                _this.artDialog = null;
                _this.appInstance && !_this.appInstance.isAppDestroy
                && _this.appInstance.destroy();
            } );
            // 点击弹窗时，置顶该弹窗
            $( this.artDialog.node ).on( "mousedown.dock.app", function () {
                _this.appInstance.show();
            } );

            return this;
        }
    } );

    return AppWindow;
} );
