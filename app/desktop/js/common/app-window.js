/**
 * @fileOverview 应用（App）—— 窗口（AppWindow）
 * @author 吴钦飞(wuqf@pkusoft.net)
 *
 * @requires jquery
 * @requires jquery-ui
 * @requires module:common/dialog
 * @requires artTemplate
 * @requires isLoading
 */
define( function ( require ) {
    var $,
        Dialog,
        ArtTemplate,
        appWindowTpl,
        appWindowTplRender,
        appWindowMainTpl,
        appWindowMainTplRender,
        MenuSource = require( "./menuSource" )
        ;

    $ = require( "jquery" );
    Dialog = require( "./dialog" );
    ArtTemplate = require( "artTemplate" );
    appWindowTpl = require( "../../tpl/desktop/appWindow.html" );
    appWindowTplRender = ArtTemplate.compile( appWindowTpl );
    appWindowMainTpl = require( "../../tpl/desktop/appWindowMain.html" );
    appWindowMainTplRender = ArtTemplate.compile( appWindowMainTpl );

    require( "isLoading" );

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

        /** 初始化后是否显示最大化 */
        isMaxOnInit: true,

        hasSidebar: true,

        width: 600,
        height: 400,
        content: "<i class='pkui-content-loading-ring'></i>"

    };


    // @public
    $.extend( AppWindow.prototype, /** @lends AppWindow.prototype */ {
        /**
         * 创建窗口（AppWindow）。
         * @return {AppWindow} 链式调用
         */
        create: function () {
            var _this,
                pkuiOptions
                ;

            _this = this;

            _this.artDialog = Dialog.create( {

                appendTo: "#daDesktop",

                title: _this.title ? _this.title + " —— " + document.title : document.title,
                content: _this.content,
                url: this.options.mode === "iframe" ? this.options.src : null,
                width: _this.options.width,
                height: _this.options.height,
                onclose: function () {
                    // 点击右上角最小化按钮，最小化后，使dock也隐藏
                    _this.appInstance.appDock.hide();
                },
                oniframeload: function () {
                    // 删除loading
                    _this.artDialog.options.pkuiOptions.$dialogContent
                        .children( ".pkui-content-loading-ring" ).remove();
                }
            } );


            // 添加loading
            if ( this.options.mode === "iframe" ) {
                _this.artDialog.options.pkuiOptions.$dialogContent
                    .append( AppWindow.prototype.defaults.content );
            }
            // 显示
            this.artDialog.show();
            // 居中
            this.artDialog.__center();

            if ( this.options.isMaxOnInit ) {
                pkuiOptions = this.artDialog.options.pkuiOptions;
                pkuiOptions.$dialogContainer.stop();
                pkuiOptions.$maxBtn.trigger( "click.window.app" );
            }

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
            // 如果不是iframe模式，则动态载入HTML片段
            if ( this.options.mode === "default" ) {
                this.content = this._getContent();
            }

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

            if ( icon.indexOf( "fa fa-" ) !== -1 ) {
                iconHtml = '<i class="pkui-dialog-title-fonticon ' + icon + '"></i>';
            }
            else {
                iconHtml = '<img class="pkui-dialog-title-icon" src="' + icon + '">';
            }

            return iconHtml + text;
        },
        /**
         * 获取窗口内容，通过"src"。
         * @returns {string|string|null|*}
         * @private
         */
        _getContent: function () {
            var _this,
                menuId,
                templateUrl,
                structureHtml,
                contentHtml
                ;
            _this = this;
            templateUrl = this.options.src;

            menuId = this.options.menuId;

            /*
             当 menuId 为字符串时，添加字符串界定符
             data-pkui-component-options='{
                 "url": "{{menuUrl}}",
                 "dnd": false,
                 "menuId": {{menuId}}
             }'
             */
            if ( typeof menuId === "string" ) {
                menuId = '"' + menuId + '"';
            }

            // 1. appWindow模板（面包屑导航、菜单树、主体）
            structureHtml = appWindowTplRender( {
                "menuId": menuId,
                "menuUrl": MenuSource.opts.url
            } );

            // 2. 业务模板
            $.ajax( {
                type: "GET",
                cache: false,
                dataType: "text",
                url: templateUrl
            } ).done( function ( data ) {
                var html,
                    $temp,
                    $jstreeAnchor,
                    $sidebar
                ;
                contentHtml = data;
                $temp = $( "<div>" );
                $temp.append( structureHtml ).find( ".win-main-body" ).html( contentHtml );
                html = $temp.html();
                _this.options.content = html;
                _this.artDialog.content( html );

                // 侧边栏只有一个菜单的情况下，隐藏侧边栏之后，触发菜单的点击
                $sidebar = _this.artDialog.options.pkuiOptions.$dialogContainer.find( ".da-win-sidebar" );
                $sidebar.children( '[data-pkui-component="menuTree"]' ).one( "ready.jstree", function() {
                    $jstreeAnchor = $sidebar.find( ".jstree-anchor" );
                    if ( $jstreeAnchor.size() === 1 ) {
                        if ( $sidebar.data( "isHideWhenThereIsOnlyOneNode" ) ) {
                            $sidebar.next( ".da-win-sidebar-toggle" ).trigger( "click" );
                            $sidebar.closest( ".da-win" ).addClass( "only-one-node" );
                            window.setTimeout( function() {
                                $jstreeAnchor.eq( 0 ).trigger( "click" );
                            }, 360 )
                        }
                    }
                } );


                $temp = null;
            } ).fail( function ( xhr ) {
                var str = "[" + xhr.status + "]" + xhr.statusText;
                _this.artDialog.content( str );
                console.error( str );
            } );

            return this.options.content;
        },
        /**
         * 给页签（AppWindow）绑定事件
         * @private
         * @return {AppWindow} 链式调用
         */
        _bindEvent: function () {
            var _this,
                pkuiOptions = this.artDialog.options.pkuiOptions
                ;
            _this = this;

            // 点击弹框关闭按钮后，进行摧毁，执行此回调销毁应用
            this.artDialog.addEventListener( "remove", function () {
                _this.artDialog = null;
                _this.appInstance && !_this.appInstance.isAppDestroy
                && _this.appInstance.destroy();
            } );

            // 点击弹窗时，置顶该弹窗
            pkuiOptions.$dialogContainer.on( "mousedown.dock.app", function () {
                _this.appInstance.show();
            } );

            // 折叠
            pkuiOptions.$dialogContainer.on( "click.sidebar", ".da-win-sidebar-toggle", function () {
                $( this ).children( ".fa" ).toggleClass( "fa-indent" );
                pkuiOptions.$dialogContainer.find( ".da-win" ).toggleClass( "collapsed" );
            } );
            // 则请求相应页面
            pkuiOptions.$dialogContainer.on( "click.sidebar.anchor", ".da-win-sidebar .jstree-anchor", function ( event ) {
                var $this = $( this ),
                    menuicon,
                    title,
                    $winMain,
                    $winMainBody,
                    url
                ;
                event.preventDefault();

                url = $this.attr( "href" );

                // 如果不是 URL，则返回
                if ( url.indexOf( "/" ) === -1 ) {
                    return;
                }
                // 1. 高亮

                // 2. 装载主体
                //iconSrc = $this.find( "img" ).attr( "src" );
                menuicon = $this.attr( "menuicon" );
                title = $this.text();
                if ( menuicon.indexOf( ".png" ) !== -1 ) {
                    $winMain = $( appWindowMainTplRender( {
                        menuicon: "", title: title,
                        menuiconStyle: "background-image: url(" + menuicon + ")" } )
                    );
                }
                else {
                    $winMain = $( appWindowMainTplRender( { menuicon: menuicon, title: title } ) );
                }

                pkuiOptions.$dialogContainer.find(".da-win-main").replaceWith( $winMain );

                $winMainBody = $winMain.children( ".win-main-body" );

                // 3. 请求页面
                $winMainBody.isLoading();

                $.ajax( {
                    type: "GET",
                    cache: false,
                    dataType: "text",
                    url: url
                } ).done( function ( data ) {
                    $winMainBody.html( data );
                } ).fail( function ( xhr ) {
                    var str = "[" + xhr.status + "]" + xhr.statusText;
                    $winMainBody.html( str );
                    console.error( str );
                } ).always( function() {
                    $winMainBody.isLoading( "hide" );
                } );


            } );

            return this;
        }
    } );

    return AppWindow;
} );
