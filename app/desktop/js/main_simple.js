define( function ( require ) {

    var
        $ = require( "jquery" ),
        ArtTemplate = require( "artTemplate" ),
        appWindowMainTpl = require( "../tpl/desktop/appWindowMain.html" ),
        appWindowMainTplRender = ArtTemplate.compile( appWindowMainTpl )

    ;

    if ( window.isIE8 ) {
        seajs.use( "./css/page/ie8-hack.css" );
    }

    // 载入系统功能URL配置文件
    require( "./config/systemUrl" );


    $( document ).ready( function () {
        var
            $container = $( "#da-win" )

        ;

        $container.on( "click.sidebar.anchor", ".da-win-sidebar .jstree-anchor", function ( event ) {
            var $this = $( this ),
                menuicon,
                title,
                $winMain,
                $winMainBody,
                url
            ;
            event.preventDefault();

            url = $this.attr( "href" );

            // 如果不是 URL，则返回
            if ( url.indexOf( "/" ) === -1 ) {
                return;
            }
            // 1. 高亮

            // 2. 装载主体
            //iconSrc = $this.find( "img" ).attr( "src" );
            menuicon = $this.attr( "menuicon" );
            title = $this.text();
            if ( menuicon.indexOf( ".png" ) !== -1 ) {
                $winMain = $( appWindowMainTplRender( {
                        menuicon: "", title: title,
                        menuiconStyle: "background-image: url(" + menuicon + ")"
                    } )
                );
            }
            else {
                $winMain = $( appWindowMainTplRender( { menuicon: menuicon, title: title } ) );
            }

            $container.find( ".da-win-main" ).replaceWith( $winMain );

            $winMainBody = $winMain.children( ".win-main-body" );

            // 3. 请求页面
            $winMainBody.isLoading();

            $.ajax( {
                type: "GET",
                cache: false,
                dataType: "text",
                url: url
            } ).done( function ( data ) {
                $winMainBody.html( data );
            } ).fail( function ( xhr ) {
                var str = "[" + xhr.status + "]" + xhr.statusText;
                $winMainBody.html( str );
                console.error( str );
            } ).always( function () {
                $winMainBody.isLoading( "hide" );
            } );


        } );
    } );


} );