( function ( root, factory ) {
    "use strict";
    if ( typeof define === "function" && define.amd ) {
        // AMD
        define( [ "jquery" ], factory );
    } else if ( typeof module === "object" && module.exports ) {
        // CommonJS
        module.exports = factory( require( "jquery" ) );
    } else if ( typeof define === "function" && define.cmd ) {
        // CMD
        define( function ( require, exports, module ) {
            module.exports = factory( require( "jquery" ) );
        } );
    } else {
        // Browser globals (root is window)
        root.Drawer = factory( root.Drawer );
    }
}( this, function ( $ ) {
    "use strict";
    var
        Drawer = {}
        ;

    Drawer.namespace = "pkui.drawer";

    Drawer.defaults = {
        ajax: true,
        url: "",
        showOverlay: true,

        state: false,
        isCreated: false,

        // 指定当抽屉层打开时，指定那个会显示滚动条的祖先元素，让其 overflow="hidden"
        overflowHiddenWhenOpen: null,

        // 祖先元素
        parentContainerSelector: ".pkui-drawer-parent",
        // 初始化时，根据 parentContainerSelector 生成
        $parentContainer: null,
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
                $parentContainer,
                $drawer
                ;

            // 父容器
            $parentContainer = $this.closest( options.parentContainerSelector );
            options.$parentContainer = $parentContainer;

            if ( $parentContainer.css( "position" ) == "static" ) {
                $parentContainer.css( "position", "relative" );
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
                .addClass( Drawer.clazz.drawer ).appendTo( $parentContainer );

            options.$drawer = $drawer;

            // 抽屉层主体
            options.$drawerContent = $drawer.find( ".pkui-drawer-content" );

            // 抽屉层按钮
            options.$drawerButton = $drawer.find( ".pkui-drawer-button" );

            // 点击按钮，摧毁掉
            options.$drawerButton.on( "click." + Drawer.namespace, function () {
                Drawer.destroy.call( _this );
            } );

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
                options = $.extend( {}, Drawer.defaults, $this.data( PKUI.optionsMarkupProp ) );
                $this.data( Drawer.namespace, { options: options } );

                // toggle
                $this.on( "click." + Drawer.namespace, function () {
                    $this.drawer( "open" );
                } );
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
                .addClass( Drawer.clazz.open )
                .animate( { left: "2%" }, function() {
                    var openCallback = options.onOpen
                    ;
                    if ( window[ openCallback ] && typeof window[ openCallback ] === "function" ) {
                        window[ openCallback ].call( $this );
                    }
                    $this.trigger( "open." + Drawer.namespace );
                } );
            options.$parentContainer
                .addClass( Drawer.clazz.open );

            if ( options.overflowHiddenWhenOpen ) {
                options.$parentContainer.closest( options.overflowHiddenWhenOpen ).addClass( Drawer.clazz.open );
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
                options.$parentContainer
                    .removeClass( Drawer.clazz.open );

                if ( options.overflowHiddenWhenOpen ) {
                    options.$parentContainer.closest( options.overflowHiddenWhenOpen ).removeClass( Drawer.clazz.open );
                }

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
                options.$parentContainer
                    .removeClass( Drawer.clazz.open );

                if ( options.overflowHiddenWhenOpen ) {
                    options.$parentContainer.closest( options.overflowHiddenWhenOpen ).removeClass( Drawer.clazz.open );
                }
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
            options.$parentContainer.append( $overlay );
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
} ));