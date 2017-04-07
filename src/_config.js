/**
 * @file 配置文件
 * @author 吴钦飞(wuqf@pkusoft.net)
 */

// namespace
window[ "www.pkusoft.net" ] = {};

// 组件别名（模块ID）
seajs.config( {

    // 别名配置
    alias: {

        //【core】
        "_pkui": "_pkui",

        //【lib/polyfill】 ES5 grammar
        "es5-shim": "lib/polyfill/es5-shim/4.5.9.x/es5-shim",
        "es5-sham": "lib/polyfill/es5-shim/4.5.9.x/es5-sham",

        //【lib/polyfill】 JSON（JSON.parse、JSON.stringify）
        "json3": "lib/polyfill/json3/3.3.2/json3",

        //【lib/polyfill】 for min/max-width CSS3 Media Queries (for IE 6-8, and more)
        "respond": "lib/polyfill/respond/1.4.2/respond",

        //【lib/polyfill】使IE8识别HTML5标记（在下方被 document.write 硬编码，请同步修改）
        "html5shiv": "lib/polyfill/html5shiv/3.7.3/html5shiv",

        //【lib/utils】模板引擎
        "artTemplate": "lib/utils/art-template/3.1.0/template",

        //【lib/utils】RSA
        "jsencrypt": "lib/utils/jsencrypt/2.3.1.x/jsencrypt",

        //【lib/utils】AOP
        "meld": "lib/utils/meld/1.3.1.x/meld.js",

        //【lib/utils】表单提交
        "form": "lib/utils/form/4.2.0.x/jquery.form",

        //【lib/utils】日期处理工具
        "moment": "lib/utils/moment/2.18.0.x/moment",
        "moment-local-zh": "lib/utils/moment/2.18.0.x/locale/zh-cn",

        //【lib/utils】中国身份证号校验
        "IDValidator": "lib/utils/IDValidator/1.3.0/IDValidator",
        // 行政区划
        "IDValidator-GB2260": "lib/utils/IDValidator/1.3.0/GB2260",

        //【lib/jQuery】
        "jquery": "lib/jquery/1.11.3.x/jquery",

        //【lib/jQuery/plugin】jQuery UI
        "jquery-ui": "lib/jquery/plugin/jquery-ui/1.12.1.x/jquery-ui.min",

        //【lib/jQuery/plugin】表格列宽，拖拽调整（被 bootgrid 依赖）
        "colResizable": "lib/jquery/plugin/colResizable/1.6.0.x/colResizable",

        //【lib/jQuery/plugin】bootstrap dropdown menu（被 bootgrid 依赖）
        "bootstrap-dropdown": "lib/jquery/plugin/bootstrap/3.3.6/dropdown",

        //【lib/jQuery/plugin】bootstrap tooltip
        "bootstrap-tooltip": "lib/jquery/plugin/bootstrap/3.3.6/tooltip",

        //【lib/component】轮播图组件
        "swiper": "lib/component/swiper/2.7.6.x/swiper",

        //【lib/component】弹窗组件，在 _pkui.js 硬编码引入样式文件
        "layer": "lib/component/layer/3.0.1.x/layer",

        //【lib/component】模块名"artDialog"已在模块内定义，请勿更改
        "artDialog": "lib/component/art-dialog/6.0.4.x/dialog-plus",

        //【lib/component】bootgrid
        "bootgrid": "lib/component/bootgrid/1.3.1.x/jquery.bootgrid",

        //【lib/component】loading
        "isLoading": "lib/component/isloading/1.0.6.x/isloading",

        //【lib/component】表单验证
        "validator": "lib/component/validator/1.0.10.x/jquery.validator",

        //【lib/component】chosen
        "chosen": "lib/component/chosen/1.6.2.x/chosen",

        //【component/common 】 数据源
        "dataSource": "component/common/dataSource/1.0.0/dataSource",

        //【component/common 】抽屉式弹窗
        "drawer": "component/common/drawer/1.0.0/drawer",

        //【component/logic 】datagrid的扩展
        "datagrid-delete": "component/logic/datagridExt/1.0.0/datagrid-delete"

        //
    }
} );

