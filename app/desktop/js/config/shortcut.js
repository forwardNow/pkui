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
     * @type {[*]}
     */
    templateConfig = [
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

    return templateConfig;
} );