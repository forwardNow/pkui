/**
 * 对 intro 的封装
 */
define( function( require ) {
    require( "lib/component/intro/2.5.0/introjs.css" );
    var 
        introJs = require( "intro" ).introJs,
        $ = require( "jquery" ),
        namespace = "pkui.intro",
        PKUI = window.PKUI
    ;
    Intro.prototype.defaults = {
        // 启动引导的目标选择器
        startIntroSelector: "",
        prevLabel: "上一步",
        nextLabel: "下一步",
        skipLabel: "退出",
        doneLabel: "完成",
        tooltipPosition: "auto"
    };

    function Intro( $target, options ) {
        this.$target = $target;
        this.opts = $.extend( true, {}, this.defaults, options );
        this.init();
    }

    Intro.prototype.init = function () {
        var
            targetId = this.$target.attr( "id" )
        ;
        if ( ! targetId ) {
            targetId = "intro_" + ( new Date() ).getTime();
            this.$target.attr( "id", targetId );
        }
        this.introJsInstance = introJs( "#" + targetId );

        this.introJsInstance.setOptions( this.opts );

        this.render();
        this.bind();
    };
    Intro.prototype.render = function () {
        this.$startIntro = $( this.opts.startIntroSelector );
    };
    Intro.prototype.bind = function () {
        var
            _this = this
        ;
        this.$startIntro.on( "click." + namespace, function () {
            _this.introJsInstance.start();
        } );
    };

    $.fn.Intro = function ( options ) {

        this.each( function () {
            var
                $this = $( this ),
                instance = $this.data( namespace )
                ;

            // 如果没有初始化，则进行初始化
            if ( ! instance ) {
                $this.attr( "isrendered", true );
                instance = new Intro( $this, options );
                $this.data( namespace, instance );
            }

        } );

        return this;
    };

    PKUI.component.Intro = $.fn.Intro;
} );
