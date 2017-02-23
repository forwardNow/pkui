/**
 * @file 应用系统
 * @author 吴钦飞(wuqf@pkusoft.net)
 */
define( function ( require ) {
    var $,
        Utils,
        AppDock,
        AppWindow,
        _App
        ;

    $ = require( "jquery" );
    AppDock = require( "./_app-dock" );
    AppWindow = require( "./_app-window" );

    _App = {
        options: {},
        init: function ( opts ) {
            this.options = $.extend( {}, this.defaults, opts );
            this._bind();
            AppDock.init();
        },
        _bind: function () {
            var _this
            ;
            _this = this;
            $( window.document ).on( "click.app", _this.options.hookSelector, function () {
                this.appInstance = _this.create( this );
            } );
        },
        create: function ( target ) {
            return new App( target );
        },
        getFormatOptions: function( $target ) {
            var data = $target.attr( this.options.optionsProp );
            return $.parseJSON( data );
        }
    };
    _App.defaults = {
        hookSelector: '[data-pkui-app="true"]',
        optionsProp: 'data-pkui-app-options'
    };

    function App ( target ) {
        this.$target = target.jquery ? target : $( target );
        this.init();
    }

    $.extend( App.prototype, {
        init: function () {
            // 1. 获取参数
            this.options = $.extend( {}, this.defaults, _App.getFormatOptions( this.$target ) );

            // 2. 创建一个 页签（dock）
            this.appDock = AppDock.create( this.options );

            // 3. 创建一个 窗口（window）
            this.appWindow = AppWindow.create( this.options );
        }
    } );

    App.prototype.defaults = {
        icon: "",
        title: ""
    };

    return _App;
} );
