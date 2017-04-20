/*! Sea.js 3.0.0 | seajs.org/LICENSE.md */
!function(a,b){function c(a){return function(b){return{}.toString.call(b)=="[object "+a+"]"}}function d(){return A++}function e(a){return a.match(D)[0]}function f(a){for(a=a.replace(E,"/"),a=a.replace(G,"$1/");a.match(F);)a=a.replace(F,"/");return a}function g(a){var b=a.length-1,c=a.charCodeAt(b);return 35===c?a.substring(0,b):".js"===a.substring(b-2)||a.indexOf("?")>0||47===c?a:a+".js"}function h(a){var b=v.alias;return b&&x(b[a])?b[a]:a}function i(a){var b=v.paths,c;return b&&(c=a.match(H))&&x(b[c[1]])&&(a=b[c[1]]+c[2]),a}function j(a){var b=v.vars;return b&&a.indexOf("{")>-1&&(a=a.replace(I,function(a,c){return x(b[c])?b[c]:a})),a}function k(a){var b=v.map,c=a;if(b)for(var d=0,e=b.length;e>d;d++){var f=b[d];if(c=z(f)?f(a)||a:a.replace(f[0],f[1]),c!==a)break}return c}function l(a,b){var c,d=a.charCodeAt(0);if(J.test(a))c=a;else if(46===d)c=(b?e(b):v.cwd)+a;else if(47===d){var g=v.cwd.match(K);c=g?g[0]+a.substring(1):a}else c=v.base+a;return 0===c.indexOf("//")&&(c=location.protocol+c),f(c)}function m(a,b){if(!a)return"";a=h(a),a=i(a),a=h(a),a=j(a),a=h(a),a=g(a),a=h(a);var c=l(a,b);return c=h(c),c=k(c)}function n(a){return a.hasAttribute?a.src:a.getAttribute("src",4)}function o(a,b,c){var d;try{importScripts(a)}catch(e){d=e}b(d)}function p(a,b,c){var d=Y.createElement("script");if(c){var e=z(c)?c(a):c;e&&(d.charset=e)}q(d,b,a),d.async=!0,d.src=a,bb=d,ab?_.insertBefore(d,ab):_.appendChild(d),bb=null}function q(a,b,c){function d(c){a.onload=a.onerror=a.onreadystatechange=null,v.debug||_.removeChild(a),a=null,b(c)}var e="onload"in a;e?(a.onload=d,a.onerror=function(){C("error",{uri:c,node:a}),d(!0)}):a.onreadystatechange=function(){/loaded|complete/.test(a.readyState)&&d()}}function r(){if(bb)return bb;if(cb&&"interactive"===cb.readyState)return cb;for(var a=_.getElementsByTagName("script"),b=a.length-1;b>=0;b--){var c=a[b];if("interactive"===c.readyState)return cb=c}}function s(a){function b(){l=a.charAt(k++)}function c(){return/\s/.test(l)}function d(){return'"'==l||"'"==l}function e(){var c=k,d=l,e=a.indexOf(d,c);if(-1==e)k=m;else if("\\"!=a.charAt(e-1))k=e+1;else for(;m>k;)if(b(),"\\"==l)k++;else if(l==d)break;o&&(r.push(a.slice(c,k-1)),o=0)}function f(){for(k--;m>k;)if(b(),"\\"==l)k++;else{if("/"==l)break;if("["==l)for(;m>k;)if(b(),"\\"==l)k++;else if("]"==l)break}}function g(){return/[a-z_$]/i.test(l)}function h(){var b=a.slice(k-1),c=/^[\w$]+/.exec(b)[0];p={"if":1,"for":1,"while":1,"with":1}[c],n={"break":1,"case":1,"continue":1,"debugger":1,"delete":1,"do":1,"else":1,"false":1,"if":1,"in":1,"instanceof":1,"return":1,"typeof":1,"void":1}[c],o=/^require\s*\(\s*(['"]).+?\1\s*\)/.test(b),o?(c=/^require\s*\(\s*['"]/.exec(b)[0],k+=c.length-2):k+=/^[\w$]+(?:\s*\.\s*[\w$]+)*/.exec(b)[0].length-1}function i(){return/\d/.test(l)||"."==l&&/\d/.test(a.charAt(k))}function j(){var b=a.slice(k-1),c;c="."==l?/^\.\d+(?:E[+-]?\d*)?\s*/i.exec(b)[0]:/^0x[\da-f]*/i.test(b)?/^0x[\da-f]*\s*/i.exec(b)[0]:/^\d+\.?\d*(?:E[+-]?\d*)?\s*/i.exec(b)[0],k+=c.length-1,n=0}if(-1==a.indexOf("require"))return[];for(var k=0,l,m=a.length,n=1,o=0,p=0,q=[],r=[];m>k;)b(),c()||(d()?(e(),n=1):"/"==l?(b(),"/"==l?(k=a.indexOf("\n",k),-1==k&&(k=a.length)):"*"==l?(k=a.indexOf("*/",k),-1==k?k=m:k+=2):n?(f(),n=0):(k--,n=1)):g()?h():i()?j():"("==l?(q.push(p),n=1):")"==l?n=q.pop():(n="]"!=l,o=0));return r}function t(a,b){this.uri=a,this.dependencies=b||[],this.deps={},this.status=0,this._entry=[]}if(!a.seajs){var u=a.seajs={version:"3.0.0"},v=u.data={},w=c("Object"),x=c("String"),y=Array.isArray||c("Array"),z=c("Function"),A=0,B=v.events={};u.on=function(a,b){var c=B[a]||(B[a]=[]);return c.push(b),u},u.off=function(a,b){if(!a&&!b)return B=v.events={},u;var c=B[a];if(c)if(b)for(var d=c.length-1;d>=0;d--)c[d]===b&&c.splice(d,1);else delete B[a];return u};var C=u.emit=function(a,b){var c=B[a];if(c){c=c.slice();for(var d=0,e=c.length;e>d;d++)c[d](b)}return u},D=/[^?#]*\//,E=/\/\.\//g,F=/\/[^/]+\/\.\.\//,G=/([^:/])\/+\//g,H=/^([^/:]+)(\/.+)$/,I=/{([^{]+)}/g,J=/^\/\/.|:\//,K=/^.*?\/\/.*?\//;u.resolve=m;var L="undefined"==typeof window&&"undefined"!=typeof importScripts&&z(importScripts),M=/^(about|blob):/,N,O,P=!location.href||M.test(location.href)?"":e(location.href);if(L){var Q;try{var R=Error();throw R}catch(S){Q=S.stack.split("\n")}Q.shift();for(var T,U=/.*?((?:http|https|file)(?::\/{2}[\w]+)(?:[\/|\.]?)(?:[^\s"]*)).*?/i,V=/(.*?):\d+:\d+\)?$/;Q.length>0;){var W=Q.shift();if(T=U.exec(W),null!=T)break}var X;if(null!=T)var X=V.exec(T[1])[1];O=X,N=e(X||P),""===P&&(P=N)}else{var Y=document,Z=Y.scripts,$=Y.getElementById("seajsnode")||Z[Z.length-1];O=n($),N=e(O||P)}if(L)u.request=o;else{var Y=document,_=Y.head||Y.getElementsByTagName("head")[0]||Y.documentElement,ab=_.getElementsByTagName("base")[0],bb;u.request=p}var cb,db=u.cache={},eb,fb={},gb={},hb={},ib=t.STATUS={FETCHING:1,SAVED:2,LOADING:3,LOADED:4,EXECUTING:5,EXECUTED:6,ERROR:7};t.prototype.resolve=function(){for(var a=this,b=a.dependencies,c=[],d=0,e=b.length;e>d;d++)c[d]=t.resolve(b[d],a.uri);return c},t.prototype.pass=function(){for(var a=this,b=a.dependencies.length,c=0;c<a._entry.length;c++){for(var d=a._entry[c],e=0,f=0;b>f;f++){var g=a.deps[a.dependencies[f]];g.status<ib.LOADED&&!d.history.hasOwnProperty(g.uri)&&(d.history[g.uri]=!0,e++,g._entry.push(d),g.status===ib.LOADING&&g.pass())}e>0&&(d.remain+=e-1,a._entry.shift(),c--)}},t.prototype.load=function(){var a=this;if(!(a.status>=ib.LOADING)){a.status=ib.LOADING;var c=a.resolve();C("load",c);for(var d=0,e=c.length;e>d;d++)a.deps[a.dependencies[d]]=t.get(c[d]);if(a.pass(),a._entry.length)return a.onload(),b;var f={},g;for(d=0;e>d;d++)g=db[c[d]],g.status<ib.FETCHING?g.fetch(f):g.status===ib.SAVED&&g.load();for(var h in f)f.hasOwnProperty(h)&&f[h]()}},t.prototype.onload=function(){var a=this;a.status=ib.LOADED;for(var b=0,c=(a._entry||[]).length;c>b;b++){var d=a._entry[b];0===--d.remain&&d.callback()}delete a._entry},t.prototype.error=function(){var a=this;a.onload(),a.status=ib.ERROR},t.prototype.exec=function(){function a(b){var d=c.deps[b]||t.get(a.resolve(b));if(d.status==ib.ERROR)throw Error("module was broken: "+d.uri);return d.exec()}var c=this;if(c.status>=ib.EXECUTING)return c.exports;if(c.status=ib.EXECUTING,c._entry&&!c._entry.length&&delete c._entry,!c.hasOwnProperty("factory"))return c.non=!0,b;var e=c.uri;a.resolve=function(a){return t.resolve(a,e)},a.async=function(b,c){return t.use(b,c,e+"_async_"+d()),a};var f=c.factory,g=z(f)?f(a,c.exports={},c):f;return g===b&&(g=c.exports),delete c.factory,c.exports=g,c.status=ib.EXECUTED,C("exec",c),c.exports},t.prototype.fetch=function(a){function c(){u.request(g.requestUri,g.onRequest,g.charset)}function d(a){delete fb[h],gb[h]=!0,eb&&(t.save(f,eb),eb=null);var b,c=hb[h];for(delete hb[h];b=c.shift();)a===!0?b.error():b.load()}var e=this,f=e.uri;e.status=ib.FETCHING;var g={uri:f};C("fetch",g);var h=g.requestUri||f;return!h||gb.hasOwnProperty(h)?(e.load(),b):fb.hasOwnProperty(h)?(hb[h].push(e),b):(fb[h]=!0,hb[h]=[e],C("request",g={uri:f,requestUri:h,onRequest:d,charset:z(v.charset)?v.charset(h)||"utf-8":v.charset}),g.requested||(a?a[g.requestUri]=c:c()),b)},t.resolve=function(a,b){var c={id:a,refUri:b};return C("resolve",c),c.uri||u.resolve(c.id,b)},t.define=function(a,c,d){var e=arguments.length;1===e?(d=a,a=b):2===e&&(d=c,y(a)?(c=a,a=b):c=b),!y(c)&&z(d)&&(c=b===s?[]:s(""+d));var f={id:a,uri:t.resolve(a),deps:c,factory:d};if(!L&&!f.uri&&Y.attachEvent&&b!==r){var g=r();g&&(f.uri=g.src)}C("define",f),f.uri?t.save(f.uri,f):eb=f},t.save=function(a,b){var c=t.get(a);c.status<ib.SAVED&&(c.id=b.id||a,c.dependencies=b.deps||[],c.factory=b.factory,c.status=ib.SAVED,C("save",c))},t.get=function(a,b){return db[a]||(db[a]=new t(a,b))},t.use=function(b,c,d){var e=t.get(d,y(b)?b:[b]);e._entry.push(e),e.history={},e.remain=1,e.callback=function(){for(var b=[],d=e.resolve(),f=0,g=d.length;g>f;f++)b[f]=db[d[f]].exec();c&&c.apply(a,b),delete e.callback,delete e.history,delete e.remain,delete e._entry},e.load()},u.use=function(a,b){return t.use(a,b,v.cwd+"_use_"+d()),u},t.define.cmd={},a.define=t.define,u.Module=t,v.fetchedList=gb,v.cid=d,u.require=function(a){var b=t.get(t.resolve(a));return b.status<ib.EXECUTING&&(b.onload(),b.exec()),b.exports},v.base=N,v.dir=N,v.loader=O,v.cwd=P,v.charset="utf-8",u.config=function(a){for(var b in a){var c=a[b],d=v[b];if(d&&w(d))for(var e in c)d[e]=c[e];else y(d)?c=d.concat(c):"base"===b&&("/"!==c.slice(-1)&&(c+="/"),c=l(c)),v[b]=c}return C("config",a),u}}}(this);

