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
