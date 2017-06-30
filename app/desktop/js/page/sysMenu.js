/**
 * 菜单管理相关
 */
define( function ( require ) {

    var
        $ = require( "jquery" ),
        layer = window.layer,
        PKUI = window.PKUI,
        __CTX__ = PKUI.ctxPath
    ;

    require( "menutree" );

    function SysMenu( opts ) {
        this.opts = $.extend( true, {}, this.defaults, opts );
        this.init();
    }


    SysMenu.prototype.defaults = {
        treeSelector: "#sysMenuTree",
        createSysMenuButtonSelector: "#createSysMenuButton",
        editSysMenuButtonSelector: "#editSysMenuButton",
        deleteSysMenuButtonSelector: "#deleteSysMenuButton",
        refreshSysMenuTreeButtonSelector: "#refreshSysMenuTreeButton",
        saveSysMenuTreeButtonSelector: "#saveSysMenuTreeButton",
        displayAreaSelector: "#sysMenuDisplayArea"
    };


    SysMenu.prototype.init = function () {
        this.render();
        this.initCache();
        this.bind();
    };

    SysMenu.prototype.render = function () {
        var
            opts = this.opts
        ;
        this.$tree = $( opts.treeSelector );
        this.$createSysMenuButton = $( opts.createSysMenuButtonSelector );
        this.$editSysMenuButton = $( opts.editSysMenuButtonSelector );
        this.$deleteSysMenuButton = $( opts.deleteSysMenuButtonSelector );
        this.$refreshSysMenuTreeButton = $( opts.refreshSysMenuTreeButtonSelector );
        this.$saveSysMenuTreeButton = $( opts.saveSysMenuTreeButtonSelector );
        this.$displayArea = $( opts.displayAreaSelector );
    };

    SysMenu.prototype.initCache = function () {
        /**
         * 保存新建的节点ID
         */
        this.newNodeCache = {
            // "nodeId": true
        };
        /**
         * 创建节点时，默认的属性
         */
        this.defaultNode = {

            icon: "fa fa-question",
            text: "请编辑并保存！"
        };

        /**
         * redraw后，节点全部刷新，不能通过 $.data() 保存临时数据
         */
        this.modifiedNodeCache = {
            /*
             "jstree_1492756514868_3" : {
             nodestatus: "moved",
             modifiedProperties: { "menuId": 1, "treeLevel": 1, "treeParentid": 1, "orderFlag": 1 }
             }
             */
        };

    };

    SysMenu.prototype.bind = function () {
        var
            _this = this
        ;

        this.$tree.off( "select_node.jstree" ).on( "select_node.jstree", function( event, selected ) {
            var
                sysMenu = selected.node.data,
                selectedNodeId = selected.node.id,

                $tree,
                ref,
                $selectedNode,
                $jstreeNode
                ;

            if ( $.isArray( selectedNodeId ) ) {
                selectedNodeId = selectedNodeId[ 0 ];
            }

            // 新建 但未保存的，则调用编辑
            if ( _this.newNodeCache[ selectedNodeId ] === true ) {
                $tree = _this.$tree;
                ref = $tree.jstree( true );
                $selectedNode = ref.get_node( selectedNodeId, true );
                $jstreeNode = $tree.find( ".jstree-node" );
                _this.editSysMenu( $jstreeNode.index( $selectedNode ) );
                return;
            }

            PKUI.component.Template.getModelAndView(
                // viewUrl
                __CTX__ + "/static/desktop/tpl/system/menu/detail.html",
                // modelUrl
                sysMenu,
                // callback
                function( htmlString ) {
                    _this.$displayArea.html( htmlString );
                },
                {
                    escape: false
                }
            );
        } );

        $( document )
            .off( "dnd_stop.vakata", dndStopHandler )
            .on( "dnd_stop.vakata", dndStopHandler );


        function dndStopHandler( event, relatedData ) {
            var
                rel = relatedData.data.origin,
                dndNodeIds = relatedData.data.nodes,
                $dndNode = rel.get_node( dndNodeIds[ 0 ], true )
                ;
            if ( $dndNode.is( _this.opts.treeSelector + " .jstree-node" ) ) {
                _this.sortSysMenu();
            }
        }

        this.$createSysMenuButton.off( "click.sysmenu" ).on( "click.sysmenu", function () {
            _this.createSysMenu();
        } );
        this.$editSysMenuButton.off( "click.sysmenu" ).on( "click.sysmenu", function () {
            _this.editSysMenu();
        } );
        this.$deleteSysMenuButton.off( "click.sysmenu" ).on( "click.sysmenu", function () {
            _this.deleteSysMenu();
        } );
        this.$saveSysMenuTreeButton.off( "click.sysmenu" ).on( "click.sysmenu", function () {
            _this.saveSysMenuTree();
        } );
        this.$refreshSysMenuTreeButton.off( "click.sysmenu" ).on( "click.sysmenu", function () {
            _this.refreshSysMenuTree();
        } );
    };

    SysMenu.prototype.createSysMenu = function createSysMenu () {
        var
            $tree = this.$tree,
            ref = $tree.jstree( true ),
            selectedNodeIds = ref.get_selected(),
            selectedNode,
            parentNodeId,
            newNodeId,
            newNodeData,

            newNodeCache = this.newNodeCache
            ;


        // 有未编辑（保存）的新建菜单
        if ( this.hasUnsavedSysMenu() ) {
            layer.alert( "请先编辑（保存）已新建菜单，或将其删除。", { icon: 0 } );
            return;
        }

        newNodeData = $.extend( true, { id: "newNode_" + ( new Date() ).getTime() }, this.defaultNode );

        // 未选择菜单，创建顶级菜单
        if( !selectedNodeIds.length ) {
            newNodeId = ref.create_node( "#", newNodeData );
        }
        // 选择的菜单
        else {
            parentNodeId = selectedNodeIds[0];
            selectedNode = ref.get_node( parentNodeId );

            // menuId 存的是 parentId（详情请查看 com.pkusoft.admin.service.impl.SysMenuServiceImpl.insertSysMenu(SysMenu sysMenu) ）
            newNodeData.menuId = selectedNode.original.menuId;
            newNodeId = ref.create_node( parentNodeId, newNodeData );
        }

        newNodeCache[ newNodeId ] = true;

        //$newNode = ref.get_node( newNodeId, true );

        // 取消已被选中的
        ref.deselect_node( selectedNodeIds );

        // 让新建的node被选中
        ref.select_node( [ newNodeId ] );

        // 编辑
        // this.editSysMenu( $jstreeNode.index( $newNode ) );
    };

    SysMenu.prototype.editSysMenu = function editSysMenu( orderFlag ) {
        var
            _this = this,
            $tree = this.$tree,
            ref = $tree.jstree( true ),
            selectedNodeIds = ref.get_selected(),
            selectedNode,
            model,

            newNodeCache = this.newNodeCache
            ;

        // 如果没有被选中的
        if ( selectedNodeIds.length === 0 ) {
            layer.msg( "请选择菜单项！", { icon: 0 } );
            return;
        }

        selectedNode = ref.get_node( selectedNodeIds[ 0 ] );


        // 新建的菜单：新增
        if ( newNodeCache[ selectedNodeIds[ 0 ] ] === true ) {

            model = $.extend( true, {}, selectedNode.original );

            if ( orderFlag != null ) {
                model.orderFlag = orderFlag;
            }

            PKUI.component.Template.getModelAndView(
                // viewUrl
                __CTX__ + "/static/desktop/tpl/system/menu/add.html",
                // modelUrl
                model,
                // callback
                function( htmlString ) {
                    _this.$displayArea.html( htmlString );
                },
                {
                    escape: false
                }
            );
        }
        // 已存在的菜单：修改
        else {
            PKUI.component.Template.getModelAndView(
                // viewUrl
                __CTX__ + "/static/desktop/tpl/system/menu/edit.html",
                // modelUrl
                "{% system.menu.list.js.sysMenuModel %}?menuId=" + selectedNode.data.menuId,
                // callback
                function( htmlString ) {
                    _this.$displayArea.html( htmlString );
                },
                {
                    escape: false
                }
            );
        }


    };

    SysMenu.prototype.deleteSysMenu = function deleteSysMenu() {
        var
            $tree = this.$tree,
            ref = $tree.jstree( true ),
            selectedNodeIds = ref.get_selected(),
            selectedNode,
            $button = this.$deleteSysMenuButton,

            newNodeCache = this.newNodeCache,
            modifiedNodeCache = this.modifiedNodeCache
            ;

        // 如果没有被选中的
        if ( selectedNodeIds.length === 0 ) {
            layer.msg( "请选择菜单项！", { icon: 0 } );
            return;
        }
        // 确认删除
        layer.confirm(
            "是否删除？",
            {
                icon: 0,
                btn: ['删除','取消'] //按钮
            },
            // 确认
            function(){
                doDelete();
            },
            // 取消
            function(){

            }
        );

        function doDelete() {

            // 新建的菜单
            if ( newNodeCache[ selectedNodeIds[ 0 ] ] === true ) {
                ref.delete_node( selectedNodeIds[ 0 ] );
                // 清除缓存
                delete newNodeCache[ selectedNodeIds[ 0 ] ];
                // 提示
                layer.msg( '删除成功！', { icon: 1 } );
                return;
            }

            // 已存在的菜单
            selectedNode = ref.get_node( selectedNodeIds[ 0 ] );

            $button.isLoading( { position: "insideButton" } );

            $.ajax( {
                url: "{% system.menu.list.js.sysMenuDelete %}",
                data: {
                    menuId: selectedNode.data.menuId
                }
            } ).done( function ( jsonResult ) {
                // 服务器端处理成功
                if ( jsonResult.success ) {
                    // 提示
                    layer.msg( '删除成功！', { icon: 1 } );

                    ref.delete_node( selectedNodeIds[ 0 ] );

                    // 清除缓存
                    delete modifiedNodeCache[ selectedNodeIds[ 0 ] ];

                }
                // 服务器端处理失败
                else {
                    // 提示
                    layer.msg( '删除失败！', { icon: 2 } );
                }
            } ).fail( function () {
                layer.msg( '网络错误！', { icon: 0 } );
            } ).always( function () {
                $button.isLoading( "hide" );
            } );
        }

    };

    SysMenu.prototype.saveSysMenuTree = function saveSysMenuTree() {
        var
            _this = this,
            $button = this.$saveSysMenuTreeButton,
            data = [],

            modifiedNodeCache = this.modifiedNodeCache,
            nodeId,
            modifiedProperties

            ;

        for ( nodeId in modifiedNodeCache ) {
            if ( !modifiedNodeCache.hasOwnProperty( nodeId ) ) {
                continue;
            }
            modifiedProperties = modifiedNodeCache[ nodeId ].modifiedProperties;
            if ( modifiedProperties ) {
                data.push( modifiedProperties );
            }
        }

        if ( data.length === 0 ) {
            return;
        }

        $button.isLoading( { position: "insideButton" } );

        $.ajax( {
            url: "{% system.menu.list.js.sysMenuSave %}",
            data: {
                sysMenuList: JSON.stringify( data )
            }
        } ).done( function ( jsonResult ) {
            // 服务器端处理成功
            if ( jsonResult.success ) {
                // 提示
                layer.msg( '修改成功！', { icon: 1 } );

                // 清空缓存
                modifiedNodeCache = {};

                // 刷新
                _this.refreshSysMenuTree();
            }
            // 服务器端处理失败
            else {
                // 提示
                layer.msg( '修改失败！', { icon: 2 } );
            }
        } ).fail( function () {
            layer.msg( '网络错误！', { icon: 0 } );
        } ).always( function () {
            $button.isLoading( "hide" );
        } );
    };

    /**
     * 销毁 jstree
     * 删除 MenuTree引用 和 isrendered标志
     * 清空 右侧容器（调用 jquery.html()方法后，会自动渲染）
     * init()
     */
    SysMenu.prototype.refreshSysMenuTree = function refreshSysMenuTree() {
        var
            $tree = this.$tree,
            ref = $tree.jstree( true )
            ;
        // 销毁 jstree
        ref.destroy();

        // 删除 MenuTree引用 和 isrendered标志
        $tree
            .data( "pkui.menutree", null )
            .removeAttr( "isrendered" ) ;

        // 清空 右侧容器（调用 jquery.html()方法后，会自动渲染）
        this.$displayArea.html( "" );

        this.init();
    };

    /**
     * 每进行一次拖拽，则计算每个节点的位置属性 treeLevel、treeParentid、orderFlag
     * 如果位置属性有变化，则标记其被移动（[nodestatus="moved"]），改变后的属性存储在 modifiedProperties 上
     *
     * 发送的数据（序列化后的字符串）
     *      movedSysMenuList = [
     *          { "menuId": x, "treeLevel": x, "treeParentid": x, "orderFlag": x },
     *          { "menuId": x, "treeLevel": x, "treeParentid": x, "orderFlag": x }
     *      ]
     */
    SysMenu.prototype.sortSysMenu = function sortSysMenu() {
        var
            _this = this,
            $tree = this.$tree,
            ref = $tree.jstree( true ),
            $jstreeNode
            ;

        $jstreeNode = $tree.find( ".jstree-node[role='treeitem']" );

        // 展开所有节点（关闭的节点的children会被remove掉）
        ref.open_all();

        $jstreeNode.each( function ( index, jstreeNode ) {
            var
                nodeId = jstreeNode.id,
                node = ref.get_node( nodeId ),
                //$node = ref.get_node( nodeId, true ),
                parentNodeId = ref.get_parent( nodeId ),
                parentNode = ref.get_node( parentNodeId ),
                //$parentNode = ref.get_node( parentNodeId, true ),
                sysMenu = node.data,
                parentSysMenu = parentNode.data,

                cache = _this.modifiedNodeCache,
                parentNodeCache = cache[ parentNodeId ],

                isMoved = false,
                modifiedProperties
                ;

            // 如果当前节点是新创建的未保存节点
            if ( sysMenu == null ) {
                return;
            }

            modifiedProperties = { menuId: sysMenu.menuId };

            // 如果当前节点是顶级节点
            if ( parentNodeId === "#" ) {
                parentSysMenu = {
                    treeLevel: 0,
                    menuId: -1
                }
            }
            // 如果父节点也被移动了
            if ( parentNodeCache && parentNodeCache[ "nodestatus" ] === "moved" ) {
                parentSysMenu = $.extend( true, {} , parentSysMenu, parentNodeCache[ "modifiedProperties" ] );
            }

            // debugger;

            // 层级变量，父元素肯定也变了
            if ( sysMenu.treeLevel !== ( parentSysMenu.treeLevel + 1 ) ) {
                isMoved = true;
                modifiedProperties.treeLevel = parentSysMenu.treeLevel + 1;
                modifiedProperties.treeParentid = parentSysMenu.menuId;
                modifiedProperties.orderFlag = index;
            }
            else if ( sysMenu.treeParentid != parentSysMenu.menuId ) {
                isMoved = true;
                modifiedProperties.treeParentid = parentSysMenu.menuId;
                modifiedProperties.orderFlag = index;
            }
            else if ( sysMenu.orderFlag !== index ) {
                isMoved = true;
                modifiedProperties.orderFlag = index;
            }

            if ( isMoved ) {
                _this.modifiedNodeCache[ nodeId ] = {
                    nodestatus: "moved",
                    modifiedProperties: modifiedProperties
                }
            }
        } );


    };

    SysMenu.prototype.hasUnsavedSysMenu = function () {
        var
            hasUnsavedSysMenu = false,
            newNodeId,
            newNodeCache = this.newNodeCache
        ;
        for ( newNodeId in newNodeCache ) {
            if ( newNodeCache.hasOwnProperty( newNodeId ) && newNodeCache[ newNodeId ] === true ) {
                hasUnsavedSysMenu = true;
            }
        }
        return hasUnsavedSysMenu;
    };



    return SysMenu;
} );