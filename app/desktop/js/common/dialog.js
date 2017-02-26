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
        ArtDialog,
        Dialog
        ;

    $ = require( "jquery" );
    require( "jquery-ui" );
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
         * @param artDialogInstance {object} artDialogInstance
         * @returns {module:common/dialog}
         */
        setResizable: function ( artDialogInstance ) {
            $( artDialogInstance.node ).find( ".pkui-dialog-content" ).resizable( {
                // animate: true
            } );
            return this;
        },
        setTop: function () {

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