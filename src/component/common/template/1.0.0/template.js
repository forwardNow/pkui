/**
 * 对 artTemplate 的封装
 */
define( function ( require ) {
    var
        $ = require( "jquery" ),
        ArtTemplate = require( "artTemplate" ),
        Template
    ;
    Template = {
        renderCache: {},
        /**
         * 根据 viewUrl和modelUrl 获取 html字符串
         * @param viewUrl 模板URL
         * @param modelUrl 模型URL，如果是对象则直接使用
         * @param callback 都请求完毕后执行回调，参数为html字符串
         */
        getModelAndView: function ( viewUrl, modelUrl, callback, options ) {
            var Status,
                renderCache
                ;
            renderCache = this.renderCache;
            Status = {
                tplRender: false,
                data: false,
                update: function () {
                    var htmlString
                        ;
                    if ( this.tplRender && this.data ) {
                        htmlString = this.tplRender( this.data );
                        callback( htmlString );
                    }
                }
            };

            // 1. 获取模板
            // 1.1 如果在缓存里，则取缓存里的
            if ( renderCache[ viewUrl ] ) {
                Status.tplRender = renderCache[ viewUrl ];
                Status.update();
            } else {
                // 1.2 如果不在缓存里，则Ajax请求
                $.ajax( {
                    url: viewUrl,
                    type: "GET",
                    dataType: "text"
                } ).done( function ( data ) {
                    Status.tplRender = ArtTemplate.compile( data, options );
                    renderCache[ viewUrl ] = Status.tplRender;
                    Status.update();
                } ).fail( function () {
                    window.PKUI.console.error( "模板获取失败！", true )
                } );

            }

            // 2. 获取数据
            // 2.1 如果 modelUrl 是对象，则直接使用
            if ( typeof modelUrl === "object" ) {
                Status.data = modelUrl;
                Status.update();
                return;
            }
            // 2.2 如果 modelUrl 是URL，则Ajax请求
            $.ajax( {
                url: modelUrl
            } ).done( function ( data ) {
                data = window.PKUI.handleJsonResult( data );
                if ( !data || ! data.success ) {
                    window.PKUI.console.error( "模型获取失败！", true )
                }
                Status.data = data.data;
                Status.update();
            } ).fail( function ( /*jqXHR, textStatus */) {
                window.PKUI.console.error( "模型获取失败！", true )
            } );

        }
    };
    window.PKUI.component.Template = Template;
    return Template;
} );