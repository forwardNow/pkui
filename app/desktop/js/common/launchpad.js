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
        Launchpad,
        Utils
        ;
    $ = require( "jquery" );
    require( "jquery-ui" );
    Utils = require( "../base/utils" );

    require( "swiper" );


    /**
     * 应用启动面板单例
     * @exports module:common/launchpad
     */
    Launchpad = {
        swiper: null,
        $pageList: ".launchpad-view-pageList",
        $previousBtn: ".launchpad-pagination-previous",
        $nextBtn: ".launchpad-pagination-next",
        $pagination: ".launchpad-pagination-switchList",
        $shortcut: ".launchpad-shortcut",
        // 定义一个参数：翻页的时间间隔
        intervalWhenSort: 2000,
        isSwippingWhenSort: false,
        /**
         * 启动 应用启动面板
         * @memberOf module:common/launchpad#
         */
        init: function () {
            this.render();
            this.bind();
        },
        render: function () {
            this.$previousBtn = $( this.$previousBtn );
            this.$pageList = $( this.$pageList );
            this.$nextBtn = $( this.$nextBtn );
            this.$shortcut = $( this.$shortcut );
        },
        bind: function () {
            var _this;
            _this = this;
            this.swiper = new window.Swiper( ".swiper-container", {
                // eventTarget : 'wrapper',
                // noSwiping : true,
                pagination: this.$pagination,
                // loop: true,
                grabCursor: true,
                paginationClickable: true,

                releaseElementsClass: "launchpad-shortcut",
                loopWithoutDuplicate: true,
                onFirstInit: function () {
                    _this.$pageList.removeClass( "hidden" );
                }

            } );
            this.$previousBtn.on( "click", function ( e ) {
                e.preventDefault();
                _this.swiper.swipePrev();
            } );
            this.$nextBtn.on( "click", function ( e ) {
                e.preventDefault();
                _this.swiper.swipeNext();
            } );
            /*
            // 拖拽排序
            $( ".launchpad-shortcutpad" ).sortable( {
                appendTo: document.body,
                helper: "clone",
                connectWith: ".launchpad-shortcutpad",
                handle: ".launchpad-shortcut-icon",
                placeholder: "launchpad-shortcut-placeholder",
                scroll: false,
                tolerance: "pointer",
                // 拖拽到页面边界会发生翻页，翻页时间间隔是1秒
                sort: function ( event /!*, ui *!/ ) {
                    var x,
                        pageWidth
                        ;
                    if ( _this.isSwippingWhenSort ) {
                        return;
                    }
                    x = event.pageX;
                    pageWidth = Utils.getPageWidth();

                    if ( x < 20 || x + 20 > Utils.getPageWidth() ) {
                        _this.isSwippingWhenSort = true;
                        console.info( "×...不允许翻页！！！/(ㄒoㄒ)/~~" );
                        window.setTimeout( function () {
                            _this.isSwippingWhenSort = false;
                            console.info( "√...可以翻页！！！O(∩_∩)O~" );
                        }, _this.intervalWhenSort );
                    }

                    if ( x < 20 ) {
                        _this.$previousBtn.trigger( "click" );
                        console.info( "<<...翻页（前）" );
                    }
                    if ( x + 20 > pageWidth ) {
                        _this.$nextBtn.trigger( "click" );
                        console.info( ">>...翻页（后）" );
                    }

                }
            } ).disableSelection();
            */
        }
    };

    return Launchpad;
} );
