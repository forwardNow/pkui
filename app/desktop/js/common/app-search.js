/**
 * 应用搜索模块
 *      1. 基于 SYS_MENU 的 MENU_NAME
 *      2. 列出符合关键字的菜单项
 *      3. 选中菜单项并按下回车立即启动该功能
 */
define( function ( require ) {

    require( "jquery-ui" );

    var
        $ = require( "jquery" ),
        MenuSource = require( "./menuSource" ),
        layer = window.layer,
        App = require( "./app" ),
        namespace = "pkui.search"
        ;

    Search.prototype.defaults = {
        targetSelector: null,
        template: '<div class="pkui-search-popup" id="pkui-search-popup">'
            +       '<i class="fa fa-search pkui-search-icon"></i>'
            +       '<input type="text" id="pkui-search-input" class="pkui-search-input" placeholder="请输入应用名称">'
            +     '</div>'
    };

    function Search( opts ) {
        this.opts = $.extend( true, {}, this.defaults, opts );
        this.$target = $( this.opts.targetSelector );
        this.init();
    }

    Search.prototype.init = function () {

        // 获取菜单数据
        this._getData();
        this._fmtData();

        this.bind();

    };

    Search.prototype.bind = function () {

        var _this = this;

        // 点击 target 时，启动搜索功能
        this.$target.on( "click." + namespace, function ( event ) {

            if ( ! _this.data ) {
                layer.alert( "初始时获取菜单数据失败，无法启用搜索功能，正在尝试重新获取菜单数据！", { icon: 2 } );
                _this._getData();
                _this._fmtData();
                return;
            }

            _this.show();

            event.stopPropagation();
        } );

        // 点击非 popup 的地方，隐藏
        $( document ).on( "click." + namespace, function ( event ) {
            var target = event.target;
            if ( ! _this.$popup ) {
                return;
            }
            if ( ! $.contains( _this.$popup.get( 0 ), target ) ) {
                _this.hide();
            }
        } );
    };

    Search.prototype.create = function () {

        var _this = this;

        this.$popup = $( this.opts.template ).appendTo( $( document.body ) );

        $.ui.autocomplete.prototype._renderItem = function( ul, item ) {
            return $( "<li>" )
                .append( $( "<div>" ).html( '<i class="' + item.icon + '"></i>' + item.label ) )
                .appendTo( ul );
        };

        $( "#pkui-search-input" ).autocomplete({
            appendTo: "#pkui-search-popup",
            // autoFocus: true,
            //source: this.data
            source: function ( request, response ) {
                var matcher = new RegExp( $.ui.autocomplete.escapeRegex( request.term ), "i" );
                response( $.map( _this.data, function ( item ) {
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
        }).on( "focus", function () {
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
                "src": "./tpl/system/index.html",
                "menuId": item.menuId,
                "mode": "default"})
        } );

        this.isCreated = true;
    };

    Search.prototype.show = function () {
        if ( ! this.isCreated ) {
            this.create();
        }
        this.$popup.show();
    };

    Search.prototype.hide = function () {
        this.$popup.hide();
    };


    Search.prototype._getData = function () {
        this.data = MenuSource.getList();
    };

    Search.prototype._fmtData = function () {
        var fmtData = [];
        $.each( this.data, function ( index, item ) {
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
        this.data = fmtData;
    };

    return Search;

} );