/**
 * 菜单图标编辑相关
 */
define( function ( require ) {
    var
        $ = require( "jquery" ),
        PKUI = window.PKUI,
        layer = window.layer,
        namespace = "pkui.sysmenu.icon"
    ;

    require( "bootstrap-tab" );

    SysMenuIcon.prototype.defaults = {

        //icon: null,
        //$menuIconInput: null,
        menuIconInputSelector: "#sysMenuIconInput",

        //$container: null,
        containerSelector: "#menuiconContainer",

        //$tab: null,
        tabSelector: ".nav-tabs a",

        //$fontIconInput: null,
        fontIconInputSelector: "#sysMenuFontIconInput",
        //$fontIconDisplayArea: null,
        fontIconDisplayAreaSelector: "#sysMenuFontIconDisplayArea",

        // $imageIconInput: null,
        imageIconInputSelector: "#sysMenuImageIconInput",
        // $imageIconChooseArea: null
        imageIconChooseAreaSelector: "#sysMenuImageIconChooseArea"

    };

    /**
     * 图标名称（缓存）
     * @type {Array}
     */
    SysMenuIcon.iconNameList = null;

    /**
     *
     * @param options
     * @constructor
     */
    function SysMenuIcon( options ) {
        this.opts = $.extend( true, {}, this.defaults, options);

        if ( $( this.opts.containerSelector ).data( namespace ) ) {
            console.info( "已经初始化过..." );
            return;
        }
        $( this.opts.containerSelector ).data( namespace, true );

        this._init();
    }

    SysMenuIcon.prototype._init = function () {
        this._render();
        this._bind();
    };

    SysMenuIcon.prototype._render = function () {
        var
            $container,
            opts = this.opts
        ;
        this.$container = $( opts.containerSelector );

        $container = this.$container;

        this.$menuIconInput = $container.find( opts.menuIconInputSelector );

        this.icon = this.$menuIconInput.val();

        this.$tab = $container.find( opts.tabSelector );

        this.$fontIconInput = $container.find( opts.fontIconInputSelector );
        this.$fontIconDisplayArea = $container.find( opts.fontIconDisplayAreaSelector );

        this.$imageIconInput = $container.find( opts.imageIconInputSelector );
        this.$imageIconChooseArea = $container.find( opts.imageIconChooseAreaSelector );

    };
    SysMenuIcon.prototype._bind = function () {
        var
            _this = this
        ;
        /**
         * 初始化 bootstrap-tab
         */
        this.$tab.tab();


        /**
         * font icon
         * 输入框的值一旦改变，则改变显示区域的图标，同时改变 <input name="icon"> 的值
         */
        this.$fontIconInput
            .off( "input." + namespace )
            .on( "input." + namespace, function () {
                var
                    value = this.value
                    ;
                if ( !value ) {
                    return;
                }
                if ( value.indexOf( "fa-" ) !== -1 ) {
                    _this.$fontIconDisplayArea.html( '<i class="' + value + '"></i>' );
                    _this.$menuIconInput.val( value );
                }

            } );

        /**
         * image icon
         * 页签显示（shown.bs.tab）后，进行初始化
         */
        this.$tab.eq( 1 ).on( "shown.bs.tab", function () {
            var
                $this = $( this ),
                status = $this.data( "status." + namespace )
            ;
            // 避免多次点击造成多次执行装载
            if ( status === "loading" ) {
                layer.msg( "正在载入图片，请稍等！" );
                return;
            }
            // 载入完毕
            else if ( status === "loaded" ) {
                return;
            }

            $this.data( "status." + namespace, "loading" );

            // 获取 图标名称，并渲染
            _this._getIconNameList( function ( iconNameList ) {
                var
                    html = "",
                    pathPrefix = PKUI.iconPath + "/",
                    icon = _this.icon
                ;

                $.each( iconNameList, function ( index, sysMenuIcon ) {
                    var iconName = sysMenuIcon[ "iconName" ],
                        isActive = ( icon === iconName ),
                        src = pathPrefix + iconName
                        ;
                    if ( isActive ) {
                        html += "<div class='item' data-icon-name='" + iconName + "'><img src='" + src + "' class='active'></div>";
                    } else {
                        html += "<div class='item' data-icon-name='" + iconName + "'><img src='" + src + "'></div>";
                    }
                } );

                _this.$imageIconChooseArea.html( html );

                // 如果input里有值，则让对应的图标高亮（active）
                if ( _this.$imageIconInput.text() ) {
                    _this.$imageIconChooseArea
                        .find( '[data-icon-name="' + _this.$imageIconInput.text() + '"]' ).addClass( "active" );
                }

                $this.data( "status." + namespace, "loaded" );
            } );

        } );

        /**
         * 点击 image icon 的图片，改变输入框的值
         */
        this.$imageIconChooseArea.on( "click." + namespace, ".item", function () {
            var
                $this = $( this ),
                iconName = $this.attr( "data-icon-name" )
            ;
            // active
            $this.addClass( "active" ).siblings().removeClass( "active" );
            // 改变显示的图片名称
            _this.$imageIconInput.text( iconName );
            // 改变输入域的值
            _this.$menuIconInput.val( iconName );
        } );

        /**
         * 根据 icon 的值，决定显示哪个 tab
         */
        this._showTab();
    };

    /**
     * 根据 icon 的值，决定显示哪个 tab
     */
    SysMenuIcon.prototype._showTab = function () {
        var
            icon = this.icon
        ;
        if ( !icon ) {

        }
        else if ( icon.indexOf( "fa-" ) !== -1 ) {
            this.$tab.eq( 0 ).tab( "show" );
            this.$fontIconInput.val( icon ).trigger( "input." + namespace );
        }
        else if ( icon.indexOf( ".png" ) !== -1 ) {
            this.$imageIconInput.text( this.icon );
            this.$tab.eq( 1 ).tab( "show" );
        }
    };

    /**
     * 获取图标名数组
     * @param callback {function}
     */
    SysMenuIcon.prototype._getIconNameList = function ( callback ) {
        var
            _this = this
        ;
        if ( typeof callback !== "function" ) {
            throw "需要传递一个回调函数作为参数。";
        }

        /* 1. 如果已被缓存，则直接使用缓存 */
        if ( SysMenuIcon.iconNameList ) {
            callback( SysMenuIcon.iconNameList );
            return;
        }

        /* 2. 如果没有缓存，则Ajax请求 */

        // 打开 loading
        this.$imageIconChooseArea.isLoading( { position: "insideButton" } );

        // ajax
        $.ajax( {
            url: "{% system.menu.edit.js.sysMenuIconsDataExt %}"
        } ).done( function ( gridResult ) {
            var
                sysMenuIconList
            ;
            if ( gridResult && ( gridResult.success || gridResult.totalRecords >= 0  ) ) {
                sysMenuIconList = gridResult.data;
                // 放入缓存
                if ( sysMenuIconList && $.isArray( sysMenuIconList ) && sysMenuIconList.length > 0 ) {
                    SysMenuIcon.iconNameList = sysMenuIconList;
                }
                // 执行回调
                callback( sysMenuIconList );
            }
            else {
                layer.alert( "【系统菜单模块】获取图标名称失败：服务器内部错误。", { icon: 2 } );
            }
        } ).fail( function () {
            // 提示网络错误
            layer.alert( '【系统菜单模块】获取图标名称失败：网络错误/登陆失效！', { icon: 0 } );
        } ).always( function () {
            // 关闭 loading
            _this.$imageIconChooseArea.isLoading( "hide" );
        } );
    };

    return SysMenuIcon;
} );