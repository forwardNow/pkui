/**
 * @fileOverview 弹窗，对artDialog进行封装
 * @author 吴钦飞(wuqf@pkusoft.net)
 *
 * @module module:common/dialog
 * @requires jquery
 * @requires jquery-ui
 * @requires artDialog
 */
define( function ( require ) {

    var $,
        Utils,
        ArtDialog,
        Dialog
        ;

    $ = require( "jquery" );
    require( "jquery-ui" );
    Utils = require( "../base/utils" );
    ArtDialog = require( "artDialog" );

    /**
     * 弹窗单例
     * @exports module:common/dialog
     */
    Dialog = {
        /**
         * 启动 应用启动面板
         * @memberOf module:common/dialog#
         * @param options {object} 弹框实例初始化参数
         * @returns {artDialog} 返回 artDialog 实例
         */
        create: function ( options ) {
            var opts
                ;
            opts = $.extend( {}, this.defaults, options );
            return ArtDialog( opts );
        },
        /**
         * 让弹窗可拖拽改变大小
         * @memberOf module:common/dialog#
         * @param appWindow {object} appWindow
         * @returns {module:common/dialog}
         */
        setResizable: function ( appWindow ) {
            appWindow.$dialogContent.resizable( {
                /*
                resize: function ( event, ui ) {
                    appWindow.originWidth = ui.element.width();
                    appWindow.originHeight = ui.element.height();
                }
                */
                alsoResize: appWindow.$dialogContainer

            } );
            return this;
        },
        /**
         * 置顶弹窗
         * @memberOf module:common/dialog#
         * @param artDialogInstance {object} artDialogInstance
         * @returns {module:common/dialog}
         */
        setTop: function ( artDialogInstance ) {
            // focus() 方法重新设置了z-index值
            artDialogInstance.focus();
            return this;
        },
        /**
         * 最小化
         * @memberOf module:common/dialog#
         * @param appWindow {object} appWindowIntance
         * @returns {module:common/dialog}
         */
        setMin: function ( appWindow ) {
            // 让dock处于非active状态
            appWindow.appInstance.appDock.inactive();
            // 关闭window
            appWindow.dialogInstance.close();
            return this;
        },
        /**
         * 最大化
         * @memberOf module:common/dialog#
         * @param appWindow {object} appWindowIntance
         * @returns {module:common/dialog}
         */
        setMax: function ( appWindow ) {
            var pageWidth,
                pageHeight,
                topbarHeight,
                dialogHeaderHeight
                ;
            pageWidth = Utils.getPageWidth();
            pageHeight = Utils.getPageHeight();
            topbarHeight = $( ".da-topbar" ).height();
            dialogHeaderHeight = appWindow.$dialogHeader.height();

            // 保存原始宽高和位置
            appWindow.originWidth = appWindow.$dialogContainer.width();
            appWindow.originHeight = appWindow.$dialogContainer.height();
            appWindow.originTop = appWindow.$dialogContainer.css( "top" );
            appWindow.originLeft = appWindow.$dialogContainer.css( "left" );

            // 1. 设置最外围的container的宽高以及坐标
            appWindow.$dialogContainer.css( {
                "top": topbarHeight,
                "left": 0,
                "width": pageWidth,
                "height": pageHeight - topbarHeight
            } );

            // 2. 设置内容区域的宽高 （.pkui-dialog-content）
            appWindow.$dialogContent.css( {
                "width": pageWidth,
                "height": pageHeight - topbarHeight - dialogHeaderHeight
            } );

            return this;
        },
        /**
         * 绑定事件：点击最小化，关闭窗口
         * @memberOf module:common/dialog#
         * @param appWindow {object} appWindowIntance
         * @returns {module:common/dialog}
         */
        bindMinEvent: function ( appWindow ) {
            var _this
                ;
            _this = this;
            appWindow.$dialogContainer.find( ".pkui-dialog-min" )
                .on( "click.window.app", function () {
                    _this.setMin( appWindow );
                } );
            return this;
        },
        /**
         * 绑定事件：点击最大化，铺满窗口
         * @memberOf module:common/dialog#
         * @param appWindow {object} appWindowIntance
         * @returns {module:common/dialog}
         */
        bindMaxEvent: function ( appWindow ) {
            var _this
                ;
            _this = this;
            appWindow.$dialogContainer.find( ".pkui-dialog-max" )
                .on( "click.window.app", function () {
                    _this.setMax( appWindow );
                    $( this ).hide()
                        .siblings( ".pkui-dialog-restore" ).show();
                } );
            appWindow.$dialogContainer.find( ".pkui-dialog-restore" )
                .on( "click.window.app", function () {
                    _this._doRestore( appWindow );
                    $( this ).hide()
                        .siblings( ".pkui-dialog-max" ).show();
                } );
            return this;
        },
        /**
         * 绑定事件：点击最大化，铺满窗口
         * @memberOf module:common/dialog#
         * @private
         * @param appWindow {object} appWindowIntance
         * @returns {module:common/dialog}
         */
        _doRestore: function ( appWindow ) {
            appWindow.$dialogContent.css( {
                "width": appWindow.originWidth,
                "height": appWindow.originHeight -  appWindow.$dialogHeader.height()
            } );
            appWindow.$dialogContainer.css( {
                "top": appWindow.originTop,
                "left": appWindow.originLeft,
                "width": appWindow.originWidth,
                "height": appWindow.originHeight
            } );
            return this;
        }
    };
    /**
     * 弹窗默认参数
     * @memberOf module:common/dialog#
     * @property pku_isNotCenter { boolean } 是否不居中
     * @property width { number } 内容区域宽度
     * @property height { number } 内容区域高度
     */
    Dialog.defaults = {
        pku_isNotCenter: true,
        width: 800,
        height: 480
    };

    return Dialog;
} );