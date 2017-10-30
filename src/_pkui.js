/**
 * @fileoverview PKUI 核心模块
 *
 *      1. 预加载必须的模块和样式文件
 *      2. 其他的处理
 *
 * @author 吴钦飞（wuqf@pkusoft.net）
 * @link https://github.com/forwardNow/pkui/releases/
 * @version 1.3.0
 */
define( function ( require ) {
    "use strict";

    require( "isLoading" );

    require( "css/font/font-awesome/4.7.0/font-awesome.css" );

    require( "layer" );
    require( "lib/component/layer/3.0.1.x/skin/default/layer.css" );

    require( "moment-local-zh" );

    require( "bootstrap-tooltip" );

    require( "bootstrap-dropdown" );

    var
        $ = require( "jquery" ),

        PlaceholderHandler = require( "placeholderHandler" ),

        AOP = require( "meld" ),

        moment = require( "moment" ),

        ArtTemplate = require( "artTemplate" ),

        DataSource = require( "dataSource" ),

        ns = window[ "www.pkusoft.net" ],

        $doc = $( window.document ),

        PKUI = {

            // 是否为开发模式
            isDevMode: false,

            // 标识组件类型的HTML属性：<div data-pkui-component>
            componentHtmlAttr: "pkui-component",

            // 标识组件参数的HTML属性：<div data-pkui-component-options>
            componentOptionsHtmlAttr: "pkui-component-options",

            // CTX路径：${ ctx }（http://localhost:8080/projname）
            ctxPath: ns.ctxPath,

            // pkui的基本路径：${ ctx }/static/pkui
            basePath: ns.pkuiBasePath,

            // icon的基本路径：${ ctx }/static/images/icons/16x16
            iconPath: ns.ctxPath + "/static/images/icons/16x16",

            // 字典路径：${ ctx }/static/dic/
            dicPath: ns.ctxPath + "/static/dic/",

            // 时间戳（版本控制）v=2012-1-1
            timestamp: ns.timestamp,

            // 组件容器
            component: {},

            // 数据表格使用预定义格式化器 dateFormatter 时，指定日期值格式化的模式
            datagridDateFormat: "YYYY-MM-DD",
            // 数据表格使用预定义格式化器 datetimeFormatter 时，指定日期时间值格式化的模式
            datagridDatetimeFormat: "YYYY-MM-DD HH:mm:ss",

            // 是否格式化发送到服务器的日期（时间）值，针对 form（PKUI组件）
            isFormatDateInputField: true,
            // 服务器获取到的日期（时间）值格式
            formattedInputFieldPattern: "YYYYMMDDHHmmss",

            // 自动渲染标志
            isAutoRender: true,

            // 是否正在渲染
            __isrendering: false,
            // 渲染次数（render()被调用的次数）
            __renderedTimes: 0,

            isIE8: ns.isIE8,

            version: "1.3.0"

        }
        ;

    var
        handleSeajsBugInIE8Timer
    ;



    /**
     * 控制台打印
     * @type {{info: info, warn: warn, error: error}}
     */
    PKUI.console = {
        info: function ( message, isShow ) {
            console.info( message );
            if ( isShow ) {
                window.layer.msg( message );
            }
        },
        warn: function ( message, isShow ) {
            console.warn( message );
            if ( isShow ) {
                window.layer.msg( message );
            }
        },
        error: function ( message, isShow ) {
            console.error( message );
            if ( isShow ) {
                window.layer.msg( message );
            }
        }
    };

    /**
     * 初始化
     */
    $.extend( PKUI, {
        _init: function () {

            // 暴露到全局名称空间
            window.PKUI = PKUI;

            // 判断是否为开发模式
            this._distinguishMode();

            // 处理低版本IE
            this._handleLowVersionIE();

            // 注册在当前模块中使用的组件
            this._registerComponent();

            // 全局的事件绑定
            this._bindEvent();

            // 修改浏览器的原生方法（如 alert ）
            this._modifyBrowserMethod();

            // 配置ajax的默认参数
            this._setAjaxDefaultOptions();

            // 处理 __CTX__
            this._convertCtxPath();

            // 模板helper
            this._setTemplateHelper();

            // 预设 bootgrid 的formatter
            this._setBootgridFormatter();

            // 设置自动渲染
            this.setAutoRender( this.isAutoRender );
        },

        /**
         * 判断是否为开发模式
         */
        _distinguishMode: function () {
            var
                pattern = /^http(s)?:\/\/localhost/
            ;
            PKUI.isDevMode = pattern.test( PKUI.ctxPath );
        },

        /**
         * 处理低版本IE
         */
        _handleLowVersionIE: function () {
            var
                div = document.createElement('div')
            ;
            div.innerHTML = '<!--[if lt IE 8]><i></i><![endif]-->';
            if ( div.getElementsByTagName( "i" ).length > 0 ) {
                $( document.body ).append(
                    '<div class="alert alert-warning text-center" style="position:fixed; z-index: 99999; top: 0; left: 0; width: 100%;">'
                  +     '很抱歉，您的IE浏览器版本过低，在您的使用过程中会带来一些不好的体验。建议您使用IE8及以上版本，或使用其他现代浏览器。'
                  + '</div>'
                );
            }
        },
        /**
         * 注册在当前模块中使用的组件
         */
        _registerComponent: function () {
            // DataSource
            PKUI.component.DataSource = DataSource;
            DataSource.init();
        },
        /**
         * 绑定事件
         */
        _bindEvent: function () {
            var
                originErrorHandler
            ;
            // IE8时，处理error
            if ( ns.isIE8 ) {

                originErrorHandler = window.onerror;

                window.onerror = function () {

                    // layer.msg( "有未处理的异常！" );

                    if ( handleSeajsBugInIE8Timer ) {
                        return;
                    }

                    handleSeajsBugInIE8Timer = window.setTimeout( function() {

                        // 清除 beforeunload，避免出现弹框。
                        $( window ).off( "beforeunload" );

                        window.layer.alert(
                            "您正在使用的IE8，未能正确载入脚本文件，请刷新页面！（2秒后自动刷新。）",
                            {
                                title: "提示",
                                btn: ['刷新'], //按钮
                                icon : 2,
                                time: 2400,
                                end: function() {
                                    layer.msg("refresh");
                                    window.location.reload();
                                }
                            },
                            // 确认
                            function( index ){
                                layer.close( index );
                                window.location.reload();
                            }
                        );
                        window.onerror = originErrorHandler;
                    }, 300 );

                };
                // 4秒后，如果没有error，则删除掉handler
                window.setTimeout( function() {
                    window.onerror = originErrorHandler;
                }, 4 * 1000 );
            }

            // DOM树构建完毕，执行一次渲染
            $doc.ready( PKUI.render );
        },
        /**
         * 修改浏览器的原生方法（如 alert ）
         */
        _modifyBrowserMethod: function () {
            window.__alert = window.alert;
            window.alert = window.layer.alert;
        },
        /**
         * 设置Ajax的默认参数
         */
        _setAjaxDefaultOptions: function () {
            // 默认参数设置
            $.ajaxSetup( {
                type: "POST",   // 1.9.0 版本使用 "type"
                method: "POST", // 1.9.0 版本后用 "method"
                dataType: "json",
                //请求失败遇到异常触发
                error: function ( xhr ) {

                    // 处理IE8下，seajs的使用bug
                    if ( ns.isIE8 ) {
                        if ( handleSeajsBugInIE8Timer && handleSeajsBugInIE8Timer !== true ) {
                            window.clearTimeout( handleSeajsBugInIE8Timer );
                        } else {
                            handleSeajsBugInIE8Timer = true; // 可能是登陆失效引起的错误。
                        }
                    }

                    var msg = "Ajax请求失败：" + xhr.status + " (" + xhr.statusText + ")。请刷新网页，如果依旧存在此提示，请联系管理员。";
                    // window.layer.alert( msg, { icon: 0 } );
                    // $.error( msg );
                    console.error( msg );

                    if ( xhr.status === 0 ) {
                        console.info(
                            "可能原因："
                            + "1、url不存在；"
                            + "2、url不可达；"
                            + "3、发送了跨域请求；"
                            + "4、数据格式错；"
                            + "5、ajax在完成之前请求已经被取消（ajax请求没有发出），"
                            + "例如：页面已经跳转或跳转太快、浏览器输入新的url、按钮立即新的点击等。"
                        );
                    }
                }
            } );
        },
        /**
         * 转换 __CTX__ 为 PKUI.ctxPath，转换情景：
         * 1. 使用 $.ajax( { url: "__CTX__/..." } )
         * 2. 使用 $jq.html( "....__CTX__..." )
         */
        _convertCtxPath: function () {
            var
                originHtmlMethod = $.fn.html,
                originAjaxMethod = $.ajax
            ;

            $.ajax = function ( url, options ) {


                // 正则添加".*"是为了解决被当成相对路径时，自动拼接的前缀。
                if ( typeof url === "string" ) {
                    url = PlaceholderHandler.process( url );
                    url = processAjaxUrl( url );
                }
                else if ( typeof url === "object" && url.hasOwnProperty( "url" ) ) {
                    url.url = PlaceholderHandler.process( url.url );
                    url.url = processAjaxUrl( url.url );
                }
                return originAjaxMethod.call( this, url, options );
            };

            function processAjaxUrl( url ) {
                if ( typeof url !== "string" ) {
                    console.error( "[" + url + "] 不是字符串" );
                    return url;
                }
                return url.replace( /.*__CTX__/, PKUI.ctxPath );
            }

            $.fn.html = function ( value ) {

                // 没有传值
                if ( value === undefined ) {
                    return originHtmlMethod.call( this );
                }

                // 字符串
                if ( typeof value === "string" ) {
                    value = PlaceholderHandler.process( value );
                    value = value.replace( /__CTX__/gm, PKUI.ctxPath );
                }

                return originHtmlMethod.call( this, value );

            }
        },
        /**
         * 模板helper
         * @example
         * {{addTime | dateFormat : "YYYY年MM月DD日 HH时mm分ss秒"}}
         * {{parentDeptId | dicValue: "DIC_DEPT" }}
         */
        _setTemplateHelper: function () {
            // 类比 <pku:dicValue>
            ArtTemplate.helper( "dicValue", function ( code, dicName ) {
                return DataSource.getDicValue( dicName, code );
            } );
            ArtTemplate.helper( "dateFormat", function ( date, format ) {
                var
                    momentInstance
                ;
                if ( typeof date === "number" ) {
                    momentInstance = moment( date );
                } else if ( typeof date === "string" ) {
                    momentInstance = moment( date, [ "YYYYMMDDHHmmss", "YYYY-MM-DD HH:mm:ss", "YYYY/MM/DD HH:mm:ss" ] );
                }

                format = format || "YYYY-MM-DD";

                return momentInstance.format( format );
            } );
            ArtTemplate.helper( "iconFormat", function ( icon, imageSize ) {
                var style, url;
                if ( !icon ) {
                    return "";
                }
                // font icon
                if ( icon.indexOf( "fa-" ) !== -1 ) {
                    return '<i class="' + icon + '"></i>';
                }
                if ( icon.indexOf( ".png" ) !== -1 ) {
                    imageSize = parseInt( imageSize ) || 24;
                    url = PKUI.iconPath + "/" + icon;
                    style = "background-image: url(" + url + "); width: " + imageSize + "px; height: " + imageSize + "px;";
                    return '<span class="pkui-icon-image" style="' + style + '"></span>';
                }
                return "";
            } );
        },
        /**
         * 预设 bootgrid formatter
         * @example
         * <th data-column-id="addTime"  data-formatter="dateFormatter" >录入时间</th>
         */
        _setBootgridFormatter: function () {
            PKUI.bootgridFormatter = {
                // 日期 转 格式化后的年月日
                dateFormatter: function ( column, row ) {
                    var
                        date = row[ column.id ],
                        momentInstance
                    ;
                    if ( !date ) {
                        return "";
                    }
                    if ( typeof date === "number" ) {
                        momentInstance = moment( date );
                    } else if ( typeof date === "string" ) {
                        momentInstance = moment( date, [ "YYYYMMDDHHmmss", "YYYY-MM-DD HH:mm:ss", "YYYY/MM/DD HH:mm:ss" ] );
                    }

                    return momentInstance.format( PKUI.datagridDateFormat )
                },
                // 日期 转 格式化后的年月日时分秒
                datetimeFormatter: function ( column, row ) {
                    var
                        date = row[ column.id ],
                        momentInstance
                    ;
                    if ( !date ) {
                        return "";
                    }
                    if ( typeof date === "number" ) {
                        momentInstance = moment( date );
                    } else if ( typeof date === "string" ) {
                        momentInstance = moment( date, [ "YYYYMMDDHHmmss", "YYYY-MM-DD HH:mm:ss", "YYYY/MM/DD HH:mm:ss" ] );
                    }

                    return momentInstance.format( PKUI.datagridDatetimeFormat )
                },
                // 标志状态（正常/停用）
                statusFormatter: function ( column, row ) {
                    var
                        status = row[ column.id ]
                        ;
                    // 正常
                    if ( status === "1" ) {
                        return '<span class="text-success"><i class="fa fa-circle"></i> 正常</span>';
                    }
                    // 停用
                    else if ( status === "0" ) {
                        return '<span class="text-danger"><i class="fa fa-circle"></i> 停用</span>';
                    }
                    else {
                        return "";
                    }
                },
                // 标志状态（是/否）
                yesOrNoFormatter: function ( column, row ) {
                    var
                        status = row[ column.id ]
                        ;
                    // 正常
                    if ( status === "1" ) {
                        return '<span class="text-success"><i class="fa fa-circle"></i> 是</span>';
                    }
                    // 停用
                    else if ( status === "0" ) {
                        return '<span class="text-danger"><i class="fa fa-circle"></i> 否</span>';
                    }
                    else {
                        return "";
                    }
                }
            }
        },
        /**
         * 添加 tooltip
         */
        _addTooltip: function () {
            var
                $target,
                timeout = 4
            ;
            // 如果在执行该方法，则退出
            if ( this._isPending ) {
                return;
            }
            this._isPending = true;

            $target = $( '[title]' ).not( function () {
                return ! $.trim( $( this ).attr( "title" ) );
            } );

            $target.bsTooltip( {
                container: "body",
                delay: 300,
                placement: "auto top"
            } );

            // 指定 timeout 时间后，隐藏
            $target
                .off( "show.bs.tooltip" ).on( "show.bs.tooltip", function () {
                    var $this = $( this ),
                        timeoutId = $this.data( "timeoutId" )
                        ;
                    if ( timeoutId ) {
                        window.clearTimeout( timeoutId );
                    }
                    timeoutId = setTimeout( function () {
                        $this.bsTooltip( "hide" );
                        // 如果原生的删不掉，则清除所有的 tooltip
                        if ( ! $this.data('bs.tooltip') ) {
                            $( "body > .bs-tooltip" ).remove();
                        }
                    }, timeout * 1000 );
                    $this.data( "timeoutId", timeoutId );
                } )
                .off( "hide.bs.tooltip" ).on( "hide.bs.tooltip", function () {
                    var $this = $( this ),
                        timeoutId = $this.data( "timeoutId" )
                        ;
                    if ( timeoutId ) {
                        window.clearTimeout( timeoutId );
                    }
                });

            this._isPending = false;
        }
    } );


    /**
     * 核心功能
     */
    $.extend( PKUI, {

        // 载入模块（seajs.use方法的别名）
        load: seajs.use,

        /**
         * 渲染。
         *
         * 渲染的目标：
         *      // datagrid
         *      <div data-pkui-component="datagrid"
         *           data-pkui-component-options='{"key":"val",...}' >
         *
         *      // drawer
         *      <div data-pkui-component="drawer" ...></div>
         *
         *      // form|validator
         *      <div data-pkui-component="form|validator" ...></div>
         *
         *
         * 已渲染的标志（添加 isrendered="true"）：
         *
         *      <div data-pkui-component="datagrid" isrendered="true">
         *
         *      渲染标志的添加由组件自身添加
         *
         * 不识别的组件（添加 notrecognized="not reg"）
         *
         *      <div data-pkui-component="xxx" notrecognized="not reg">
         */
        render: function () {
            var
                $component = $( "[data-" + PKUI.componentHtmlAttr + "]" )
                    .not('[isrendered]')
                    .not( "[notrecognized='not reg']" )

                ;

            // 添加 tooltip
            PKUI._addTooltip();

            try {

                // 找不到标识为组件的
                if ( $component.size() === 0 ) {
                    return;
                }
                // 正在渲染时
                if ( PKUI.__isrendering ) {
                    console.info( moment().format( "YYYY年MM月DD日 HH:MM:SS" ), "正在渲染..." );
                    return;
                }

                PKUI.__isrendering = true;


                PKUI.__renderedTimes++;
                console.info( moment().format( "YYYY年MM月DD日 HH:MM:SS" ), "渲染次数：" + PKUI.__renderedTimes);

                $component.each( function () {
                    var
                        $this = $( this ),
                        componentName = $this.data( PKUI.componentHtmlAttr ),
                        // string
                        componentOptions = $this.attr( "data-" + PKUI.componentOptionsHtmlAttr ) || null,
                        componentNameList
                        ;

                    // 替换 __CTX__ 和 占位符
                    if ( componentOptions ) {
                        componentOptions = PlaceholderHandler.process( componentOptions );
                        componentOptions = componentOptions.replace( /__CTX__/gm, PKUI.ctxPath );
                    }

                    // json
                    componentOptions = $.parseJSON( componentOptions ) || {};

                    if ( $.trim( componentName ) === "" ) {
                        return ;
                    }

                    if ( componentName.indexOf( "|" ) !== -1 ) {
                        componentNameList = componentName.split( "|" );
                    } else {
                        componentNameList = [ componentName ];
                    }

                    if ( ! $.isArray( componentOptions ) ) {
                        componentOptions = [ componentOptions ];
                    }

                    $.each( componentNameList, function( index, componentName ) {
                        var
                            options = componentOptions[ index ] || {},
                            component = PKUI.component[ $.trim( componentName ) ],
                            moduleId = componentName
                            ;
                        // 如果没有注册该组件，则载入，再初始化
                        if ( !component ) {
                            switch ( componentName ) {
                                case "datagrid":
                                    moduleId = "bootgrid";
                                    break;
                                case "bootgrid":
                                    moduleId = "bootgrid";
                                    break;
                                case "datagrid-delete":
                                    moduleId = "datagrid-delete";
                                    break;
                                case "drawer":
                                    moduleId = "drawer";
                                    break;
                                case "form":
                                    moduleId = "form";
                                    break;
                                case "validator":
                                    moduleId = "validator";
                                    break;
                                case "chosen":
                                    moduleId = "chosen";
                                    break;
                                case "webuploader":
                                    moduleId = "webuploader";
                                    break;
                                case "menuTree":
                                    moduleId = "menutree";
                                    break;
                                case "Intro":
                                    moduleId = "Intro";
                                    break;
                                case "loadContent":
                                    moduleId = "loadContent";
                                    break;
                                case "datepicker":
                                    moduleId = "datepicker";
                                    break;
                                case "datetimepicker":
                                    moduleId = "datetimepicker";
                                    break;
                                case "textMagnifier":
                                    moduleId = "textMagnifier";
                                    break;
                                case "umeditor":
                                    moduleId = "umeditor";
                                    break;
                                case "message":
                                    moduleId = "message";
                                    break;
                                default:
                                    var errorMessage = "未被注册的组件[" + componentName + "]";
                                    console.info( moment().format("YYYY年MM月DD日 HH:MM:SS") + " " + errorMessage );
                                    window.layer.msg( errorMessage );
                                    $this.attr( "notrecognized", "not reg" );
                                    return;
                            }
                            require.async( [ moduleId ], function () {
                                PKUI.component[ $.trim( componentName ) ].call( $this, options );
                            } );
                        }
                        // 如果已注册，则初始化
                        else {
                            component.call( $this, options );
                        }
                    } );


                } );

            } catch ( e ) {
                throw e;
            } finally {
                PKUI.__isrendering = false;
            }
        },

        /**
         * 开启/关闭 自动渲染。
         *
         * 自动渲染时机：
         *
         *      1. 调用 jquery.html( value ) 方法之后
         *      2. 调用 jquery.append( value ) 方法之后
         *      3. 调用 jquery.appendTo( value ) 方法之后
         *      4. 调用 jquery.prepend( value ) 方法之后
         *      5. 调用 jquery.prependTo( value ) 方法之后
         *
         * @param isAutoRender {boolean} true-开启，false-关闭。
         *
         */
        setAutoRender: function ( isAutoRender ) {
            if ( arguments.length === 0 ) {
                console.info( "/(ㄒoㄒ)/~~ 请设置参数。" );
                return;
            }

            PKUI.isAutoRender = Boolean( isAutoRender );

            if ( isAutoRender ) {

                PKUI.setAutoRender.pointcutHandlerList = [

                    // 1. 调用 jquery.html() 方法之后
                    AOP.after( $.prototype, "html", PKUI.render )

                    // 2. 调用 jquery.append( value ) 方法之后
                    //AOP.after( $.prototype, "append", render ),

                    // 3. 调用 jquery.appendTo( value ) 方法之后
                    //AOP.after( $.prototype, "appendTo", render ),

                    // 4. 调用 jquery.prepend( value ) 方法之后
                    //AOP.after( $.prototype, "prepend", render ),

                    // 5. 调用 jquery.prependTo( value ) 方法之后
                    //AOP.after( $.prototype, "prependTo", render )

                ];

            } else {

                $.each( PKUI.setAutoRender.pointcutHandlerList, function ( index, pointcutHandler ) {
                    pointcutHandler.remove();
                } );

            }

        }
    } );

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
         * @param options {{data: Array, rootId: *, idName: string, parentIdName: string, childrenName: string}}
         * @example
         * PKUI.getTreeList( {
                data: [
                    { menuId: 0, menuName: "系统管理", treeParentid: null },
                    { menuId: 1, menuName: "用户管理", treeParentid: 0 },
                    { menuId: 2, menuName: "单位管理", treeParentid: 0 },
					{ menuId: 10, menuName: "系统管理2", treeParentid: null },
                    { menuId: 11, menuName: "用户管理2", treeParentid: 10 },
                    { menuId: 12, menuName: "单位管理2", treeParentid: 10 }
                ],
                rootId: 0, // 省略则取将所有 parentId 为null或-1 的作为根节点，可以是 { rootId_1: xxx, rootId_2: xxx } 的形式
                idName: "menuId",
                parentIdName: "treeParentid",
                childrenName: "children"
           } );
         返回：
         [
             {
                 menuId: 0, menuName: "系统管理", treeParentId: null,
                 children: [
                     { menuId: 1, menuName: "用户管理", treeParentid: 0, children: null },
                     { menuId: 2, menuName: "单位管理", treeParentid: 0, children: null }
                 ]
             },
            {
                 menuId: 10, menuName: "系统管理2", treeParentid: null,
                 children: [
                     { menuId: 11, menuName: "用户管理2", treeParentid: 10, children: null },
                     { menuId: 12, menuName: "单位管理2", treeParentid: 10, children: null }
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
                rootList = []
                ;

            // 如果没有指定根节点的ID，则将所有 treeParentId == null 的节点作为根节点
            if ( rootId === null || rootId === undefined ) {
                // rootId = data[ 0 ][ idName ];
                $.each( data, function ( index, elt ) {
                    var parentId = elt[ parentIdName ];
                    if ( parentId === null
                         || parentId === undefined
                         || parentId === -1
                         || parentId === "-1") {
                        rootList.push( elt );
                    }
                } );
            }
            else {
                // 多个 rootId
                if ( typeof rootId === "object" ) {
                    $.each( data, function ( index, elt ) {
                        var
                            id = elt[ idName ]
                        ;
                        if ( rootId.hasOwnProperty( id ) ) {
                            rootList.push( elt );
                        }
                    } );
                }
                // 单个
                else {
                    $.each( data, function ( index, elt ) {
                        var
                            id = elt[ idName ]
                        ;
                        if ( id === rootId ) {
                            rootList.push( elt );
                            return false;
                        }
                    } );
                }
            }


            $.each( data, function ( index, elt ) {
                if ( elt === null || elt === undefined ) {
                    return;
                }
                parentId = elt[ parentIdName ];
                childrenCollection[ parentId ] = childrenCollection[ parentId ] || [];
                childrenCollection[ parentId ].push( elt );
            } );

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
                    newRecord = $.extend( true, {}, record );
                    newRecord[ childrenName ] = fmtData( childrenCollection[ record[ idName ] ] );
                    list.push( newRecord );
                } );
                return list;
            }


            return returnData;

        }
    } );



    PKUI._init();

} );