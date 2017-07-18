/**
 * @fileoverview 全局设置。
 *
 *      1. 日期格式
 *
 * @author 吴钦飞（wuqf@pkusoft.net）
 */
define( function( require ) {
    "use strict";
    var
        $ = require( "jquery" ),
        PKUI = window.PKUI
    ;

    // 日期控件
    require( "datepicker" );

    // 日期时间控件
    require( "datetimepicker" );

//---------------------------------------------------------------


    // 设置主题（theme）


    // 日期控件 -- 设置默认的日期格式
    $.fn.datepicker.dates[ "zh-CN" ].format = "yyyy-mm-dd";

    // 日期时间控件 -- i18n （简体中文）
    $.datetimepicker.setLocale('ch');

    $.extend( $.fn.datetimepicker.defaults, {
        format:	'Y-m-d H:i:s',
        formatTime:	'H:i:s',
        formatDate:	'Y-m-d',
        // 每周从星期一开始
        dayOfWeekStart: 1
    } );

    // 数据表格使用 dateFormatter 时，日期格式化后的日期
    PKUI.datagridDateFormat = "YYYY-MM-DD";

    // 数据表格使用 datetimeFormatter 时，日期时间格式化后的日期时间
    PKUI.datagridDatetimeFormat = "YYYY-MM-DD HH:mm:ss";

} );