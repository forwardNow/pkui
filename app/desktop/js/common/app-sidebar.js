/**
 * sidebar 相关功能
 */
define( function ( require ) {
    var
        $ = require( "jquery" ),
        layer = window.layer,
        App = require( "./app" ),
        namespace = "pkui.sidebar",
        ArtTemplate = require( "artTemplate" )
    ;

    AppSidebar.prototype.defaults = {
        menuUrl: "",
        oftenUsedUrl: "",
        recentUsedUrl: "",
        saveUsedMenuUrl: "",
        toggleSelector: "",
        sidebarSelector: "",
        template:
        '   <dl class="use-group use-group-often">'
        +   '    <dt class="use-group-header">常用功能</dt>'
        +   '    {{each oftenUsedMenuList }}'
        +   '        {{if $index < 6}}'
        +   '        <dd class="use-group-item" '
        +               'data-menu-id="{{$value.menuId}}" '
        +               'data-menu-name="{{$value.menuName}}" '
        +               'data-icon="{{$value.icon}}">'
        +   '            <a href="#"><i class="{{$value.icon}}"></i> {{$value.menuName}}</a><span class="count">{{$value.count}}</span></dd>'
        +   '        {{/if}}'
        +   '    {{/each}}'
        +   '</dl>'
        +   '<dl class="use-group use-group-recent">'
        +   '    <dt class="use-group-header">最近使用</dt>'
        +   '    {{each recentUsedMenuList }}'
        +   '        {{if $index < 8}}'
        +   '        <dd class="use-group-item" '
        +               'data-menu-id="{{$value.menuId}}" '
        +               'data-menu-name="{{$value.menuName}}" '
        +               'data-icon="{{$value.icon}}">'
        +   '            <a href="#"><i class="{{$value.icon}}"></i> {{$value.menuName}}</a></dd>'
        +   '        {{/if}}'
        +   '    {{/each}}'
        +   '</dl>'


    };

    /**
     * 构造函数
     * @param opts
     * @constructor
     */
    function AppSidebar( opts ) {
        this.opts = $.extend( true, {}, this.defaults, opts );
        this.init();
    }

    /**
     * 初始化方法
     */
    AppSidebar.prototype.init = function () {
        var _this = this;
        this.render();
        this.bind();

        this.templateRender = ArtTemplate.compile( this.opts.template );

        this.getData( function () {
            _this._fmtData();
            _this.draw();
        } );
    };

    /**
     * 准备数据
     */
    AppSidebar.prototype.render = function () {
        this.$toggle = $( this.opts.toggleSelector );
        this.$sidebar = $( this.opts.sidebarSelector );
    };

    /**
     * 绑定事件
     */
    AppSidebar.prototype.bind = function () {
        var _this = this;

        // 点击开关时，显示/隐藏 侧边栏
        this.$toggle.on( "click." + namespace, function () {
            var $sidebar = _this.$sidebar;

            if ( $sidebar.is( ".app-sidebar-showed" ) ) {
                _this.hide();
            }
            else {
                _this.show();
            }
        } );

        // 点击app条目，打开app
        this.$sidebar.on( "click." + namespace, ".use-group-item", function () {

            var $item = $( this );

            // 开启 窗口
            new App(null, {
                "icon": $item.data( "icon" ),
                "title": $item.data( "menuName" ),
                "src": "./tpl/system/index.html",
                "menuId": $item.data( "menuId" ),
                "mode": "default"})
        } );

        // 监听 在 $document 上触发的 inited.app 事件
        $( document ).on( "inited.app", function ( event, menuId ) {
            if ( ! menuId ) {
                return;
            }
            _this.redraw( menuId );
        } );

    };

    /**
     * 获取数据
     * 1. 菜单数据
     * 2. 常用菜单数据
     * 3. 最近使用菜单数据
     */
    AppSidebar.prototype.getData = function ( callback ) {
        var
            _this = this
        ;
        this._getData( this.opts.menuUrl, function ( jsonResult ) {
            _this.sysMenuList = jsonResult.data;
            refresh();
        } );
        this._getData( this.opts.oftenUsedUrl, function ( jsonResult ) {
            _this.oftenUsedMenuList = jsonResult.data;
            refresh();
        } );
        this._getData( this.opts.recentUsedUrl, function ( jsonResult ) {
            _this.recentUsedMenuList = jsonResult.data;
            refresh();
        } );

        function refresh() {

            if ( _this.hasOwnProperty( "sysMenuList" ) &&
                 _this.hasOwnProperty( "oftenUsedMenuList" ) &&
                 _this.hasOwnProperty( "recentUsedMenuList" ) ) {

                callback && callback();
                _this.isDataReady = true;
            }
        }
    };

    /**
     * 获取数据的公共方法
     * @param url
     * @param callback
     * @private
     */
    AppSidebar.prototype._getData = function ( url, callback ) {
        $.ajax( {
            url: url
        } ).done( function ( jsonResult ) {
            if ( !jsonResult ||  jsonResult.success === false ) {
                layer.alert( ( jsonResult && jsonResult.message ) || "【应用侧边栏】请求数据失败：服务器内部错误！", { icon: 2 } );
                return;
            }
            callback && callback( jsonResult );
        } ).fail( function () {
            // 提示网络错误
            layer.alert( '【应用侧边栏】请求数据失败：网络错误/登陆失效。', { icon: 0 } );
        } ).always( function () {
            // do something
        } );
    };

    /**
     * 显示侧边栏
     */
    AppSidebar.prototype.show = function () {
        var $sidebar = this.$sidebar;
        $sidebar.stop().animate( { left: 0 }, function () {
            $sidebar.addClass( "app-sidebar-showed" )
        } );
    };
    /**
     * 隐藏侧边栏
     */
    AppSidebar.prototype.hide = function () {
        var $sidebar = this.$sidebar;
        $sidebar.stop().animate( { left: -$sidebar.width() }, function () {
            $sidebar.removeClass( "app-sidebar-showed" );
        } );
    };

    /**
     * 绘制侧边栏的内容
     */
    AppSidebar.prototype.draw = function () {
        var
            html
        ;

        html = this.templateRender( {
            oftenUsedMenuList: this.oftenUsedMenuList,
            recentUsedMenuList: this.recentUsedMenuList
        } );

        this.$sidebar.html( html );
    };

    /**
     * 格式化数据
     * @private
     */
    AppSidebar.prototype._fmtData = function () {
        var temp,
            _this = this,
            lastPos,
            str,
            menuId, sysMenu
        ;

        if ( this.sysMenuList ) {
            temp = {};
            $.each( this.sysMenuList, function ( index, sysMenu ) {
                temp[ sysMenu[ "menuId" ] ] = {
                    menuId: sysMenu[ "menuId" ],
                    menuName: sysMenu[ "menuName" ],
                    icon: sysMenu[ "icon" ]
                }
            } );
            this.sysMenuList = temp;
        }
        if ( this.oftenUsedMenuList &&
             typeof this.oftenUsedMenuList === "string" &&
             this.oftenUsedMenuList.indexOf( "," ) !== -1 ) {
            try {
                temp = [];
                this.oftenUsedMenuList = this.oftenUsedMenuList.replace( /'/g, '"');
                this.oftenUsedMenuList = $.parseJSON( this.oftenUsedMenuList );
            } catch ( e ) {
                lastPos = _this.oftenUsedMenuList.lastIndexOf( "," );
                str = _this.oftenUsedMenuList.substring( 0, lastPos ) + "}";
                _this.oftenUsedMenuList = $.parseJSON( str );
            }

            for ( menuId in _this.oftenUsedMenuList ) {
                if ( _this.oftenUsedMenuList.hasOwnProperty( menuId ) ) {
                    sysMenu = _this.sysMenuList[ menuId ];
                    sysMenu.count = _this.oftenUsedMenuList[ menuId ];
                    temp.push( sysMenu );
                }
            }
            _this.oftenUsedMenuList = temp;

        }
        if ( this.recentUsedMenuList &&
             typeof this.recentUsedMenuList === "string" &&
             this.recentUsedMenuList.indexOf( "," ) !== -1 ) {

            temp = [];

            this.recentUsedMenuList = this.recentUsedMenuList.split( "," );

            $.each( this.recentUsedMenuList, function ( index, menuId ) {
                sysMenu = _this.sysMenuList[ menuId ];
                temp.push( sysMenu );
            } );

            this.recentUsedMenuList = temp;

        }
    };

    /**
     * 当打开一个新的app时，重新绘制侧边栏内容
     * @param menuId
     */
    AppSidebar.prototype.redraw = function ( menuId ) {
        var
            _this = this,
            sysMenu
        ;
        /* 最近使用 */
        // 1. 若存在列表中，则删除
        if ( this.isInRecentUsedList( menuId ) ) {
            $.each( this.recentUsedMenuList, function ( index, item ) {
                if ( item && item.menuId == menuId ) {
                    _this.recentUsedMenuList.splice( index, 1 );
                    return true;
                }
            } );
        }
        // 2. 将其添加列表第一位
        this.recentUsedMenuList.unshift( this.sysMenuList[ menuId ] );

        /* 最常使用 */
        // 1. 若存在，则自增，并排序
        if ( this.isInOftenUsedList( menuId ) ) {
            $.each( this.oftenUsedMenuList, function ( index, item ) {
                if ( item && item.menuId == menuId ) {
                    item.count++;
                    if ( index !== 0 && item.count > _this.oftenUsedMenuList[ index - 1 ].count ) {
                        _this.oftenUsedMenuList.splice( index, 1 );
                        _this.oftenUsedMenuList.splice( index - 1, 0, item );
                    }
                    return true;
                }
            } );
        }
        // 2. 若不存在，则追加到末尾
        else {
            sysMenu = this.sysMenuList[ menuId ];
            sysMenu.count = 1;
            this.oftenUsedMenuList.push( sysMenu );
        }

        // 重新绘制
        this.draw();
    };

    AppSidebar.prototype.isInOftenUsedList =  function ( menuId, list ) {
        var isExist = false;
        list = list || this.oftenUsedMenuList;
        $.each( list, function ( index, item ) {
            if ( item.menuId == menuId ) {
                isExist = true;
                return true;
            }
        } );
        return isExist;
    };
    AppSidebar.prototype.isInRecentUsedList =  function ( menuId ) {
        return this.isInOftenUsedList( menuId, this.recentUsedMenuList );
    };
    return AppSidebar;
} );