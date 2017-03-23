
// PKUI 核心模块
define( function ( require ) {
    "use strict";

    require( "isLoading" );
    require( "css/font/font-awesome/4.7.0/font-awesome.css" );
    require( "layer" );
    require( "lib/layer/3.0.1.x/skin/default/layer.css" );

    var
        $ = require( "jquery" ),

        AOP = require( "meld" ),

        ns = window[ "www.pkusoft.net" ],

        PKUI = {
            // <div data-pkui-component>
            componentMarkupProp: "pkui-component",

            // <div data-pkui-component-options>
            optionsMarkupProp: "pkui-component-options",

            // CTX路径
            ctxPath: ns.ctxPath,

            // pkui的基本路径
            basePath: ns.pkuiBasePath,

            // 字典路径
            dicPath: ns.ctxPath + "/static/dic/",

            // 时间戳（版本控制）v=2012-1-1
            timestamp: ns.timestamp,

            // 组件容器
            component: {},

            // 载入模块（seajs.use方法的别名）
            load: seajs.use,

            // 渲染
            render: render,

            // 自动渲染标志
            isAutoRender: true,

            // 设置自动渲染（true/false）
            setAutoRender: setAutoRender
        }
        ;

    // 如果是在WebStorm里跑 PKUI项目，则更改 ctxPath 和 dicPath
    if ( location.href.indexOf( "localhost" ) !== -1 && ns.pkuiBasePath.indexOf( "static" ) === -1 ) {
        PKUI.ctxPath = "http://localhost:8080/pkui";
        PKUI.dicPath = "http://localhost:8080/pkui/static/dic/";
    }

    /**
     * 初始化
     * @private
     */
    PKUI._init = function _init() {

        // DOM树构建完毕，执行一次渲染
        $( document ).ready( render );

        // 设置自动渲染
        this.setAutoRender( this.isAutoRender );

        // 暴露到全局名称空间
        window.PKUI = PKUI;
    };

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


    /**
     * 渲染。
     *
     * 渲染的目标（在此列出全部可被自动渲染的组件）：
     *
     *      <div data-pkui-component="datagrid"
     *           data-pkui-component-options='{"key":"val",...}' >
     *      <div data-pkui-component="drawer"
     *           data-pkui-component-options='{"key":"val",...}' >
     *      <div data-pkui-component="validator|form"
     *           data-pkui-component-options='[{"key":"val",...},{"key":"val",...}]' >
     *
     * 已渲染的标志（添加 isrendered="true"）：
     *
     *      <div data-pkui-component="datagrid" isrendered="true">
     *
     *      渲染标志的添加由组件自身添加
     */
    function render() {
        var
            $component = $( "[data-" + PKUI.componentMarkupProp + "]" )
                .not('[isrendered]')
            ;

        $component.each( function () {
            var
                $this = $( this ),
                componentName = $this.data( PKUI.componentMarkupProp ),
                // jQuery自动转为JSON对象了
                componentOptions = $this.data( PKUI.optionsMarkupProp ) || {},
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
    }

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
    function setAutoRender ( isAutoRender ) {

        if ( arguments.length === 0 ) {
            console.info( "/(ㄒoㄒ)/~~ 请设置参数。" );
            return;
        }

        PKUI.isAutoRender = Boolean( isAutoRender );

        if ( isAutoRender ) {

            setAutoRender.pointcutHandlerList = [

                // 1. 调用 jquery.html( value ) 方法之后
                AOP.after( $.prototype, "html", render )
                // ,

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

            $.each( setAutoRender.pointcutHandlerList, function ( index, pointcutHandler ) {
                pointcutHandler.remove();
            } );

        }

    }

    PKUI._init();

} );