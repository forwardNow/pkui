/**
 * @fileoverview 处理依赖，注册主题。
 * @author 吴钦飞（wuqf@pkuisoft.net）
 */
define( function () {
    "use strict";
    // 核心
    require( "./echarts.min" );

    // 主题 - 深色
    require( "./theme/dark" );

    // 主题 - 浅色
    require( "./theme/macarons" );

    // 主题 - 浅色（亮色）
    require( "./theme/shine" );

    return window[ "echarts" ];
} );