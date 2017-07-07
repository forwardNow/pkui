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
        $ = require( "jquery" )
    ;

    // 日期控件
    require( "datepicker" );


    // 设置默认的日期格式
    $.fn.datepicker.dates[ "zh-CN" ].format = "yyyy-mm-dd";

} );