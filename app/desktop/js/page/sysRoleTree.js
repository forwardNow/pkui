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
        //ArtTemplate = require( "artTemplate" ),
        namespace = "pkui.sysrole.tree"
    ;

    require( "jstree" );

    /*
     * @event clickSysRoleTreeItem
     *      点击菜单树条目
     *
     */

    SysRoleTree.namespace = namespace;

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

        editSysRoleButtonSelector: "#editSysRoleButton",
        deleteSysRoleButtonSelector: "#deleteSysRoleButton",

        sysRoleTreeListSelector: "#sysrole-tree-list"
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
        var
            _this = this
        ;
        this._render();
        this.draw( function () {
            _this._bindTreeEvent();
        } );
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
        this.$editSysRoleButton = $( options.editSysRoleButtonSelector );
        this.$deleteSysRoleButton = $( options.deleteSysRoleButtonSelector );

        // this.templateRender = ArtTemplate.compile( this.opts.sysRoleTreeItemTemplete );
    };

    /**
     * 重新绘制
     * @param roleId {*} 使指定ID的条目高亮
     */
    SysRoleTree.prototype.redraw = function ( roleId ) {
        var
            _this = this
        ;
        this.draw( function() {

            _this._bindTreeEvent();

            if ( roleId === undefined || roleId === null ) {
                return;
            }
            // 让指定node被选中
            _this.$sysRoleTreeList.find( '.jstree-anchor[roleid="' + roleId + '"]' ).trigger( "click" );

        } )
    };

    /**
     * 发送Ajax请求数据，并绘制树
     * @param callback {Function?} 成功后的回调
     */
    SysRoleTree.prototype.draw = function ( callback ) {
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
                originalData,
                fmtData,
                treeData,
                ref
            ;
            if ( jsonResult.success ) {

                originalData = jsonResult.data;
                fmtData = fmtSysRoleList( originalData );
                treeData = genTreeData( fmtData );

                ref = _this.$sysRoleTreeList.jstree( true );

                if ( ref ) {
                    ref.destroy();
                }

                _this.$sysRoleTreeList.jstree( {
                    "core": {
                        "data" : treeData,
                        "dblclick_toggle": true,
                        "worker": false,
                        "multiple" : false, // no multiselection
                        "themes" : {
                            "dots" : true // no connecting dots between dots
                        }
                    },
                    "plugins" : [
                        "search",
                        "wholerow" // 引用此插件后，连接线消失。
                    ]
                } );

                callback && callback();
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


        function fmtSysRoleList( list ) {
            var
                fmtList = [],
                timestamp = "jstree_"  +( new Date() ).getTime() + "_"
            ;
            // 添加 jstree 必须的属性
            $.each( list, function ( index, sysRole ) {

                fmtList.push( sysRole );

                // 绑定的 data
                sysRole.data = $.extend( true, {}, sysRole );

                // href
                sysRole.a_attr = {
                    href: "javascript:void(0)",
                    roleid: sysRole.roleId
                };

                // id
                sysRole.id = timestamp + sysRole[ "roleId" ];
                // text
                sysRole.text = sysRole[ "roleName" ];
                // icon
                sysRole.icon = "fa fa-vcard";
                // state
                sysRole.state = {
                    opened: true
                };


            } );
            return fmtList;
        }

        function genTreeData ( list ) {
            var
                timestamp = "jstree_"  + ( new Date() ).getTime() + "_",
                childrenSet = {
                    "defaultGroup": []
                },
                treeData = [],
                sysId, node
            ;
            // 分组
            $.each( list, function ( index, item ) {
                var
                    sysId = item.sysId
                ;
                if ( sysId === null || sysId === undefined ) {
                    childrenSet[ "defaultGroup" ].push( item );
                } else {
                    if ( childrenSet[ sysId ] === undefined ) {
                        childrenSet[ sysId ] = [];
                    }
                    childrenSet[ sysId ].push( item );
                }
            } );

            for( sysId in childrenSet ) {
                node = {
                    id: timestamp + sysId,
                    icon: "fa fa-folder",
                    state: {
                        opened: true
                    },
                    children: childrenSet[ sysId ]
                };
                if ( sysId === "defaultGroup" ) {
                    node.text = "未分类";
                    node.data = { "sysId": null };
                } else {
                    node.text = childrenSet[ sysId ][ 0 ].sysName;
                    node.data = { "sysId": sysId };
                }

                node.data.isRoot = true;

                treeData.push( node );
            }

            return treeData;
        }
    };

    /**
     * 绑定jstree相关的事件
     * @private
     */
    SysRoleTree.prototype._bindTreeEvent = function () {
        var
            _this = this
        ;


        // 单击角色树条目
        _this.$sysRoleTreeList.on( "select_node.jstree", function ( event, selected ) {
            var
                data = selected.node.data
            ;
            if ( data.isRoot || ! data.roleId ) {
                return;
            }
            /**
             * @event clickSysRoleTreeItem
             */
            _this.$container.trigger( "clickSysRoleTreeItem." + namespace, { roleId: data.roleId, roleName: data.roleName } );
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

        // 添加
        _this.$createSysRoleButton.on( "click." + namespace, function () {
            var
                ref = _this.$sysRoleTreeList.jstree( true ),
                selectedNodeIds = ref.get_selected(),
                selectedNode,
                data
            ;

            // 如果没有被选中的
            if ( selectedNodeIds.length === 0 ) {
                // layer.msg( "请选择菜单项！", { icon: 0 } );
                // return;
            }
            else {
                selectedNode = ref.get_node( selectedNodeIds[ 0 ] );
                data = selectedNode.data;
            }

            _this._createSysRole( data );
        } );

        // 编辑
        _this.$editSysRoleButton.on( "click." + namespace, function () {
            var
                ref = _this.$sysRoleTreeList.jstree( true ),
                selectedNodeIds = ref.get_selected(),
                selectedNode,
                data
            ;

            // 如果没有被选中的
            if ( selectedNodeIds.length === 0 ) {
                layer.msg( "请选择角色！", { icon: 0 } );
                return;
            }

            selectedNode = ref.get_node( selectedNodeIds[ 0 ] );
            data = selectedNode.original;

            if ( data.isRoot || data.roleId === undefined ) {
                layer.msg( "此项无法进行编辑！", { icon: 0 } );
                return;
            }

            _this._editSysRole( data );
        } );

        // 删除
        _this.$deleteSysRoleButton.on( "click." + namespace, function () {
            var
                ref = _this.$sysRoleTreeList.jstree( true ),
                selectedNodeIds = ref.get_selected(),
                selectedNode,
                data
            ;

            // 如果没有被选中的
            if ( selectedNodeIds.length === 0 ) {
                layer.msg( "请选择角色！", { icon: 0 } );
                return;
            }

            selectedNode = ref.get_node( selectedNodeIds[ 0 ] );
            data = selectedNode.data;

            if ( data.isRoot || data.roleId === undefined ) {
                layer.msg( "此项无法删除！", { icon: 0 } );
                return;
            }


            // 确认删除
            layer.confirm(
                "是否删除角色[" + data.roleName + "]？",
                {
                    btn: ['删除','取消'] //按钮
                },
                // 确认
                function( index ){
                    _this._deleteSysRole( data );
                    layer.close( index );
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
    SysRoleTree.prototype._createSysRole = function ( data ) {
        var
            viewUrl = this.$sysRoleTreeList.attr( "data-view-url" ),
            $layerContent
        ;

        if ( data ) {
            data = {
                sysId: data.sysId,
                sysName: data.sysName,
                orderFlag: data.orderFlag || 10
            };
        }

        layer.open( {
            id: "editSysRoleLayer",
            title: "添加角色",
            type: 1,
            skin: 'layui-layer-rim', //加上边框
            area: ['600px', '380px'], //宽高
            content: '',
            success: function ( layero ) {

                $layerContent = layero.find( ".layui-layer-content" );

                // 开启loading
                $layerContent.isLoading();

                Template.getModelAndView( viewUrl, data, function ( htmlString ) {
                    if ( ! $layerContent ) {
                        return;
                    }
                    // 关闭 loading
                    $layerContent.isLoading( "hide" );

                    $layerContent.html( htmlString );
                } );

            },
            end: function () {
                $layerContent = null;
            }
        } );

    };

    /**
     * 编辑角色
     */
    SysRoleTree.prototype._editSysRole = function ( data ) {
        var
            viewUrl = this.$sysRoleTreeList.attr( "data-view-url" ),
            modelUrl = this.$sysRoleTreeList.attr( "data-model-url" ),
            $layerContent
        ;

        modelUrl += "?roleId=" + data.roleId;

        layer.open( {
            id: "editSysRoleLayer",
            title: "编辑角色—— " + data.roleName,
            type: 1,
            skin: 'layui-layer-rim', //加上边框
            area: ['600px', '380px'], //宽高
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
                $layerContent = null;
            }
        } );

    };
    /**
     * 删除角色
     * @private
     */
    SysRoleTree.prototype._deleteSysRole = function ( sysRole ) {
        var
            _this = this,
            url = this.$sysRoleTreeList.attr( "data-delete-url" ),
            $button = this.$deleteSysRoleButton,
            roleId = sysRole.roleId,
            roleName = sysRole.roleName
        ;

        // 打开 loading
        $button.isLoading( { position: "insideButton" } );

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
                _this.redraw();
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
            $button.isLoading( "hide" );
        } );
    };


    return SysRoleTree;
} );