/**
 * @file 窗口/对话框
 * @author 吴钦飞(wuqf@pkusoft.net)
 */
define( function ( require ) {
    var $, Dialog, Utils;

    $ = require( "jquery" );
    Utils = require( "../base/_utils" );
    layer = require( "layer" );

    Dialog = {
        init: function () {
            this.render();
            this.bind();
        },
        render: function () {
        },
        bind: function () {
            var _this;
            _this = this;
        }
    };

    return Dialog;
} );
