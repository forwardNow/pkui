/**
 * @file 窗口
 * @author 吴钦飞(wuqf@pkusoft.net)
 */
define( function ( require ) {
    var $,
        layer,
        AppWindow
        ;

    $ = require( "jquery" );
    layer = require( "layer" );

    AppWindow = {
        layer: layer,
        _init: function () {
            this.render();
            this.bind();
        },
        _render: function () {
        },
        _bind: function () {
            var _this;
            _this = this;
        },
        create: function ( opts ) {
            return new Window( opts );
        }
    };

    function Window() {

    }

    return AppWindow;
} );
