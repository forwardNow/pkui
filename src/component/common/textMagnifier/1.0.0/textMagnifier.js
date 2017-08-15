/**
 * @fileOverview  文本放大镜
 * @author 吴钦飞(wuqf@pkusoft.net)
 */
define( function( require ) {
    "use strict";
    var
        $ = require( "jquery" ),
        PKUI = window.PKUI,

        namespace = "pkui.textMagnifier"
    ;


    TextMagnifier.prototype.defaults = {
        // 显示的位置：top | bottom | left | right
        placement: "bottom",
        // 拆分规则
        splitType: [ 6, 8, 4 ],
        // 分隔符
        delimiter: " ",
        // 主题：waring | success | danger | info
        theme: "warning",
        // 模板
        template: "<div class='text-magnifier'></div>"
    };

    /**
     * 构造函数
     * @param opts {*?} 参数
     * @param target {HTMLElement | jQuery} 注册组件的目标元素
     * @constructor
     */
    function TextMagnifier( opts, target ) {
        this.opts = $.extend( true, {}, this.defaults, opts );
        this.$target = target.jquery ? target : $( target );
        this._init();
    }

    /**
     * 初始化方法
     * @private
     */
    TextMagnifier.prototype._init = function () {
        this._bind();
    };

    /**
     * 创建
     * @private
     */
    TextMagnifier.prototype._create = function () {
        this.$container = $( this.opts.template ).appendTo( $( "body" ) );
        this.$container.addClass( this.opts.theme );
    };

    /**
     * 注册事件
     * @private
     */
    TextMagnifier.prototype._bind = function () {
        var
            _this = this
        ;
        this.$target
            .off( "focusin." + namespace )
            .on( "focusin." + namespace, function () {
                _this._show();
            } );

        this.$target
            .off( "focusout." + namespace )
            .on( "focusout." + namespace, function () {
                _this._hide();
            } );

        this.$target
            .off( "keyup." + namespace )
            .on( "keyup." + namespace, function () {
                _this.$container.text( _this._fmtValue() );
            } );

    };

    /**
     * 显示
     * @private
     */
    TextMagnifier.prototype._show = function () {

        var
            docPos = this.$target.offset(),
            docTop = docPos.top,
            docLeft = docPos.left,
            targetHeight = this.$target.outerHeight(),
            top,
            left
        ;

        // 创建
        this._create();
        this.$container.show();

        switch ( this.opts.placement ) {
            case "top": {
                left = docLeft;
                top = docTop - targetHeight + 2;
                break;
            }
            case "bottom": {
                left = docLeft;
                top = docTop + targetHeight + 2;
                break;
            }
        }

        // 定位
        this.$container.css( {
            left: left,
            top: top
        } );

        this.$container.text( this._fmtValue() );
    };

    /**
     * 隐藏
     * @private
     */
    TextMagnifier.prototype._hide = function () {
        this.$container.remove();
    };

    /**
     * 格式化
     * @private
     * @return {string}
     */
    TextMagnifier.prototype._fmtValue = function () {
        var
            splitType = this.opts.splitType,
            originValue = this.$target.val(),
            count = 0,
            output = [],
            i, len, s
        ;
        if ( !originValue ) {
            return "";
        }
        for ( i = 0, len = splitType.length; i < len; i++ ) {
            s = originValue.substr( count, splitType[ i ] );
            if ( s.length > 0 ) {
                output.push( s );
            }
            count += splitType[ i ];
        }
        return output.join( this.opts.delimiter );
    };


    /**
     * 注册到 jQuery.fn
     * @param opts {*|String}
     * @returns {$}
     */
    $.fn.textMagnifier = function ( opts ) {

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
                $( this ).data( namespace, new TextMagnifier( opts, this ) );
                // FIX 标志已被初始化
                $( this ).attr( "isrendered", true );
            }
        } );

        return this;
    };

    PKUI.component.textMagnifier = $.fn.textMagnifier;

    return TextMagnifier;

} );