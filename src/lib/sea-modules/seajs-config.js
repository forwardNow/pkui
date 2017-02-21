;+function () {

    var isSupportHtml5Markup,
        isSupportMediaQuery,
        isSupportES5,
        isSupportJSON
    ;

    isSupportHtml5Markup = ( function ( ver ) {
        var b = document.createElement( "b" );
        b.innerHTML = "<!--[if IE " + ver + "]><i></i><![endif]-->";
        return b.getElementsByTagName( "i" ).length === 1
    }( 8 ) );

    isSupportMediaQuery = window.matchMedia && window.matchMedia( "only all" ) !== null
        && window.matchMedia( "only all" ).matches;

    isSupportES5 = Function.prototype.bind;

    isSupportJSON = window.JSON;

    // 配置
    seajs.config( {

        // 别名配置
        alias: {
            // 动态载入CSS文件
            "seajs-css": "lib/jquery/1.0.0/seajs-css",
            "seajs-debug": "lib/jquery/1.0.0/seajs-debug",

            // polyfill ES5 grammar
            "es5-shim": "lib/es5-shim/4.5.9.x/es5-shim",
            "es5-sham": "lib/es5-shim/4.5.9.x/es5-sham",

            // polyfill JSON（JSON.parse、JSON.stringify）
            "json3": "lib/json3/3.3.2/json3",

            // polyfill for min/max-width CSS3 Media Queries (for IE 6-8, and more)
            "respond": "lib/respond/1.4.2/respond",

            // 是IE8识别HTML5标记
            "html5shiv": "lib/html5shiv/3.7.3/html5shiv",

            // jQuery
            "jquery": "lib/jquery/1.11.3.x/jquery",

            // jQuery UI
            "jquery-ui": "lib/jquery/plugin/jquery-ui/1.12.1.x/jquery-ui.min",

            // 轮播图组件
            "swiper": "lib/swiper/2.7.6.x/swiper",

            // 弹窗组件
            "layer": "lib/layer/3.0.1.x/layer"
        },

        // 路径配置
        paths: {
            //"pkui": "../../pkui"
        },

        // 变量配置
        vars: {
            //"locale": "zh-cn"
        },

        // 映射配置
        map: [
            // [ "http://example.com/js/app/", "http://localhost/js/app/" ]
        ],

        // 预加载项
        preload: [
            window.jQuery ? "" : "jquery",
            // "jquery-ui",
            isSupportES5 ? "" : "es5-sham",
            isSupportJSON ? "" : "json3",
            isSupportMediaQuery ? "" : "respond",
            isSupportHtml5Markup ? "html5shiv" : ""

        ],

        // 调试模式
        debug: true,

        // Sea.js 的基础路径，由页面指定
        // base: "../../pkui",

        // 文件编码
        charset: "utf-8"
    } );

}();