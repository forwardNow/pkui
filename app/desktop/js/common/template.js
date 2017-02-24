/**
 * @file 模板工具
 * @author 吴钦飞(wuqf@pkusoft.net)
 */
define( function ( require ) {
    var $,
        ArtTemplate,
        Template
        ;
    $ = require( "jquery" );
    ArtTemplate = require( "artTemplate" );

    Template = {
        renderCache: {},
        init: function ( options ) {
            this.options = $.extend( {}, this.defaults, options );
        },
        getTemplate: function ( templateName, data ) {
            var templateUrl,
                renderCache,
                tpl
            ;
            tpl = null;
            renderCache = this.renderCache;

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
    Template.defaults = {
        base: "",
        extName: ".html"
    };

    return Template;
} );

