/**
 * @fileOverview 应用搜索模块
 *      1. 基于 SYS_MENU 的 MENU_NAME
 *      2. 列出符合关键字的菜单项
 *      3. 选中菜单项并按下回车立即启动该功能
 *
 * 应用场景
 *
 *      1. 绑定到按钮
 *
 *          点击（click）某按钮（或其他元素）后，出现【弹出层和搜索】。
 *          【弹出层和搜索】仅有一个。
 *
 *      2. 绑定到输入域
 *
 *          输入域获取焦点后，出现【推荐列表】。
 *          【推荐列表】可以有多个，每个实例一个。
 *
 * @author 吴钦飞（wuqf@pkusoft.net）
 */
define( function ( require ) {
    "use strict";

    var
        $ = require( "jquery" ),
        MenuSource = require( "./menuSource" ),
        layer = window.layer,
        App = require( "./app" ),
        NAMESPACE = "pkui.search",
        IS_POPUP_CREATED = false,
        // 公共弹出层
        PublicPopup = {}
        ;

    // 依赖 jquery ui 的 autocomplete 模块
    require( "jquery-ui" );

    /**
     * 默认参数
     * @type {{targetSelector: string, template: string}}
     */
    Search.prototype.defaults = {
        // 模式："public" - 应用场景1；"private" - 应用场景2。
        mode: "public",
        // 目标元素的CSS选择器，指定触发搜索的元素
        targetSelector: null,
        // 弹出层的HTML模板
        publicPopupTemplate: '<div class="pkui-search-popup" id="pkui-search-popup">'
            +       '<i class="fa fa-search pkui-search-icon"></i>'
            +       '<input type="text" id="pkui-search-input" class="pkui-search-input" placeholder="请输入应用名称">'
            +     '</div>'
            +     '<div class="pkui-search-backdrop">'
            +     '</div>'
    };



    /**
     * 构造函数
     * @param opts {*?}
     * @constructor
     */
    function Search( opts ) {
        this.opts = $.extend( true, {}, this.defaults, opts );
        this.$target = $( this.opts.targetSelector );
        this.init();
    }

    /**
     * 初始化方法
     */
    Search.prototype.init = function () {

        this._render();

        // 获取菜单数据
        this._getData();
        this._fmtData();

        this._bind();

    };
    Search.prototype._render = function () {
        // this.$blur = $( this.opts.blurElementSelector );
    };
    /**
     * 绑定事件处理函数
     * @private
     */
    Search.prototype._bind = function () {

        var _this = this;

        // 点击 target 时，启动搜索功能
        this.$target.on( "click." + NAMESPACE, function ( event ) {

            if ( ! _this._data ) {
                layer.alert( "初始时获取菜单数据失败，无法启用搜索功能，正在尝试重新获取菜单数据！", { icon: 2 } );
                _this._getData();
                _this._fmtData();
                return;
            }

            _this.show();

            event.stopPropagation();
        } );


    };

    /**
     *
     * 场景1 创建 search
     * @private
     */
    Search.prototype._createPublicPopup = function () {

        var _this = this;

        PublicPopup.$popup = $( this.opts.publicPopupTemplate ).appendTo( $( document.body ) );

        PublicPopup.$backdrop = PublicPopup.$popup.find( ".pkui-search-backdrop" );

        $.ui.autocomplete.prototype._renderItem = function( ul, item ) {
            return $( "<li>" )
                .append( $( "<div>" ).html( '<i class="' + item.icon + '"></i>' + item.label ) )
                .appendTo( ul );
        };

        $( "#pkui-search-input" ).autocomplete({
            appendTo: "#pkui-search-popup",
            // autoFocus: true,
            //source: this._data
            source: function ( request, response ) {
                var matcher = new RegExp( $.ui.autocomplete.escapeRegex( request.term ), "i" );
                response( $.map( _this._data, function ( item ) {
                    var menuName = item.value;
                    if  ( !request.term || matcher.test( menuName ) ) {
                        return {
                            label: menuName.replace(
                                new RegExp(
                                    "(?![^&;]+;)(?!<[^<>]*)(" +
                                    $.ui.autocomplete.escapeRegex( request.term ) +
                                    ")(?![^<>]*>)(?![^&;]+;)", "gi"
                                ), "<strong>$1</strong>" ),
                            value: menuName,
                            menuId: item.menuId,
                            icon: item.icon
                        };
                    }
                } ) );
            }
        } ).on( "focus", function () {
            $( this ).autocomplete( "search" );
        } ).on( "autocompleteselect", function( event, ui ) {
            var item = ui.item;
            // 关闭 menu
            $( this ).autocomplete( "close" );
            // 关闭 search
            _this.hide();
            // 开启 窗口
            new App(null, {
                "icon": item.icon,
                "title": item.value,
                "src": "__CTX__/static/desktop/tpl/system/index.html",
                "menuId": item.menuId,
                "mode": "default"})
        } );


        // 点击非 popup 的地方，隐藏
        $( document ).on( "click." + NAMESPACE, function ( event ) {
            var target = event.target;
            if ( ! PublicPopup.$popup ) {
                return;
            }
            // 点击 popup
            if ( $.contains( PublicPopup.$popup.get( 0 ), target ) ) {
                return;
            }
            _this.hide();
        } );

        // this.isCreated = true;

        IS_POPUP_CREATED = true;
    };

    /**
     * 场景2
     * @private
     */
    Search.prototype._createPrivatePopup = function () {
        var
            _this = this
        ;

        $.ui.autocomplete.prototype._renderItem = function( ul, item ) {
            return $( "<li>" )
                .append( $( "<div>" ).html( '<i class="' + item.icon + '"></i>' + item.label ) )
                .appendTo( ul );
        };

        $.ui.autocomplete.prototype._resizeMenu = function() {
            var ul = this.menu.element;
            if ( this.options.width ) {
                ul.outerWidth( this.options.width );
                return;
            }
            ul.outerWidth( Math.max(
                // Firefox wraps long text (possibly a rounding bug)
                // so we add 1px to avoid the wrapping (#7513)
                ul.width( "" ).outerWidth() + 1,
                this.element.outerWidth()
            ) );
        };
        this.$target.autocomplete({
            // autoFocus: true,
            //source: this._data
            // appendTo: this.$target.parent(),

            width: this.$target.outerWidth(),

            source: function ( request, response ) {
                var matcher = new RegExp( $.ui.autocomplete.escapeRegex( request.term ), "i" );
                response( $.map( _this._data, function ( item ) {
                    var menuName = item.value;
                    if  ( !request.term || matcher.test( menuName ) ) {
                        return {
                            label: menuName.replace(
                                new RegExp(
                                    "(?![^&;]+;)(?!<[^<>]*)(" +
                                    $.ui.autocomplete.escapeRegex( request.term ) +
                                    ")(?![^<>]*>)(?![^&;]+;)", "gi"
                                ), "<strong>$1</strong>" ),
                            value: menuName,
                            menuId: item.menuId,
                            icon: item.icon
                        };
                    }
                } ) );
            }
        } ).on( "focus", function () {
            $( this ).autocomplete( "search" );
        } ).on( "autocompleteselect", function( event, ui ) {
            var item = ui.item;
            // 关闭 menu
            $( this ).autocomplete( "close" );
            // 开启 窗口
            new App(null, {
                "icon": item.icon,
                "title": item.value,
                "src": "__CTX__/static/desktop/tpl/system/index.html",
                "menuId": item.menuId,
                "mode": "default"})
        } );

        this._isCreated = true;
    };



    /**
     * 显示
     */
    Search.prototype.show = function () {

        // 场景1
        if ( this.opts.mode === "public" ) {

            if ( ! IS_POPUP_CREATED ) {
                this._createPublicPopup();
            }

            PublicPopup.$backdrop.show();
            PublicPopup.$popup.show();

        }
        // 场景2
        else {
            if ( ! this._isCreated ) {
                this._createPrivatePopup();
            }
        }

    };

    /**
     * 隐藏
     */
    Search.prototype.hide = function () {

        // 场景1
        if ( this.opts.mode === "public" ) {
            PublicPopup.$popup.hide();
            PublicPopup.$backdrop.hide();
        }
        // 场景2
        else {

        }

    };


    /**
     * 获取 包含所有菜单的列表。
     * @private
     */
    Search.prototype._getData = function () {
        this._data = MenuSource.getList();
    };

    /**
     * 对 包含所有菜单的列表 进行格式化。
     * @private
     */
    Search.prototype._fmtData = function () {
        var fmtData = [];
        $.each( this._data, function ( index, item ) {
            if ( item[ "visiable" ] !== "1" ) {
                return;
            }
            fmtData.push( {
                menuId: item[ "menuId" ],
                // menuName
                value: item[ "menuName" ],
                icon: item[ "icon" ]
            } )
        } );
        this._data = fmtData;
    };

    return Search;

} );