/**
 * 快捷方式的配置。
 *  每个数组元素对应一个快捷方式，每个快捷方式即为一个菜单项（SYS_MENU）
 *  快捷方式的图标（icon）和名称（menuName）默认使用 sysMenu.icon和sysMenu.menuName
 *  打开方式（mode）默认为"default"
 *  打开窗口后显示的页面（src）默认为 “${ctx}/static/desktop/tpl/system/index.html”
 */
define( function() {

    var config = [
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

    return config;
} );