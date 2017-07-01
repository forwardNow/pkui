/**
 * 此组件用于往指定节点载入内容，类似于 $jquery.html( 内容 )。
 * 内容的获取通过“指定的模块”获取，“指定的模块”必须提供 getHtml() 接口
 */
define( function( require ) {
    "use strict";
    var
        $ = require( "jquery" ),
        PKUI = window.PKUI,

        namespace = "pkui.loadContent"
        ;


    LoadContent.prototype.defaults = {
        // 内容载入的位置（ 指定元素的CSS选择器，缺省或"default"为当前元素 ）
        targetSelector: "default",
        // 生成内容的模块ID
        loadContentFromWhichModuleId: null
    };

    /**
     * 构造函数
     * @param opts {*?} 参数
     * @param target {HTMLElement?} 注册组件的目标元素
     * @constructor
     */
    function LoadContent( opts, target ) {
        this.opts = $.extend( true, {}, this.defaults, opts );
        this.$target = target;
        this._init();
    }

    /**
     * 初始化方法
     * @private
     */
    LoadContent.prototype._init = function () {
        this._render();
        this.loadContent();
    };
    /**
     * 初始化一些元素变量
     * @private
     */
    LoadContent.prototype._render = function () {
        var
            target = this.$target,
            targetSelector = this.opts.targetSelector
        ;
        // 在自身装填内容
        if ( targetSelector === "default" ) {
            this.$target = target.jquery ? target : $( target );
        } else {
            this.$target = $( targetSelector );
        }

        if ( this.$target.jquery && this.$target.size() === 0 ) {
            $.error( "[loadContent] targetSelector参数 指定的选择器不正确。" );
        }
    };

    LoadContent.prototype.loadContent = function () {
        var
            _this = this
        ;
        // 开启 loading
        _this.$target.isLoading();

        // 载入模块
        seajs.use( this.opts.loadContentFromWhichModuleId, function ( mod ) {
            if ( mod.hasOwnProperty( "getHtml" ) && typeof mod.getHtml === "function" ) {

                mod.getHtml( function ( html ) {

                    // 关闭 loading
                    _this.$target.isLoading( "hide" );

                    _this.$target.html( html );

                } );
            } else {
                $.error( "[loadContent] loadContentFromWhichModuleId参数 指定的模块必须通过 getHtml() 方法。" );
            }
        } );
    };

    /**
     * 注册到 jQuery.fn
     * @param opts {*|String}
     * @returns {$}
     */
    $.fn.loadContent = function ( opts ) {

        this.each( function () {
            var instance = $( this ).data( namespace );

            // 已经初始化
            if ( instance ) {
                // 如果是参数字符串
                if ( typeof opts === "string" ) {
                    // 如果是私有方法，则返回
                    if ( opts.charAt( 0 ) === '_' ) {
                        return;
                    }
                    instance[ opts ].apply( instance, [].slice.call( args, 1 ) );
                }
                // 如果是参数对象，则 reset
                else if ( opts ) {
                    //instance._reset( true );
                    //instance._init( this, options );
                }
            }
            // 初始化
            else {
                $( this ).data( namespace, new LoadContent( opts, this ) );
                // FIX 标志已被初始化
                $( this ).attr( "isrendered", true );
            }
        } );

        return this;
    };

    PKUI.component.loadContent = $.fn.loadContent;

    return LoadContent;
} );