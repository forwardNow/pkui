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

        // dept/list.html
        {
            "system.dept.list.sysDeptDelete": "__CTX__/admin/sysDeptDelete",
            "system.dept.list.sysDeptListData": "__CTX__/admin/sysDeptListData",
            "system.dept.list.sysDeptModel": "__CTX__/admin/sysDeptModel",
            "system.dept.list.sysDeptCreateDic": "__CTX__/admin/sysDeptCreateDic"
        },

        // dept/add.html
        // dept/edit.html
        {
            "system.dept.add.sysDeptSave": "__CTX__/admin/sysDeptSave",
            "system.dept.add.sysDeptCheckInfo": "__CTX__/admin/sysDeptCheckInfo"
        },

        // dic/item/list.html
        {
            "system.dic.item.list.sysDicItemDelete": "__CTX__/admin/sysDicItemDelete",
            "system.dic.item.list.sysDicItemListDataExt": "__CTX__/admin/sysDicItemListDataExt",
            "system.dic.item.list.sysDicItemModel": "__CTX__/admin/sysDicItemModel"
        },

        // dic/item/add.html
        // dic/item/edit.html
        {
            "system.dic.item.add.sysDicItemSave": "__CTX__/admin/sysDicItemSave"
        },

        // dic/list/list.html
        {
            "system.dic.list.list.sysDicListDelete": "__CTX__/admin/sysDicListDelete",
            "system.dic.list.list.sysDicListListDataExt": "__CTX__/admin/sysDicListListDataExt",
            "system.dic.list.list.sysDicListModel": "__CTX__/admin/sysDicListModel",
            "system.dic.list.list.sysDicDownload": "__CTX__/admin/sysDicDownload",
            "system.dic.list.list.sysDicCreateXml": "__CTX__/admin/sysDicCreateXml"
        },

        // dic/list/edit.html
        {
            "system.dic.list.edit.sysDicListSave": "__CTX__/admin/sysDicListSave"
        },
        // dic/list/add.html
        {
            "system.dic.list.add.sysDicListAdd": "__CTX__/admin/sysDicListAdd",
            "system.dic.list.add.checkDicNameUnique": "__CTX__/admin/checkDicNameUnique"
        },

        // dic/list/import.html
        {
            "system.dic.list.import.sysDicImport": "__CTX__/admin/sysDicImport"
        },

        // log/list.html
        {
            "system.log.list.sysLogDeleteByIds": "__CTX__/admin/sysLogDeleteByIds",
            "system.log.list.sysLogListData_new_getPage": "__CTX__/admin/sysLogListData_new_getPage",
            "system.log.list.sysLogListData_new_getCount": "__CTX__/admin/sysLogListData_new_getCount",
            "system.log.list.sysLogTotalRecords": "__CTX__/admin/sysLogTotalRecords"
        },


        {

        }

    );

    // 添加进占位符处理器匹配源数据源
    PlaceholderHandler.appendMatchSource( config );
} );