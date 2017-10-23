/**
 * @fileoverview 处理依赖，注册主题。
 * @author 吴钦飞（wuqf@pkuisoft.net）
 */
define( function ( require ) {
    "use strict";
    // 核心
    require( "./echarts.min" );

    // 主题，请参考 http://echarts.baidu.com/download-theme.html
    require( "./theme/all" );

    return window[ "echarts" ];
} );