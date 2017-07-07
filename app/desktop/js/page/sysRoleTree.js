/**
 * @fileOverview 角色管理-树
 *
 *  SysRoleTree 与 SysRoleContent 的通过自定义事件进行通信。
 *  事件的注册和监听都在 $container 上。
 *
 * @author 吴钦飞（wuqf@pkusoft.net）
 */
define( function ( require ) {
    "use strict";
    var
        $ = require( "jquery" ),
        layer = window.layer,
        Template = require( "template" ),
        ArtTemplate = require( "artTemplate" ),
        namespace = "pkui.sysrole.tree"
    ;

    /**
     * 工厂方法
     * @returns {SysRoleTree}
     */
    SysRoleTree.init = function ( options ) {
        return new SysRoleTree( options );
    };

    /**
     * 默认参数
     */
    SysRoleTree.prototype.defaults = {

        containerSelector: "#sysrole-container",

        sysRoleTreeSelector: "#sysRoleTree",

        createSysRoleButtonSelector: "#createSysRoleButton",
        createSysRoleInputSelector: "#createSysRoleInput",

        editSysRoleButtonSelector: ".sysrole-item-ope-edit",
        deleteSysRoleButtonSelector: ".sysrole-item-ope-delete",

        sysRoleTreeListSelector: ".sysrole-tree-list",
        sysRoleTreeItemSelector: ".sysrole-tree-item",

        sysRoleTreeItemTemplete: '<li class="sysrole-tree-item" roleid={{roleId}} rolename="{{roleName}}">'
        +                            '<a href="javascript:void(0);" class="sysrole-tree-anchor">'
        +                            '<i class="fa fa-user-circle-o"></i><span class="text">{{roleName}}</span></a>'
        +                            '<span class="input-group edit-input">'
        +                                '<input type="text" class="da-form-control" value="{{roleName}}">'
        +                                '<span class="input-group-btn">'
        +                                    '<button class="btn btn-success-2" type="button"><i class="fa fa-save"></i></button>'
        +                                '</span>'
        +                            '</span>'
        +                            '<i class="sysrole-item-ope sysrole-item-ope-edit fa fa-edit"></i>'
        +                            '<i class="sysrole-item-ope sysrole-item-ope-delete fa fa-trash-o"></i>'
        +                        '</li>'

    };

    /**
     * 构造函数
     * @param options {*?}
     * @constructor
     */
    function SysRoleTree( options ) {
        this.opts = $.extend( true, {}, this.defaults, options );
        this._init( options );
    }

    /**
     * 初始化方法
     * @private
     */
    SysRoleTree.prototype._init = function () {
        this._render();
        this.drawSysRoleTree();
        this._bind();
    };
    /**
     * 渲染
     * @private
     */
    SysRoleTree.prototype._render = function () {
        var options = this.opts;

        this.$container = $( options.containerSelector );

        this.$sysRoleTree = $( options.sysRoleTreeSelector );
        this.$sysRoleTreeList = this.$sysRoleTree.find( options.sysRoleTreeListSelector );

        this.$createSysRoleButton = $( options.createSysRoleButtonSelector );
        this.$createSysRoleInput = $( options.createSysRoleInputSelector );

        this.templateRender = ArtTemplate.compile( this.opts.sysRoleTreeItemTemplete );
    };
    /**
     * 发送Ajax请求数据，并绘制树
     */
    SysRoleTree.prototype.drawSysRoleTree = function (  ) {
        var
            _this = this,
            $sysRoleTree = this.$sysRoleTree,
            url = this.$sysRoleTreeList.attr( "data-list-url" )
        ;

        // 开启loading
        $sysRoleTree.isLoading();

        $.ajax( {
            url: url
        } ).done( function ( jsonResult ) {
            var
                html = ""
            ;
            if ( jsonResult.success ) {

                $.each( jsonResult.data, function ( index, sysRole ) {
                    html += _this.templateRender( {
                        roleId: sysRole[ "roleId" ],
                        roleName: sysRole[ "roleName" ]
                    } );
                } );
                _this.$sysRoleTreeList.html( html );
            }
            else {
                // 提示
                layer.msg( '服务器端异常！', { icon: 2 } );
            }

        } ).fail( function () {
            layer.msg( '获取角色失败，无法构建角色树！', { icon: 0 } );
        } ).always( function () {
            // 关闭loading
            $sysRoleTree.isLoading( "hide" );
        } );

    };

    /**
     * 绑定事件
     * @private
     */
    SysRoleTree.prototype._bind = function () {
        var
            _this = this
        ;


        // 单击角色树条目
        _this.$sysRoleTreeList.on( "click." + namespace, this.opts.sysRoleTreeItemSelector, function () {
            var
                $this = $( this )
            ;

            // 高亮状态
            $this.addClass( "active" ).siblings().removeClass( "active" );

            // 事件通知
            _this.$sysRoleTree.trigger( "clickSysRoleTreeItem." + namespace, { roleId: $this.attr( "roleid" ) } )

        } );

        // 添加
        _this.$createSysRoleButton.on( "click." + namespace, function () {
            _this._createSysRole();
        } );

        // 编辑
        _this.$sysRoleTreeList.on( "click." + namespace, this.opts.editSysRoleButtonSelector, function ( event ) {
            // 阻止冒泡
            event.stopPropagation();
            _this._editSysRole( $( this ) );
        } );

        // 删除
        _this.$sysRoleTreeList.on( "click." + namespace, this.opts.deleteSysRoleButtonSelector, function ( event ) {
            var $this = $( this ),
                roleName = $this.closest( _this.opts.sysRoleTreeItemSelector ).attr( "rolename" );
            // 阻止冒泡
            event.stopPropagation();
            // 确认删除
            layer.confirm(
                "是否删除角色[" + roleName + "]？",
                {
                    btn: ['删除','取消'] //按钮
                },
                // 确认
                function(){
                    _this._deleteSysRole( $this );
                },
                // 取消
                function(){

                }
            );
        } );
    };

    /**
     * 创建角色
     * @private
     */
    SysRoleTree.prototype._createSysRole = function () {
        var
            _this = this,
            $button = this.$createSysRoleButton,
            url = this.$sysRoleTreeList.attr( "data-save-url" ),
            roleName = this.$createSysRoleInput.val()
        ;

        roleName = $.trim( roleName );

        if ( $.trim( roleName ) === "" ) {
            layer.msg( '请输入角色名！', { icon: 2 } );
            return;
        }

        // 打开 loading
        $button.isLoading( { position: "insideButton" } );

        $.ajax( {
            url: url,
            data: {
                roleName: roleName,
                roleLevel: 1,
                roleDerc: roleName
            }
        } ).done( function ( jsonResult ) {
            var
                sysRole
            ;
            // 服务器端处理成功
            if ( jsonResult.success ) {
                sysRole = jsonResult.data;
                if ( ! sysRole ) {
                    layer.alert( "角色[" + roleName + "]添加成功，但服务器没有返回该角色的ID。", { icon: 2 } );
                    return;
                }
                // 提示
                layer.msg( jsonResult.message || "添加角色[" + roleName + "]成功！", { icon: 1 } );


                // 将其追加到角色树
                _this.$sysRoleTreeList.append(
                    _this.templateRender( {
                        roleId: sysRole[ "roleId" ],
                            roleName: sysRole[ "roleName" ]
                        } )
                )
            }
            // 服务器端处理失败
            else {
                // 提示
                layer.alert( "添加角色[" + roleName + "]失败：" + ( jsonResult.message || "服务器内部错误。" ), { icon: 2 } );
            }
        } ).fail( function () {
            // 提示网络错误
            layer.alert(  "添加角色[" + roleName + "]失败：", { icon: 0 } );
        } ).always( function () {
            // 关闭 loading
            $button.isLoading( "hide" );
        } );

    };

    /**
     * 编辑角色
     */
    SysRoleTree.prototype._editSysRole = function ( $btn ) {
        var
            _this = this,
            $sysRoleTreeItem = $btn.parent(),
            roleId = $sysRoleTreeItem.attr( "roleid" ),
            roleName = $sysRoleTreeItem.attr( "rolename" ),
            viewUrl = this.$sysRoleTreeList.attr( "data-view-url" ),
            modelUrl = this.$sysRoleTreeList.attr( "data-model-url" ),
            $layerContent
        ;

        modelUrl += "?roleId=" + roleId;

        layer.open( {
            id: "editSysRoleLayer",
            title: "编辑角色—— " + roleName,
            type: 1,
            skin: 'layui-layer-rim', //加上边框
            area: ['600px', '320px'], //宽高
            content: '',
            success: function ( layero ) {

                $layerContent = layero.find( ".layui-layer-content" );

                // 开启loading
                $layerContent.isLoading();

                Template.getModelAndView( viewUrl, modelUrl, function ( htmlString ) {
                    if ( ! $layerContent ) {
                        return;
                    }
                    // 关闭 loading
                    $layerContent.isLoading( "hide" );

                    $layerContent.html( htmlString );
                } );

            },
            end: function () {
                // 重新绘制
                if ( $layerContent ) {
                    _this.drawSysRoleTree();
                }
                $layerContent = null;

            }
        } );

    };
    /**
     * 删除角色
     * @private
     */
    SysRoleTree.prototype._deleteSysRole = function ( $btn ) {
        var
            $sysRoleTreeItem = $btn.parent(),
            roleId = $sysRoleTreeItem.attr( "roleid" ),
            roleName = $sysRoleTreeItem.attr( "rolename" ),
            url = this.$sysRoleTreeList.attr( "data-delete-url" )
        ;

        if ( $btn.is( ".fa-spinner" ) ) {
            layer.alert( "删除中，请稍等" , { icon: 2 } );
            return;
        }

        // 打开 loading
        $btn.addClass( "fa-spinner" );

        $.ajax( {
            url: url,
            data: {
                roleId: roleId
            }
        } ).done( function ( jsonResult ) {
            // 服务器端处理成功
            if ( jsonResult.success ) {
                // 提示
                layer.msg( jsonResult.message || "删除角色[" + roleName + "]成功！", { icon: 1 } );

                // 将其从角色树中删除
                $sysRoleTreeItem.remove();
            }
            // 服务器端处理失败
            else {
                // 提示
                layer.alert( "删除角色[" + roleName + "]失败：" + ( jsonResult.message || "服务器内部错误。" ), { icon: 2 } );
            }
        } ).fail( function () {
            // 提示网络错误
            layer.alert(  "删除角色[" + roleName + "]失败：：网络错误/登陆失效。", { icon: 0 } );
        } ).always( function () {
            // 关闭 loading
            $btn.removeClass( "fa-spinner" );
        } );
    };


    return SysRoleTree;
} );