/*! Sea.js 3.0.0 | seajs.org/LICENSE.md */
!function(a,b){function c(a){return function(b){return{}.toString.call(b)=="[object "+a+"]"}}function d(){return A++}function e(a){return a.match(D)[0]}function f(a){for(a=a.replace(E,"/"),a=a.replace(G,"$1/");a.match(F);)a=a.replace(F,"/");return a}function g(a){var b=a.length-1,c=a.charCodeAt(b);return 35===c?a.substring(0,b):".js"===a.substring(b-2)||a.indexOf("?")>0||47===c?a:a+".js"}function h(a){var b=v.alias;return b&&x(b[a])?b[a]:a}function i(a){var b=v.paths,c;return b&&(c=a.match(H))&&x(b[c[1]])&&(a=b[c[1]]+c[2]),a}function j(a){var b=v.vars;return b&&a.indexOf("{")>-1&&(a=a.replace(I,function(a,c){return x(b[c])?b[c]:a})),a}function k(a){var b=v.map,c=a;if(b)for(var d=0,e=b.length;e>d;d++){var f=b[d];if(c=z(f)?f(a)||a:a.replace(f[0],f[1]),c!==a)break}return c}function l(a,b){var c,d=a.charCodeAt(0);if(J.test(a))c=a;else if(46===d)c=(b?e(b):v.cwd)+a;else if(47===d){var g=v.cwd.match(K);c=g?g[0]+a.substring(1):a}else c=v.base+a;return 0===c.indexOf("//")&&(c=location.protocol+c),f(c)}function m(a,b){if(!a)return"";a=h(a),a=i(a),a=h(a),a=j(a),a=h(a),a=g(a),a=h(a);var c=l(a,b);return c=h(c),c=k(c)}function n(a){return a.hasAttribute?a.src:a.getAttribute("src",4)}function o(a,b,c){var d;try{importScripts(a)}catch(e){d=e}b(d)}function p(a,b,c){var d=Y.createElement("script");if(c){var e=z(c)?c(a):c;e&&(d.charset=e)}q(d,b,a),d.async=!0,d.src=a,bb=d,ab?_.insertBefore(d,ab):_.appendChild(d),bb=null}function q(a,b,c){function d(c){a.onload=a.onerror=a.onreadystatechange=null,v.debug||_.removeChild(a),a=null,b(c)}var e="onload"in a;e?(a.onload=d,a.onerror=function(){C("error",{uri:c,node:a}),d(!0)}):a.onreadystatechange=function(){/loaded|complete/.test(a.readyState)&&d()}}function r(){if(bb)return bb;if(cb&&"interactive"===cb.readyState)return cb;for(var a=_.getElementsByTagName("script"),b=a.length-1;b>=0;b--){var c=a[b];if("interactive"===c.readyState)return cb=c}}function s(a){function b(){l=a.charAt(k++)}function c(){return/\s/.test(l)}function d(){return'"'==l||"'"==l}function e(){var c=k,d=l,e=a.indexOf(d,c);if(-1==e)k=m;else if("\\"!=a.charAt(e-1))k=e+1;else for(;m>k;)if(b(),"\\"==l)k++;else if(l==d)break;o&&(r.push(a.slice(c,k-1)),o=0)}function f(){for(k--;m>k;)if(b(),"\\"==l)k++;else{if("/"==l)break;if("["==l)for(;m>k;)if(b(),"\\"==l)k++;else if("]"==l)break}}function g(){return/[a-z_$]/i.test(l)}function h(){var b=a.slice(k-1),c=/^[\w$]+/.exec(b)[0];p={"if":1,"for":1,"while":1,"with":1}[c],n={"break":1,"case":1,"continue":1,"debugger":1,"delete":1,"do":1,"else":1,"false":1,"if":1,"in":1,"instanceof":1,"return":1,"typeof":1,"void":1}[c],o=/^require\s*\(\s*(['"]).+?\1\s*\)/.test(b),o?(c=/^require\s*\(\s*['"]/.exec(b)[0],k+=c.length-2):k+=/^[\w$]+(?:\s*\.\s*[\w$]+)*/.exec(b)[0].length-1}function i(){return/\d/.test(l)||"."==l&&/\d/.test(a.charAt(k))}function j(){var b=a.slice(k-1),c;c="."==l?/^\.\d+(?:E[+-]?\d*)?\s*/i.exec(b)[0]:/^0x[\da-f]*/i.test(b)?/^0x[\da-f]*\s*/i.exec(b)[0]:/^\d+\.?\d*(?:E[+-]?\d*)?\s*/i.exec(b)[0],k+=c.length-1,n=0}if(-1==a.indexOf("require"))return[];for(var k=0,l,m=a.length,n=1,o=0,p=0,q=[],r=[];m>k;)b(),c()||(d()?(e(),n=1):"/"==l?(b(),"/"==l?(k=a.indexOf("\n",k),-1==k&&(k=a.length)):"*"==l?(k=a.indexOf("*/",k),-1==k?k=m:k+=2):n?(f(),n=0):(k--,n=1)):g()?h():i()?j():"("==l?(q.push(p),n=1):")"==l?n=q.pop():(n="]"!=l,o=0));return r}function t(a,b){this.uri=a,this.dependencies=b||[],this.deps={},this.status=0,this._entry=[]}if(!a.seajs){var u=a.seajs={version:"3.0.0"},v=u.data={},w=c("Object"),x=c("String"),y=Array.isArray||c("Array"),z=c("Function"),A=0,B=v.events={};u.on=function(a,b){var c=B[a]||(B[a]=[]);return c.push(b),u},u.off=function(a,b){if(!a&&!b)return B=v.events={},u;var c=B[a];if(c)if(b)for(var d=c.length-1;d>=0;d--)c[d]===b&&c.splice(d,1);else delete B[a];return u};var C=u.emit=function(a,b){var c=B[a];if(c){c=c.slice();for(var d=0,e=c.length;e>d;d++)c[d](b)}return u},D=/[^?#]*\//,E=/\/\.\//g,F=/\/[^/]+\/\.\.\//,G=/([^:/])\/+\//g,H=/^([^/:]+)(\/.+)$/,I=/{([^{]+)}/g,J=/^\/\/.|:\//,K=/^.*?\/\/.*?\//;u.resolve=m;var L="undefined"==typeof window&&"undefined"!=typeof importScripts&&z(importScripts),M=/^(about|blob):/,N,O,P=!location.href||M.test(location.href)?"":e(location.href);if(L){var Q;try{var R=Error();throw R}catch(S){Q=S.stack.split("\n")}Q.shift();for(var T,U=/.*?((?:http|https|file)(?::\/{2}[\w]+)(?:[\/|\.]?)(?:[^\s"]*)).*?/i,V=/(.*?):\d+:\d+\)?$/;Q.length>0;){var W=Q.shift();if(T=U.exec(W),null!=T)break}var X;if(null!=T)var X=V.exec(T[1])[1];O=X,N=e(X||P),""===P&&(P=N)}else{var Y=document,Z=Y.scripts,$=Y.getElementById("seajsnode")||Z[Z.length-1];O=n($),N=e(O||P)}if(L)u.request=o;else{var Y=document,_=Y.head||Y.getElementsByTagName("head")[0]||Y.documentElement,ab=_.getElementsByTagName("base")[0],bb;u.request=p}var cb,db=u.cache={},eb,fb={},gb={},hb={},ib=t.STATUS={FETCHING:1,SAVED:2,LOADING:3,LOADED:4,EXECUTING:5,EXECUTED:6,ERROR:7};t.prototype.resolve=function(){for(var a=this,b=a.dependencies,c=[],d=0,e=b.length;e>d;d++)c[d]=t.resolve(b[d],a.uri);return c},t.prototype.pass=function(){for(var a=this,b=a.dependencies.length,c=0;c<a._entry.length;c++){for(var d=a._entry[c],e=0,f=0;b>f;f++){var g=a.deps[a.dependencies[f]];g.status<ib.LOADED&&!d.history.hasOwnProperty(g.uri)&&(d.history[g.uri]=!0,e++,g._entry.push(d),g.status===ib.LOADING&&g.pass())}e>0&&(d.remain+=e-1,a._entry.shift(),c--)}},t.prototype.load=function(){var a=this;if(!(a.status>=ib.LOADING)){a.status=ib.LOADING;var c=a.resolve();C("load",c);for(var d=0,e=c.length;e>d;d++)a.deps[a.dependencies[d]]=t.get(c[d]);if(a.pass(),a._entry.length)return a.onload(),b;var f={},g;for(d=0;e>d;d++)g=db[c[d]],g.status<ib.FETCHING?g.fetch(f):g.status===ib.SAVED&&g.load();for(var h in f)f.hasOwnProperty(h)&&f[h]()}},t.prototype.onload=function(){var a=this;a.status=ib.LOADED;for(var b=0,c=(a._entry||[]).length;c>b;b++){var d=a._entry[b];0===--d.remain&&d.callback()}delete a._entry},t.prototype.error=function(){var a=this;a.onload(),a.status=ib.ERROR},t.prototype.exec=function(){function a(b){var d=c.deps[b]||t.get(a.resolve(b));if(d.status==ib.ERROR)throw Error("module was broken: "+d.uri);return d.exec()}var c=this;if(c.status>=ib.EXECUTING)return c.exports;if(c.status=ib.EXECUTING,c._entry&&!c._entry.length&&delete c._entry,!c.hasOwnProperty("factory"))return c.non=!0,b;var e=c.uri;a.resolve=function(a){return t.resolve(a,e)},a.async=function(b,c){return t.use(b,c,e+"_async_"+d()),a};var f=c.factory,g=z(f)?f(a,c.exports={},c):f;return g===b&&(g=c.exports),delete c.factory,c.exports=g,c.status=ib.EXECUTED,C("exec",c),c.exports},t.prototype.fetch=function(a){function c(){u.request(g.requestUri,g.onRequest,g.charset)}function d(a){delete fb[h],gb[h]=!0,eb&&(t.save(f,eb),eb=null);var b,c=hb[h];for(delete hb[h];b=c.shift();)a===!0?b.error():b.load()}var e=this,f=e.uri;e.status=ib.FETCHING;var g={uri:f};C("fetch",g);var h=g.requestUri||f;return!h||gb.hasOwnProperty(h)?(e.load(),b):fb.hasOwnProperty(h)?(hb[h].push(e),b):(fb[h]=!0,hb[h]=[e],C("request",g={uri:f,requestUri:h,onRequest:d,charset:z(v.charset)?v.charset(h)||"utf-8":v.charset}),g.requested||(a?a[g.requestUri]=c:c()),b)},t.resolve=function(a,b){var c={id:a,refUri:b};return C("resolve",c),c.uri||u.resolve(c.id,b)},t.define=function(a,c,d){var e=arguments.length;1===e?(d=a,a=b):2===e&&(d=c,y(a)?(c=a,a=b):c=b),!y(c)&&z(d)&&(c=b===s?[]:s(""+d));var f={id:a,uri:t.resolve(a),deps:c,factory:d};if(!L&&!f.uri&&Y.attachEvent&&b!==r){var g=r();g&&(f.uri=g.src)}C("define",f),f.uri?t.save(f.uri,f):eb=f},t.save=function(a,b){var c=t.get(a);c.status<ib.SAVED&&(c.id=b.id||a,c.dependencies=b.deps||[],c.factory=b.factory,c.status=ib.SAVED,C("save",c))},t.get=function(a,b){return db[a]||(db[a]=new t(a,b))},t.use=function(b,c,d){var e=t.get(d,y(b)?b:[b]);e._entry.push(e),e.history={},e.remain=1,e.callback=function(){for(var b=[],d=e.resolve(),f=0,g=d.length;g>f;f++)b[f]=db[d[f]].exec();c&&c.apply(a,b),delete e.callback,delete e.history,delete e.remain,delete e._entry},e.load()},u.use=function(a,b){return t.use(a,b,v.cwd+"_use_"+d()),u},t.define.cmd={},a.define=t.define,u.Module=t,v.fetchedList=gb,v.cid=d,u.require=function(a){var b=t.get(t.resolve(a));return b.status<ib.EXECUTING&&(b.onload(),b.exec()),b.exports},v.base=N,v.dir=N,v.loader=O,v.cwd=P,v.charset="utf-8",u.config=function(a){for(var b in a){var c=a[b],d=v[b];if(d&&w(d))for(var e in c)d[e]=c[e];else y(d)?c=d.concat(c):"base"===b&&("/"!==c.slice(-1)&&(c+="/"),c=l(c)),v[b]=c}return C("config",a),u}}}(this);

