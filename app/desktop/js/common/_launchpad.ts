declare function define ( ...args: any[] ): any;
/**
 * @file 应用启动面板
 * @author 吴钦飞(wuqf@pkusoft.net)
 */
define( function ( require ) {
    let $,
        Swiper,
        Launchpad,
        Utils
        ;
    $ = require( "jquery" );
    Swiper = require( "swiper" );
    require( "jquery-ui" );
    Utils = require( "../base/_utils" );

    Launchpad = {
        swiper: null,
        previousBtn: ".launchpad-pagination-previous",
        nextBtn: ".launchpad-pagination-next",
        pagination: ".launchpad-pagination-switchList",
        shortcut: ".launchpad-shortcut",
        // 定义一个参数：翻页的时间间隔
        intervalWhenSort: 1000,
        isSwippingWhenSort: false,
        init: function () {
            this.render();
            this.bind();
        },
        render: function () {

            this.previousBtn = $( this.previousBtn );
            this.nextBtn = $( this.nextBtn );
            this.shortcut = $( this.shortcut );
        },
        bind: function () {
            let _this;
            _this = this;

            this.swiper = new Swiper( ".swiper-container", {
                // eventTarget : 'wrapper',
                // noSwiping : true,
                pagination: this.pagination,
                loop: true,
                grabCursor: true,
                paginationClickable: true,
                releaseElementsClass: "launchpad-shortcut"
            } );
            this.previousBtn.on( "click", function ( e ) {
                e.preventDefault();
                _this.swiper.swipePrev();
            } );
            this.nextBtn.on( "click", function ( e ) {
                e.preventDefault();
                _this.swiper.swipeNext();
            } );

            // 拖拽排序
            $( ".launchpad-shortcutpad" ).sortable( {
                appendTo: document.body,
                helper: "clone",
                connectWith: ".launchpad-shortcutpad",
                handle: ".launchpad-shortcut-icon",
                placeholder: "launchpad-shortcut-placeholder",
                scroll: false,
                // 拖拽到页面边界会发生翻页，翻页时间间隔是1秒
                sort: function ( event/*, ui */ ) {
                    let x;
                    if ( _this.isSwippingWhenSort ) {
                        return;
                    }
                    x = event.pageX;

                    if ( x === 0 ) {
                        _this.previousBtn.trigger( "click" );
                    }
                    if ( x + 1 === Utils.pageWidth ) {
                        _this.nextBtn.trigger( "click" );
                    }
                    if ( x === 0 || x + 1 === Utils.pageWidth ) {
                        _this.isSwippingWhenSort = true;
                        window.setTimeout( function () {
                            _this.isSwippingWhenSort = false;
                        }, _this.intervalWhenSort );
                    }
                }
            } ).disableSelection();

        }
    };

    /*
     $( document ).ready( function() {
        Launchpad.init();
     } );
     */

    return Launchpad;
} );