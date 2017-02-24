/**
 * @file 应用入口
 * @author 吴钦飞(wuqf@pkusoft.net)
 */
define( function ( require ) {
    var $ = require( "jquery" );
    var Launchpad = require( "./common/launchpad" );
    var App = require( "./page/app" );
    var Template = require( "./common/template" );

    if ( window.isIE8 ) {
        require( "seajs-css" );
        seajs.use( "./css/page/ie8-hack.css" );
    }

    $( document ).ready( function () {

        Template.init( { base: "/pkui/app/desktop/tpl/" } );

        Launchpad.init();

        App.init();
    } );
} );
