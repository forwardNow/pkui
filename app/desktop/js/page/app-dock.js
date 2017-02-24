/**
 * @file dock，页签
 * @author 吴钦飞(wuqf@pkusoft.net)
 */
define( function ( require ) {
    var $,
        Template
        ;

    $ = require( "jquery" );
    Template = require( "../common/template" );

    /**
     * 默认参数
     * @type {{icon: string, title: string, dockTemplateName: string}}
     */
    AppDock.prototype.defaults = {
        icon: "",
        title: "",
        dockTemplateName: ""
    };

    /**
     * 包裹所有dock的容器
     * @type {string}
     */
    AppDock.prototype.$container = ".topbar-dock";

    /**
     * app dock，页签
     * @class
     * @param {Object} options 参数
     */
    function AppDock ( options ) {
        if ( typeof this.$container === "string" ) {
            this.$container = $( this.$container );
        }
        this._init( options );
    }

    // @public
    $.extend( AppDock.prototype, {
        /**
         * 显示dock，让该dock处于active状态。
         *
         * @public
         * @return {AppDock} 链式调用
         */
        show: function () {
            this.$target.addClass( "active" ).siblings().removeClass( "active" );
            return this;
        }
    } );

    // @private
    $.extend( AppDock.prototype, {
        /**
         * 初始化
         *
         * @private
         * @param {Object} options 参数
         * @return {AppDock} 链式调用
         */
        _init: function ( options ) {
            // 1. 参数
            this.options = $.extend( {}, this.defaults, options );

            // 2. 创建target
            this._createTarget();

            return this;
        },
        /**
         * 创建DOM
         *
         * @private
         * @return {AppDock} 链式调用
         */
        _createTarget: function () {
            var html,
                data,
                $target
                ;
            // 1. 数据 和 模板
            data = {
                icon: this.options.icon,
                title: this.options.title
            };

            // 2. 获取模板
            html = Template.getTemplate( this.options.dockTemplateName, data );
            $target = $( html );

            // 3. 添加进 container
            this.$container.append( $target );

            this.$target = $target;

            this.show();

            return this;
        }
    } );



    return AppDock;
} );
