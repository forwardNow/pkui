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

    $.extend( config, {
        // desktop/js/common/menuSource.js
        "system.menu.sysMenuListData": "__CTX__/admin/sysMenuListData",

        // 获取所有子系统对象
        "system.accessSystemlistData": "__CTX__/admin/subSysListData",

        // role/index.html
        "system.role.index.getAllSysRole": "__CTX__/admin/getAllSysRole",
        "system.role.index.sysRoleDelete": "__CTX__/admin/sysRoleDelete",
        "system.role.index.sysRoleSave": "__CTX__/admin/sysRoleSave",
        "system.role.index.sysRoleModel": "__CTX__/admin/sysRoleModel",

        "system.role.index.sysRoleUserSave": "__CTX__/admin/sysRoleUserSave",
        "system.role.index.sysRoleUserDelete": "__CTX__/admin/sysRoleUserDelete",
        "system.role.index.sysRoleUserListData": "__CTX__/admin/sysRoleUserListData",
        "system.role.index.sysRoleMenuSave": "__CTX__/admin/sysRoleMenuSave",
        "system.role.index.sysRoleMenuListData": "__CTX__/admin/sysRoleMenuListData",
        "system.role.index.sysRoleResouceSave": "__CTX__/admin/sysRoleResouceSave",
        "system.role.index.sysRoleResouceListData": "__CTX__/admin/sysRoleResouceListData",
        "system.role.index.sysRolePermitSave": "__CTX__/admin/sysRolePermitSave",
        "system.role.index.sysRolePermitListData": "__CTX__/admin/sysRolePermitListData",
        "system.role.index.sysRoleNewPermitSave": "__CTX__/admin/sysRoleNewPermitSave",
        "system.role.index.sysRoleNewPermitListData": "__CTX__/admin/sysRoleNewPermitListData"

    } );


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

        // maxid/type/list.html
        {
            "system.maxid.type.list.sysMaxIdTypeDelete": "__CTX__/admin/sysMaxIdTypeDelete",
            "system.maxid.type.list.sysMaxIdTypeListDataExt": "__CTX__/admin/sysMaxIdTypeListDataExt",
            "system.maxid.type.list.sysMaxIdTypeModel": "__CTX__/admin/sysMaxIdTypeModel",
            "system.maxid.type.list.sysMaxIdTypeCreateDic": "__CTX__/admin/sysMaxIdTypeCreateDic"
        },
        // maxid/type/add.html
        {
            "system.maxid.type.add.sysMaxIdTypeAdd": "__CTX__/admin/sysMaxIdTypeAdd",
            "system.maxid.type.add.checkTypeIdUnique": "__CTX__/admin/checkTypeIdUnique"
        },
        // maxid/type/edit.html
        {
            "system.maxid.type.edit.sysMaxIdTypeSave": "__CTX__/admin/sysMaxIdTypeSave"
        },

        // menu/list.html
        {
            "system.menu.list.sysMenuListData": "__CTX__/admin/sysMenuListData"
        },
        // js/page/sysMenu.js
        {
            "system.menu.list.js.sysMenuModel": "__CTX__/admin/sysMenuModel",
            "system.menu.list.js.sysMenuDelete": "__CTX__/admin/sysMenuDelete",
            "system.menu.list.js.sysMenuSave": "__CTX__/admin/sysMenuSave"
        },
        // menu/edit.html
        {
            "system.menu.edit.sysMenuUpdate": "__CTX__/admin/sysMenuUpdate"
        },
        // js/page/sysMenuIcon.js
        {
            "system.menu.edit.js.sysMenuIconsDataExt": "__CTX__/admin/sysMenuIconsDataExt"
        },
        // menu/add.html
        {
            "system.menu.add.sysMenuAdd": "__CTX__/admin/sysMenuAdd"
        },

        // para/list.html
        {
            "system.para.list.sysParaDelete": "__CTX__/admin/sysParaDelete",
            "system.para.list.sysParaListData": "__CTX__/admin/sysParaListData",
            "system.para.list.sysParaModel": "__CTX__/admin/sysParaModel"
        },
        // para/add.html
        {
            "system.para.add.sysParaSave": "__CTX__/admin/sysParaSave",
            "system.para.add.checksysParaForm": "__CTX__/admin/checksysParaForm"
        },
        // para/edit.html
        {
            "system.para.edit.sysParaSave": "__CTX__/admin/sysParaSave",
            "system.para.edit.checksysParaForm": "__CTX__/admin/checksysParaForm"
        },

        // user/list.html
        {
            "system.user.list.sysUserModel": "__CTX__/admin/sysUserModel",
            "system.user.list.sysUserDelete": "__CTX__/admin/sysUserDelete",
            "system.user.list.sysUserListData": "__CTX__/admin/sysUserListData",
            "system.user.list.sysUserResetPWD": "__CTX__/admin/sysUserResetPWD"
        },
        // user/add.html
        {
            "system.user.add.sysUserSave": "__CTX__/admin/sysUserSave",
            "system.user.add.sysDeptDic": "__CTX__/admin/sysDeptDic"
        },

        // user/edit.html
        {
            "system.user.edit.sysUserSave": "__CTX__/admin/sysUserSave",
            "system.user.edit.sysDeptDic": "__CTX__/admin/sysDeptDic"
        },

        // resource/list.html
        {
            "system.resource.list.sysResourceDelete": "__CTX__/admin/sysResourceDelete",
            "system.resource.list.sysResourceListData": "__CTX__/admin/sysResourceListData",
            "system.resource.list.sysResourceModel": "__CTX__/admin/sysResourceModel"
        },
        // resource/add.html
        {
            "system.resource.add.sysResourceSave": "__CTX__/admin/sysResourceSave"
        },
        // permit/list.html
        {
            "system.permit.list.sysPermitDelete": "__CTX__/admin/sysPermitDelete",
            "system.permit.list.sysPermitListData": "__CTX__/admin/sysPermitListData",
            "system.permit.list.sysPermitModel": "__CTX__/admin/sysPermitModel"
        },
        // permit/edit.html
        {
            "system.permit.edit.sysPermitSave": "__CTX__/admin/sysPermitSave"
        },
        // permit/add.html
        {
            "system.permit.add.sysPermitSave": "__CTX__/admin/sysPermitSave"
        },

        {

        }

    );

    // 添加进占位符处理器匹配源数据源
    PlaceholderHandler.appendMatchSource( config );
} );