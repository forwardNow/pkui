/**
 * @fileOverview 应用（App）系统
 * @author 吴钦飞（wuqf@pkusoft.net）
 *
 * @module module:page/app
 * @requires jquery
 * @requires module:page/app-dock
 * @requires module:page/app-window
 */
define( function ( require ) {
    var $,
        AppDock,
        AppWindow
        ;

    $ = require( "jquery" );
    AppDock = require( "./app-dock" );
    AppWindow = require( "./app-window" );

    /**
     * @classDesc 应用（App）类
     * @exports module:page/app
     * @alias App
     * @constructor
     * @param {object} $target 快捷方式DOM
     */
    function App( $target ) {
        this.$target = $target;
        this._init();
        this.show();
    }

    /**
     * 用于App类初始化时的默认参数
     * @type {object}
     * @property {string} hookSelector 标志快捷方式的CSS选择器
     * @property {string} optionsProp 标志快捷方式的参数的HTML属性
     */
    App.defaults = {
        hookSelector: '[data-pkui-app="true"]',
        optionsProp: 'data-pkui-app-options'
    };
    /**
     * App类的初始化（设置参数和绑定事件处理函数）
     * @param options
     */
    App.init = function ( options ) {
        this._options = $.extend( {}, App.defaults, options );
        this._bind();
    };

    /**
     * 绑定事件处理函数：当点击快捷方式时，触发App的实例化
     * @private
     */
    App._bind = function () {
        $( window.document ).on( "click.app", this._options.hookSelector, function () {
            var $this,
                appInstance
                ;
            $this = $( this );
            appInstance = $this.data( "appInstance" );

            if ( appInstance ) {
                appInstance.show();
            }
            $this.data( "appInstance", new App( $this ) );
        } );
    };

    /**
     * App实例的默认参数
     * @type {{icon: string, title: string, dockTemplateName: string}}
     * @property {string} icon App图标的URL（建议使用绝对路径）
     * @property {string} title App标题
     * @property {string} dockTemplateName dock的模板文件名称
     */
    App.prototype.defaults = {
        icon: "",
        title: "",
        dockTemplateName: "dock_item"
    };

    // @public
    $.extend( App.prototype, /** @lends App.prototype */ {

        /**
         * 显示dock和window。
         * @returns {App}
         */
        show: function () {
            this.appDock.show();
            this.appWindow.show();
            return this;
        }
    } );

    // @private
    $.extend( App.prototype, /** @lends App.prototype */ {
        /**
         * 初始化一个App实例
         * @returns {App}
         * @private
         */
        _init: function () {
            // 1. 获取参数
            this.options = $.extend( {}, this.defaults, this._getOptsFromTarget() );

            // 2. 创建一个 页签（dock）
            this.appDock = new AppDock( this.options );

            // 3. 创建一个 窗口（window）
            this.appWindow = new AppWindow( this.options );

            return this;
        },

        /**
         * 从快捷方式的自定义HTML属性中获取参数
         * @returns {*}
         * @private
         */
        _getOptsFromTarget: function () {
            var data = this.$target.attr( App._options.optionsProp );
            return $.parseJSON( data );
        }

    } );


    return App;
} );
