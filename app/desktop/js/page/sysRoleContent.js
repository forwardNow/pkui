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
        namespace = "pkui.sysrole.content"
    ;

    require( "jstree" );

    /*
     *  @event show
     *      页签显示
     */

    SysRoleContent.namespace = namespace;

    /**
     * 默认参数
     */
    SysRoleContent.prototype.defaults = {

        containerSelector: "#sysrole-container",

        sysRoleContentSelector: "#sysroleContent",

        sysRoleTablistSelector: "#sysRoleTablist",

        /* 关联用户 */
        // roleId 隐藏输入域
        sysRoleUserRoleIdFieldSelector: "#sysRoleUser-roleId",
        // tabpanel
        sysRoleUserTabpanelSelector: "#sysroleRelUser",
        // datagrid 刷新按钮
        sysRoleUserDatagridReloadBtnSelector: "#sysRoleUserDatagrid-reloadBtn",
        // 添加用户到角色按钮
        sysRoleUserAddUserBtnSelector: "#sysRoleUser-addBtn",
        // 从角色中删除用户
        sysRoleUserRemoveUserBtnSelector: "#sysRoleUser-removeBtn",
        // table
        sysRoleUserDatagridSelector: "#sysRoleUserDatagrid",


        /* 菜单权限 */
        // tabpanel
        sysRoleMenuTabpanelSelector: "#sysroleRelMenu",
        // tree
        sysRoleMenuTreeContainerSelector: "#sysroleRelMenu-treeContainer",
        // save btn
        sysRoleMenuSaveBtnSelector: "#sysroleRelMenu-saveBtn",

        /* 资源权限 */
        // tabpanel
        sysRoleResourceTabpanelSelector: "#sysroleRelResource",
        // tree
        sysRoleResourceTreeContainerSelector: "#sysroleRelResource-treeContainer",
        // save btn
        sysRoleResourceSaveBtnSelector: "#sysroleRelResource-saveBtn",

        /* 数据权限 */
        // tabpanel
        sysRolePermitTabpanelSelector: "#sysroleRelPermit",
        // tree
        sysRolePermitTreeContainerSelector: "#sysroleRelPermit-treeContainer",
        // save btn
        sysRolePermitSaveBtnSelector: "#sysroleRelPermit-saveBtn"

    };


    /**
     * 工厂方法
     * @returns {SysRoleContent}
     */
    SysRoleContent.init = function ( options ) {
        return new SysRoleContent( options );
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
        this.$sysroleContent = $( opts.sysRoleContentSelector );
        this.$tablist = $( opts.sysRoleTablistSelector );

        this.$sysRoleUserRoleIdField = $( opts.sysRoleUserRoleIdFieldSelector );
        this.$sysRoleUserTabpanel = $( opts.sysRoleUserTabpanelSelector );
        this.$sysRoleUserDatagridReloadBtn = $( opts.sysRoleUserDatagridReloadBtnSelector );
        this.$sysRoleUserAddUserBtn = $( opts.sysRoleUserAddUserBtnSelector );
        this.$sysRoleUserRemoveUserBtn = $( opts.sysRoleUserRemoveUserBtnSelector );
        this.$sysRoleUserDatagrid = $( opts.sysRoleUserDatagridSelector );

        this.$sysRoleMenuTabpanel = $( opts.sysRoleMenuTabpanelSelector );
        this.$sysRoleMenuTreeContainer = $( opts.sysRoleMenuTreeContainerSelector );
        this.$sysRoleMenuSaveBtn = $( opts.sysRoleMenuSaveBtnSelector );

        this.$sysRoleResourceTabpanel = $( opts.sysRoleResourceTabpanelSelector );
        this.$sysRoleResourceTreeContainer = $( opts.sysRoleResourceTreeContainerSelector );
        this.$sysRoleResourceSaveBtn = $( opts.sysRoleResourceSaveBtnSelector );

        this.$sysRolePermitTabpanel = $( opts.sysRolePermitTabpanelSelector );
        this.$sysRolePermitTreeContainer = $( opts.sysRolePermitTreeContainerSelector );
        this.$sysRolePermitSaveBtn = $( opts.sysRolePermitSaveBtnSelector );

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
            var
                $this = $( this ),
                $parent = $this.parent(),
                tabpanelSelector = $this.attr( "href" )
            ;
            event.preventDefault();

            // 页签 active状态
            $parent.addClass( "active" )
                .siblings().removeClass( "active" );

            // 面板 active状态
            $( tabpanelSelector ).addClass( "active" )
                .siblings().removeClass( "active" );

            /**
             * @event show
             */
            _this.$container.trigger( "show." + namespace, tabpanelSelector );

        } );

        // 点击 radio（“用户是否已关联”），切换按钮
        this.$sysroleContent.on( "click." + namespace, "input[name=roleIdOper]", function () {
            var
                $this = $( this ),
                $addBtn,
                $removeBtn
            ;

            // 如果点击的是已经选中的radio，则返回
            if ( $this.is( ".checked" ) ) {
                return;
            }

            $addBtn = _this.$sysRoleUserAddUserBtn;
            $removeBtn = _this.$sysRoleUserRemoveUserBtn;

            $( ".roleIdOper" ).removeClass( "checked" );
            $this.addClass( "checked" );

            // 查询关联用户（显示“删除”）
            if ( $( this ).val() === "in" ) {
                $addBtn.addClass( "hidden" );
                $removeBtn.removeClass( "hidden" );
            }
            // 查询未关联用户（显示“添加”）
            else {
                $removeBtn.addClass( "hidden" );
                $addBtn.removeClass( "hidden" );
            }

            // 查询
            _this.$sysRoleUserDatagridReloadBtn.trigger( "click" );
        } );

        // 点击页签
        _this.$container.on( "show." + namespace, function ( event, tabpanelSelector ) {
            var
                roleId,
                drawForRoleId,
                $tabpanle,
                drawMethodName
            ;
            // 关联用户
            if ( tabpanelSelector === _this.opts.sysRoleUserTabpanelSelector ) {
                $tabpanle = _this.$sysRoleUserTabpanel;
                drawMethodName = "drawRoleUser";
            }
            // 菜单权限
            else if ( tabpanelSelector === _this.opts.sysRoleMenuTabpanelSelector ) {
                $tabpanle = _this.$sysRoleMenuTabpanel;
                drawMethodName = "drawRoleMenu";
            }
            // 资源权限
            else if ( tabpanelSelector === _this.opts.sysRoleResourceTabpanelSelector ) {
                $tabpanle = _this.$sysRoleResourceTabpanel;
                drawMethodName = "drawRoleResource";
            }
            // 数据权限
            else if ( tabpanelSelector === _this.opts.sysRolePermitTabpanelSelector ) {
                $tabpanle = _this.$sysRolePermitTabpanel;
                drawMethodName = "drawRolePermit";
            }

            roleId = $tabpanle.attr( "roleid" );
            drawForRoleId = $tabpanle.attr( "draw-for-roleid" );

            // 如果 roleid !== draw-for-roleid，则进行绘制
            if ( roleId === undefined || roleId === drawForRoleId ) {
                return;
            }
            _this[ drawMethodName ]( roleId );

        } );

        // 添加用户到角色
        this.$sysRoleUserAddUserBtn.on( "click." + namespace, function () {
            opeUser( $( this ), "add" );
        } );

        // 从角色中删除用户
        this.$sysRoleUserRemoveUserBtn.on( "click." + namespace, function () {
            opeUser( $( this ), "remove" );
        } );

        function opeUser ( $button, ope ) {
            var
                $table,
                seletedRowIds

            ;

            // 如果处于 isloading 状态，则退出
            if ( $button.attr( "disabled" ) ) {
                return;
            }

            $table = _this.$sysRoleUserDatagrid;
            seletedRowIds = $table.bootgrid( "getSelectedRows" );


            if ( seletedRowIds.length === 0 ) {
                layer.msg( '请选中一条或多条记录进行操作！', { icon: 0 } );
                return;
            }

            // 确认
            layer.confirm(
                "请确认您的操作？",
                {
                    btn: ['确认','取消'] //按钮
                },
                // 确认
                function(){
                    doDelete();
                },
                // 取消
                function(){

                }
            );

            function doDelete () {
                var
                    data = "",
                    roleId = _this.$sysRoleUserTabpanel.attr( "roleid" ),
                    url = $button.data( "options" ).url
                ;
                // 打开 loading
                $button.isLoading( { position: "insideButton" } );

                // 将 [ 1, 2, 3 ] 转换为 "userId=1&userId=2&userId=3"
                $.each( seletedRowIds, function ( index, userId ) {
                    if ( index >= 0 ) {
                        data += "&";
                    }
                    data += "userId=" + userId;
                } );

                data = "roleId=" + roleId + data;

                $.ajax( {
                    url: url,
                    data: data
                } ).done( function ( jsonResult ) {
                    // 服务器端处理成功
                    if ( jsonResult.success ) {
                        // 提示
                        layer.msg( jsonResult.message || "操作成功！", { icon: 1 } );
                        // 标志删除的那行
                        $table.bootgrid( "deleteRow", seletedRowIds );
                    }
                    // 服务器端处理失败
                    else {
                        // 提示
                        var msg = "操作失败：" + ( jsonResult.message || "未知的错误" );
                        layer.alert( msg, { icon: 2 } );
                        $.error( msg );
                    }
                } ).fail( function () {
                    // 提示网络错误
                    var msg = '操作失败：网络错误/登陆失效！';
                    layer.alert( msg, { icon: 0 } );
                    $.error( msg );
                } ).always( function () {
                    // 关闭 loading
                    $button.isLoading( "hide" );
                } );
            }
        }

        // 菜单权限：点击“保存”按钮
        this.$sysRoleMenuSaveBtn.on( "click." + namespace, function () {
            var
                $this = $( this ),
                $button = $this,
                ref = _this.$sysRoleMenuTreeContainer.jstree( true ),
                options = $this.data( "options" ),
                selectedNodes,
                menuIdList = [],
                menuIdData = "",
                roleId
            ;
            if ( !ref ) {
                return;
            }

            selectedNodes = ref.get_selected( true );

            $.each( selectedNodes, function ( index, node ) {
                if ( node ) {
                    menuIdList.push( node.original.menuId );
                }
            } );

            // 打开 loading
            $button.isLoading( { position: "insideButton" } );

            // 将 [ 1, 2, 3 ] 转换为 "menuId=1&menuId=2&menuId=3"
            $.each( menuIdList, function ( index, menuId ) {
                if ( index >= 0 ) {
                    menuIdData += "&";
                }
                menuIdData += "menuId=" + menuId;
            } );

            roleId = _this.$sysRoleMenuTabpanel.attr( "roleid" );

            $.ajax( {
                url: options.url,
                data: "roleId=" + roleId + menuIdData
            } ).done( function ( jsonResult ) {
                // 服务器端处理成功
                if ( jsonResult.success ) {
                    // 提示
                    layer.msg( jsonResult.message || "[菜单权限]保存成功！", { icon: 1 } );
                }
                // 服务器端处理失败
                else {
                    // 提示
                    var msg = "[菜单权限]保存失败：" + ( jsonResult.message || "未知的错误" );
                    layer.alert( msg, { icon: 2 } );
                    $.error( msg );
                }
            } ).fail( function () {
                // 提示网络错误
                layer.alert( '[菜单权限]保存失败：网络错误/登陆失效！', { icon: 0 } );
                $.error( '[菜单权限]保存失败：网络错误/登陆失效！' );
            } ).always( function () {
                // 关闭 loading
                $button.isLoading( "hide" );
            } );

        } );

        // 资源权限：点击“保存”按钮
        this.$sysRoleResourceSaveBtn.on( "click." + namespace, function () {
            var
                $this = $( this ),
                $button = $this,
                ref = _this.$sysRoleResourceTreeContainer.jstree( true ),
                options = $this.data( "options" ),
                selectedNodes,
                resourceIdList = [],
                resourceIdData = "",
                roleId
            ;
            if ( !ref ) {
                return;
            }

            selectedNodes = ref.get_selected( true );

            $.each( selectedNodes, function ( index, node ) {
                if ( node && node.original.menuId !== false ) {
                    resourceIdList.push( node.original.resourceId );
                }
            } );

            // 打开 loading
            $button.isLoading( { position: "insideButton" } );

            // 将 [ 1, 2, 3 ] 转换为 "resourceId=1&resourceId=2&resourceId=3"
            $.each( resourceIdList, function ( index, resourceId ) {
                if ( index >= 0 ) {
                    resourceIdData += "&";
                }
                resourceIdData += "resourceId=" + resourceId;
            } );

            roleId = _this.$sysRoleResourceTabpanel.attr( "roleid" );

            $.ajax( {
                url: options.url,
                data: "roleId=" + roleId + resourceIdData
            } ).done( function ( jsonResult ) {
                // 服务器端处理成功
                if ( jsonResult.success ) {
                    // 提示
                    layer.msg( jsonResult.message || "[资源权限]保存成功！", { icon: 1 } );
                }
                // 服务器端处理失败
                else {
                    // 提示
                    var msg = "[资源权限]保存失败：" + ( jsonResult.message || "未知的错误" );
                    layer.alert( msg, { icon: 2 } );
                    $.error( msg );
                }
            } ).fail( function () {
                // 提示网络错误
                layer.alert( '[资源权限]保存失败：网络错误/登陆失效！', { icon: 0 } );
                $.error( '[资源权限]保存失败：网络错误/登陆失效！' );
            } ).always( function () {
                // 关闭 loading
                $button.isLoading( "hide" );
            } );

        } );

        // 数据权限：点击“保存”按钮
        this.$sysRolePermitSaveBtn.on( "click." + namespace, function () {
            var
                $this = $( this ),
                $button = $this,
                ref = _this.$sysRolePermitTreeContainer.jstree( true ),
                options = $this.data( "options" ),
                selectedNodes,
                permitIdList = [],
                permitIdData = "",
                roleId
            ;
            if ( !ref ) {
                return;
            }

            selectedNodes = ref.get_selected( true );

            $.each( selectedNodes, function ( index, node ) {
                if ( node && node.original.permitCode !== false ) {
                    permitIdList.push( node.original.permitId );
                }
            } );

            // 打开 loading
            $button.isLoading( { position: "insideButton" } );

            // 将 [ 1, 2, 3 ] 转换为 "permitId=1&permitId=2&permitId=3"
            $.each( permitIdList, function ( index, permitId ) {
                if ( index >= 0 ) {
                    permitIdData += "&";
                }
                permitIdData += "permitId=" + permitId;
            } );

            roleId = _this.$sysRolePermitTabpanel.attr( "roleid" );

            $.ajax( {
                url: options.url,
                data: "roleId=" + roleId + permitIdData
            } ).done( function ( jsonResult ) {
                // 服务器端处理成功
                if ( jsonResult.success ) {
                    // 提示
                    layer.msg( jsonResult.message || "[数据权限]保存成功！", { icon: 1 } );
                }
                // 服务器端处理失败
                else {
                    // 提示
                    var msg = "[数据权限]保存失败：" + ( jsonResult.message || "未知的错误" );
                    layer.alert( msg, { icon: 2 } );
                    $.error( msg );
                }
            } ).fail( function () {
                // 提示网络错误
                layer.alert( '[数据权限]保存失败：网络错误/登陆失效！', { icon: 0 } );
                $.error( '[数据权限]保存失败：网络错误/登陆失效！' );
            } ).always( function () {
                // 关闭 loading
                $button.isLoading( "hide" );
            } );

        } );
    };

    /**
     * 绘制
     */
    SysRoleContent.prototype.draw = function () {

    };

    /**
     * 重新绘制
     * @param roleId {*} 角色ID
     */
    SysRoleContent.prototype.redraw = function ( roleId ) {
        this.redrawRoleUser( roleId );
        this.redrawRoleMenu( roleId );
        this.redrawRolePermit( roleId );
        this.redrawRoleResource( roleId );
    };

    /**
     * 重新绘制“关联用户”
     * @param roleId {*} 角色ID
     */
    SysRoleContent.prototype.redrawRoleUser = function ( roleId ) {
        // 设置输入域的值为选中的角色树条目的roleId
        this.$sysRoleUserRoleIdField.val( roleId );

        // 标志需要为 选中的角色树条目 绘制
        this.$sysRoleUserTabpanel.attr( "roleid", roleId );

        // 如果当前页签为active状态，则进行绘制；
        if ( this.$sysRoleUserTabpanel.is( ".active" ) ) {
            this.drawRoleUser( roleId );
        }

    };
    /**
     * 绘制“关联用户”
     * @param roleId {*} 角色ID
     */
    SysRoleContent.prototype.drawRoleUser = function ( roleId ) {
        // 进行绘制
        this.$sysRoleUserDatagridReloadBtn.trigger( "click" );
        // 标志已被绘制
        this.$sysRoleUserTabpanel.attr( "draw-for-roleid", roleId );
    };
    /**
     * 重新绘制“菜单权限”
     * @param roleId {*} 角色ID
     */
    SysRoleContent.prototype.redrawRoleMenu = function ( roleId ) {

        // 标志需要为 选中的角色树条目 绘制
        this.$sysRoleMenuTabpanel.attr( "roleid", roleId );

        // 如果当前页签为active状态，则进行绘制；
        if ( this.$sysRoleMenuTabpanel.is( ".active" ) ) {
            this.drawRoleMenu( roleId );
        }
    };
    /**
     * 绘制“菜单权限”
     * @param roleId {*} 角色ID
     */
    SysRoleContent.prototype.drawRoleMenu = function ( roleId ) {
        var
            $tree  = this.$sysRoleMenuTreeContainer,
            $tabpanel = this.$sysRoleMenuTabpanel,
            ref = $tree.jstree( true ),
            options = $tree.data( "options" ),
            url = options.url
        ;

        // 销毁已经绘制的
        if ( ref ) {
            ref.destroy();
        }

        // 进行绘制

        $tabpanel.isLoading();

        $.ajax( {
            url: url,
            data: {
                roleId: roleId
            }
        } ).done( function ( gridResult ) {
            var msg;
            if ( !gridResult ||
                gridResult.success === false ||
                gridResult.data === null ||
                gridResult.data === undefined ) {

                msg = ( gridResult && gridResult.message ) || "菜单权限树构建失败！";
                layer.msg( msg, { icon: 2 } );
                $.error( msg );
                return;
            }
            initTree( gridResult );
        } ).fail( function ( xhr ) {
            var msg = "菜单权限树构建失败：" + xhr.status + " (" + xhr.statusText + ")";
            layer.msg( msg, { icon: 0 } );
            $.error( msg );
        } ).always( function () {
            $tabpanel.isLoading( "hide" );
        } );

        /**
         * 初始化 jstree
         * @param gridResult {{data:*}}
         */
        function initTree( gridResult ) {
            var
                originData,
                fmtData,
                jstreeData,
                jstreeOptions = {}
            ;

            originData = gridResult.data;

            fmtData = fmtSysMenuList( originData, options );

            jstreeData = window.PKUI.getTreeList( {
                data: fmtData,
                rootId: options.menuId,
                idName: "menuId",
                parentIdName: "treeParentid",
                childrenName: "children"
            } );
            jstreeOptions.core = {
                "data" : jstreeData,
                "dblclick_toggle": options[ "jstreeOptions"][ "dblclick_toggle" ],
                "worker": false,
                "multiple" : true, // no multiselection
                "themes" : {
                    "dots" : true // no connecting dots between dots
                },
                "check_callback" : true
            };

            jstreeOptions.checkbox = {
                keep_selected_style: false
            };

            jstreeOptions.plugins = [ "checkbox" ];

            $tree.jstree( jstreeOptions );
        }

        /**
         *
         * @param list {Array}
         * @param options {{}}
         * @returns {Array}
         */
        function fmtSysMenuList( list, options ) {
            var
                fmtList = [],
                timestamp = "jstree_"  +( new Date() ).getTime() + "_",
                jstreeOptions = options[ "jstreeOptions" ]
            ;
            // 添加 jstree 必须的属性
            $.each( list, function ( index, sysMenuView ) {
                var
                    icon = sysMenuView[ "icon" ] || "fa fa-file-o"
                ;
                fmtList.push( sysMenuView );
                if ( icon && icon.indexOf( ".png" ) !== -1 ) {
                    icon = window.PKUI.iconPath + "/24x24/" + icon;
                }
                // 绑定的 data
                sysMenuView.data = $.extend( true, {}, sysMenuView );

                // href
                sysMenuView.a_attr = {
                    href: "javascript:void(0)",
                    menuicon: icon
                };

                // id
                sysMenuView.id = timestamp + sysMenuView[ "menuId" ];
                // text
                sysMenuView.text = sysMenuView[ "menuName" ];
                // icon
                sysMenuView.icon = icon;
                // state
                sysMenuView.state = {
                    opened: jstreeOptions[ "openAll" ],
                    selected: sysMenuView[ "checked" ] === "checked"
                };


            } );

            return fmtList;
        }

        // 标志已被绘制
        $tabpanel.attr( "draw-for-roleid", roleId );
    };
    /**
     * 重新绘制“资源权限”
     * @param roleId {*} 角色ID
     */
    SysRoleContent.prototype.redrawRoleResource = function ( roleId ) {

        // 标志需要为 选中的角色树条目 绘制
        this.$sysRoleResourceTabpanel.attr( "roleid", roleId );

        // 如果当前页签为active状态，则进行绘制；
        if ( this.$sysRoleResourceTabpanel.is( ".active" ) ) {
            this.drawRoleResource( roleId );
        }
    };

    /**
     * 绘制“资源权限”
     * @param roleId {*} 角色ID
     */
    SysRoleContent.prototype.drawRoleResource = function ( roleId ) {
        var
            $tree  = this.$sysRoleResourceTreeContainer,
            $tabpanel = this.$sysRoleResourceTabpanel,
            ref = $tree.jstree( true ),
            options = $tree.data( "options" ),
            url = options.url
        ;

        // 销毁已经绘制的
        if ( ref ) {
            ref.destroy();
        }

        // 进行绘制

        $tabpanel.isLoading();

        $.ajax( {
            url: url,
            data: {
                roleId: roleId
            }
        } ).done( function ( gridResult ) {
            var msg;
            if ( !gridResult ||
                gridResult.success === false ||
                gridResult.data === null ||
                gridResult.data === undefined ) {

                msg = ( gridResult && gridResult.message ) || "资源权限构建失败！"

                layer.msg( msg, { icon: 2 } );
                $.error( msg );
                return;
            }
            initTree( gridResult );
        } ).fail( function ( xhr ) {
            var msg = "资源权限构建失败：" + xhr.status + " (" + xhr.statusText + ")";
            layer.msg( msg, { icon: 0 } );
            $.error( msg );
        } ).always( function () {
            $tabpanel.isLoading( "hide" );
        } );

        /**
         * 初始化 jstree
         * @param gridResult {{data:*}}
         */
        function initTree( gridResult ) {
            var
                originData,
                fmtData,
                jstreeData = [],
                jstreeOptions = {},
                menuIdList = [],
                rootNodeList = [],
                childrenSet = {}
            ;


            originData = gridResult.data;

            // 获取所有的 menuId，并去重
            $.each( originData, function ( index, item ) {
                if ( item ) {
                    menuIdList.push( item.menuId );
                }
            } );

            $.unique( menuIdList );


            fmtData = fmtSysResourceList( originData, options );


            // 按menuId分组
            $.each( fmtData, function ( index, item ) {
                var
                    menuId = item.menuId
                ;
                if ( menuId === null ) {
                    return;
                }
                if ( ! childrenSet[ menuId ] ) {
                    childrenSet[ menuId ] = [];
                }
                childrenSet[ menuId ].push( item );
            } );

            // 构建 根节点
            $.each( menuIdList, function ( index, menuId ) {
                rootNodeList.push( {
                    resourceId: "menuId_" + menuId,
                    resourceDesc: childrenSet[ menuId ][ 0 ].menuName,
                    menuId: false,
                    _menuId: menuId
                });
            } );

            rootNodeList = fmtSysResourceList( rootNodeList, options );

            // 构建 jstreeData
            $.each( rootNodeList, function( index, rootNode ) {
                var
                    subtree = rootNode
                ;
                subtree.children = childrenSet[ rootNode._menuId ];
                jstreeData.push( subtree )
            } );

            jstreeOptions.core = {
                "data" : jstreeData,
                "dblclick_toggle": options[ "jstreeOptions"][ "dblclick_toggle" ],
                "worker": false,
                "multiple" : true, // no multiselection
                "themes" : {
                    "dots" : true // no connecting dots between dots
                },
                "check_callback" : true
            };

            jstreeOptions.checkbox = {
                keep_selected_style: false
            };

            jstreeOptions.plugins = [ "checkbox" ];

            $tree.jstree( jstreeOptions );
        }

        /**
         *
         * @param list {Array}
         * @param options {{}}
         * @returns {Array}
         */
        function fmtSysResourceList( list, options ) {
            var
                fmtList = [],
                timestamp = "jstree_"  +( new Date() ).getTime() + "_",
                jstreeOptions = options[ "jstreeOptions" ]
            ;
            // 添加 jstree 必须的属性
            $.each( list, function ( index, sysResourceView ) {
                var
                    icon = "fa fa-file-o"
                ;
                fmtList.push( sysResourceView );

                // 绑定的 data
                sysResourceView.data = $.extend( true, {}, sysResourceView );

                // href
                sysResourceView.a_attr = {
                    href: "javascript:void(0)",
                    menuicon: icon
                };

                // id
                sysResourceView.id = timestamp + sysResourceView[ "resourceId" ];
                // text
                sysResourceView.text = sysResourceView[ "resourceDesc" ];
                // icon
                sysResourceView.icon = icon;
                // state
                sysResourceView.state = {
                    opened: jstreeOptions[ "openAll" ],
                    selected: sysResourceView[ "checked" ] === "checked"
                };


            } );

            return fmtList;
        }

        // 标志已被绘制
        $tabpanel.attr( "draw-for-roleid", roleId );
    };
    /**
     * 重新绘制“数据权限”
     * @param roleId {*} 角色ID
     */
    SysRoleContent.prototype.redrawRolePermit = function ( roleId ) {

        // 标志需要为 选中的角色树条目 绘制
        this.$sysRolePermitTabpanel.attr( "roleid", roleId );

        // 如果当前页签为active状态，则进行绘制；
        if ( this.$sysRolePermitTabpanel.is( ".active" ) ) {
            this.drawRolePermit( roleId );
        }
    };

    /**
     * 绘制“数据权限”
     * @param roleId {*} 角色ID
     */
    SysRoleContent.prototype.drawRolePermit = function ( roleId ) {
        var
            $tree  = this.$sysRolePermitTreeContainer,
            $tabpanel = this.$sysRolePermitTabpanel,
            ref = $tree.jstree( true ),
            options = $tree.data( "options" ),
            url = options.url
        ;

        // 销毁已经绘制的
        if ( ref ) {
            ref.destroy();
        }

        // 进行绘制

        $tabpanel.isLoading();

        $.ajax( {
            url: url,
            data: {
                roleId: roleId
            }
        } ).done( function ( gridResult ) {
            var msg;
            if ( !gridResult ||
                gridResult.success === false ||
                gridResult.data === null ||
                gridResult.data === undefined ) {

                msg = ( gridResult && gridResult.message ) || "数据权限构建失败！"

                layer.msg( msg, { icon: 2 } );
                $.error( msg );
                return;
            }
            initTree( gridResult );
        } ).fail( function ( xhr ) {
            var msg = "数据权限构建失败：" + xhr.status + " (" + xhr.statusText + ")";
            layer.msg( msg, { icon: 0 } );
            $.error( msg );
        } ).always( function () {
            $tabpanel.isLoading( "hide" );
        } );

        /**
         * 初始化 jstree
         * @param gridResult {{data:*}}
         */
        function initTree( gridResult ) {
            var
                originData,
                fmtData,
                jstreeData = [],
                jstreeOptions = {},
                permitCodeList = [],
                rootNodeList = [],
                permitCodeSet = {}
            ;


            originData = gridResult.data;

            // 获取所有的 permitCode，并去重
            $.each( originData, function ( index, item ) {
                if ( item ) {
                    permitCodeList.push( item.permitCode );
                }
            } );

            $.unique( permitCodeList );


            fmtData = fmtSysPermitList( originData, options );


            // 按permitCode分组
            $.each( fmtData, function ( index, item ) {
                var
                    permitCode = item.permitCode
                ;
                if ( permitCode === null ) {
                    return;
                }
                if ( ! permitCodeSet[ permitCode ] ) {
                    permitCodeSet[ permitCode ] = [];
                }
                permitCodeSet[ permitCode ].push( item );
            } );

            // 构建 根节点
            $.each( permitCodeList, function ( index, permitCode ) {
                rootNodeList.push( {
                    permitId: "permitCode_" + permitCode,
                    permitName: permitCodeSet[ permitCode ][ 0 ].permitCodeDesc,
                    permitCode: false,
                    _permitCode: permitCode
                });
            } );

            rootNodeList = fmtSysPermitList( rootNodeList, options );

            // 构建 jstreeData
            $.each( rootNodeList, function( index, rootNode ) {
                var
                    subtree = rootNode
                ;
                subtree.children = permitCodeSet[ rootNode._permitCode ];
                jstreeData.push( subtree )
            } );

            jstreeOptions.core = {
                "data" : jstreeData,
                "dblclick_toggle": options[ "jstreeOptions"][ "dblclick_toggle" ],
                "worker": false,
                "multiple" : true, // no multiselection
                "themes" : {
                    "dots" : true // no connecting dots between dots
                },
                "check_callback" : true
            };

            jstreeOptions.checkbox = {
                keep_selected_style: false
            };

            jstreeOptions.plugins = [ "checkbox" ];

            $tree.jstree( jstreeOptions );
        }

        /**
         *
         * @param list {Array}
         * @param options {{}}
         * @returns {Array}
         */
        function fmtSysPermitList( list, options ) {
            var
                fmtList = [],
                timestamp = "jstree_"  +( new Date() ).getTime() + "_",
                jstreeOptions = options[ "jstreeOptions" ]
            ;
            // 添加 jstree 必须的属性
            $.each( list, function ( index, sysPermit ) {
                var
                    icon = "fa fa-file-o"
                ;
                fmtList.push( sysPermit );

                // 绑定的 data
                sysPermit.data = $.extend( true, {}, sysPermit );

                // href
                sysPermit.a_attr = {
                    href: "javascript:void(0)",
                    menuicon: icon
                };

                // id
                sysPermit.id = timestamp + sysPermit[ "permitId" ];
                // text
                sysPermit.text = sysPermit[ "permitName" ];
                // icon
                sysPermit.icon = icon;
                // state
                sysPermit.state = {
                    opened: jstreeOptions[ "openAll" ],
                    selected: sysPermit[ "checked" ] === "checked"
                };


            } );

            return fmtList;
        }

        // 标志已被绘制
        $tabpanel.attr( "draw-for-roleid", roleId );
    };

    return SysRoleContent;
} );