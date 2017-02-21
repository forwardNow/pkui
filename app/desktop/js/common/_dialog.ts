declare function define ( ...args: any[] ): any;
/**
 * @file 窗口/对话框
 * @author 吴钦飞(wuqf@pkusoft.net)
 */
define( function ( require ) {
    let $,
        Dialog,
        Utils
        ;
    $ = require( "jquery" );
    Utils = require( "../base/_utils" );

    Dialog = {
        init: function () {
            this.render();
            this.bind();
        },
        render: function () {
        },
        bind: function () {
            let _this;
            _this = this;
        }
    };


    return Dialog;
} );