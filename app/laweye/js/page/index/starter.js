/**
 * 首页（启动页），
 * 此模块配合 loadContent模块 使用，提供 getHtml() 接口
 */
define( function ( require ) {
    var
        $ = require( "jquery" ),
        Template = require( "template" ),
        Starter = {}
    ;


    Starter.defaults = {
        src: "__CTX__/static/desktop/tpl/index/starter.html",
        mode: "default"
    };

    Starter.template =  "";

    /**
     * 初始化方法
     * @private
     */
    Starter._init = function () {
    };

    /**
     * 核心方法
     * @param callback
     */
    Starter.getHtml = function ( callback ) {
        Template.getModelAndView( this.defaults.src, null, function ( htmlString ) {
            callback( htmlString );
        } );
    };


    Starter._init();

    return Starter;
} );