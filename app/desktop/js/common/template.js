/**
 * @fileOverview  模板工具
 * @author 吴钦飞(wuqf@pkusoft.net)
 * @requires module:jquery
 * @requires artTemplate
 */
define( function ( require ) {
    var $,
        ArtTemplate,
        Template
        ;
    $ = require( "jquery" );
    ArtTemplate = require( "artTemplate" );
    /**
     * 模板工具
     */
    Template = {
        /** 缓存模板引擎的render @private */
        _renderCache: {},
        /**
         * 设置模板引擎的参数
         * @returns {object} 链式调用
         * @example
         * Template.setOptions( {
         *      base: "${ctx}/static/tpl/", // 模板文件父路径
         *      extName: ".html"            // 模板文件的扩展名
         * });
         */
        setOptions: function ( options ) {
            this.options = $.extend( {}, this.defaults, options );
            return this;
        },
        /**
         * 获取生成的模板字符串
         * @param {string} templateName 模板文件名
         * @param {object} data 传入模板的数据
         * @returns {string} 模板加数据后生成的字符串
         */
        getHtmlString: function ( templateName, data ) {
            var
                templateUrl,
                renderCache,
                tpl
                ;
            tpl = null;
            renderCache = this._renderCache;

            if ( renderCache[ templateName ] ) {
                return renderCache[ templateName ]( data );
            }

            templateUrl = this._getTemplateUrl( templateName );

            $.ajax( {
                async: false,
                type: "GET",
                cache: false,
                dataType: "text",
                url: templateUrl
            } ).done( function ( data ) {
                tpl = data;
            } ).fail( function ( jqXHR, textStatus ) {
                console.info( textStatus );
                throw "获取模板失败";
            } );

            renderCache[ templateName ] = ArtTemplate.compile( tpl );

            return renderCache[ templateName ]( data );
        },

        get: function ( tplSrc, dataSrc, callback ) {

            var Status,
                renderCache,
                _this
                ;
            _this = this;
            renderCache = this._renderCache;
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
            if ( renderCache[ tplSrc ] ) {
                Status.tplRender = renderCache[ tplSrc ];
                Status.update();
            } else {
                // 1.2 如果不在缓存里，则Ajax请求
                this._ajax( {
                    url: _this._getTemplateUrl( tplSrc ),
                    dataType: "text"
                } ).done( function ( data ) {
                    Status.tplRender = ArtTemplate.compile( data );
                    renderCache[ tplSrc ] = Status.tplRender;
                    Status.update();
                } ).fail( function ( jqXHR, textStatus ) {
                    throw "/(ㄒoㄒ)/~~[ " + textStatus + " ]模板获取失败！";
                } );

            }

            // 2. 获取数据
            // 2.1 如果 dataSrc 是对象，则直接使用
            if ( typeof dataSrc === "object" ) {
                Status.data = dataSrc;
                Status.update();
                return;
            }
            // 2.2 如果 dataSrc 是URL，则Ajax请求
            this._ajax( {
                url: dataSrc
            } ).done( function ( data ) {
                data = window.PKUI.responseDataHandler( data );
                if ( !data ) {
                    throw "/(ㄒoㄒ)/~~数据获取失败！";
                }
                Status.data = data;
                Status.update();
            } ).fail( function ( jqXHR, textStatus ) {
                throw "/(ㄒoㄒ)/~~[ " + textStatus + " ]数据获取失败！";
            } );

        },
        /**
         * 获取模板URL
         * @param templateName 模板名
         * @returns {string} 模板URL字符串
         * @private
         */
        _getTemplateUrl: function ( templateName ) {

            // 如果是绝对路径，则不做任何处理
            if ( /http:|https:|(^\/)/.test( templateName ) ) {
                return templateName;
            }

            // 如果不包含后缀名，则添加默认后缀名
            if ( !/\.(html|tpl|txt|json|js)/.test( templateName ) ) {
                return this.options.base + templateName + this.options.extName;
            }
        },
        /**
         *
         * @param options
         * @returns {jqXHR}
         * @private
         */
        _ajax: function ( options ) {
            var opts
                ;
            opts = $.extend( {
                // async: false,
                type: "GET",
                cache: false,
                dataType: "json" // "json"
            }, options );
            return $.ajax( opts );
        }
    };
    /**
     * 模板引擎的默认参数
     * @type {{base: string, extName: string}}
     */
    Template.defaults = {
        base: "",
        extName: ".html"
    };


    return Template;
} );

