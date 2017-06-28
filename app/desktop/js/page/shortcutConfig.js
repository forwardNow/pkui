/**
 * 快捷方式配置
 */
define( function ( require ) {
    var
        $ = require( "jquery" ),
        MenuSource = require( "../common/menuSource" ),
        ArtTemplate = require( "artTemplate" ),
        Shortcut = {}
    ;

    /**
     * 快捷方式的配置。
     *  每个数组元素对应一个快捷方式，每个快捷方式即为一个菜单项（SYS_MENU）
     *  快捷方式的图标（icon）和名称（menuName）默认使用 sysMenu.icon和sysMenu.menuName
     *  打开方式（mode）默认为"default"
     *  打开窗口后显示的页面（src）默认为 “${ctx}/static/desktop/tpl/system/index.html”
     * @type {Array}
     */
    Shortcut.SHORTCUT_CONFIG = [
        {
            menuId: 1,
            menuName: "系统管理", icon: "__CTX__/static/desktop/images/apps/gear.png",

            mode: "default",
            src: "__CTX__/static/desktop/tpl/system/index.html"
        },
        { menuId: 2 },
        { menuId: 3 },
        { menuId: 4 },
        { menuId: 5 },
        { menuId: 6 },
        { menuId: 7 },
        { menuId: 8 },
        { menuId: 9 },
        { menuId: 10 }
    ];

    Shortcut.defaults = {
        src: "__CTX__/static/desktop/tpl/system/index.html",
        mode: "default"
    };

    Shortcut.template =
         "<div class=\"launchpad-shortcut\" "
        +"     data-pkui-app=\"true\""
        +"     data-pkui-app-options='{"
        +"         \"icon\": \"{{icon}}\","
        +"         \"title\": \"{{menuName}}\","
        +"         \"src\": \"{{src}}\","
        +"         \"menuId\": \"{{menuId}}\","
        +"         \"mode\": \"{{mode}}\"}'>"
        +"    {{if isFontIcon}} "
        +"        <span class=\"launchpad-shortcut-icon launchpad-shortcut-fonticon\"><i class=\"{{icon}}\"></i></span>"
        +"    {{else}} "
        +"        <img class=\"launchpad-shortcut-icon\" src=\"{{icon}}\" alt=\"\">"
        +"    {{/if}} "
        +"    <p class=\"launchpad-shortcut-title\">{{menuName}}</p></div>"
    ;

    /**
     * 初始化方法
     * @private
     */
    Shortcut._init = function () {
        this.sysMenuSet = MenuSource.getSet( true );
        this.config = this._getConfig();
        this.render = ArtTemplate.compile( this.template );
    };

    /**
     * 核心方法
     * @param callback
     */
    Shortcut.getHtml = function ( callback ) {
        callback( this._getHtml() );
    };

    /**
     * 获取
     * @private
     */
    Shortcut._getHtml = function () {
        var
            _this = this,
            sysMenuSet = this.sysMenuSet,
            defaultSrc = this.defaults.src,
            defaultMode = this.defaults.mode,
            html = ""
        ;
        $.each( this.config, function ( index, item ) {
            var
                shortcutHtml,
                isFontIcon = true,
                sysMenu,
                icon
            ;

            sysMenu = sysMenuSet[ item.menuId ];

            // 如果不在 sysMenuSet 中，则说明没有该菜单的权限
            if ( ! sysMenu ) {
                return true; // continue
            }

            icon = item.icon || sysMenu.icon || "fa fa-play";

            if ( icon.indexOf( ".png" ) !== -1  ) {
                isFontIcon = false;
            }

            // 翻译模板
            shortcutHtml = _this.render( {
                icon: icon,
                menuName: item.menuName || sysMenu.menuName,
                menuId: item.menuId,
                src: item.src || defaultSrc,
                mode: item.mode || defaultMode,
                isFontIcon: isFontIcon
            } );

            html += shortcutHtml;
        } );

        return html;
    };

    /**
     * 获取配置，可通过 window.SHORTCUT_CONFIG 进行重置
     */
    Shortcut._getConfig = function () {
        // 如果有自定义的，则直接使用
        if ( window[ "SHORTCUT_CONFIG" ] ) {
            return window[ "SHORTCUT_CONFIG" ]
        }

        return this.SHORTCUT_CONFIG;
    };

    Shortcut._init();

    return Shortcut;
} );