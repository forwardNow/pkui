/**
 * @file dock，页签
 * @author 吴钦飞(wuqf@pkusoft.net)
 */
define( function ( require ) {
    var $,
        Template,
        AppDock
        ;

    $ = require( "jquery" );
    Template = require( "../common/_template" );

    AppDock = {
        $container: ".topbar-dock",
        init: function () {
            this._render();
            this._bind();
        },
        _render: function () {
            this.$container = $( this.$container );
        },
        _bind: function () {
            var _this;
            _this = this;
        },
        create: function ( opts ) {
            var html,
                templateName,
                data,
                $dock
            ;
            // 1. 数据 和 模板
            data = {
                icon: opts.icon,
                title: opts.title
            };

            templateName = "dock_item";

            // 2. 获取模板
            html = Template.getTemplate( templateName, data );
            $dock = $( html );

            // 3. 添加进 container
            this.$container.append( $dock );

            return new Dock( opts, $dock );
        }
    };

    function Dock( options ) {
        this.options = options;
    }
    Dock.prototype.defaults = {
        icon: "",
        title: ""
    };
    $.extend( Dock.prototype, {
        init: function() {
            this._bind();
        },
        _bind: function () {
            // 点击关闭按钮
            // 点击页签
        }
    } );
    return AppDock;
} );
