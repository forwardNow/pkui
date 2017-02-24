/**
 * @file 窗口/对话框
 * @author 吴钦飞(wuqf@pkusoft.net)
 */
define( function ( require ) {
    var $, Dialog, Utils;

    $ = require( "jquery" );
    Utils = require( "../base/utils" );
    layer = require( "layer" );

    Dialog = {
        layer: layer,
        init: function () {
            this.render();
            this.bind();
        },
        render: function () {
        },
        bind: function () {
            var _this;
            _this = this;
        },
        open: function ( opts ) {
            // return layer.
        }
    };

    return Dialog;
} );
