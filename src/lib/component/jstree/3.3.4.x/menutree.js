define( function ( require ) {
    require( "../3.3.4/jstree.js" );
    require( "../3.3.4/themes/default/style.css" );
    require( "./style.css" );


    var $ = require( "jquery" ),
        namespace = "pkui.menutree"
    ;

    MenuTree.prototype.defaults = {
        // /admin/sysMenuListData
        url: "",
        // 是否可拖拽
        dnd: false,
        // 指定根节点（menuId）
        menuId: null
    };

    $.extend( MenuTree.prototype, {
        $target: null,
        options: null
    } );

    function MenuTree( $target, options ) {
        this.$target = $target;
        this.options = $.extend( {}, this.defaults, options );
        this.init();
    }

    MenuTree.prototype.init = function () {
        var
            _this = this,
            options = this.options
        ;

        _this.$target.isLoading();

        $.ajax( {
            url: options.url
        } ).done( function ( gridResult ) {
            var
                originData,
                fmtData,
                jstreeData,
                jstreeOptions = {}
            ;
            if ( !gridResult ) {
                window.layer.alert( "获取菜单数据失败！", { icon: 2 } );
                return;
            }
            originData = gridResult.data;

            fmtData = fmtSysMenuList( originData );

            jstreeData = window.PKUI.getTreeList( {
                data: fmtData,
                rootId: options.menuId,
                idName: "menuId",
                parentIdName: "treeParentid",
                childrenName: "children"
            } );
            jstreeOptions.core = {
                "data" : jstreeData,
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

        } ).fail( function () {
            // 提示网络错误
            window.layer.alert( '网络错误！', { icon: 0 } );
        } ).always( function () {
            _this.$target.isLoading( "hide" );
        } );

    };

    /**
     *
     * @param list
     * @returns {Array}
     */
    function fmtSysMenuList( list ) {
        var
            pos,
            fmtList = []
        ;
        // 添加 jstree 必须的属性
        $.each( list, function ( index, sysMenu ) {
            var
                icon = sysMenu[ "icon" ],
                visiable = sysMenu[ "visiable" ] === "1"
            ;
            if ( ! visiable ) {
                //list[ index ] = undefined;
                return;
            }
            fmtList.push( sysMenu );
            if ( icon.indexOf( ".png" ) !== -1 ) {
                icon = window.PKUI.iconPath + "/24x24/" + icon;
            }
            // 绑定的 sysMenu
            sysMenu.li_attr = {
                "data-sysmenu": JSON.stringify( sysMenu )
            };

            // href
            sysMenu.a_attr = {
                href: sysMenu[ "menuUrl" ] ? ( window.PKUI.ctxPath + sysMenu[ "menuUrl" ] ) : "#",
                menuicon: icon
            };

            // id
            sysMenu.id = sysMenu[ "menuId" ];
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