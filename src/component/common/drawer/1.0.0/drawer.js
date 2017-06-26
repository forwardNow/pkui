define( function( require ) {
    "use strict";
    var
        $ = require( "jquery" ),
        Template = require( "template" ),
        Drawer = {}
        ;

    require( "isLoading" );

    Drawer.namespace = "pkui.drawer";

    Drawer.defaults = {
        ajax: true,
        url: "",
        model: "",
        showOverlay: true,

        state: false,
        isCreated: false,

        // 放置抽屉层的 容器（查找规则：以body为上下文查找，如果有多个 则改为从当前节点往上找到最近的那个）
        container: ".drawer-container",
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

    Drawer.clazz = {
        drawer: "pkui-drawer",
        button: 'pkui-drawer-button',
        overlay: 'pkui-drawer-overlay',
        open: 'pkui-drawer-open'
    };

    $.extend( Drawer, {
        _create: function () {
            var
                _this = this,
                $this = $( this ),
                data = $this.data( Drawer.namespace ),
                options = data.options,
                $container,
                $drawer
                ;

            // 父容器
            $container = $( options.container );
            if ( $container.size() > 1 ) {
                $container = $this.closest( options.container );
            }
            options.$container = $container;

            if ( $container.css( "position" ) == "static" ) {
                $container.css( "position", "relative" );
            }

            // 遮罩层
            if ( options.showOverlay ) {
                Drawer.addOverlay.call( _this );
            }

            // 抽屉层
            $drawer = $( '<div class="pkui-drawer">'
                +           '<button href="#" class="pkui-drawer-button">&#215;</button>'
                +           '<div class="pkui-drawer-content"></div>'
                +        '</div>' )
                .addClass( Drawer.clazz.drawer ).appendTo( $container );

            options.$drawer = $drawer;

            // 抽屉层主体
            options.$drawerContent = $drawer.find( ".pkui-drawer-content" );

            // 抽屉层按钮
            options.$drawerButton = $drawer.find( ".pkui-drawer-button" );

            // 点击按钮，摧毁掉
            options.$drawerButton.on( "click." + Drawer.namespace, function () {
                Drawer.destroy.call( _this );
            } );

            if ( $container.scrollTop() > 0 ) {
                $drawer.css( {
                    "top": $container.scrollTop()
                } )
            }

            // 标志已经创建
            options.isCreated = true;
        },
        init: function () {
            return this.each( function () {
                var
                    $this = $( this ),
                    data = $this.data( Drawer.namespace ),
                    options
                    ;

                // 已经初始化则退出
                if ( data && $this.attr( "isrendered" )) {
                    return;
                }

                // 参数
                options = $.extend( {}, Drawer.defaults, $this.data( window.PKUI.componentOptionsHtmlAttr ) );
                $this.data( Drawer.namespace, { options: options } );

                // toggle
                $this.on( "click." + Drawer.namespace, function () {
                    $this.drawer( "open" );
                } );

                $this.attr( "isrendered", true );
            } );
        },
        getOptions: function() {
            var $this = this.jquery ? this : $( this );
            return $this.data( Drawer.namespace ).options;
        },
        open: function () {
            var
                $this = $( this ),
                options = Drawer.getOptions.call( this )
            ;

            if ( ! options.isCreated ) {
                Drawer._create.call( this );
            }

            options.$drawer
                // .addClass( Drawer.clazz.open )
                .animate( { left: "0" }, function() {
                    var openCallback = options.onOpen
                    ;
                    if ( window[ openCallback ] && typeof window[ openCallback ] === "function" ) {
                        window[ openCallback ].call( $this );
                    }
                    $this.trigger( "open." + Drawer.namespace );
                } );
            options.$container
                .addClass( Drawer.clazz.open );

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
                } ).fail( function( jqXHR, textStatus ) {
                    //options.$drawerContent.html( "/(ㄒoㄒ)/~~[ " + textStatus + " ]网络错误。" );
                    //console.info(  "/(ㄒoㄒ)/~~[ " + textStatus + " ]网络错误。" );
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
                } );

            }
        },
        hide: function () {
            var
                $this = $( this ),
                options = $this.data( Drawer.namespace ).options
                ;
            options.$drawer.animate( { left: "100%" }, function() {
                var hideCallback = options.onHide
                    ;
                options.$container
                    .removeClass( Drawer.clazz.open );

                // 隐藏遮罩层
                options.$overlay.hide();

                if ( window[ hideCallback ] && typeof window[ hideCallback ] === "function" ) {
                    window[ hideCallback ].call( $this );
                }
                $this.trigger( "hide." + Drawer.namespace );
            } );
        },
        destroy: function () {
            var
                $this = $( this ),
                options = $this.data( Drawer.namespace ).options
            ;
            options.$drawer.animate( { left: "100%" }, function() {
                var destroyCallback = options.onDestroy
                    ;
                options.$container
                    .removeClass( Drawer.clazz.open );

                // 销毁 drawer DOM
                options.$drawer.remove();
                // 销毁遮罩层
                options.$overlay.remove();
                // 更新标志
                options.isCreated = false;

                if ( window[ destroyCallback ] && typeof window[ destroyCallback ] === "function" ) {
                    window[ destroyCallback ].call( $this );
                }

            } );
        },
        addOverlay: function () {
            var
                $this = $( this ),
                $overlay = $( "<div>" ).addClass( Drawer.clazz.overlay ),
                options = $this.data( Drawer.namespace ).options
            ;
            options.$overlay = $overlay;
            options.$container.append( $overlay );
            return $this;
        }
    } );


    // 注册到jQuery
    $.fn.drawer = function ( method ) {
        if ( Drawer[ method ] ) {
            return Drawer[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
        } else if ( typeof method === 'object' || !method ) {
            return Drawer.init.apply( this, arguments );
        } else {
            $.error( 'Method ' + method + ' does not exist on [' + Drawer.namespace + "]" );
        }
    };

    // 注册到PKUI
    window.PKUI.component.drawer = $.fn.drawer;

    return {};


} );