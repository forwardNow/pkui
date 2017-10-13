define( function( require ) {
    "use strict";
    var
        $ = require( "jquery" ),
        Template = require( "template" ),
        namespace = "pkui.drawer",
        Drawer = {}
        ;

    require( "isLoading" );

    // 针对没有宿主元素的drawer，缓存其 options
    Drawer.optionsCache = {
        count: 0
    };

    Drawer.defaults = {
        ajax: true,
        url: "",
        model: "",
        showOverlay: true,

        state: false,
        isCreated: false,

        // 放置抽屉层的 容器。值：如果不是jQuery对象 而是CSS选择器，则从目标节点开始查找最近的祖先元素
        container: ".drawer-container",
        // 参考点。如果 container 指定的选择器不唯一时使用。
        referenceElementSelector: null,

        // 初始化时，根据 container 生成
        $container: null,
        // 抽屉层，
        $drawer: null,
        // 抽屉层主体
        $drawerContent: null,
        // 抽屉层按钮
        $drawerButton: null,
        // 遮罩层
        $overlay: null,

        onOpen: null,
        onHide: null,
        onDestroy: null,
        onLoad: null
    };

    /**
     * 使用到的CSS类
     * @private
     */
    Drawer._class = {
        drawer: "pkui-drawer",
        button: 'pkui-drawer-button',
        overlay: 'pkui-drawer-overlay',
        open: 'pkui-drawer-open'
    };

    /**
     * 初始化
     * @return {jQuery}
     * @private
     */
    Drawer._init = function () {
        return this.each( function () {
            var
                $this = $( this ),
                data = $this.data( namespace ),
                options
                ;

            // 已经初始化则退出
            if ( data && $this.attr( "isrendered" )) {
                return;
            }

            // 参数
            options = $.extend( true, {}, Drawer.defaults, $this.data( window.PKUI.componentOptionsHtmlAttr ) );
            $this.data( namespace, { options: options } );

            // toggle
            $this.on( "click." + namespace, function () {
                $this.drawer( "open" );
            } );

            $this.attr( "isrendered", true );
        } );
    };

    /** 创建弹出层
     * @param optionsIndex {(int|string)?}
     * @private
     */
    Drawer._create = function ( optionsIndex ) {
        var
            _this = this,
            $this = $( this ),
            options = Drawer.getOptions.call( this, optionsIndex ),
            $container,
            $drawer
        ;

        // 父容器，可以为 jQuery对象，也可以为CSS选择器
        $container = options.container.jquery ? options.container : $( options.container );

        // 如果父容器有多个
        if ( $container.size() > 1 ) {
            // 如果指定的选择器
            if ( typeof options.container === "string" ) {
                // 如果指定了参考点
                if ( options.referenceElementSelector ) {
                    $container = $( options.referenceElementSelector ).closest( options.container );
                }
                // 如果没指定了参考点，则使用target
                else if ( ! this.hasOwnProperty( "PKUI" ) ) {
                    $container = $this.closest( options.container );
                }
            }
            else {
                throw "【drawer】container 不唯一！";
            }
        }
        options.$container = $container;

        if ( $container.css( "position" ) === "static" ) {
            $container.css( "position", "relative" );
        }

        // 遮罩层
        if ( options.showOverlay ) {
            Drawer._addOverlay.call( _this, options );
        }

        // 抽屉层
        $drawer = $( '<div class="pkui-drawer">'
            +           '<button href="#" class="pkui-drawer-button">&#215;</button>'
            +           '<div class="pkui-drawer-content"></div>'
            +        '</div>' )
            .addClass( Drawer._class.drawer ).appendTo( $container );

        options.$drawer = $drawer;

        // 抽屉层主体
        options.$drawerContent = $drawer.find( ".pkui-drawer-content" );

        // 抽屉层按钮
        options.$drawerButton = $drawer.find( ".pkui-drawer-button" );

        // 点击按钮，摧毁掉
        options.$drawerButton.on( "click." + namespace, function () {
            Drawer.destroy.call( _this, optionsIndex );
        } );

        if ( $container.scrollTop() > 0 ) {
            $drawer.css( {
                "top": $container.scrollTop()
            } )
        }

        // 标志已经创建
        options.isCreated = true;
    };
    /**
     * 获取参数
     * @param optionsIndex {(int|string)?}
     */
    Drawer.getOptions = function( optionsIndex ) {
        var
            optionsCache = Drawer.optionsCache
        ;
        if ( optionsCache.hasOwnProperty( optionsIndex ) ) {
            return optionsCache[ optionsIndex ];
        }
        return ( this.jquery ? this : $( this ) ).data( namespace ).options;
    };
    /**
     * 打开一个抽屉
     * @param options {{}?} 如果传入参数了，则将其缓存，以供其他需要参数的方法使用
     * @return {int|undefined} optionsCache 的key值
     */
    Drawer.open = function ( options ) {
        var
            $this = $( this ),
            speed = 400,
            optionsIndex,
            optionsCache
        ;

        // 如果传入参数了，则将其缓存，以供其他需要参数的方法使用
        if ( options ) {
            optionsCache = Drawer.optionsCache;
            optionsIndex = optionsCache.count;
            optionsCache.count++;
            optionsCache[ optionsIndex ] = $.extend( true, {}, Drawer.defaults, options );
        }

        options = Drawer.getOptions.call( this, optionsIndex );


        if ( ! options.isCreated ) {
            Drawer._create.call( this, optionsIndex );
        }
        if ( window.PKUI.isIE8 ) {
            speed = 0;
        }
        options.$drawer
            // .addClass( Drawer._class.open )
            .animate( { left: "0" }, speed, function() {
                var openCallback = options.onOpen
                ;
                if ( window[ openCallback ] && typeof window[ openCallback ] === "function" ) {
                    window[ openCallback ].call( $this );
                }

                loadContent();

                $this.trigger( "open." + namespace );
            } );
        options.$container
            .addClass( Drawer._class.open );


        function loadContent () {

            // 开启 loading
            options.$drawer.isLoading();

            // 后端mvc
            if ( options.ajax && options.url && ! options.model ) {
                $.ajax( {
                    url: options.url,
                    type: "GET",
                    cache: false,
                    dataType: "text"
                } ).done( function( responseData ) {
                    options.$drawerContent.html( responseData );
                } ).fail( function() {
                    window.PKUI.console.error( "[drawer]网络错误/登陆失效。", true )
                } ).always( function() {
                    options.$drawer.isLoading( "hide" );
                } );

            }
            // 前端mvc
            else if ( options.url && options.model ) {
                // 如果 options.model 是 序列化的json对象
                try {
                    options.model = $.parseJSON( options.model );
                } catch ( e ) {
                    window.PKUI.console.info( "model 不是序列化对象" )
                }

                Template.getModelAndView( options.url, options.model, function ( htmlString ) {
                    // 关闭 loading
                    options.$drawer.isLoading( "hide" );

                    options.$drawerContent.html( htmlString );
                }, { escape: false } );

            }
        }

        return optionsIndex;

    };

    /**
     *
     * @param optionsIndex
     */
    Drawer.hide = function ( optionsIndex ) {
        var
            $this = $( this ),
            options = Drawer.getOptions.call( this, optionsIndex )
        ;

        options.$drawer.animate( { left: "100%" }, function() {
            var hideCallback = options.onHide
                ;
            options.$container
                .removeClass( Drawer._class.open );

            // 隐藏遮罩层
            options.$overlay.hide();

            if ( window[ hideCallback ] && typeof window[ hideCallback ] === "function" ) {
                window[ hideCallback ].call( $this );
            }
            $this.trigger( "hide." + namespace );
        } );
    };
    /**
     * 销毁
     * @param optionsIndex
     */
    Drawer.destroy = function ( optionsIndex ) {
        var
            $this = $( this ),
            options = Drawer.getOptions.call( this, optionsIndex )
        ;
        options.$drawer.animate( { left: "100%" }, function() {
            var destroyCallback = options.onDestroy
                ;
            options.$container
                .removeClass( Drawer._class.open );

            // 销毁 drawer DOM
            options.$drawer.remove();
            // 销毁遮罩层
            options.$overlay.remove();
            // 更新标志
            options.isCreated = false;

            // 删除缓存
            if ( Drawer.optionsCache.hasOwnProperty( optionsIndex ) ) {
                delete Drawer.optionsCache[ optionsIndex ];
            }

            if ( window[ destroyCallback ] && typeof window[ destroyCallback ] === "function" ) {
                window[ destroyCallback ].call( $this );
            }

        } );

    };

    Drawer._addOverlay = function ( options ) {
        var
            $overlay = $( "<div>" ).addClass( Drawer._class.overlay )
        ;
        options.$overlay = $overlay;
        options.$container.append( $overlay );
    };

    // 注册到jQuery
    $.fn.drawer = function ( method ) {
        if ( Drawer[ method ] ) {
            return Drawer[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
        } else if ( typeof method === 'object' || !method ) {
            return Drawer._init.apply( this, arguments );
        } else {
            console.error( 'Method ' + method + ' does not exist on [' + namespace + "]" );
        }
    };

    // 注册到PKUI
    window.PKUI.component.drawer = $.fn.drawer;

    return {};


} );