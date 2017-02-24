/**
 * @file 窗口
 * @author 吴钦飞(wuqf@pkusoft.net)
 */
define( function ( require ) {
    var $,
        layer
        ;

    $ = require( "jquery" );
    layer = require( "layer" );


    /**
     * 默认参数
     * @type {{icon: string, title: string}}
     */
    AppWindow.prototype.defaults = {
        icon: "",
        title: ""
    };

    /**
     * app window 类
     * @class
     * @param {Object} options 参数
     */
    function AppWindow ( options ) {
        this._init( options );
    }

    // @public
    $.extend( AppWindow.prototype, {
        show: function () {

        }
    } );

    // @private
    $.extend( AppWindow.prototype, {
        _init: function ( options ) {
            // 1. 参数
            this.options = $.extend( {}, this.defaults, options );

            // 2. 创建target
            this._createTarget();
        },
        _createTarget: function () {
        }
    } );

    return AppWindow;
} );
