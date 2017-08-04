/**
 * @fileOverview 对jstree的封装
 *
 * @author 吴钦飞（wuqf@pkusoft.net）
 */
define( function ( require ) {
    require( "../3.3.4/jstree.js" );
    require( "../3.3.4/themes/default/style.css" );
    require( "./style.css" );


    var $ = require( "jquery" ),
        namespace = "pkui.menutree",
        layer = window.layer
    ;

    /**
     * 默认参数
     */
    MenuTree.prototype.defaults = {
        // /admin/sysMenuListData
        url: "",
        // 是否可拖拽
        dnd: false,
        // 指定根节点（menuId），省略则取将所有 parentId 为null 的作为根节点
        menuId: null,
        // 是否显示不可见的菜单
        showInvisible: false,
        // 初始化后，第一个菜单项条目是否被选中
        isFirstMenuItemSelected: false,
        // 是否隐藏根节点
        isHideSingleRootNode: false
    };

    /**
     * 构造函数
     * @param $target 菜单树目标
     * @param options {*?}
     * @constructor
     */
    function MenuTree( $target, options ) {
        this.$target = $target;
        this.options = $.extend( true, {}, this.defaults, options );
        this._init();
    }

    /**
     * 缓存。缓存指定URL的数据
     * @type {{}}
     */
    MenuTree.cache = {};

    /**
     * 初始化
     * @private
     */
    MenuTree.prototype._init = function () {
        var
            _this = this,
            options = this.options,
            url = options.url
        ;


        // 已缓存
        if ( MenuTree.cache[ url ] ) {
            initTree( MenuTree.cache[ url ] );
            return;
        }


        // 未缓存，则Ajax请求

        _this.$target.isLoading();

        $.ajax( {
            url: url
        } ).done( function ( gridResult ) {
            if ( !gridResult ||
                 gridResult.success === false ||
                 gridResult.data === null ||
                 gridResult.data === undefined ) {

                layer.msg( ( gridResult && gridResult.message ) || "菜单树构建失败！", { icon: 2 } );
                return;
            }
            MenuTree.cache[ url ] = gridResult;
            initTree( gridResult );
        } ).fail( function ( xhr ) {
            var msg = "菜单树构建失败：" + xhr.status + " (" + xhr.statusText + ")";
            layer.msg( msg, { icon: 0 } );
            console.error( msg );
        } ).always( function () {
            _this.$target.isLoading( "hide" );
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
                jstreeOptions = {},
                children
                ;

            originData = gridResult.data;


            fmtData = fmtSysMenuList( originData, options.showInvisible );

            jstreeData = window.PKUI.getTreeList( {
                data: fmtData,
                rootId: options.menuId,
                idName: "menuId",
                parentIdName: "treeParentid",
                childrenName: "children"
            } );

            // 如果只有一个根节点
            if ( jstreeData.length === 1 ) {

                // 如果该根节点下还有 children
                // 则将其删除（避免过多重复：标签名、窗口标题名、根节点名都是相同的）
                if ( options.isHideSingleRootNode ) {


                    children = jstreeData[ 0 ].children;

                    if ( children && children.length !==0 ) {
                        jstreeData = children;
                    }

                }
            }


            jstreeOptions.core = {
                "data" : jstreeData,
                "worker": false,
                "multiple" : false, // no multiselection
                "themes" : {
                    "dots" : true // no connecting dots between dots
                },
                "check_callback" : true
            };
            jstreeOptions.plugins = ["wholerow"];

            if ( options.dnd ) {
                jstreeOptions.plugins.push( "dnd" );
            }

            _this.$target.jstree( jstreeOptions );

            /* 此操作放在
            if ( options.isFirstMenuItemSelected ) {
                $jstreeAnchor = _this.$target.find( ".jstree-anchor" );
                $jstreeAnchor.eq( 0 ).trigger( "click" );
            }
            */

            // 标志
            _this.$target.addClass( "jstree-menutree" );
        }

    };

    /**
     *
     * @param list {Array}
     * @param showInvisible {Boolean}
     * @returns {Array}
     */
    function fmtSysMenuList( list, showInvisible ) {
        var
            iconPath = window.PKUI.iconPath,
            ctxPath = window.PKUI.ctxPath,
            fmtList = [],
            timestamp = "jstree_"  +( new Date() ).getTime() + "_"
        ;
        // 添加 jstree 必须的属性
        $.each( list, function ( index, sysMenu ) {
            var
                icon = sysMenu[ "icon" ] || "fa fa-file-o",
                visiable = sysMenu[ "visiable" ] === "1",
                patchIcon = sysMenu[ "reserve1" ],
                url = sysMenu[ "menuUrl" ],
                patchUrl = sysMenu[ "reserve2" ]
            ;
            if ( !visiable && !showInvisible) {
                return;
            }

            fmtList.push( sysMenu );

            if ( icon.indexOf( ".png" ) !== -1 && icon.indexOf( iconPath ) === -1 ) {
                icon = iconPath + "/" + icon;
            }

            if ( typeof patchIcon === "string" && patchIcon.indexOf( "fa-" ) !== -1 ) {
                icon = patchIcon;
            }
            if ( typeof patchUrl === "string" && patchUrl.indexOf( "/" ) === 0 ) {
                url = patchUrl;
            }

            if ( url ) {
                url = ctxPath + url;
            } else {
                url = "#";
            }

            // 绑定的 data
            sysMenu.data = $.extend( true, {}, sysMenu );

            // href
            sysMenu.a_attr = {
                href: url,
                menuicon: icon
            };

            // id
            sysMenu.id = timestamp + sysMenu[ "menuId" ];
            // text
            sysMenu.text = sysMenu[ "menuName" ];
            // icon
            sysMenu.icon = icon;
            // state
            sysMenu.state = {
                opened: sysMenu[ "expand" ] === "1"
            };


        } );

        // 删除所有值为undefined的元素
        /*while( ( pos = $.inArray( undefined, list ) ) !== -1 ) {
            list.splice( pos, 1 );
        }*/

        return fmtList;
    }

    $.fn.MenuTree = function ( options ) {

        this.each( function () {
            var
                $this = $( this ),
                instance = $this.data( namespace )
                ;

            // 如果没有初始化，则进行初始化
            if ( ! instance ) {
                $this.attr( "isrendered", true );
                instance = new MenuTree( $this, options );
                $this.data( namespace, instance );
            }

        } );

        return this;
    };

    window.PKUI.component.menuTree = $.fn.MenuTree;

    return MenuTree;
} );