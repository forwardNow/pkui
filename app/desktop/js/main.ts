declare function define(...args: any[]): any;
/**
 * @file 应用入口
 * @author 吴钦飞(wuqf@pkusoft.net)
 */
define( function( require ) {
    let $ = require( "jquery" );
    let Launchpad = require( "./common/_launchpad" );
    let Dialog = require( "./common/_dialog" );
    $( document ).ready( function () {
        Launchpad.init();
        Dialog.init();
    } );
} );