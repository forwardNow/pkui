/**
 * @fileoverview 快捷方式的配置。
 *
 * @author 吴钦飞（wuqf@pkusoft.net）
 */
define( function() {

    var
        templateConfig
    ;

    /**
     * 每个元素对应一个快捷方式
     *
     *      menuId: SYS_MENU.MENU_ID。（此属性必须指定，其余属性可省略。）
     *
     *      menuName: 快捷方式的名称。
     *                默认为 SYS_MENU.MENU_NAME（SYS_MENU表的MENU_NAME字段的值）
     *
     *      icon: 快捷方式的图标，可指定png图片（绝对路径）。
     *            默认为 SYS_MENU.ICON（SYS_MENU表的ICON字段的值）
     *
     *      mode: 快捷方式的打开方式。
     *            默认为 "default"
     *
     *      src: 打开的窗口，主界面显示的页面（欢迎页面）。
     *           默认为 "__CTX__/static/desktop/tpl/system/index.html"
     *
     *      fontIconClass: 设置快捷方式的样式类
     *
     *      fontIconStyle: 设置快捷方式的样式
     *
     * @type {[*]}
     */
    templateConfig = [
        {
            menuId: 1,
            menuName: "系统管理", icon: "__CTX__/static/desktop/images/apps/settings.png",

            mode: "default",
            src: "__CTX__/static/desktop/tpl/system/index.html"
        },
        { menuId: 2 },
        { menuId: 3, fontIconClass: "fonticon-cyan" },
        { menuId: 4, fontIconClass: "fonticon-grayWhite" },
        { menuId: 5, fontIconClass: "fonticon-green" },
        { menuId: 6, fontIconClass: "fonticon-orange" },
        { menuId: 7, fontIconClass: "fonticon-red" },
        { menuId: 8, fontIconClass: "fonticon-purple" },
        { menuId: 9, fontIconClass: "fonticon-yellow" },
        { menuId: 10, fontIconStyle: { bgColor: "#f8e2b3", color: "#5a4118" } },
        { menuId: 114 },

        { menuId: 446, fontIconStyle: { bgColor: "#fff", color: "#2319dc" },
            menuName: "mode(iframe)",
            icon: "fa fa-search",
            mode: "iframe",
            src: "http://www.baidu.com/" },
        { menuId: 447, fontIconStyle: { bgColor: "#fff", color: "#2319dc" },
            menuName: "mode(browserTab)",
            icon: "fa fa-search",
            mode: "browserTab",
            src: "http://www.baidu.com/"}
    ];

    return templateConfig;
} );