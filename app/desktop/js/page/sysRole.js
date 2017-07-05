/**
 * 角色管理相关
 * SysRoleTree 与 SysRoleContent 的通过自定义事件进行通信。
 */
define( function ( require ) {

    var
        $ = require( "jquery" ),
        layer = window.layer,
        Template = require( "template" ),
        namespace = "pkui.sysrole"
        ;

    require( "bootstrap-tab" );

    SysRole.prototype.defaults = {
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

    function SysRole( options ) {
        this.opts = $.extend( true, {}, this.defaults, options );
        this.init();
    }

    SysRole.prototype.init = function () {
        this.tree = new SysRoleTree( this.opts );
        this.content = new SysRoleContent( this.opts );
    };


    function SysRoleTree( options ) {
        this.opts = options;
        this.init( options );
    }

    SysRoleTree.prototype.init = function () {
        this.render();
        this.drawSysRoleTree();
        this.bind();
    };
    SysRoleTree.prototype.render = function () {
        var options = this.opts;

        this.$sysRoleTree = $( options.sysRoleTreeSelector );
        this.$sysRoleTreeList = this.$sysRoleTree.find( options.sysRoleTreeListSelector );

        this.$createSysRoleButton = $( options.createSysRoleButtonSelector );
        this.$createSysRoleInput = $( options.createSysRoleInputSelector );

    };
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
                    html += _this._getSysRoleTreeItemHtml( sysRole[ "roleId" ], sysRole[ "roleName" ] )
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
    SysRoleTree.prototype.bind = function () {
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
            _this.createSysRole();
        } );

        // 编辑
        _this.$sysRoleTreeList.on( "click." + namespace, this.opts.editSysRoleButtonSelector, function ( event ) {
            // 阻止冒泡
            event.stopPropagation();
            _this.editSysRole( $( this ) );
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
                    _this.deleteSysRole( $this );
                },
                // 取消
                function(){

                }
            );
        } );
    };

    SysRoleTree.prototype.createSysRole = function () {
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
                    _this._getSysRoleTreeItemHtml( sysRole[ "roleId" ], sysRole[ "roleName" ] )
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

    SysRoleTree.prototype.editSysRole = function ( $btn ) {
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
    SysRoleTree.prototype.deleteSysRole = function ( $btn ) {
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
    SysRoleTree.prototype._getSysRoleTreeItemHtml = function ( roleId, roleName ) {
        return this.opts.sysRoleTreeItemTemplete
            .replace( /{{roleId}}/g, roleId )
            .replace( /{{roleName}}/g,  roleName );
    };


    function SysRoleContent( options ) {

    }

    return SysRole;
} );