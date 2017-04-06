
// PKUI 核心模块
define( function ( require ) {
    "use strict";

    require( "isLoading" );
    require( "css/font/font-awesome/4.7.0/font-awesome.css" );
    require( "layer" );
    require( "lib/component/layer/3.0.1.x/skin/default/layer.css" );
    require( "moment-local-zh" );

    var
        $ = require( "jquery" ),

        AOP = require( "meld" ),

        moment = require( "moment" ),

        ArtTemplate = require( "artTemplate" ),

        DataSource = require( "dataSource" ),

        ns = window[ "www.pkusoft.net" ],

        $doc = $( window.document ),

        PKUI = {
            // 标识组件类型的HTML属性：<div data-pkui-component>
            componentHtmlAttr: "pkui-component",

            // 标识组件参数的HTML属性：<div data-pkui-component-options>
            componentOptionsHtmlAttr: "pkui-component-options",

            // CTX路径：${ ctx }（http://localhost:8080/projname）
            ctxPath: ns.ctxPath,

            // pkui的基本路径：${ ctx }/static/pkui
            basePath: ns.pkuiBasePath,

            // 字典路径：${ ctx }/static/dic/
            dicPath: ns.ctxPath + "/static/dic/",

            // 时间戳（版本控制）v=2012-1-1
            timestamp: ns.timestamp,

            // 组件容器
            component: {},


            // 自动渲染标志
            isAutoRender: true,

            // 是否正在渲染
            __isrendering: false,
            // 渲染次数（render()被调用的次数）
            __renderedTimes: 0

        }
        ;

    // 如果是在WebStorm里跑 PKUI项目，则更改 ctxPath 和 dicPath
    if ( location.href.indexOf( "localhost" ) !== -1 && ns.pkuiBasePath.indexOf( "static" ) === -1 ) {
        PKUI.ctxPath = "http://localhost:8080/pkui";
        PKUI.dicPath = "http://localhost:8080/pkui/static/dic/";
    }

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

            // 注册在当前模块中使用的组件
            this._registerComponent();

            // 全局的事件绑定
            this._bindEvent();


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
            // DOM树构建完毕，执行一次渲染
            $doc.ready( PKUI.render );
        },
        /**
         * 设置Ajax的默认参数
         */
        _setAjaxDefaultOptions: function () {
            // 默认参数设置
            $.ajaxSetup( {
                type: "POST",   // 1.9.0 版本使用 "type"
                method: "POST", // 1.9.0 版本后用 "method"
                dataType: "json"
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
                    url = url.replace( /.*__CTX__/, PKUI.ctxPath );
                }
                else if ( typeof url === "object" && url.hasOwnProperty( "url" ) ) {
                    url.url = url.url.replace( /.*__CTX__/, PKUI.ctxPath );
                }
                return originAjaxMethod.call( this, url, options );
            };

            $.fn.html = function ( value ) {

                // 没有传值
                if ( value === undefined ) {
                    return originHtmlMethod.call( this );
                }

                // 字符串
                if ( typeof value === "string" ) {
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
                return moment( date ).format( format )
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
                    var date = row[ column.id ];
                    return moment( date ).format( "YYYY年MM月DD日" )
                },
                // 日期 转 格式化后的年月日时分秒
                datetimeFormatter: function ( column, row ) {
                    var date = row[ column.id ];
                    return moment( date ).format( "YYYY年MM月DD日 HH时mm分ss秒" )
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
                    else {
                        return '<span class="text-danger"><i class="fa fa-circle"></i> 停用</span>';
                    }
                }
            }
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
                        // jQuery自动转为JSON对象了
                        componentOptions = $this.data( PKUI.componentOptionsHtmlAttr ) || {},
                        componentNameList
                        ;
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
                                default:
                                    var errorMessage = "未被注册的组件[" + componentName + "]";
                                    console.info( moment().format("YYYY年MM月DD日 HH:MM:SS"), errorMessage );
                                    window.layer.msg( errorMessage );
                                    $this.attr( "notrecognized", "not reg" );
                                    return;
                            }
                            seajs.use( [ moduleId ], function () {
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

                    // 1. 调用 jquery.html( value ) 方法之后
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



    PKUI._init();

} );