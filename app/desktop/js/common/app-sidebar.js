/**
 * sidebar 相关功能
 */
define( function ( require ) {
    var
        $ = require( "jquery" ),
        layer = window.layer,
        MenuSource = require( "./menuSource" ),
        App = require( "./app" ),
        namespace = "pkui.sidebar",
        ArtTemplate = require( "artTemplate" )
    ;


    AppSidebar.prototype.defaults = {
        oftenUsedUrl: null,
        recentUsedUrl: null,
        saveUsedMenuUrl: null,
        toggleSelector: null,
        sidebarSelector: null,
        closeBtnSelector: ".da-sidebar-closeBtn",
        // 一旦内容改变，三分钟后发送请求进行保存
        saveDelayTime: 3 * 60 * 1000,
        // 显示的最常使用的最大数
        maxOftenUsedItemNum: 6,
        // 显示的最近使用的最大数
        maxRecentUsedItemNum: 10,

        template: null
    };

    AppSidebar.prototype.defaults.template = '<i class="da-sidebar-closeBtn fa fa-close"></i>'
        +   '<dl class="use-group use-group-often">'
        +   '    <dt class="use-group-header">常用功能</dt>'
        +   '    {{each oftenUsedMenuList }}'
        +   '        {{if $index < '+ AppSidebar.prototype.defaults.maxOftenUsedItemNum +'}}'
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
        +   '        {{if $index < '+ AppSidebar.prototype.defaults.maxRecentUsedItemNum +'}}'
        +   '        <dd class="use-group-item" '
        +               'data-menu-id="{{$value.menuId}}" '
        +               'data-menu-name="{{$value.menuName}}" '
        +               'data-icon="{{$value.icon}}">'
        +   '            <a href="#"><i class="{{$value.icon}}"></i> {{$value.menuName}}</a></dd>'
        +   '        {{/if}}'
        +   '    {{/each}}'
        +   '</dl>';

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
        var
            _this = this,
            timerId
        ;

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

        // 点击关闭按钮
        this.$sidebar.on( "click." + namespace, this.opts.closeBtnSelector, function () {
            _this.hide();
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
        $( document ).on( "inited.app", function ( event, appOptions ) {
            if ( appOptions && appOptions.menuId != null && appOptions.mode === "default" ) {
                _this.redraw( appOptions.menuId );
            }
        } );


        // 内容改变后，进行保存
        this.$sidebar.on( "changed." + namespace, function ( event, isRefresh ) {
            // 立马更新（）如果有更新）
            if ( isRefresh && timerId ) {
                _this.save();
            }
            // 取消前一个计时任务
            if ( timerId ) {
                window.clearTimeout( timerId );
            }
            // 开始计时任务
            timerId = window.setTimeout( function () {
                _this.save();
                timerId = null;
            }, _this.saveDelayTime )
        } );

        // 关闭（刷新）网页前进行保存
        $( window ).unload( function () {
            _this.$sidebar.trigger( "changed." + namespace, true );
        } );
    };

    /**
     * 获取数据
     * 1. 菜单数据
     * 2. 常用菜单数据
     *      { 'menuId':使用次数,... }
     *      {'1':12,'2':8,'3':7,'4':6,'5':5,'6':4,'7':3,'8':2}
     * 3. 最近使用菜单数据
     *      { menuId1, menuId2 }
     *      1,2,3,4,5,6,7,8,9,10
     */
    AppSidebar.prototype.getData = function ( callback ) {
        var
            _this = this
        ;
        /*
        this._getData( this.opts.menuUrl, function ( jsonResult ) {
            refresh();
            _this.sysMenuList = jsonResult.data;
        } );
        */
        this.sysMenuList = MenuSource.getList();

        this._getData( this.opts.oftenUsedUrl, function ( jsonResult ) {
            _this.oftenUsedMenuList = jsonResult.data || [];
            refresh();
        } );
        this._getData( this.opts.recentUsedUrl, function ( jsonResult ) {
            _this.recentUsedMenuList = jsonResult.data || [];
            refresh();
        } );

        function refresh() {

            if ( _this.hasOwnProperty( "sysMenuList" ) &&
                 _this.hasOwnProperty( "oftenUsedMenuList" ) &&
                 _this.hasOwnProperty( "recentUsedMenuList" ) ) {

                callback && callback();
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
        $sidebar.stop().animate( { left: -$sidebar.outerWidth() }, function () {
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
     * 格式化数据。
     * this.oftenUsedMenuList 和 this.recentUsedMenuList 使用的都是 this.sysMenuList 的数据，
     * 也就是说sysMenu对象的引用是相同的。
     * @private
     * @example
        this.sysMenuList = {
            1: { menuId: 1, menuName: "字典管理", icon: "fa fa-x" },
            2: { menuId: 2, menuName: "菜单管理", icon: "fa fa-xx" },
            ...
        }
        this.oftenUsedMenuList = [
            { menuId: 1, menuName: "字典管理", icon: "fa fa-x", count: 3 },
            { menuId: 2, menuName: "菜单管理", icon: "fa fa-xx", count: 2 },
            ...
        ]
        this.recentUsedMenuList = [
            { menuId: 1, menuName: "字典管理", icon: "fa fa-x", count: 3 },
            { menuId: 2, menuName: "菜单管理", icon: "fa fa-xx", count: 2 },
            ...
        ]

     */
    AppSidebar.prototype._fmtData = function () {
        var temp,
            _this = this,
            lastPos,
            str,
            menuId, sysMenu
        ;

        // 将全局菜单数据格式化为字典格式
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

        // 判断是否符合特定格式
        if ( this.oftenUsedMenuList &&
             typeof this.oftenUsedMenuList === "string" &&
             this.oftenUsedMenuList.indexOf( ":" ) !== -1 ) {
            try {
                temp = [];
                // 将单引号替换为双引号
                this.oftenUsedMenuList = this.oftenUsedMenuList.replace( /'/g, '"');
                // 转为json，如果转换失败，则说明字符串json格式不完整，
                this.oftenUsedMenuList = $.parseJSON( this.oftenUsedMenuList );
            } catch ( e ) {
                // 截取前面可用部分，进行转换
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
             ( this.recentUsedMenuList.length === 1 || this.recentUsedMenuList.indexOf( "," ) !== -1 ) ) {

            temp = [];

            this.recentUsedMenuList = this.recentUsedMenuList.split( "," );

            $.each( this.recentUsedMenuList, function ( index, menuId ) {
                sysMenu = _this.sysMenuList[ menuId ];
                if ( sysMenu.hasOwnProperty( "menuId" ) ) {
                    temp.push( sysMenu );
                }
            } );

            this.recentUsedMenuList = temp;

        }

        // 排序
        this._sortOftenUsedMenuList();

    };

    /**
     * 当打开一个新的app时，重新绘制侧边栏内容，并产生一个 changed 事件
     * @param menuId
     */
    AppSidebar.prototype.redraw = function ( menuId ) {
        var
            _this = this,
            sysMenu
        ;

        /* 最近使用 */
        // 1. 若存在列表中，则删除
        $.each( this.recentUsedMenuList, function ( index, item ) {
            if ( item.menuId == menuId ) {
                _this.recentUsedMenuList.splice( index, 1 );
                return false;
            }
        } );
        // 2. 将其添加列表第一位
        this.recentUsedMenuList.unshift( this.sysMenuList[ menuId ] );

        /* 最常使用 */
        // 1. 若存在，则自增
        if ( this.isInOftenUsedList( menuId ) ) {
            $.each( this.oftenUsedMenuList, function ( index, item ) {
                if ( item.menuId == menuId ) {
                    item.count++;
                    return false;
                }
            } );
        }
        // 2. 若不存在，则追加到末尾
        else {
            sysMenu = this.sysMenuList[ menuId ];
            sysMenu.count = 1;
            this.oftenUsedMenuList.push( sysMenu );
        }
        // 排序
        this._sortOftenUsedMenuList();


        // 重新绘制
        this.draw();

        /**
         * 内容改变后执行
         * @event changed.pkui.sidebar
         */
        this.$sidebar.trigger( "changed." + namespace );
    };

    AppSidebar.prototype.isInOftenUsedList =  function ( menuId, list ) {
        var isExist = false;
        list = list || this.oftenUsedMenuList;
        $.each( list, function ( index, item ) {
            if ( item.menuId == menuId ) {
                isExist = true;
                return false;
            }
        } );
        return isExist;
    };
    AppSidebar.prototype.isInRecentUsedList =  function ( menuId ) {
        return this.isInOftenUsedList( menuId, this.recentUsedMenuList );
    };

    /**
     * 保存，发送的数据
     * @example
        {
            recent: "1,2,3,4,5,6,7,8,9,10",
            often: "{'1':12,'2':8,'3':7,'4':6,'5':5,'6':4,'7':3,'8':2}"
        }
     */
    AppSidebar.prototype.save = function () {
        var
            data,
            recent = "",
            often = ""
        ;


        $.each( this.recentUsedMenuList, function ( index, menu ) {
            if ( ! (menu && menu.hasOwnProperty( "menuId" ) ) ) {
                return;
            }
            recent += menu.menuId + ",";
        } );
        if ( recent.indexOf( "," ) !== -1 ) {
            recent = recent.substring( 0, recent.length - 1 );
        }

        $.each( this.oftenUsedMenuList, function ( index, menu ) {
            var
                menuId,
                count
            ;
            if ( ! (menu && menu.hasOwnProperty( "menuId" ) ) ) {
                return;
            }
            menuId = menu.menuId;
            count = menu.count || 1;
            often += "'" + menuId + "':" + count + ",";
        } );
        if ( often.indexOf( "," ) !== -1 ) {
            often = "{" + often.substring( 0, often.length - 1 ) + "}";
        }

        data = {
            recent: recent,
            often: often
        };

        $.ajax( {
            url: this.opts.saveUsedMenuUrl,
            data: data
        } ).done( function ( jsonResult ) {
            if ( jsonResult && jsonResult.success ) {
                console.info( "侧边栏数据保存成功" );
            }
            else {
                layer.alert( "侧边栏数据保存失败：服务器内部错误。", { icon: 2 } );
            }
        } );

    };

    /**
     * 排序
     * @private
     */
    AppSidebar.prototype._sortOftenUsedMenuList = function () {
        this.oftenUsedMenuList.sort( function ( prevMenu, nextMenu ) {
            var
                prevCount = prevMenu.count || 1,
                nextCount = nextMenu.count || 1
                ;
            // 倒序
            return nextCount - prevCount;
        } );
    };


    return AppSidebar;
} );