!function(){var a=seajs.data,b=document;seajs.Module.preload=function(b){var c=a.preload,d=c.length;d?seajs.Module.use(c,function(){c.splice(0,d),seajs.Module.preload(b)},a.cwd+"_preload_"+a.cid()):b()},seajs.use=function(b,c){return seajs.Module.preload(function(){seajs.Module.use(b,c,a.cwd+"_use_"+a.cid())}),seajs},a.preload=function(){var a=[],c=location.search.replace(/(seajs-\w+)(&|$)/g,"$1=1$2");return c+=" "+b.cookie,c.replace(/(seajs-\w+)=1/g,function(b,c){a.push(c)}),a}(),define("seajs/seajs-preload/1.0.0/seajs-preload",[],{})}();
!function(){function a(a){return function(b){return{}.toString.call(b)=="[object "+a+"]"}}function b(a){return"[object Function]"=={}.toString.call(a)}function c(a,c,e,f){var g=u.test(a),h=r.createElement(g?"link":"script");if(e){var i=b(e)?e(a):e;i&&(h.charset=i)}void 0!==f&&h.setAttribute("crossorigin",f),d(h,c,g,a),g?(h.rel="stylesheet",h.href=a):(h.async=!0,h.src=a),p=h,t?s.insertBefore(h,t):s.appendChild(h),p=null}function d(a,b,c,d){function f(){a.onload=a.onerror=a.onreadystatechange=null,c||seajs.data.debug||s.removeChild(a),a=null,b()}var g="onload"in a;return!c||!v&&g?(g?(a.onload=f,a.onerror=function(){seajs.emit("error",{uri:d,node:a}),f()}):a.onreadystatechange=function(){/loaded|complete/.test(a.readyState)&&f()},void 0):(setTimeout(function(){e(a,b)},1),void 0)}function e(a,b){var c,d=a.sheet;if(v)d&&(c=!0);else if(d)try{d.cssRules&&(c=!0)}catch(f){"NS_ERROR_DOM_SECURITY_ERR"===f.name&&(c=!0)}setTimeout(function(){c?b():e(a,b)},20)}function f(a){return a.match(x)[0]}function g(a){for(a=a.replace(y,"/"),a=a.replace(A,"$1/");a.match(z);)a=a.replace(z,"/");return a}function h(a){var b=a.length-1,c=a.charAt(b);return"#"===c?a.substring(0,b):".js"===a.substring(b-2)||a.indexOf("?")>0||".css"===a.substring(b-3)||"/"===c?a:a+".js"}function i(a){var b=w.alias;return b&&q(b[a])?b[a]:a}function j(a){var b,c=w.paths;return c&&(b=a.match(B))&&q(c[b[1]])&&(a=c[b[1]]+b[2]),a}function k(a){var b=w.vars;return b&&a.indexOf("{")>-1&&(a=a.replace(C,function(a,c){return q(b[c])?b[c]:a})),a}function l(a){var c=w.map,d=a;if(c)for(var e=0,f=c.length;f>e;e++){var g=c[e];if(d=b(g)?g(a)||a:a.replace(g[0],g[1]),d!==a)break}return d}function m(a,b){var c,d=a.charAt(0);if(D.test(a))c=a;else if("."===d)c=g((b?f(b):w.cwd)+a);else if("/"===d){var e=w.cwd.match(E);c=e?e[0]+a.substring(1):a}else c=w.base+a;return 0===c.indexOf("//")&&(c=location.protocol+c),c}function n(a,b){if(!a)return"";a=i(a),a=j(a),a=k(a),a=h(a);var c=m(a,b);return c=l(c)}function o(a){return a.hasAttribute?a.src:a.getAttribute("src",4)}var p,q=a("String"),r=document,s=r.head||r.getElementsByTagName("head")[0]||r.documentElement,t=s.getElementsByTagName("base")[0],u=/\.css(?:\?|$)/i,v=+navigator.userAgent.replace(/.*(?:AppleWebKit|AndroidWebKit)\/?(\d+).*/i,"$1")<536;seajs.request=c;var w=seajs.data,x=/[^?#]*\//,y=/\/\.\//g,z=/\/[^/]+\/\.\.\//,A=/([^:/])\/+\//g,B=/^([^/:]+)(\/.+)$/,C=/{([^{]+)}/g,D=/^\/\/.|:\//,E=/^.*?\/\/.*?\//,r=document,F=location.href&&0!==location.href.indexOf("about:")?f(location.href):"",G=r.scripts,H=r.getElementById("seajsnode")||G[G.length-1];f(o(H)||F),seajs.resolve=n,define("seajs/seajs-css/1.0.5/seajs-css",[],{})}();
!function(){function a(a){h[a.name]=a}function b(a){return a&&h.hasOwnProperty(a)}function c(a){for(var c in h)if(b(c)){var d=","+h[c].ext.join(",")+",";if(d.indexOf(","+a+",")>-1)return c}}function d(a,b){var c=g.XMLHttpRequest?new g.XMLHttpRequest:new g.ActiveXObject("Microsoft.XMLHTTP");return c.open("GET",a,!0),c.onreadystatechange=function(){if(4===c.readyState){if(c.status>399&&c.status<600)throw new Error("Could not load: "+a+", status = "+c.status);b(c.responseText)}},c.send(null)}function e(a){a&&/\S/.test(a)&&(g.execScript||function(a){(g.eval||eval).call(g,a)})(a)}function f(a){return a.replace(/(["\\])/g,"\\$1").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r").replace(/[\u2028]/g,"\\u2028").replace(/[\u2029]/g,"\\u2029")}var g=window,h={},i={};a({name:"text",ext:[".tpl",".html"],exec:function(a,b){e('define("'+a+'#", [], "'+f(b)+'")')}}),a({name:"json",ext:[".json"],exec:function(a,b){e('define("'+a+'#", [], '+b+")")}}),a({name:"handlebars",ext:[".handlebars"],exec:function(a,b){var c=['define("'+a+'#", ["handlebars"], function(require, exports, module) {','  var source = "'+f(b)+'"','  var Handlebars = require("handlebars")["default"]',"  module.exports = function(data, options) {","    options || (options = {})","    options.helpers || (options.helpers = {})","    for (var key in Handlebars.helpers) {","      options.helpers[key] = options.helpers[key] || Handlebars.helpers[key]","    }","    return Handlebars.compile(source)(data, options)","  }","})"].join("\n");e(c)}}),seajs.on("resolve",function(a){var d=a.id;if(!d)return"";var e,f;(f=d.match(/^(\w+)!(.+)$/))&&b(f[1])?(e=f[1],d=f[2]):(f=d.match(/[^?]+(\.\w+)(?:\?|#|$)/))&&(e=c(f[1])),e&&-1===d.indexOf("#")&&(d+="#");var g=seajs.resolve(d,a.refUri);e&&(i[g]=e),a.uri=g}),seajs.on("request",function(a){var b=i[a.uri];b&&(d(a.requestUri,function(c){h[b].exec(a.uri,c),a.onRequest()}),a.requested=!0)}),define("seajs/seajs-text/1.1.1/seajs-text",[],{})}();
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

        //【lib/component】webuploader
        "webuploader": "lib/component/webuploader/0.1.5.x/webuploader",

        //【lib/component】jstree
        "jstree": "lib/component/jstree/3.3.4.x/jstree",
        "menutree": "lib/component/jstree/3.3.4.x/menutree",

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