/**
 * @fileOverview 角色管理
 *
 * @author 吴钦飞（wuqf@pkusoft.net）
 */
define( function ( require ) {
    "use strict";
    var
        $ = require( "jquery" ),

        SysRoleTree = require( "./sysRoleTree" ),
        SysRoleContent = require( "./sysRoleContent" ),

        namespace = "pkui.sysrole"
    ;

    /**
     * 工厂方法
     * @returns {SysRole}
     */
    SysRole.init = function ( options ) {
        return new SysRole( options );
    };

    /**
     * 默认参数
     */
    SysRole.prototype.defaults = {
        containerSelector: "#sysrole-container",
        sysRoleInfoSelector: "#sysrole-info"
    };

    /**
     * 构造函数
     * @param options {*?} 参数
     * @constructor
     */
    function SysRole( options ) {
        this.opts = $.extend( true, {}, this.defaults, options );
        this._init();
    }

    /**
     * 初始化方法
     * @private
     */
    SysRole.prototype._init = function () {
        this._render();
        this._bind();

    };
    /**
     * 渲染（赋值）
     * @private
     */
    SysRole.prototype._render = function () {
        this.$container = $( this.opts.containerSelector );
        this.$sysRoleInfo = $( this.opts.sysRoleInfoSelector );
        this.sysRoleTreeInstance = new SysRoleTree();
        this.sysRoleContentInstance = new SysRoleContent();
    };

    /**
     * 事件绑定
     * @private
     */
    SysRole.prototype._bind = function () {
        var
            _this = this,
            selectedRoleId = null
        ;
        // 点击角色列表条目后，重新绘制 sysRoleContent
        this.$container.on( "clickSysRoleTreeItem." + SysRoleTree.namespace, function ( event, params ) {
            selectedRoleId = params.roleId;
            _this.$sysRoleInfo.addClass( "info" ).html( "正在操作的角色：" + ( params.roleName || "未命名的角色" ) );
            _this.sysRoleContentInstance.redraw( selectedRoleId );
        } );

        // 编辑角色后，保存成功后，重新绘制 sysRoleTree
        this.$container.on( "saved." + SysRoleTree.namespace, function () {
            _this.sysRoleTreeInstance.redraw( selectedRoleId );
        } );
    };

    return SysRole;
} );