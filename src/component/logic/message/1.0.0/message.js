/**
 * @fileOverview 我的消息
 *      1. 定位
 *      2. 点击非有效区域 则隐藏
 *      3. 可配置 tabs 的类别
 *      4. 可拖拽
 *
 * @author 吴钦飞（wuqf@pkusoft.net）
 */
define( function ( require ) {
    "use strict";
    var 
        $ = require( "jquery" ),
        ArtTemplate = require( "artTemplate" ),
        NAMESPACE = "pkui.message",
        // 记数
        count = 0
    ;

    /**
     * 默认参数
     */
    Message.prototype.defaults = {

        tabList: [
            { "text": "未读", "icon": "fa fa-envelope-o", "url": "__CTX__/common/getUnreadSysMessage?type=all"},
            { "text": "私信", "icon": "fa fa-commenting-o", "url": "__CTX__/common/getUnreadSysMessage?type=private"},
            { "text": "公告", "icon": "fa fa-file-text-o", "url": "__CTX__/common/getUnreadSysMessage?type=public"}
        ],

        // 视口，指定 popup 的容器。值类型：CSS选择器
        viewport: "body",

        // 弹出层出现的位置："auto" | "top" | "right" | "bottom" | "left"
        placement: "auto",

        // 面板标题
        panelTitle: "我的消息",

        // 面板头部
        hasPanelHeader: true,
        // 面板头部 - 关闭按钮
        hasCloseBtn: true,

        // 面板底部
        hasPanelFooter: true,
        // 面板底部 - 刷新按钮
        hasRefreshBtn: true,
        // 面板底部 - 更多按钮
        hasMoreBtn: true,

        // 弹出层模板
        popupTemplate:
            '<div class="pkui-message-popup">'
            +     '<div class="pkui-message-panel">'
            +         '{{if hasPanelHeader }}'
            +         '<div class="pkui-message-panel-header">'
            +             '{{if hasCloseBtn }}'
            +             '<button class="pkui-message-panel-header-closebtn">×</button>'
            +             '{{/if}}'
            +             '<span class="pkui-message-panel-header-title">{{panelTitle}}</span>'
            +         '</div>'
            +         '{{/if}}'
            +         '<div class="pkui-message-panel-body">'
            +             '<div class="pkui-message-menu">'
            +                 '<div class="pkui-message-menu-tabs">{{tabHtml}}</div>'
            +                 '<div class="pkui-message-menu-content">{{contentHtml}}</div>'
            +             '</div>'
            +         '</div>'
            +         '{{if hasPanelFooter }}'
            +         '<div class="pkui-message-panel-footer">'
            +             '{{if hasRefreshBtn}}'
            +             '<button type="button" class="pkui-message-refresh" title="刷新"><i class="fa fa-rotate-right"></i></button>'
            +             '{{/if}}'
            +             '{{if hasMoreBtn}}'
            +             '<a href="#" class="pkui-message-more" title="打开消息中心">更多 <i class="fa fa-angle-double-right"></i></a>'
            +             '{{/if}}'
            +         '</div>'
            +         '{{/if}}'
            +     '</div>'
            + '</div>'
        ,

        // tab模板
        /*
            tabList = [
                { "text": "未读", "icon": "fa fa-envelope-o",
                  "url": "__CTX__/common/getUnreadSysMessage?type=all"},
                { "text": "私信", "icon": "fa fa-commenting-o",
                  "url": "__CTX__/common/getUnreadSysMessage?type=private"},
                { "text": "公告", "icon": "fa fa-file-text-o",
                  "url": "__CTX__/common/getUnreadSysMessage?type=public"}
            ]
         */
        tabTemplate:
              '{{each tabs}}'
            +     '<div class="pkui-message-menu-tab">'
            +         '<a href="#" class="pkui-message-menu-tab-a" data-url="{{$value.url}}">'
            +             '<i class="{{$value.icon}}"></i> {{$value.text}}'
            +         '</a>'
            +     '</div>'
            + '{{/each}}'
        ,
        // 列表模板
        listTemplate:
              '{{each tabs}}'
            +     '<div class="pkui-message-menu-list" data-tabindex="{{$index}}"></div>'
            + '{{/each}}'
        ,
        // 条目模板
        itemTemplate:
              '{{each items}}'
            +     '<div class="pkui-message-menu-item">'
            +         '<span class="pkui-message-menu-item-icon"><i class="{{$value.icon}}"></i></span>'
            +         '<span class="pkui-message-menu-item-text">{{$value.msgTitle}}</span>'
            +         '<span class="pkui-message-menu-item-date">{{$value.sendTime | dateFormat : "YYYY年MM月DD日 HH时mm分ss秒"}}</span>'
            +     '</div>'
            + '{{/each}}'

    };

    /**
     * 构造器
     * @param target {HTMLElement}
     * @param options {{}?}
     * @constructor
     */
    function Message ( target, options ) {
        this.$target = $( target );
        this._init( options );
    }

    /**
     * 初始化方法
     * @param options {{}?}
     * @private
     */
    Message.prototype._init = function ( options ) {
        this.opts = $.extend( true, {}, this.defaults, options );
        this._render();
        this._bind();
    };

    /**
     * 赋值之类
     * @private
     */
    Message.prototype._render = function () {
        // 是否已经创建
        this._isCreated = false;

        // 是否已经显示
        this._isShown = false;

        // 弹出层
        this.$popup = null;

        // ID
        this._id = count++;

        // 视口/popup的容器
        this.$viewport = $( this.opts.viewport );

    };

    /**
     * 绑定事件处理程序
     * @private
     */
    Message.prototype._bind = function () {
        var
            _this = this
        ;
        // 单击目标元素后，显示
        _this.$target.on( "click." + NAMESPACE, function () {
            _this.show();
        } );

        // 点击非有效区域，则进行隐藏
        $( document ).on( "click." + NAMESPACE + "." + _this._id, function ( event ) {
            var
                target
            ;
            // 如果 已经隐藏 或 没有创建弹出层，则退出
            if ( _this._isShown || !_this.$popup  ) {
                return;
            }
            target = event.target;

            // 如果点击的是 $target，则退出
            if ( $.contains( _this.$target.get( 0 ), target ) ) {
                return;
            }

            // 如果点击的是 弹出层，则退出
            if ( $.contains( _this.$popup.get( 0 ), target ) ) {
                return;
            }

            _this.hide();
        } );
    };

    /**
     * 创建
     * @private
     */
    Message.prototype._create = function () {
        var
            tabHtml,
            listHtml,
            popup
        ;

        // tab
        tabHtml = this._createTab();

        // content - list
        listHtml = this._createList();

        // popup
        popup = this._createPopup( { tabHtml: tabHtml, listHtml: listHtml } );

        // 添加到文档
        this.$popup = $( popup ).appendTo( document.body );
    };

    /**
     * 根据模板，创建tab
     * @return {string} htmlString
     * @private
     */
    Message.prototype._createTab = function () {
        var
            opts = this.opts,
            tpl = opts.tabTemplate,
            tabs = opts.tabList
        ;
        return ArtTemplate.compile( tpl )( { tabs: tabs } );
    };

    /**
     * 根据模板，创建 content - list
     * @return {string} htmlString
     * @private
     */
    Message.prototype._createList = function () {
        var
            opts = this.opts,
            tpl = opts.listTemplate,
            tabs = opts.tabList
        ;
        return ArtTemplate.compile( tpl )( { tabs: tabs } );
    };

    /**
     * 根据模板，创建 popup
     * @param options {{}?}
     * @return {string} htmlString
     * @private
     */
    Message.prototype._createPopup = function ( options ) {
        var
            opts = this.opts,
            tpl = opts.popupTemplate,
            data = $.extend( true, {}, opts, options )
        ;
        return ArtTemplate.compile( tpl )( data );
    };


    /**
     * 显示
     */
    Message.prototype.show = function () {
        // 未创建，则创建
        if ( ! this._isCreated ) {
            this._create();
        }

        this.$popup.show();

        // 定位
        this.position();

        // 标志已经显示
        this._isShown = true;
    };

    /**
     * 隐藏
     */
    Message.prototype.hide = function () {

        // 隐藏弹出层
        this.$popup.hide();

        // 标志已经隐藏
        this._isShown = false;
    };

    /**
     * 销毁
     */
    Message.prototype.destroy = function () {

        // 注销事件处理函数
        this.$target.off( "click." + NAMESPACE );
        $( document ).off( "click." + NAMESPACE + "." + this._id );

        // 删除弹出层节点
        this.$popup.remove();
    };



    /**
     * 定位
     * @param placement {String?} 位置，"auto" | "top" | "right" | "bottom" | "left"
     */
    Message.prototype.position = function ( placement ) {
        var
            popupPos = this._getPosition(),
            actualWidth = this.$popup[0].offsetWidth,
            actualHeight = this.$popup[0].offsetHeight,
            viewportDimension,
            calculatedOffset
        ;

        placement = placement || this.opts.position || "auto";

        // 处理 "auto"
        if ( placement === "auto" ) {

            viewportDimension = this._getPosition( this.$viewport );

            placement = placement === 'bottom' && popupPos.bottom + actualHeight > viewportDimension.bottom ? 'top'    :
                        placement === 'top'    && popupPos.top    - actualHeight < viewportDimension.top    ? 'bottom' :
                        placement === 'right'  && popupPos.right  + actualWidth  > viewportDimension.width  ? 'left'   :
                        placement === 'left'   && popupPos.left   - actualWidth  < viewportDimension.left   ? 'right'  :
                        "bottom"
            ;
        }

        // 设置 popup 相对于 target 出现的位置
        this.$popup
            .removeClass( "bottom top right left" )
            .addClass( placement )
        ;

        // 计算位置
        calculatedOffset = this._getCalculatedOffset( placement, popupPos, actualWidth, actualHeight );

        // 移动
        this._applyPlacement( calculatedOffset );
    };

    /**
     * 计算 offset
     * @return {*}
     * @private
     */
    Message.prototype._getCalculatedOffset = function ( placement, pos, actualWidth, actualHeight ) {
        return placement === 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
               placement === 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
               placement === 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
            /* placement === 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

    };
    /**
     * 移动
     * @param offset
     * @param placement
     * @private
     */
    Message.prototype._applyPlacement = function ( offset ) {
        var
            $popup,
            marginTop,
            marginLeft
        ;
        $popup = this.$popup;

        // manually read margins because getBoundingClientRect includes difference
        marginTop = parseInt( $popup.css( 'margin-top' ), 10 );
        marginLeft = parseInt( $popup.css( 'margin-left' ), 10 );

        // we must check for NaN for ie 8/9
        if ( isNaN( marginTop ) ) {
            marginTop = 0;
        }
        if ( isNaN( marginLeft ) ) {
            marginLeft = 0;
        }

        offset.top  += marginTop;
        offset.left += marginLeft;

        // $.fn.offset doesn't round pixel values
        // so we use setOffset directly with our own function B-0
        $.offset.setOffset( $popup[ 0 ], $.extend( {
            using: function ( props ) {
                $popup.css( {
                    top: Math.round( props.top ),
                    left: Math.round( props.left )
                } )
            }
        }, offset ), 0 );

        $popup.addClass('in');

        $popup.offset( offset );
    };

    /**
     * 获取位置信息
     * @param $element {jQuery?}
     * @private
     */
    Message.prototype._getPosition = function ( $element ) {
        var
            element,
            isBody,
            elementRectangle,
            elementOffset,
            scroll,
            outerDimension
        ;
        $element = $element || this.$popup;

        element = $element[ 0 ];
        isBody = ( element.tagName === 'BODY' );

        elementRectangle = element.getBoundingClientRect();
        if ( elementRectangle.width == null ) {
            // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
            elementRectangle = $.extend( {}, elementRectangle, {
                width: elementRectangle.right - elementRectangle.left,
                height: elementRectangle.bottom - elementRectangle.top
            } );
        }
        elementOffset = isBody ? { top: 0, left: 0 } : $element.offset();
        scroll = {
            scroll: isBody ?
                document.documentElement.scrollTop || document.body.scrollTop :
                $element.scrollTop()
        };
        outerDimension = isBody ?
            { width: $( window ).width(), height: $( window ).height() } :
            null
        ;

        return $.extend( {}, elementRectangle, scroll, outerDimension, elementOffset );
    };

    $.fn.Message = function ( options ) {
        var
            _this = this,
            args = arguments
        ;


        _this.each( function () {
            var instance = $( this ).data( NAMESPACE );

            // 已经初始化
            if ( instance ) {
                // 如果是方法名字符串
                if ( typeof options === "string" ) {
                    // 如果是私有方法，则返回
                    if ( options.charAt( 0 ) === '_' ) {
                        return;
                    }
                    instance[ options ].apply( instance, [].slice.call( args, 1 ) );
                }
                // 如果是参数对象，则 reset
                else if ( options ) {
                    //instance._reset( true );
                    //instance._init( this, options );
                }
            }
            // 初始化
            else {
                // FIX 标志已被初始化
                $( this ).attr( "isrendered", true );

                $( this ).data( NAMESPACE, new Message( this, options ) );
            }
        } );

        return this;
    };

    window.PKUI.component[ "message" ] = $.fn.Message;
    
} );