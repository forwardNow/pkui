/**
 * @file 应用入口
 * @author 吴钦飞(wuqf@pkusoft.net)
 */
define( function ( require ) {
    var $ = require( "jquery" );
    var Launchpad = require( "./common/_launchpad" );
    var App = require( "./page/_app" );
    var Template = require( "./common/_template" );

    if ( window.isIE8 ) {
        require( "seajs-css" );
        seajs.use( "./css/page/ie8-hack.css" );
    }

    $( document ).ready( function () {
        Launchpad.init();
        Template.init( { base: "/pkui/app/desktop/tpl/" } )
        App.init();
    } );
} );
