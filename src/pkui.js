/*! Sea.js 2.3.0 | seajs.org/LICENSE.md */
!function(a,b){function c(a){return function(b){return{}.toString.call(b)=="[object "+a+"]"}}function d(){return z++}function e(a){return a.match(C)[0]}function f(a){for(a=a.replace(D,"/"),a=a.replace(F,"$1/");a.match(E);)a=a.replace(E,"/");return a}function g(a){var b=a.length-1,c=a.charAt(b);return"#"===c?a.substring(0,b):".js"===a.substring(b-2)||a.indexOf("?")>0||"/"===c?a:a+".js"}function h(a){var b=u.alias;return b&&w(b[a])?b[a]:a}function i(a){var b=u.paths,c;return b&&(c=a.match(G))&&w(b[c[1]])&&(a=b[c[1]]+c[2]),a}function j(a){var b=u.vars;return b&&a.indexOf("{")>-1&&(a=a.replace(H,function(a,c){return w(b[c])?b[c]:a})),a}function k(a){var b=u.map,c=a;if(b)for(var d=0,e=b.length;e>d;d++){var f=b[d];if(c=y(f)?f(a)||a:a.replace(f[0],f[1]),c!==a)break}return c}function l(a,b){var c,d=a.charAt(0);if(I.test(a))c=a;else if("."===d)c=f((b?e(b):u.cwd)+a);else if("/"===d){var g=u.cwd.match(J);c=g?g[0]+a.substring(1):a}else c=u.base+a;return 0===c.indexOf("//")&&(c=location.protocol+c),c}function m(a,b){if(!a)return"";a=h(a),a=i(a),a=j(a),a=g(a);var c=l(a,b);return c=k(c)}function n(a){return a.hasAttribute?a.src:a.getAttribute("src",4)}function o(a,b,c){var d=K.createElement("script");if(c){var e=y(c)?c(a):c;e&&(d.charset=e)}p(d,b,a),d.async=!0,d.src=a,R=d,Q?P.insertBefore(d,Q):P.appendChild(d),R=null}function p(a,b,c){function d(){a.onload=a.onerror=a.onreadystatechange=null,u.debug||P.removeChild(a),a=null,b()}var e="onload"in a;e?(a.onload=d,a.onerror=function(){B("error",{uri:c,node:a}),d()}):a.onreadystatechange=function(){/loaded|complete/.test(a.readyState)&&d()}}function q(){if(R)return R;if(S&&"interactive"===S.readyState)return S;for(var a=P.getElementsByTagName("script"),b=a.length-1;b>=0;b--){var c=a[b];if("interactive"===c.readyState)return S=c}}function r(a){var b=[];return a.replace(U,"").replace(T,function(a,c,d){d&&b.push(d)}),b}function s(a,b){this.uri=a,this.dependencies=b||[],this.exports=null,this.status=0,this._waitings={},this._remain=0}if(!a.seajs){var t=a.seajs={version:"2.3.0"},u=t.data={},v=c("Object"),w=c("String"),x=Array.isArray||c("Array"),y=c("Function"),z=0,A=u.events={};t.on=function(a,b){var c=A[a]||(A[a]=[]);return c.push(b),t},t.off=function(a,b){if(!a&&!b)return A=u.events={},t;var c=A[a];if(c)if(b)for(var d=c.length-1;d>=0;d--)c[d]===b&&c.splice(d,1);else delete A[a];return t};var B=t.emit=function(a,b){var c=A[a],d;if(c){c=c.slice();for(var e=0,f=c.length;f>e;e++)c[e](b)}return t},C=/[^?#]*\//,D=/\/\.\//g,E=/\/[^/]+\/\.\.\//,F=/([^:/])\/+\//g,G=/^([^/:]+)(\/.+)$/,H=/{([^{]+)}/g,I=/^\/\/.|:\//,J=/^.*?\/\/.*?\//,K=document,L=location.href&&0!==location.href.indexOf("about:")?e(location.href):"",M=K.scripts,N=K.getElementById("seajsnode")||M[M.length-1],O=e(n(N)||L);t.resolve=m;var P=K.head||K.getElementsByTagName("head")[0]||K.documentElement,Q=P.getElementsByTagName("base")[0],R,S;t.request=o;var T=/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g,U=/\\\\/g,V=t.cache={},W,X={},Y={},Z={},$=s.STATUS={FETCHING:1,SAVED:2,LOADING:3,LOADED:4,EXECUTING:5,EXECUTED:6};s.prototype.resolve=function(){for(var a=this,b=a.dependencies,c=[],d=0,e=b.length;e>d;d++)c[d]=s.resolve(b[d],a.uri);return c},s.prototype.load=function(){var a=this;if(!(a.status>=$.LOADING)){a.status=$.LOADING;var c=a.resolve();B("load",c);for(var d=a._remain=c.length,e,f=0;d>f;f++)e=s.get(c[f]),e.status<$.LOADED?e._waitings[a.uri]=(e._waitings[a.uri]||0)+1:a._remain--;if(0===a._remain)return a.onload(),b;var g={};for(f=0;d>f;f++)e=V[c[f]],e.status<$.FETCHING?e.fetch(g):e.status===$.SAVED&&e.load();for(var h in g)g.hasOwnProperty(h)&&g[h]()}},s.prototype.onload=function(){var a=this;a.status=$.LOADED,a.callback&&a.callback();var b=a._waitings,c,d;for(c in b)b.hasOwnProperty(c)&&(d=V[c],d._remain-=b[c],0===d._remain&&d.onload());delete a._waitings,delete a._remain},s.prototype.fetch=function(a){function c(){t.request(g.requestUri,g.onRequest,g.charset)}function d(){delete X[h],Y[h]=!0,W&&(s.save(f,W),W=null);var a,b=Z[h];for(delete Z[h];a=b.shift();)a.load()}var e=this,f=e.uri;e.status=$.FETCHING;var g={uri:f};B("fetch",g);var h=g.requestUri||f;return!h||Y[h]?(e.load(),b):X[h]?(Z[h].push(e),b):(X[h]=!0,Z[h]=[e],B("request",g={uri:f,requestUri:h,onRequest:d,charset:u.charset}),g.requested||(a?a[g.requestUri]=c:c()),b)},s.prototype.exec=function(){function a(b){return s.get(a.resolve(b)).exec()}var c=this;if(c.status>=$.EXECUTING)return c.exports;c.status=$.EXECUTING;var e=c.uri;a.resolve=function(a){return s.resolve(a,e)},a.async=function(b,c){return s.use(b,c,e+"_async_"+d()),a};var f=c.factory,g=y(f)?f(a,c.exports={},c):f;return g===b&&(g=c.exports),delete c.factory,c.exports=g,c.status=$.EXECUTED,B("exec",c),g},s.resolve=function(a,b){var c={id:a,refUri:b};return B("resolve",c),c.uri||t.resolve(c.id,b)},s.define=function(a,c,d){var e=arguments.length;1===e?(d=a,a=b):2===e&&(d=c,x(a)?(c=a,a=b):c=b),!x(c)&&y(d)&&(c=r(""+d));var f={id:a,uri:s.resolve(a),deps:c,factory:d};if(!f.uri&&K.attachEvent){var g=q();g&&(f.uri=g.src)}B("define",f),f.uri?s.save(f.uri,f):W=f},s.save=function(a,b){var c=s.get(a);c.status<$.SAVED&&(c.id=b.id||a,c.dependencies=b.deps||[],c.factory=b.factory,c.status=$.SAVED,B("save",c))},s.get=function(a,b){return V[a]||(V[a]=new s(a,b))},s.use=function(b,c,d){var e=s.get(d,x(b)?b:[b]);e.callback=function(){for(var b=[],d=e.resolve(),f=0,g=d.length;g>f;f++)b[f]=V[d[f]].exec();c&&c.apply(a,b),delete e.callback},e.load()},t.use=function(a,b){return s.use(a,b,u.cwd+"_use_"+d()),t},s.define.cmd={},a.define=s.define,t.Module=s,u.fetchedList=Y,u.cid=d,t.require=function(a){var b=s.get(s.resolve(a));return b.status<$.EXECUTING&&(b.onload(),b.exec()),b.exports},u.base=O,u.dir=O,u.cwd=L,u.charset="utf-8",t.config=function(a){for(var b in a){var c=a[b],d=u[b];if(d&&v(d))for(var e in c)d[e]=c[e];else x(d)?c=d.concat(c):"base"===b&&("/"!==c.slice(-1)&&(c+="/"),c=l(c)),u[b]=c}return B("config",a),t}}}(this);

!function(){var a=seajs.data,b=document;seajs.Module.preload=function(b){var c=a.preload,d=c.length;d?seajs.Module.use(c,function(){c.splice(0,d),seajs.Module.preload(b)},a.cwd+"_preload_"+a.cid()):b()},seajs.use=function(b,c){return seajs.Module.preload(function(){seajs.Module.use(b,c,a.cwd+"_use_"+a.cid())}),seajs},a.preload=function(){var a=[],c=location.search.replace(/(seajs-\w+)(&|$)/g,"$1=1$2");return c+=" "+b.cookie,c.replace(/(seajs-\w+)=1/g,function(b,c){a.push(c)}),a}(),define("seajs/seajs-preload/1.0.0/seajs-preload",[],{})}();
!function(){function a(a){return function(b){return{}.toString.call(b)=="[object "+a+"]"}}function b(a){return"[object Function]"=={}.toString.call(a)}function c(a,c,e,f){var g=u.test(a),h=r.createElement(g?"link":"script");if(e){var i=b(e)?e(a):e;i&&(h.charset=i)}void 0!==f&&h.setAttribute("crossorigin",f),d(h,c,g,a),g?(h.rel="stylesheet",h.href=a):(h.async=!0,h.src=a),p=h,t?s.insertBefore(h,t):s.appendChild(h),p=null}function d(a,b,c,d){function f(){a.onload=a.onerror=a.onreadystatechange=null,c||seajs.data.debug||s.removeChild(a),a=null,b()}var g="onload"in a;return!c||!v&&g?(g?(a.onload=f,a.onerror=function(){seajs.emit("error",{uri:d,node:a}),f()}):a.onreadystatechange=function(){/loaded|complete/.test(a.readyState)&&f()},void 0):(setTimeout(function(){e(a,b)},1),void 0)}function e(a,b){var c,d=a.sheet;if(v)d&&(c=!0);else if(d)try{d.cssRules&&(c=!0)}catch(f){"NS_ERROR_DOM_SECURITY_ERR"===f.name&&(c=!0)}setTimeout(function(){c?b():e(a,b)},20)}function f(a){return a.match(x)[0]}function g(a){for(a=a.replace(y,"/"),a=a.replace(A,"$1/");a.match(z);)a=a.replace(z,"/");return a}function h(a){var b=a.length-1,c=a.charAt(b);return"#"===c?a.substring(0,b):".js"===a.substring(b-2)||a.indexOf("?")>0||".css"===a.substring(b-3)||"/"===c?a:a+".js"}function i(a){var b=w.alias;return b&&q(b[a])?b[a]:a}function j(a){var b,c=w.paths;return c&&(b=a.match(B))&&q(c[b[1]])&&(a=c[b[1]]+b[2]),a}function k(a){var b=w.vars;return b&&a.indexOf("{")>-1&&(a=a.replace(C,function(a,c){return q(b[c])?b[c]:a})),a}function l(a){var c=w.map,d=a;if(c)for(var e=0,f=c.length;f>e;e++){var g=c[e];if(d=b(g)?g(a)||a:a.replace(g[0],g[1]),d!==a)break}return d}function m(a,b){var c,d=a.charAt(0);if(D.test(a))c=a;else if("."===d)c=g((b?f(b):w.cwd)+a);else if("/"===d){var e=w.cwd.match(E);c=e?e[0]+a.substring(1):a}else c=w.base+a;return 0===c.indexOf("//")&&(c=location.protocol+c),c}function n(a,b){if(!a)return"";a=i(a),a=j(a),a=k(a),a=h(a);var c=m(a,b);return c=l(c)}function o(a){return a.hasAttribute?a.src:a.getAttribute("src",4)}var p,q=a("String"),r=document,s=r.head||r.getElementsByTagName("head")[0]||r.documentElement,t=s.getElementsByTagName("base")[0],u=/\.css(?:\?|$)/i,v=+navigator.userAgent.replace(/.*(?:AppleWebKit|AndroidWebKit)\/?(\d+).*/i,"$1")<536;seajs.request=c;var w=seajs.data,x=/[^?#]*\//,y=/\/\.\//g,z=/\/[^/]+\/\.\.\//,A=/([^:/])\/+\//g,B=/^([^/:]+)(\/.+)$/,C=/{([^{]+)}/g,D=/^\/\/.|:\//,E=/^.*?\/\/.*?\//,r=document,F=location.href&&0!==location.href.indexOf("about:")?f(location.href):"",G=r.scripts,H=r.getElementById("seajsnode")||G[G.length-1];f(o(H)||F),seajs.resolve=n,define("seajs/seajs-css/1.0.5/seajs-css",[],{})}();
!function(){function a(a){h[a.name]=a}function b(a){return a&&h.hasOwnProperty(a)}function c(a){for(var c in h)if(b(c)){var d=","+h[c].ext.join(",")+",";if(d.indexOf(","+a+",")>-1)return c}}function d(a,b){var c=g.XMLHttpRequest?new g.XMLHttpRequest:new g.ActiveXObject("Microsoft.XMLHTTP");return c.open("GET",a,!0),c.onreadystatechange=function(){if(4===c.readyState){if(c.status>399&&c.status<600)throw new Error("Could not load: "+a+", status = "+c.status);b(c.responseText)}},c.send(null)}function e(a){a&&/\S/.test(a)&&(g.execScript||function(a){(g.eval||eval).call(g,a)})(a)}function f(a){return a.replace(/(["\\])/g,"\\$1").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r").replace(/[\u2028]/g,"\\u2028").replace(/[\u2029]/g,"\\u2029")}var g=window,h={},i={};a({name:"text",ext:[".tpl",".html"],exec:function(a,b){e('define("'+a+'#", [], "'+f(b)+'")')}}),a({name:"json",ext:[".json"],exec:function(a,b){e('define("'+a+'#", [], '+b+")")}}),a({name:"handlebars",ext:[".handlebars"],exec:function(a,b){var c=['define("'+a+'#", ["handlebars"], function(require, exports, module) {','  var source = "'+f(b)+'"','  var Handlebars = require("handlebars")["default"]',"  module.exports = function(data, options) {","    options || (options = {})","    options.helpers || (options.helpers = {})","    for (var key in Handlebars.helpers) {","      options.helpers[key] = options.helpers[key] || Handlebars.helpers[key]","    }","    return Handlebars.compile(source)(data, options)","  }","})"].join("\n");e(c)}}),seajs.on("resolve",function(a){var d=a.id;if(!d)return"";var e,f;(f=d.match(/^(\w+)!(.+)$/))&&b(f[1])?(e=f[1],d=f[2]):(f=d.match(/[^?]+(\.\w+)(?:\?|#|$)/))&&(e=c(f[1])),e&&-1===d.indexOf("#")&&(d+="#");var g=seajs.resolve(d,a.refUri);e&&(i[g]=e),a.uri=g}),seajs.on("request",function(a){var b=i[a.uri];b&&(d(a.requestUri,function(c){h[b].exec(a.uri,c),a.onRequest()}),a.requested=!0)}),define("seajs/seajs-text/1.1.1/seajs-text",[],{})}();
/**
 * @file 配置文件
 * @author 吴钦飞(wuqf@pkusoft.net)
 */


// namespace，如果未创建则新建
if ( ! window[ "www.pkusoft.net" ] ) {
    window[ "www.pkusoft.net" ] = {};
}

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
        "IDValidator": "lib/utils/IDValidator/1.3.0.x/IDValidator",

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

        //【lib/jQuery/plugin】bootstrap tab
        "bootstrap-tab": "lib/jquery/plugin/bootstrap/3.3.6/tab",

        //【lib/jQuery/plugin】jquery-mousewheel
        "jquery-mousewheel": "lib/jquery/plugin/mousewheel/3.1.13.x/jquery.mousewheel",

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

        //【lib/component】webuploader
        "webuploader": "lib/component/webuploader/0.1.5.x/webuploader",

        //【lib/component】jstree
        "jstree": "lib/component/jstree/3.3.4.x/jstree",
        "menutree": "lib/component/jstree/3.3.4.x/menutree",

        //【lib/component】intro
        "intro": "lib/component/intro/2.5.0/intro",
        "Intro": "lib/component/intro/2.5.0.x/intro",

        //【lib/component】datepicker
        "datepicker": "lib/component/datepicker/1.7.0.x/datepicker",

        //【lib/component】datetimepicker
        "datetimepicker": "lib/component/datetimepicker/2.5.4.x/datetimepicker",

        //【lib/component】umeditor
        "umeditor": "lib/component/umeditor/1.2.3.x/wrapper",

        //【lib/component】echarts
        "echarts": "lib/component/echarts/3.7.2.x/wrapper",

        //【component/common 】 数据源
        "dataSource": "component/common/dataSource/1.0.0/dataSource",

        //【component/common 】抽屉式弹窗
        "drawer": "component/common/drawer/1.0.0/drawer",

        //【component/common 】对 artTemplate 的封装
        "template": "component/common/template/1.0.0/template",

        //【component/common 】对 artTemplate 的封装
        "loadContent": "component/common/loadContent/1.0.0/loadContent",

        //【component/common 】处理占位符
        "placeholderHandler": "component/common/placeholderHandler/1.0.0/placeholderHandler",

        //【component/common 】文本放大镜
        "textMagnifier": "component/common/textMagnifier/1.0.0/textMagnifier",

        //【component/logic 】datagrid的扩展
        "datagrid-delete": "component/logic/datagridExt/1.0.0/datagrid-delete",

        //【component/logic 】我的消息
        "message": "component/logic/message/1.0.0/message"

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
    } else if ( timestamp === "dev" ) { // 开发模式
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
            "_pkui",
            isSupportES5 ? "" : "es5-shim",
            isSupportJSON ? "" : "json3",
            isSupportMediaQuery ? "" : "respond"
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