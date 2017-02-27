/**
 * @fileOverview 弹窗，对artDialog进行封装
 * @author 吴钦飞(wuqf@pkusoft.net)
 *
 * @module module:common/dialog
 * @module module:base/utils
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
     * 弹窗单例，
     * artDialog.node 决定位置
     * .pkui-dialog-content 决定宽高
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
            var opts,
                artDialog
                ;
            opts = $.extend( {
                width: this.defaults.width,
                height: this.defaults.height
            }, options );
            // opts.pkuiOptions = {};
            artDialog = ArtDialog( opts );
            this._init( artDialog );
            return artDialog;
        },
        /**
         * 初始化自定义参数
         * @param artDialog {artDialog} ArtDialog的实例
         * @private
         */
        _init: function ( artDialog ) {
            var pkuiOptions
            ;

            // 设置 pkuiOptions 参数
            pkuiOptions = initPkuiOptions.call( this, artDialog );

            artDialog.options.pkuiOptions = pkuiOptions;



            // 让弹窗可拖拽改变大小
            if ( pkuiOptions.resizable ) {
                this._setResizable( artDialog );
            }

            // 可最小化：隐藏
            if ( pkuiOptions.canMinimized ) {
                this._bindMinEvent( artDialog );
            }
            // 可最大化：最大化和恢复
            if ( pkuiOptions.canMaximized ) {
                this._bindMaxEvent( artDialog );
            }



        },
        /**
         * 让弹窗可拖拽改变大小
         * @private
         * @param artDialog {artDialog} ArtDialog的实例
         * @returns {module:common/dialog}
         */
        _setResizable: function ( artDialog ) {
            artDialog.options.pkuiOptions.$dialogContent.resizable( {
            } );
            return this;
        },
        /**
         * 置顶弹窗
         * @memberOf module:common/dialog#
         * @param artDialog {artDialog} artDialog
         * @returns {module:common/dialog}
         */
        setTop: function ( artDialog ) {
            // focus() 方法重新设置了z-index值
            artDialog.focus();
            return this;
        },
        /**
         * 最大化
         * @memberOf module:common/dialog#
         * @param artDialog {artDialog} artDialog
         * @returns {module:common/dialog}
         */
        setMax: function ( artDialog ) {
            var pageWidth,
                pageHeight,
                topbarHeight,
                dialogHeaderHeight,
                pkuiOptions
                ;
            pkuiOptions = artDialog.options.pkuiOptions;

            pageWidth = Utils.getPageWidth();
            pageHeight = Utils.getPageHeight();
            topbarHeight = $( ".da-topbar" ).height();
            dialogHeaderHeight = pkuiOptions.$dialogHeader.height();

            // 保存原始宽高和位置
            pkuiOptions.originWidth = pkuiOptions.$dialogContainer.width();
            pkuiOptions.originHeight = pkuiOptions.$dialogContainer.height();
            pkuiOptions.originTop = pkuiOptions.$dialogContainer.css( "top" );
            pkuiOptions.originLeft = pkuiOptions.$dialogContainer.css( "left" );

            // 1. 设置最外围的container
            pkuiOptions.$dialogContainer.css( {
                "top": topbarHeight,
                "left": 0
            } );

            // 2. 设置内容区域的宽高 （.pkui-dialog-content）
            pkuiOptions.$dialogContent.css( {
                "width": pageWidth,
                "height": pageHeight - topbarHeight - dialogHeaderHeight
            } );

            return this;
        },
        /**
         * 绑定事件：点击最小化，关闭窗口
         * @private
         * @param artDialog {artDialog} artDialog
         * @returns {module:common/dialog}
         */
        _bindMinEvent: function ( artDialog ) {
            artDialog.options.pkuiOptions.$minBtn
                .on( "click.window.app", function () {
                    artDialog.close();
                } );
            return this;
        },
        /**
         * 绑定事件：点击最大化，铺满窗口
         * @private
         * @param artDialog {artDialog} artDialog
         * @returns {module:common/dialog}
         */
        _bindMaxEvent: function ( artDialog ) {
            var _this,
                pkuiOptions
                ;
            _this = this;
            pkuiOptions = artDialog.options.pkuiOptions;

            pkuiOptions.$maxBtn
                .on( "click.window.app", function () {
                    _this.setMax( artDialog );
                    $( this ).hide();
                    pkuiOptions.$restoreBtn.show();
                } );
            pkuiOptions.$restoreBtn
                .on( "click.window.app", function () {
                    _this._doRestore( artDialog );
                    $( this ).hide();
                    pkuiOptions.$maxBtn.show();
                } );
            return this;
        },
        /**
         * 绑定事件：点击最大化，铺满窗口
         * @memberOf module:common/dialog#
         * @private
         * @param artDialog {artDialog} artDialog
         * @returns {module:common/dialog}
         */
        _doRestore: function ( artDialog ) {
            var pkuiOptions
            ;
            pkuiOptions = artDialog.options.pkuiOptions;
            pkuiOptions.$dialogContent.css( {
                "width": pkuiOptions.originWidth,
                "height": pkuiOptions.originHeight -  pkuiOptions.$dialogHeader.height()
            } );
            pkuiOptions.$dialogContainer.css( {
                "top": pkuiOptions.originTop,
                "left": pkuiOptions.originLeft
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
        isNotCenter: true,
        width: 800,
        height: 480,
        /** 弹框的wrapper（artDialog.node）---> .pkui-popup */
        $dialogContainer: null,
        /** 弹框 ---> .pkui-dialog */
        $dialog: null,
        /** 弹框的头部 ---> .pkui-dialog-header */
        $dialogHeader: null,
        /** 弹框的身体 ---> .pkui-dialog-content */
        $dialogContent: null,
        /** 最小化按钮 ---> .pkui-dialog-min */
        $minBtn: null,
        /** 最大化按钮 ---> .pkui-dialog-max */
        $maxBtn: null,
        /** 还原按钮 ---> .pkui-dialog-restore */
        $restoreBtn: null,

        /** 最大化之前的宽度，node */
        originWidth: 0,
        /** 最大化之前的高度，node */
        originHeight: 0,
        /** 最大化之前的Top */
        originTop: 0,
        /** 最大化之前的Left */
        originLeft: 0,

        /** 是否可拖拽改变窗口的大小 */
        resizable: true,
        /** 可最小化：隐藏 */
        canMinimized: true,
        /** 可最大化：最大化和恢复  */
        canMaximized: true
    };


    // 设置 pkuiOptions 参数
    function initPkuiOptions( artDialog ) {
        var $dialogContainer = $( artDialog.node );
        return $.extend( {}, artDialog.options.pkuiOptions, this.defaults, {
            /** 弹框的wrapper（artDialog.node）---> .pkui-popup */
            $dialogContainer: $dialogContainer,
            /** 弹框 ---> .pkui-dialog */
            $dialog: $dialogContainer.find( ".pkui-dialog" ),
            /** 弹框的头部 ---> .pkui-dialog-header */
            $dialogHeader: $dialogContainer.find( ".pkui-dialog-header" ),
            /** 弹框的身体 ---> .pkui-dialog-content */
            $dialogContent: $dialogContainer.find( ".pkui-dialog-content" ),
            /** 最小化按钮 ---> .pkui-dialog-min */
            $minBtn: $dialogContainer.find( ".pkui-dialog-min" ),
            /** 最大化按钮 ---> .pkui-dialog-max */
            $maxBtn: $dialogContainer.find( ".pkui-dialog-max" ),
            /** 还原按钮 ---> .pkui-dialog-restore */
            $restoreBtn: $dialogContainer.find( ".pkui-dialog-restore" )
        } );
    }


    return Dialog;
} );