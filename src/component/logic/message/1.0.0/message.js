/**
 * @fileOverview 我的消息
 *      1. 定位
 *      2. 点击非有效区域 则隐藏
 *      3. 可配置 tabs 的类别
 *     *4. 可拖拽
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

        // 请求URL，判断是否有消息，用于在目标元素上添加“有消息”的标志。可不指定。
        // 服务端返回值：JsonResult
        hasSysMessageURL: "",

        /*
         消息类别
            isMarkedMsg：是否为已读消息。该类别的消息是否都是“已读”状态
            text：页签的名称
            icon：页签的图标CSS类，使用fontawesome
            url：请求一页消息，服务器返回值 GridResult
         [
            { "isMarkedMsg": false, "text": "未读", "icon": "fa fa-envelope-o", "url": "__CTX__/common/getUnreadSysMessage?type=all"},
            { "isMarkedMsg": false, "text": "私信", "icon": "fa fa-commenting-o", "url": "__CTX__/common/getUnreadSysMessage?type=private"},
            { "isMarkedMsg": false, "text": "公告", "icon": "fa fa-file-text-o", "url": "__CTX__/common/getUnreadSysMessage?type=public"}
         ]
         */
        tabList: null,

        // 请求URL，将指定的消息标志为已被阅读
        // 请求参数名称：msgId
        // 服务端返回值：JsonResult
        sysMessageMarkCheckedURL: "",

        // 视口，指定 popup 的容器。值类型：CSS选择器
        viewport: "body",

        // 弹出层出现的位置："auto" | "top" | "right" | "bottom" | "left"
        placement: "auto",

        // 面板标题
        panelTitle: "我的消息",

        // 面板底部 - “更多” ： app参数：以app的方式打开，指定menuId和打开模式mode。
        moreAppOptions: null,
        // 面板底部 - “更多” ： onclick：指定click事件处理函数 的名称。
        moreClickHandler: "",

        // 面板头部
        hasPanelHeader: true,
        // 面板头部 - 关闭按钮
        hasCloseBtn: true,

        // 面板底部
        hasPanelFooter: true,
        // 面板底部 - 刷新按钮
        hasRefreshBtn: true,
        // 面板底部 - 加载信息反馈
        hasLoadInfo: true,
        // 面板底部 - 更多按钮
        hasMoreBtn: true,

        // 在目标元素上 标志 “有消息”
        hasMessageTemplate: "<div class=\"pkui-message-count\"></div>",

        // 弹出层模板
        popupTemplate:
            '<div class="pkui-message-popup">'
            +     '<div class="pkui-message-panel">'
            +     '<div class="pkui-message-panel-arrow"></div>'
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

            +             '{{if hasLoadInfo}}'
            +             '<span class="pkui-message-loadInfo">'
            +                   '<span class="pkui-message-loadInfo-text"></span>'
            +                   '<a href="javascript:void(0);" class="pkui-message-loadInfo-history">历史 <i class="fa fa-caret-down"></i>'
            +                       '<div class="pkui-message-history-list">'
            //+                           '<div class="pkui-message-history-item"><span class="time">16时36分30秒</span> <span class="pkui-message-loadInfo-text info"><i class="fa fa-info-circle"></i> [公告]加载完毕。</span></div>'
            +                       '</div>'
            +                   '</a>'
            +             '</span>'
            +             '{{/if}}'

            +             '{{if hasMoreBtn}}'
            +             '<a href="#" '
            +             '    {{if moreAppOptions}}'
            +             '    data-pkui-app="true"'
            +             '    data-pkui-app-options=\'{{moreAppOptions}}\''
            +             '    {{/if}}'
            +             '    onclick="{{moreClickHandler}}" '
            +             '    class="pkui-message-more" title="打开消息中心">更多 <i class="fa fa-angle-double-right"></i></a>'
            +             '{{/if}}'

            +             '{{if hasRefreshBtn}}'
            +             '<a href="javascript:void(0);" class="pkui-message-refresh"><i class="fa fa-rotate-right"></i> 刷新</a>'
            +             '{{/if}}'

            +         '</div>'
            +         '{{/if}}'
            +     '</div>'
            + '</div>'
        ,

        // tab模板
        /*
            tabList = [
                { "text": "未读", "icon": "fa fa-envelope-o", "url": "__CTX__/common/getUnreadSysMessage?type=all"},
                { "text": "私信", "icon": "fa fa-commenting-o", "url": "__CTX__/common/getUnreadSysMessage?type=private"},
                { "text": "公告", "icon": "fa fa-file-text-o", "url": "__CTX__/common/getUnreadSysMessage?type=public"}
            ]
         */
        tabsTemplate:
              '{{each tabs}}'
            +     '<div class="pkui-message-menu-tab">'
            +         '<a href="#" class="pkui-message-menu-tab-a" data-url="{{$value.url}}" data-icon="{{$value.icon}}" data-is-marked-msg="{{$value.isMarkedMsg && 1}}">'
            +             '<i class="{{$value.icon}}"></i> {{$value.text}}'
            +         '</a>'
            +     '</div>'
            + '{{/each}}'
        ,
        // 列表模板
        messageListsTemplate:
              '{{each tabs}}'
            +     '<div class="pkui-message-menu-list" data-tabindex="{{$index}}" data-tabtext="{{$value.text}}"></div>'
            + '{{/each}}'
        ,
        // 条目模板
        messageItemsTemplate:
              '{{each items}}'
            +     '<div class="pkui-message-menu-item {{isMarkedMsg||marked}}" data-msg-id="{{$value.msgId}}">'
            +         '<span class="pkui-message-menu-item-icon"><i class="pkui-message-icon-origin {{$value.icon||icon}}"></i><i class="pkui-message-icon-marked fa fa-check-square-o"></i></span>'
            +         '<span class="pkui-message-menu-item-title">{{$value.msgTitle}}</span>'
            +         '<div class="pkui-message-menu-item-content">{{$value.msgContent}}</div>'
            +         '<span class="pkui-message-menu-item-date">{{$value.sendTime | dateFormat : "YYYY年MM月DD日 HH时mm分ss秒"}}</span>'
            +         '<a href="javascript:void(0);" class="pkui-message-menu-item-view"><i class="pkui-message-icon-open fa fa-eye"></i><i class="pkui-message-icon-close fa fa-eye-slash"></i></a>'
            +     '</div>'
            + '{{/each}}',
        historyItemTemplate:
                '<div class="pkui-message-history-item">'
            +       '<span class="time">{{time | dateFormat : "HH:mm:ss"}}</span> {{html}}</span>'
            +   '</div>'
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
        this._hasMessage();
        this._render();
        this._bind();
    };

    /**
     * 发送请求，如果“有消息”则添加标志
     * @private
     */
    Message.prototype._hasMessage = function () {
        var
            _this = this,
            opts = _this.opts,
            url = opts.hasSysMessageURL,
            html = opts.hasMessageTemplate
        ;
        if ( ! url ) {
            console.warn( "【message】未指定[hasSysMessageURL]，无法判断是否有消息。" );
            return;
        }
        $.ajax( {
            url: url
        } ).done( function ( jsonResult ) {
            if ( jsonResult && jsonResult.success ) {
                _this.$target.append( html );
            }
        } );
    };

    /**
     * 赋值之类
     * @private
     */
    Message.prototype._render = function () {

        this.$target.addClass( "pkui-message" );

        // 是否已经创建
        this._isCreated = false;

        // 是否已经显示
        this._isShown = false;

        // 弹出层
        this.$popup = null;

        // ID
        this._id = count++;

        // 日志记录
        this._logList = [];

        // 视口/popup的容器
        this.$viewport = $( this.opts.viewport );

        // render
        this.historyItemRender = ArtTemplate.compile( this.opts.historyItemTemplate, { escape: false } );

    };

    /**
     * 绑定事件处理程序，创建之前的事件绑定
     * @private
     */
    Message.prototype._bind = function () {
        var
            _this = this,
            $document = $( document ),
            namespace = NAMESPACE + "." + _this._id
        ;
        // 单击目标元素后，显示
        _this.$target.on( "click." + NAMESPACE, function () {
            _this.show();
        } );

        // 点击非有效区域，则进行隐藏
        $document.on( "click." + namespace, function ( event ) {
            var
                target
            ;
            // 如果 已经隐藏 或 没有创建弹出层，则退出
            if ( !_this._isShown || !_this.$popup  ) {
                return;
            }
            target = event.target;

            // 如果点击的是 $target，则退出
            if ( _this.$target.get( 0 ) === target || $.contains( _this.$target.get( 0 ), target ) ) {
                return;
            }

            // 如果点击的是 弹出层，则退出
            if ( _this.$popup.get( 0 ) === target || $.contains( _this.$popup.get( 0 ), target ) ) {
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
            contentHtml,
            popup
        ;

        // tab
        tabHtml = this._createTab();

        // content - list
        contentHtml = this._createList();

        // popup
        popup = this._createPopup( { tabHtml: tabHtml, contentHtml: contentHtml } );

        // 添加到文档
        this.$popup = $( popup ).appendTo( document.body );

        // 注册事件处理函数
        this._bindEventAfterCreate();

        // 标志已被创建
        this._isCreated = true;

        /* 创建之后 */

        // 加载信息
        this.$loadInfoText = this.$popup.find( ".pkui-message-loadInfo-text" );
        // 历史
        this.$loadInfoHistoryList = this.$popup.find( ".pkui-message-history-list" );

        /**
         * @event created
         */
        this.$popup.trigger( "created." + NAMESPACE );

    };

    /**
     * 事件绑定
     * @private
     */
    Message.prototype._bindEventAfterCreate = function () {
        var
            _this = this
        ;
        // 标题 - 关闭按钮
        this.$popup.on( "click." + NAMESPACE, ".pkui-message-panel-header-closebtn", function () {
            _this.hide();
        } );
        // 内容 - tab切换
        this.$popup.on( "click." + NAMESPACE, ".pkui-message-menu-tab-a", function ( event ) {
            var
                $this = $( this ),
                tabIndex = $this.parent().index(),
                $tab = _this.$popup.find( ".pkui-message-menu-tab-a" ),
                $list = _this.$popup.find( ".pkui-message-menu-list" )

            ;

            event.preventDefault();

            // tab
            $tab.removeClass( "selected" );
            $this.addClass( "selected" );

            // content
            $list.hide();
            $list.eq( tabIndex ).show();

            // 载入数据
            if ( ! $this.is( ".loaded" ) ) {
                _this.loadData( tabIndex );
            }
        } );

        // 创建完毕后，让第一个页签加载
        this.$popup.on( "created." + NAMESPACE, function () {
            _this.$popup.find( ".pkui-message-menu-tab-a" ).eq( 0 ).trigger( "click" );
        } );

        // 点击刷新
        this.$popup.on( "click." + NAMESPACE, ".pkui-message-refresh", function () {
            var
                $tab = _this.$popup.find( ".pkui-message-menu-tab-a" )
            ;
            // 日志
            _this._log( "刷新", "refresh" );
            // 删除已加载的标志
            $tab.removeClass( "loaded" );
            // 让选中的页签加载内容
            $tab.filter( ".selected" ).trigger( "click" );
        } );

        // 点击阅读
        this.$popup.on( "click." + NAMESPACE, ".pkui-message-menu-item-view", function () {
            var
                $this = $( this ),
                $item = $this.parent( ".pkui-message-menu-item" ),
                itemIndex,
                tabText,
                $content = $item.children( ".pkui-message-menu-item-content" ),
                url = _this.opts.sysMessageMarkCheckedURL,
                msgId = $item.data( "msgId" )
            ;

            // 已经展开，要关闭
            if ( $this.is( ".opened" ) ) {
                $this.removeClass( "opened" );
                $content.slideUp();
                return;
            }
            // 已经关闭，要展开
            $this.addClass( "opened" );
            $content.slideDown();

            // 如果是已读状态，则返回
            if ( $item.is( ".marked" ) ) {
                return;
            }

            // 如果是未读状态，则将其标记为已读

            // loading
            $item.addClass( "marking" );
            itemIndex = $item.index() + 1;
            tabText = $this.closest( ".pkui-message-menu-list" ).data( "tabtext" );
            _this._log( "[" + tabText + "-消息#" + itemIndex + "]正在标记", "loading" );

            $.ajax( {
                url: url,
                data: {
                    msgId: msgId
                }
            } ).done( function ( jsonResult ) {
                if ( jsonResult && jsonResult.success ) {
                    markSuccess();
                } else {
                    markFail();
                }

            } ).fail( function () {
                markFail();
            } );

            function markSuccess() {
                $item.removeClass( "marking" );
                $item.addClass( "marked" );
                _this._log( "[" + tabText + "-消息#" + itemIndex + "]标记成功", "success" );
            }
            function markFail() {
                $item.removeClass( "marking" );
                _this._log( "[" + tabText + "-消息#" + itemIndex + "]标记失败", "error" );
            }
        } );
    };

    /**
     * 解除事件绑定
     * @private
     */
    Message.prototype._unbindEvent = function () {
        // 解除：单击目标元素后，显示
        this.$target.off( "click." + NAMESPACE );
        // 解除：点击非有效区域，则进行隐藏
        $( document ).off( "click." + NAMESPACE + "." + this._id );
        // 解除：标题 - 关闭按钮
        // 解除：内容 - tab切换
        // 解除：底部 - “更多”
        this.$popup.off( "click." + NAMESPACE );
    };

    /**
     * 载入指定 tabIndex 的数据
     * @param tabIndex {Number}
     * @param successCallback {Function?}
     * @param failCallback {Function?}
     */
    Message.prototype.loadData = function ( tabIndex, successCallback, failCallback ) {
        var
            _this = this,
            $tab = _this.$popup.find( ".pkui-message-menu-tab-a" ).eq( tabIndex ),
            $list = _this.$popup.find( ".pkui-message-menu-list" ).eq( tabIndex ),
            url = $tab.data( "url" ),
            icon = $tab.data( "icon" ),
            isMarkedMsg = !!$tab.data( "isMarkedMsg" ),
            text = $.trim( $tab.text() )
        ;
        successCallback = successCallback || function () {
            _this._log( "[" + text + "]加载成功", "success" );
        };
        failCallback = failCallback || function () {
            _this._log( "[" + text + "]加载失败", "error" );
        };

        if ( $tab.is( ".loading" ) ) {
            return;
        }

        // 开启 loading
        $tab.removeClass( "loaded" ).addClass( "loading" );
        $list.isLoading();
        _this._log( "[" + text + "]正在加载", "loading" );

        // 请求
        $.ajax( {
            url: url
        } ).done( function ( gridResult ) {
            if ( gridResult.success ) {
                fillList( gridResult.data );
                $.isFunction( successCallback ) && successCallback();
            } else {
                $.isFunction( failCallback ) && failCallback();
            }
        } ).fail( function () {
            $.isFunction( failCallback ) && failCallback();
        } ).always( function () {
            // 关闭 loading
            $tab.removeClass( "loading" ).addClass( "loaded" );
            $list.isLoading( "hide" );
        } );

        // 填充数据
        function fillList( list ) {
            var
                itemsHtml,
                tpl
            ;
            if ( ! list || list.length === 0 ) {
                itemsHtml = _this.opts.noResults || "没有数据";
            } else {
                tpl = _this.opts.messageItemsTemplate;
                itemsHtml = ArtTemplate.compile( tpl, { escape: false } )( { items: list, icon: icon, isMarkedMsg: isMarkedMsg } );
            }
            $list.html( itemsHtml );
        }
    };

    /**
     * 在底部显示加载反馈
     * @param text
     * @param type {String?} 类别
     * @private
     */
    Message.prototype._log = function ( text, type ) {
        var
            $loadInfoText = this.$loadInfoText,
            html,
            logItemData
        ;
        type = type || "info";

        $loadInfoText.attr( "class", "pkui-message-loadInfo-text" ).addClass( type );

        if ( type === "info" ) {
            html = '<i class=\"fa fa-info-circle\"></i> ' + text;
        } else if ( type === "loading" ) {
            html = '<i class=\"fa fa-spinner\"></i> ' + text;
        } else if ( type === "warning" ) {
            html = '<i class=\"fa fa-exclamation-triangle\"></i> ' + text;
        } else if ( type === "success" ) {
            html = '<i class=\"fa fa-check-circle\"></i> ' + text;
        } else if ( type === "error" ) {
            html = '<i class=\"fa fa-times-circle\"></i> ' + text;
        } else if ( type === "refresh" ) {
            html = '<i class=\"fa fa-rotate-right\"></i> ' + text;
        }

        $loadInfoText.get( 0 ).innerHTML = html;

        logItemData = {
            time: new Date().getTime(),
            html: $loadInfoText.prop( "outerHTML" )
        };

        // 记录
        this._logList.push( logItemData );

        // 添加到历史
        this.$loadInfoHistoryList.prepend( this.historyItemRender( logItemData ) );
    };

    /**
     * 根据模板，创建tab
     * @return {string} htmlString
     * @private
     */
    Message.prototype._createTab = function () {
        var
            opts = this.opts,
            tpl = opts.tabsTemplate,
            tabs = opts.tabList
        ;
        return ArtTemplate.compile( tpl, { escape: false } )( { tabs: tabs } );
    };

    /**
     * 根据模板，创建 content - list
     * @return {string} htmlString
     * @private
     */
    Message.prototype._createList = function () {
        var
            opts = this.opts,
            tpl = opts.messageListsTemplate,
            tabs = opts.tabList
        ;
        return ArtTemplate.compile( tpl, { escape: false } )( { tabs: tabs } );
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
        // 处理参数：将对象转换成字符串
        if ( data.moreAppOptions ) {
            data.moreAppOptions = window.JSON.stringify( data.moreAppOptions );
        }
        return ArtTemplate.compile( tpl, { escape: false } )( data );
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
        this._unbindEvent();

        // 删除弹出层节点
        this.$popup.remove();
    };



    /**
     * 定位
     * @param placement {String?} 位置，"auto" | "top" | "right" | "bottom" | "left"
     */
    Message.prototype.position = function ( placement ) {
        var
            targetPos = this._getPosition(),
            actualWidth = this.$popup[0].offsetWidth,
            actualHeight = this.$popup[0].offsetHeight,
            viewportDimension,
            calculatedOffset
        ;

        placement = placement || this.opts.position || "auto";

        // 处理 "auto"
        if ( placement === "auto" ) {

            viewportDimension = this._getPosition( this.$viewport );

            placement = placement === 'bottom' && targetPos.bottom + actualHeight > viewportDimension.bottom ? 'top'    :
                        placement === 'top'    && targetPos.top    - actualHeight < viewportDimension.top    ? 'bottom' :
                        placement === 'right'  && targetPos.right  + actualWidth  > viewportDimension.width  ? 'left'   :
                        placement === 'left'   && targetPos.left   - actualWidth  < viewportDimension.left   ? 'right'  :
                        "bottom"
            ;
        }

        // 设置 popup 相对于 target 出现的位置
        this.$popup
            .removeClass( "bottom top right left" )
            .addClass( placement )
        ;

        // 计算位置
        calculatedOffset = this._getCalculatedOffset( placement, targetPos, actualWidth, actualHeight );

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
        $element = $element || this.$target;

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