/**
 * 快捷方式配置，
 * 此模块配合 loadContent模块 使用，提供 getHtml() 接口，并解析快捷方式配置（config/shortcut.js）
 */
define( function ( require ) {
    var
        $ = require( "jquery" ),
        MenuSource = require( "../common/menuSource" ),
        ArtTemplate = require( "artTemplate" ),
        SHORTCUT_CONFIG = require( "../config/shortcut" ),
        Shortcut = {}
    ;


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
        +"         \"menuId\": {{menuId}},"
        +"         \"mode\": \"{{mode}}\"}'>"
        +"{{if isFontIcon}} "
    +"        <span class=\"launchpad-shortcut-icon launchpad-shortcut-fonticon {{ fontIconClass }} \" style=\"{{ fontIconStyle }}\"><i class=\"{{icon}}\"></i></span>"
        +"{{else}} "
    +"        <img class=\"launchpad-shortcut-icon\" src=\"{{icon}}\" alt=\"\">"
        +"{{/if}} "
        +"    <p class=\"launchpad-shortcut-title\">{{menuName}}</p></div>"
    ;

    /**
     * 初始化方法
     * @private
     */
    Shortcut._init = function () {
        this.sysMenuSet = MenuSource.getSet( true );
        this.config = SHORTCUT_CONFIG;
        this.render = ArtTemplate.compile( this.template );
    };

    /**
     * 核心方法
     * @param callback
     */
    Shortcut.getHtml = function ( callback ) {
        callback( this._getHtml() );

        /**
         * @description 在面板容器上触发一个【快捷方式以载入完毕】的自定义事件
         * @event shortcutLoaded.pkui
         */
        $( ".launchpad-container" ).trigger( "shortcutLoaded.pkui" );
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
                icon,
                patchIcon,
                menuId,
                fontIconStyle = ""
            ;

            sysMenu = sysMenuSet[ item.menuId ];

            // 如果不在 sysMenuSet 中，则说明没有该菜单的权限
            if ( ! sysMenu ) {
                return true; // continue
            }

            patchIcon = sysMenu[ "reserve1" ];

            icon = item.icon || sysMenu.icon || "fa fa-play";

            if ( typeof patchIcon === "string" && patchIcon.indexOf( "fa-" ) !== -1 ) {
                icon = patchIcon;
            }

            if ( icon.indexOf( ".png" ) !== -1  ) {
                isFontIcon = false;
            }

            menuId = item.menuId;
            if ( typeof menuId === "string" ) {
                menuId = '"' + menuId + '"';
            }

            if ( isFontIcon ) {
                fontIconStyle = getFontIconStyle( item.fontIconStyle );
            }

            // 翻译模板
            shortcutHtml = _this.render( {
                icon: icon,
                menuName: item.menuName || sysMenu.menuName,
                menuId: menuId,
                src: item.src || defaultSrc,
                mode: item.mode || defaultMode,
                isFontIcon: isFontIcon,
                fontIconClass: item.fontIconClass || "fonticon-default",
                fontIconStyle: fontIconStyle
            } );

            html += shortcutHtml;
        } );

        return html;
    };


    /**
     * 格式化样式
     * @param fontIconStyle {{ bgColor:String, color:String }} 样式对象
     * @returns {string} 样式类
     */
    function getFontIconStyle( fontIconStyle ) {
        var
            bgColor,
            color
        ;
        if ( typeof fontIconStyle !== "object") {
            return "";
        }
        bgColor = fontIconStyle.bgColor;
        color = fontIconStyle.color;
        return "background-color: " + bgColor + "; color: " + color + ";";
    }


    Shortcut._init();

    return Shortcut;
} );