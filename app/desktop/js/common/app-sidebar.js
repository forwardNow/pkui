/**
 * sidebar 相关功能
 */
define( function ( require ) {
    var
        $ = require( "jquery" ),
        layer = window.layer,
        App = require( "./app" ),
        namespace = "pkui.sidebar"
    ;

    AppSidebar.prototype.defaults = {
        menuUrl: "",
        toggleSelector: "",
        sidebarSelector: ""
    };

    function AppSidebar( opts ) {
        this.opts = $.extend( true, {}, this.defaults, opts );
        this.init();
    }

    AppSidebar.prototype.init = function () {
        this.render();
        this.bind();
    };

    AppSidebar.prototype.render = function () {
        this.$toggle = $( this.opts.toggleSelector );
        this.$sidebar = $( this.opts.sidebarSelector );
    };

    AppSidebar.prototype.bind = function () {
        var _this = this;

        this.$toggle.on( "click." + namespace, function () {
            var $sidebar = _this.$sidebar;

            if ( $sidebar.is( ".app-sidebar-showed" ) ) {
                $sidebar.stop().animate( { left: -$sidebar.width() }, function () {
                    $sidebar.removeClass( "app-sidebar-showed" )
                } );
            }
            else {
                $sidebar.stop().animate( { left: 0 }, function () {
                    $sidebar.addClass( "app-sidebar-showed" )
                } );
            }
        } );

    };


    return AppSidebar;
} );