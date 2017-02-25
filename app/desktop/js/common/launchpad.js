/**
 * @fileOverview 应用启动面板
 * @author 吴钦飞(wuqf@pkusoft.net)
 * @module module:common/launchpad
 * @requires jquery
 * @requires swiper
 * @requires jquery-ui
 * @requires module:base/utils
 *
 */
define( function ( require ) {
    var $,
        Swiper,
        Launchpad,
        Utils
        ;
    $ = require( "jquery" );
    Swiper = require( "swiper" );
    require( "jquery-ui" );
    Utils = require( "../base/utils" );

    /**
     * 应用启动面板单例
     * @exports module:common/launchpad
     */
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
            var _this;
            _this = this;
            this.swiper = new Swiper( ".swiper-container", {
                // eventTarget : 'wrapper',
                // noSwiping : true,
                pagination: this.pagination,
                loop: false,
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
                sort: function ( event /*, ui */ ) {
                    var x;
                    if ( _this.isSwippingWhenSort ) {
                        return;
                    }
                    x = event.pageX;
                    if ( x === 20 ) {
                        _this.previousBtn.trigger( "click" );
                    }
                    if ( x + 20 === Utils.getPageWidth() ) {
                        _this.nextBtn.trigger( "click" );
                    }

                    if ( x === 20 || x + 20 === Utils.getPageWidth ) {
                        _this.isSwippingWhenSort = true;
                        window.setTimeout( function () {
                            _this.isSwippingWhenSort = false;
                        }, _this.intervalWhenSort );
                    }
                }
            } ).disableSelection();
        }
    };

    return Launchpad;
} );