/* seajs-preload */
!function(){var a=seajs.data,b=document;seajs.Module.preload=function(b){var c=a.preload,d=c.length;d?seajs.Module.use(c,function(){c.splice(0,d),seajs.Module.preload(b)},a.cwd+"_preload_"+a.cid()):b()},seajs.use=function(b,c){return seajs.Module.preload(function(){seajs.Module.use(b,c,a.cwd+"_use_"+a.cid())}),seajs},a.preload=function(){var a=[],c=location.search.replace(/(seajs-\w+)(&|$)/g,"$1=1$2");return c+=" "+b.cookie,c.replace(/(seajs-\w+)=1/g,function(b,c){a.push(c)}),a}(),define("seajs/seajs-preload/1.0.0/seajs-preload",[],{})}();

/* seajs-css */
!function(){function a(a){return function(b){return{}.toString.call(b)=="[object "+a+"]"}}function b(a){return"[object Function]"=={}.toString.call(a)}function c(a,c,e,f){var g=u.test(a),h=r.createElement(g?"link":"script");if(e){var i=b(e)?e(a):e;i&&(h.charset=i)}void 0!==f&&h.setAttribute("crossorigin",f),d(h,c,g,a),g?(h.rel="stylesheet",h.href=a):(h.async=!0,h.src=a),p=h,t?s.insertBefore(h,t):s.appendChild(h),p=null}function d(a,b,c,d){function f(){a.onload=a.onerror=a.onreadystatechange=null,c||seajs.data.debug||s.removeChild(a),a=null,b()}var g="onload"in a;return!c||!v&&g?(g?(a.onload=f,a.onerror=function(){seajs.emit("error",{uri:d,node:a}),f()}):a.onreadystatechange=function(){/loaded|complete/.test(a.readyState)&&f()},void 0):(setTimeout(function(){e(a,b)},1),void 0)}function e(a,b){var c,d=a.sheet;if(v)d&&(c=!0);else if(d)try{d.cssRules&&(c=!0)}catch(f){"NS_ERROR_DOM_SECURITY_ERR"===f.name&&(c=!0)}setTimeout(function(){c?b():e(a,b)},20)}function f(a){return a.match(x)[0]}function g(a){for(a=a.replace(y,"/"),a=a.replace(A,"$1/");a.match(z);)a=a.replace(z,"/");return a}function h(a){var b=a.length-1,c=a.charAt(b);return"#"===c?a.substring(0,b):".js"===a.substring(b-2)||a.indexOf("?")>0||".css"===a.substring(b-3)||"/"===c?a:a+".js"}function i(a){var b=w.alias;return b&&q(b[a])?b[a]:a}function j(a){var b,c=w.paths;return c&&(b=a.match(B))&&q(c[b[1]])&&(a=c[b[1]]+b[2]),a}function k(a){var b=w.vars;return b&&a.indexOf("{")>-1&&(a=a.replace(C,function(a,c){return q(b[c])?b[c]:a})),a}function l(a){var c=w.map,d=a;if(c)for(var e=0,f=c.length;f>e;e++){var g=c[e];if(d=b(g)?g(a)||a:a.replace(g[0],g[1]),d!==a)break}return d}function m(a,b){var c,d=a.charAt(0);if(D.test(a))c=a;else if("."===d)c=g((b?f(b):w.cwd)+a);else if("/"===d){var e=w.cwd.match(E);c=e?e[0]+a.substring(1):a}else c=w.base+a;return 0===c.indexOf("//")&&(c=location.protocol+c),c}function n(a,b){if(!a)return"";a=i(a),a=j(a),a=k(a),a=h(a);var c=m(a,b);return c=l(c)}function o(a){return a.hasAttribute?a.src:a.getAttribute("src",4)}var p,q=a("String"),r=document,s=r.head||r.getElementsByTagName("head")[0]||r.documentElement,t=s.getElementsByTagName("base")[0],u=/\.css(?:\?|$)/i,v=+navigator.userAgent.replace(/.*(?:AppleWebKit|AndroidWebKit)\/?(\d+).*/i,"$1")<536;seajs.request=c;var w=seajs.data,x=/[^?#]*\//,y=/\/\.\//g,z=/\/[^/]+\/\.\.\//,A=/([^:/])\/+\//g,B=/^([^/:]+)(\/.+)$/,C=/{([^{]+)}/g,D=/^\/\/.|:\//,E=/^.*?\/\/.*?\//,r=document,F=location.href&&0!==location.href.indexOf("about:")?f(location.href):"",G=r.scripts,H=r.getElementById("seajsnode")||G[G.length-1];f(o(H)||F),seajs.resolve=n,define("seajs/seajs-css/1.0.5/seajs-css",[],{})}();

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
        // "seajs-css": "lib/sea-modules/seajs-css/1.0.0/seajs-css",
        "seajs-text": "lib/sea-modules/seajs-text/1.1.1/seajs-text",

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
        "layer": "lib/layer/3.0.1.x/layer",

        // 模块名"artDialog"已在模块内定义，请勿更改
        "artDialog": "lib/art-dialog/6.0.4.x/dialog-plus",

        // 模板引擎
        "artTemplate": "lib/art-template/3.1.0/template",

        // RSA
        "jsencrypt": "lib/jsencrypt/2.3.1.x/jsencrypt",

        // AOP
        "meld": "lib/meld/1.3.1.x/meld.js",

        // 表格列宽，拖拽调整（被 bootgrid 依赖）
        "colResizable": "lib/jquery/plugin/colResizable/1.6.0/colResizable",

        // bootstrap dropdown menu（被 bootgrid 依赖）
        "bootstrap-dropdown": "lib/jquery/plugin/bootstrap/3.3.6/dropdown",

        // bootgrid
        "bootgrid": "lib/bootgrid/1.3.1.x/jquery.bootgrid",

        // 数据源
        "dataSource": "component/common/dataSource/1.0.0/dataSource.js"
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

    ctxPath = pkuiBasePath.substring( 0, pkuiBasePath.lastIndexOf( "/" ) );


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
            "jquery"
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
        document.write( "<script src='" + pkuiBasePath + "/lib/html5shiv/3.7.3/html5shiv.js?" + timestamp + "'></script>" );
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
seajs.use( [ "jquery" ], function ( $ ) {

    var
        ns = window[ "www.pkusoft.net" ],

        PKUI = {
            // pkui的基本路径
            basePath: ns.pkuiBasePath,
            // CTX路径
            ctxPath: ns.ctxPath,
            // 字典路径
            dicPath: ns.ctxPath + "/static/dic/",
            // 时间戳（版本控制）v=2012-1-1
            timestamp: ns.timestamp,
            // 组件容器
            component: {},
            // 渲染
            render: function () {}
        }
        ;

    if ( location.href.indexOf( "localhost" ) !== -1 ) {
        PKUI.ctxPath = "http://localhost:8080/pkui";
        PKUI.dicPath = "http://localhost:8080/pkui/static/dic/";
    }


    /**
     * 通用功能
     */
    $.extend( PKUI, {
        /**
         * @example
         * public class JsonResult {
         *     private boolean success = false;
         *     private String message = "";
         *     private Object data;
         * }
         */
        handleJsonResult: function ( jsonResult ) {
            if ( typeof jsonResult === "string" ) {
                jsonResult = $.parseJSON( jsonResult );
            }
            // if ( jsonResult.success == false ) {
            //     return false;
            // }
            return jsonResult;
        },
        /**
         * @example
         * public class GridResult {
         *     private boolean success = true;
         *     private int totalRecords = 0;
         *     private List<?> data;
         * }
         */
        handleGridResult: function ( gridResult ) {
            return PKUI.handleJsonResult( gridResult );
        },
        /**
         * 转换树结构
         * @param options {{data: Array, rootId: string, idName: string, parentIdName: string, childrenName: string, filter: Array}}
         * @example
         * PKUI.getTreeList( {
                data: [
                    { menuId: 0, menuName: "系统管理", treeParentId: null },
                    { menuId: 1, menuName: "用户管理", treeParentId: 0 },
                    { menuId: 2, menuName: "单位管理", treeParentId: 0 }
                ],
                rootId: 0,
                idName: "menuId",
                parentIdName: "treeParentId",
                childrenName: "children"
           } );
         返回：
         [
         {
             menuId: 0, menuName: "系统管理", treeParentId: null,
             children: [
                 { menuId: 1, menuName: "用户管理", treeParentId: 0, children: null },
                 { menuId: 2, menuName: "单位管理", treeParentId: 0, children: null }
             ]
         }
         ]
         */
        getTreeList: function getTreeList( options ) {
            var
                data = options.data,
                rootId = options.rootId,
                idName = options.idName || "id",
                parentIdName = options.parentIdName || "parentId",
                childrenName = options.childrenName || "children",
                returnData,
                childrenCollection = {},
                parentId,
                rootList
                ;

            if ( !rootId ) {
                rootId = data[ 0 ][ idName ];
            }


            $.each( data, function ( index, elt ) {
                parentId = elt[ parentIdName ];
                childrenCollection[ parentId ] = childrenCollection[ parentId ] || [];
                childrenCollection[ parentId ].push( elt );
            } );

            rootList = data[ rootId ];

            if ( !$.isArray( rootList ) ) {
                rootList = [ rootList ];
            }

            returnData = fmtData( rootList );

            function fmtData( data ) {
                var list = []
                    ;
                if ( !data || !data.length ) {
                    return null;
                }
                $.each( data, function ( index, elt ) {
                    var record = elt,
                        newRecord
                        ;
                    newRecord = $.extend( {}, record );
                    newRecord[ childrenName ] = fmtData( childrenCollection[ record[ idName ] ] );
                    list.push( newRecord );
                } );
                return list;
            }


            return returnData;

        }
    } );


    // 暴露到全局名称空间
    window.PKUI = PKUI;

} );

/**
 * 自动渲染。
 *
 * 自动渲染时机：
 *
 *      1. DOM树构建完毕
 *      2. 调用 jquery.html( value ) 方法之后
 *      3. 调用 jquery.append( value ) 方法之后
 *      4. 调用 jquery.appendTo( value ) 方法之后
 *      5. 调用 jquery.prepend( value ) 方法之后
 *      6. 调用 jquery.prependTo( value ) 方法之后
 *
 * 渲染的目标（在此列出全部可被自动渲染的组件）：
 *
 *      <div data-pkui-component="datagrid" data-pkui-component-options='{"key":"val",...}' >
 *
 * 已渲染的标志（添加 isrendered="true"）：
 *
 *      <div data-pkui-component="datagrid" isrendered="true">
 */
seajs.use( [ "jquery", "meld" ], function ( $, AOP ) {

    // 1. DOM树构建完毕
    $( document ).ready( render );

    // 2. 调用 jquery.html( value ) 方法之后
    AOP.after( $.prototype, "html", render );

    // 3. 调用 jquery.append( value ) 方法之后
    AOP.after( $.prototype, "append", render );

    // 4. 调用 jquery.appendTo( value ) 方法之后
    AOP.after( $.prototype, "appendTo", render );

    // 5. 调用 jquery.prepend( value ) 方法之后
    AOP.after( $.prototype, "prepend", render );

    // 6. 调用 jquery.prependTo( value ) 方法之后
    AOP.after( $.prototype, "prependTo", render );

    window.PKUI.render = render;

    function render() {
        var
            $component = $( "[data-pkui-component]" )
        ;
        $component.each( function () {
            var
                $this = $( this ),
                componentName = $this.data( "pkui-component" ),
                componentOptions = $this.data( "pkui-component-options" ) || null,
                component = window.PKUI.component[ componentName ],

                moduleId = componentName
            ;

            // 如果没有，则载入，再初始化
            if ( !component ) {
                switch ( componentName ) {
                    case "datagrid": moduleId = "bootgrid"; break;
                }
                seajs.use( [ moduleId ], function () {
                    window.PKUI.component[ componentName ].apply( $this, componentOptions );
                } );
                return;
            }

            component.apply( $this, componentOptions );
        } );
    }


} );
