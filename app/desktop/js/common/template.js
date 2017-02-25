/**
 * @fileOverview  模板工具
 * @module module:common/template
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
     * @exports module:common/template
     */
    Template = {
        /**
         * 缓存模板引擎的render
         * @private
         */
        _renderCache: {},
        /**
         * 设置模板引擎的参数
         * @memberOf module:common/template#
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
         * @memberOf module:common/template#
         * @param {string} templateName 模板文件名
         * @param {object} data 传入模板的数据
         * @returns {string} 模板加数据后生成的字符串
         */
        getTemplate: function ( templateName, data ) {
            var templateUrl,
                renderCache,
                tpl
            ;
            tpl = null;
            renderCache = this._renderCache;

            if ( renderCache[ templateName ] ) {
                return renderCache[ templateName ]( data );
            }

            templateUrl = this.options.base + templateName + this.options.extName;

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

