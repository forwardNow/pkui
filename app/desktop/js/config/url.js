/**
 * 项目中使用到的所有URL。
 * 哪些内容里的通配符将被替换：
 *     1. 通过 $jquery.html() 方法添加的内容
 *     2. jQuery.ajax( { url: "此处的内容" } )
 *     3. data-pkui-component-options 的值
 */
define( function () {
    var
        config
    ;

    config = {

        "system.dept.list.sysDeptDelete": "__CTX__/admin/sysDeptDelete",
        "system.dept.list.sysDeptListData": "__CTX__/admin/sysDeptListData",
        "system.dept.list.sysDeptModel": "__CTX__/admin/sysDeptModel",
        "system.dept.list.sysDeptCreateDic": "__CTX__/admin/sysDeptCreateDic"


    };

    return config;
} );