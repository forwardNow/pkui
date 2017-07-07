/**
 * @fileOverview 角色管理-树
 *
 *  SysRoleTree 与 SysRoleContent 的通过自定义事件进行通信。
 *
 * @author 吴钦飞（wuqf@pkusoft.net）
 */
define( function ( require ) {
    "use strict";
    var
        $ = require( "jquery" ),
        layer = window.layer,
        Template = require( "template" ),
        namespace = "pkui.sysrole.content"
    ;

    // 页签
    require( "bootstrap-tab" );

    /**
     * 默认参数
     */
    SysRoleContent.prototype.defaults = {

        containerSelector: "#sysrole-container",

        sysRoleTablistSelector: "#sysRoleTablist"
    };

    /**
     * 构造函数
     * @param options {*?} 参数
     * @constructor
     */
    function SysRoleContent( options ) {
        this._init( options );
    }

    /**
     * 初始化
     * @param options {*?} 参数
     * @private
     */
    SysRoleContent.prototype._init = function ( options ) {
        this.opts = $.extend( true, {}, this.defaults, options );
        this._render();
        this._bind();
    };

    /**
     * 渲染
     * @private
     */
    SysRoleContent.prototype._render = function () {
        var
            opts = this.opts
        ;
        this.$container = $( opts.containerSelector );
        this.$tablist = $( opts.sysRoleTablistSelector );
    };

    /**
     * 事件绑定
     * @private
     */
    SysRoleContent.prototype._bind = function () {
        var
            _this = this
        ;

        // 页签
        this.$tablist.on( "click." + namespace, "a", function ( event ) {

        } );
    };
} );