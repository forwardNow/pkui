define( function ( require ) {
    require( "../3.3.3/jstree.js" );
    require( "../3.3.3/themes/default/style.css" );


    var $ = require( "jquery" ),
        namespace = "pkui.menutree"
    ;

    MenuTree.prototype.defaults = {
        url: "",
        dnd: false
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
                data,
                jstreeData
            ;
            if ( !gridResult ) {
                window.layer.alert( "获取菜单数据失败！", { icon: 2 } );
                return;
            }
            data = gridResult.data;

            data = fmtSysMenuList( data );

            jstreeData = window.PKUI.getTreeList( {
                data: data,
                idName: "menuId",
                parentIdName: "treeParentid",
                childrenName: "children"
            } );
            _this.$target.jstree({
                'core' : {
                    'data' : jstreeData
                }
            });

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
            pos
        ;
        // 添加 jstree 必须的属性
        $.each( list, function ( index, sysMenu ) {
            var
                icon = sysMenu[ "icon" ],
                visiable = sysMenu[ "visiable" ] === "1"
            ;
            if ( ! visiable ) {
                list[ index ] = undefined;
                return;
            }
            if ( icon.indexOf( ".png" ) !== -1 ) {
                icon = window.PKUI.ctxPath + "/static/desktop/images/icon/24x24/" + icon;
            }
            // id
            sysMenu.id = sysMenu[ "menuId" ];
            // text
            sysMenu.text = sysMenu[ "menuName" ];
            // icon
            sysMenu.icon = icon;
            // state
            sysMenu.state = {
                opened: sysMenu[ "expand" ] === "1"
            }
        } );

        // 删除所有值为undefined的元素
        while( ( pos = $.inArray( undefined, list ) ) !== -1 ) {
            list.splice( pos, 1 );
        }

        return list;
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