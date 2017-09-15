/**
 * 项目中使用到的所有URL。
 * 哪些内容里的通配符将被替换：
 *     1. 通过 $jquery.html() 方法添加的内容
 *     2. jQuery.ajax( { url: "此处的内容" } )
 *     3. data-pkui-component-options 的值
 */
define( function ( require ) {
    var
        $ = require( "jquery" ),
        PlaceholderHandler = require( "placeholderHandler" ),
        config = {}
    ;

    $.extend( config,
        // tpl/common/msg/list.html
        {
            "common.msg.list.sysMessageDelete": "__CTX__/common/sysMessageDelete",
            "common.msg.list.sysMessageListData": "__CTX__/common/sysMessageListData",
            "common.msg.list.sysMessageModel": "__CTX__/common/sysMessageModel"
        }
    );


    // 添加进占位符处理器匹配源
    PlaceholderHandler.appendMatchSource( config );
} );