// 其他的配置
+function ( window ) {

    var ns = window[ "www.pkusoft.net" ],
        isSupportHtml5Markup,
        isSupportMediaQuery,
        isSupportES5,
        isSupportJSON,
        isIE8,

        /** 时间戳：版本控制，避免缓存 */
        timestamp,

        scriptNodeList,
        currentScript,
        currentScriptPath,
        pkuiBasePath,
        mainJsPath,

        ctxPath
        ;


    scriptNodeList = window.document[ "scripts" ];
    currentScript = scriptNodeList[ scriptNodeList.length - 1 ];
    currentScriptPath = currentScript.src;
    pkuiBasePath = currentScriptPath.substring( 0, currentScriptPath.lastIndexOf( "/" ) );
    mainJsPath = currentScript.getAttribute( "data-main" );
    timestamp = currentScript.getAttribute( "data-timestamp" );


    if ( !timestamp ) { // 没设置
        timestamp = "v=please-set-version";
    } else if ( timestamp == "dev" ) { // 开发模式
        timestamp = "v=" + new Date().getTime();
    } else if ( timestamp.indexOf( "=" ) === -1 ) { // 生产模式：但没有请求参数名
        timestamp = "v=" + timestamp;
    }

    isSupportHtml5Markup = ( function ( ver ) {
        var b = document.createElement( "b" );
        b.innerHTML = "<!--[if IE " + ver + "]><i></i><![endif]-->";
        return b.getElementsByTagName( "i" ).length === 1
    }( 8 ) );

    isIE8 = isSupportHtml5Markup;

    isSupportMediaQuery = window.matchMedia && window.matchMedia( "only all" ) !== null
        && window.matchMedia( "only all" ).matches;

    isSupportES5 = !!Function.prototype.bind;

    isSupportJSON = window.JSON;

    ctxPath = pkuiBasePath.substring( 0, pkuiBasePath.lastIndexOf( "/static" ) );


    // 配置
    seajs.config( {

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
            [ /^(.*\.(?:css|js|tpl))(.*)$/i, '$1?' + timestamp ]
        ],

        // 预加载项
        preload: [
            "_pkui"
            //isSupportES5 ? "" : "es5-sham",
            //isSupportJSON ? "" : "json3",
            //isSupportMediaQuery ? "" : "respond",
        ],

        // 调试模式
        debug: true,

        // Sea.js 的基础路径，由页面指定
        base: pkuiBasePath,

        // 文件编码
        charset: "utf-8"
    } );


    if ( mainJsPath ) {
        seajs.use( mainJsPath );
    } else {
        console.info( "“<script data-main=\"\" src=\"${ctx}/pkui/lib/pkui.js\"></script>”，没有通过“data-main”指定入口文件URL。" );
    }

    if ( isIE8 ) {
        document.write( "<script src='" + pkuiBasePath + "/lib/polyfill/html5shiv/3.7.3/html5shiv.js?" + timestamp + "'></script>" );
        console.info( "O(∩_∩)O~[ IE8 ]：载入 html5shiv.js" );
    }

    // 暴露到名称空间，
    ns.pkuiBasePath = pkuiBasePath;
    ns.ctxPath = ctxPath;
    ns.timestamp = timestamp;
    ns.isIE8 = isIE8;
    ns.isSupportES5 = isSupportES5;
    ns.isSupportJSON = isSupportJSON;
    ns.isSupportMediaQuery = isSupportMediaQuery;

}( window );

/* function loadJS( src, callback ) { var script = document.createElement( 'script' ); var head = document.getElementsByTagName( 'head' )[ 0 ]; var isLoaded; script.src = src; script.charset = "utf-8"; script.onload = script.onreadystatechange = function () { if ( !isLoaded && (!script.readyState || /loaded|complete/.test( script.readyState )) ) { script.onload = script.onreadystatechange = null; isLoaded = true; callback(); } }; head.appendChild( script ); }*/