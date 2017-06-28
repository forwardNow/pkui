/**
 * 快捷方式配置
 */
define( function ( require ) {
    var
        $ = require( "jquery" ),
        Shortcut = {}
    ;

    var html =
        "<div class=\"launchpad-shortcut\" data-pkui-app=\"true\""
        +"     data-pkui-app-options='{"
        +"         \"icon\": \"./images/apps/gear.png\","
        +"         \"title\": \"系统管理\","
        +"         \"src\": \"./tpl/system/index.html\","
        +"         \"menuId\": \"1\","
        +"         \"mode\": \"default\"}'>"
        +"    <img class=\"launchpad-shortcut-icon\" src=\"./images/apps/gear.png\" alt=\"\">"
        +"    <p class=\"launchpad-shortcut-title\">系统管理</p></div>"
        +"<div class=\"launchpad-shortcut\" data-pkui-app=\"true\""
        +"     data-pkui-app-options='{"
        +"         \"icon\": \"fa fa-home\","
        +"         \"title\": \"单位管理\","
        +"         \"src\": \"./tpl/system/index.html\","
        +"         \"menuId\": \"2\","
        +"         \"mode\": \"default\"}'>"
        +"    <span class=\"launchpad-shortcut-icon launchpad-shortcut-fonticon\"><i class=\"fa fa-home\"></i></span>"
        +"    <p class=\"launchpad-shortcut-title\">单位管理</p></div>"
        +"<div class=\"launchpad-shortcut\" data-pkui-app=\"true\""
        +"     data-pkui-app-options='{"
        +"         \"icon\": \"fa fa-users\","
        +"         \"title\": \"用户管理\","
        +"         \"src\": \"./tpl/system/index.html\","
        +"         \"menuId\": \"3\","
        +"         \"mode\": \"default\"}'>"
        +"    <span class=\"launchpad-shortcut-icon launchpad-shortcut-fonticon\"><i class=\"fa fa-users\"></i></span>"
        +"    <p class=\"launchpad-shortcut-title\">用户管理</p></div>"
    ;
    Shortcut.getHtml = function ( callback ) {
        callback( html );
    };

    return Shortcut;
} );