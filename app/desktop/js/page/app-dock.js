/**
 * @fileOverview  应用（App）—— 页签（AppDock）
 * @author 吴钦飞(wuqf@pkusoft.net)
 *
 * @module module:page/app-dock
 * @requires module:jquery
 * @requires artTemplate
 */
define( function ( require ) {
    var $,
        ArtTemplate,
        dockItemTpl,
        dockItemTplRender
        ;

    $ = require( "jquery" );
    ArtTemplate = require( "artTemplate" );
    dockItemTpl = require( "../../tpl/desktop/dockItem.html" );
    dockItemTplRender = ArtTemplate.compile( dockItemTpl );
    /**
     * @classDesc 页签（AppDock）类
     * @exports module:page/app-dock
     * @alias AppDock
     * @constructor
     * @param {Object} options 参数
     */
    function AppDock( options ) {

        !AppDock.isInited && AppDock.init( null );

        this.appInstance = null;
        this.$target = null;
        this.options = null;
        this._init( options );
    }

    AppDock.namespace = "pkui.app.dock";
    AppDock.events = {
        "remove": "remove." + AppDock.namespace,
        "add": "add." + AppDock.namespace,
        "close": "click.close." + AppDock.namespace,
        "show": "click.show." + AppDock.namespace
    };

    AppDock.defaults = {
        /** 包裹所有页签（AppDock）的容器的CSS选择器 */
        $container: ".topbar-dock"
    };
    /** 标志是否初始化 */
    AppDock.isInited = false;
    /**
     * 初始化操作，在实例化之前判断
     * @param options
     */
    AppDock.init = function ( options ) {

        this.options = $.extend( {}, this.defaults, options );
        this.options.$container = this.prototype.$container = $( this.options.$container );

        this.manager.init();

        this.isInited = true;
    };

    /**
     // 自适应


     // 1. 得到 $item 宽度（itemWidth）的宽度边界： minItemWidth、maxItemWidth

     // 2. 计算 $container 可用宽度（availableContainerWidth），

     // 3. 计算 $item 的个数（itemNum）的边界： minWidthItemNum、maxWidthItemNum

     // 4. 当准备增加 $item 时
     // 4.0 当 hiddenItemNum > 0 时，直接追加到 $itemDropmenu，结束
     // 4.1 当 itemNum <= maxWidthItemNum 时，直接新增 $item，结束
     // 4.2 当 itemNum > maxWidthItemNum 时，计算nowItemWidth（itemWidth - stepWith）
     // 4.2.1 当 nowItemWidth >= minItemWidth 时，设置 $item.itemWidth = nowItemWidth，结束
     // 4.2.2 当 nowItemWidth < minItemWidth 时，取消 $itemDropmenu 的隐藏状态
     //       将 $item 添加进 $itemDropmenu，并更新 hiddenItemNum，结束

     // 5. 当删除掉 $item 时
     // 5.1 当删除的是 $container 里的$item
     // 5.1.1 当 hiddenItemNum > 0，将第一个 $hiddenItem 移动到 $container 里，
     //          然后判断 hiddenItemNum 是否为0，为0则隐藏 $itemDropmenu，结束
     // 5.1.2 当 hiddenItemNum = 0，则 计算nowItemWidth（itemWidth + stepWith）
     //          当 nowItemWidth >= maxItemWidth 时，不做处理，结束
     //          当 nowItemWidth < maxItemWidth 时，设置 $item.itemWidth = nowItemWidth，结束

     // 6. 当点击 $itemDropmenu 里的 $hiddenItem 时，交换其与第一个 $item的位置



     */
    AppDock.manager = {
        containerSelector: ".topbar-dock",
        $container: null,
        $dock: null,
        $dockDropmenuContainer: ".dock-dropmenu",
        $dockDropmenu: ".dock-dropmenu-list",
        $indicator: ".dock-dropmenu-indicator",
        itemSelector: ".topbar-dock-item",
        itemMargin: 0,
        itemPadding: 0,
        itemGap: 0,
        stepItemWith: 10,
        itemWidth: 0, // width = 136, padding(水平) = 26, margin(水平) = 6
        minItemWidth: 0,
        maxItemWidth: 0,
        availableContainerWidth: 0,
        itemNum: 0,
        displayItemNum: 0,
        hiddenItemNum: 0,
        minWidthItemNum: 0,
        maxWidthItemNum: 0,
        init: function () {
            this._init();
            this._calAvailableContainerWidth();
            this._calItemNum();
            this._bindOnAddDockItem();
            this._bindOnClickIndicator();
            this._bindOnRemoveDockItem();
            this._bindClearMenu();
            this._bindClickItenInDropmenu();
        },
        /** 1. 得到 $item 宽度（itemWidth）的宽度边界： minItemWidth、maxItemWidth
         *  $dockDropmenu 的初始化
         */
        _init: function () {
            $.extend( this, {
                itemMargin: 6,
                itemPadding: 26,
                itemGap: 6 + 26,
                itemWidth: 136, // width 属性
                minItemWidth: 60,
                maxItemWidth: 136
            } );

            this.$dockDropmenuContainer = $( this.$dockDropmenuContainer );
            this.$dockDropmenu = $( this.$dockDropmenu );
            this.$indicator = $( this.$indicator );

            this.$dockDropmenuContainer.appendTo( $( document.body ) );

            return this;
        },
        /** 2. 计算 $container 可用宽度（availableContainerWidth）， */
        _calAvailableContainerWidth: function () {
            var $container,
                $dock,
                $siblings,
                availableContainerWidth,
                siblingWidth
                ;

            $container = AppDock.options.$container;
            $dock = $container.parent();
            $siblings = $container.siblings();

            availableContainerWidth = $dock.width();

            this.$container = $container;

            // 减去兄弟的宽度
            $siblings.each( function () {
                var $this
                    ;
                $this = $( this );
                siblingWidth = parseInt( $this.outerWidth() )
                    + parseInt( $this.css( "margin-left" ) )
                    + parseInt( $this.css( "margin-right" ) );
                availableContainerWidth -= siblingWidth;
            } );

            // 减去自身的padding和margin
            availableContainerWidth -= parseInt( $container.css( "padding-left" ) )
                + parseInt( $container.css( "padding-right" ) )
                + parseInt( $container.css( "margin-left" ) )
                + parseInt( $container.css( "margin-right" ) );

            // 减去10px，防止挤掉别的浮动元素；减去40px，预留给 indicator
            this.availableContainerWidth = availableContainerWidth - 10 - 40;

            // console.info( "availableContainerWidth: " + this.availableContainerWidth );

            return this;
        },
        /** 3. 计算 $item 的个数（itemNum）的边界： minWidthItemNum、maxWidthItemNum */
        _calItemNum: function () {
            this.itemNum = this.$container.find( this.itemSelector ).size()
                + this.$dockDropmenu.find( this.itemSelector ).size();
            this.minWidthItemNum = Math.floor(
                this.availableContainerWidth / ( this.minItemWidth + this.itemGap )
            );
            this.maxWidthItemNum = Math.floor(
                this.availableContainerWidth / ( this.maxItemWidth + this.itemGap )
            );
            // console.info( "minWidthItemNum: " + this.minWidthItemNum );
            // console.info( "maxWidthItemNum: " + this.maxWidthItemNum );
            return this;
        },
        /**
         // 4. 当增加 $item 时，先隐藏
         // 4.0 当 hiddenItemNum > 0 时，直接追加到 $itemDropmenu，结束
         // 4.1 当 itemNum < maxWidthItemNum 时，直接新增 $item，结束

         // 4.2 当 itemNum <= minWidthItemNum 时，则需调整所有 $item 的宽度，
         //     进入循环逐步调整
         //         循环条件：totalItemWidth >= availableContainerWidth
         //         循环体：
         //             nowItemWidth = itemWidth + itemGap - stepItemWith
         //             totalItemWidth = nowItemWidth * itemNum
         //     循环结束
         //         currentItemWidth = nowItemWidth - itemGap，
         //         并设置所有 $item 的width


         // 4.3 当 itemNum > minWidthItemNum 时，
         //         显示 $indicator
         //         将 $dockDropmenuContainer 定位到 $indicator，并隐藏
         //         将 $item 插入到 $dockDropmenu

         */
        _bindOnAddDockItem: function () {
            var _this
                ;
            _this = this;
            this.$container.on( AppDock.events.add, _this.itemSelector, function () {
                var $this,
                    nowItemWidth,
                    totalItemWidth,
                    currentItemWidth,
                    indicatorPos
                    ;

                // 4. 当增加 $item 时，先隐藏（已隐藏）

                $this = $( this );

                _this.itemNum++;
                _this.$dockDropmenu.addClass( "hidden" );

                // 4.0 当 hiddenItemNum > 0 时，直接追加到 $itemDropmenu，结束
                if ( _this.hiddenItemNum > 0 ) {
                    $this.appendTo( _this.$dockDropmenu );
                    $this.show();
                    _this.hiddenItemNum++;
                    return;
                }

                // 4.1 当 itemNum <= maxWidthItemNum 时，直接新增 $item，结束
                if ( _this.itemNum <= _this.maxWidthItemNum ) {
                    _this.displayItemNum++;
                    $this.show();
                    return;
                }

                // 4.2 当 itemNum <= minWidthItemNum 时，则需调整所有 $item 的宽度，
                //     进入循环逐步调整
                //         循环条件：totalItemWidth >= availableContainerWidth
                //         循环体：
                //             nowItemWidth = itemWidth + itemGap - stepItemWith
                //             totalItemWidth = nowItemWidth * itemNum
                //     循环结束
                //         currentItemWidth = nowItemWidth - itemGap，
                //         并设置所有 $item 的width

                if ( _this.itemNum <= _this.minWidthItemNum ) {
                    nowItemWidth = _this.itemWidth + _this.itemGap;
                    do {
                        nowItemWidth -= _this.stepItemWith;
                        totalItemWidth = nowItemWidth * _this.itemNum;
                    } while ( totalItemWidth >= _this.availableContainerWidth );
                    // 循环结束后 总宽度 刚好比 可用宽度小一点点
                    currentItemWidth = nowItemWidth - _this.itemGap - 1;
                    if ( currentItemWidth < _this.minItemWidth ) {
                        currentItemWidth = _this.minItemWidth;
                    }
                    _this.itemWidth = currentItemWidth;
                    _this.$container.find( _this.itemSelector ).css( "width", currentItemWidth );
                    _this.displayItemNum++;
                    $this.show();
                    return;
                }

                // 4.3 当 itemNum > minWidthItemNum 时，
                //         显示 $indicator
                //         将 $dockDropmenuContainer 定位到 $indicator，并隐藏
                //         将 $item 插入到 $dockDropmenu
                _this.$indicator.show();
                indicatorPos = _this.$indicator.offset();
                _this.$dockDropmenuContainer.css( {
                    "top": indicatorPos.top + 30,
                    "left": indicatorPos.left
                } );
                _this.$dockDropmenu.append( this );
                _this.hiddenItemNum++;
                $this.show();
            } );
        },
        /**
         // 5. 当删除掉 $item 时，先隐藏
         // 5.1 当删除的是 $container 里的$item
         // 5.1.1 当 hiddenItemNum > 0，将第一个 $hiddenItem 移动到 $container 里，
         //          然后判断 hiddenItemNum 是否为0，为0则隐藏 $itemDropmenu，结束
         // 5.1.2 当 hiddenItemNum = 0，则
         //  如果 itemNum < maxWidthItemNum，则已经是最大宽度了，结束
         //  如果 itemNum >= maxWidthItemNum，则调整，然后结束
         //      循环条件：totalItemWidth > availableContainerWidth
         */
        _bindOnRemoveDockItem: function () {
            var _this
                ;
            _this = this;
            _this.$container.add( _this.$dockDropmenu )
                .on( AppDock.events.remove, _this.itemSelector, function () {
                    var $this,
                        nowItemWidth,
                        totalItemWidth,
                        currentItemWidth
                        ;
                    $this = $( this );

                    $this.hide();
                    _this.itemNum--;

                    // 5.1 当删除的是 $container 里的$item
                    if ( $this.parent().is( _this.containerSelector ) ) {
                        // 5.1.1 当 hiddenItemNum > 0，将第一个 $hiddenItem 移动到 $container 里，
                        //          然后判断 hiddenItemNum 是否为0，为0则隐藏 $itemDropmenu，结束
                        if ( _this.hiddenItemNum > 0 ) {
                            _this.$dockDropmenu.find( _this.itemSelector ).eq( 0 )
                                .css( "width", _this.itemWidth ).appendTo( _this.$container );
                            _this.hiddenItemNum--;
                            if ( _this.hiddenItemNum === 0 ) {
                                _this.$dockDropmenu.toggleClass( "hidden" );
                                _this.$indicator.hide();
                            }
                            return;
                        }
                        // 5.1.2 当 hiddenItemNum = 0，则
                        //  如果 itemNum < maxWidthItemNum，则已经是最大宽度了，结束
                        //  如果 itemNum >= maxWidthItemNum，则调整，然后结束
                        //      循环条件：totalItemWidth > availableContainerWidth
                        if ( _this.itemNum < _this.maxWidthItemNum ) {
                            _this.displayItemNum--;
                            return;
                        }
                        nowItemWidth = _this.itemWidth + _this.itemGap;
                        do {
                            nowItemWidth += _this.stepItemWith;
                            totalItemWidth = nowItemWidth * _this.itemNum;
                        } while ( totalItemWidth <= _this.availableContainerWidth );
                        // 循环结束后，总宽度比可用宽度大一个stepItemWith
                        currentItemWidth = nowItemWidth - _this.itemGap - _this.stepItemWith - 1;
                        if ( currentItemWidth > _this.maxItemWidth ) {
                            currentItemWidth = _this.maxItemWidth;
                        }
                        _this.itemWidth = currentItemWidth;
                        _this.$container.find( _this.itemSelector ).css( "width", currentItemWidth );
                        _this.displayItemNum--;

                        return;
                    }

                    // 5.2 当删除的是 $dockDropmenu 中的，则直接删除
                    _this.hiddenItemNum--;
                    if ( _this.hiddenItemNum === 0 ) {
                        _this.$dockDropmenu.toggleClass( "hidden" );
                        _this.$indicator.hide();
                    }

                } );
        },
        _bindOnClickIndicator: function () {
            var _this
                ;
            _this = this;
            this.$indicator.on( "click.app", function () {
                _this.$dockDropmenu.toggleClass( "hidden" );
            } );
            return this;
        },
        _bindClearMenu: function () {
            var _this
                ;
            _this = this;
            $( document ).on( "click.app", function ( event ) {
                if ( event.target == _this.$indicator.get( 0 ) ) {
                    return;
                }
                    _this.$dockDropmenu.addClass( "hidden" );
            } );

            return this;
        },
        _bindClickItenInDropmenu: function () {
            var _this
            ;
            _this  = this;
            this.$dockDropmenu.on( "click.app", this.itemSelector , function () {
                var $this,
                    $lastItem
                ;
                $this = $( this );
                $lastItem = _this.$container.find( _this.itemSelector ).last();

                $this.css( "width", _this.itemWidth );

                _this.$dockDropmenu.append( $lastItem );
                _this.$container.prepend( $this );
            } );
            return this;
        }
    };

    /**
     * 页签（AppDock）实例的默认参数
     * @type {object}
     * @property {string} icon 页签（dock）图标的URL（推荐使用绝对路径）
     * @property {string} title 页签（dock）的标题
     * @property {string} dockTemplateName 页签（dock）的模板文件名
     */
    AppDock.prototype.defaults = {
        /** 从 APP 中继承 */
        icon: "",
        /** 从 APP 中继承 */
        title: "",

        dockTemplateName: "desktop/dockItem",
        addAnimateClass: "animated flash",
        showAnimateClass: "animated flash"
    };

    // @public
    $.extend( AppDock.prototype, /** @lends AppDock.prototype */ {
        /**
         * 显示页签（AppDock） 即 让该dock处于active状态。
         * @return {AppDock} 链式调用
         */
        show: function () {
            this.$container.add( AppDock.manager.$dockDropmenu )
                .find( AppDock.manager.itemSelector ).removeClass( "active " + this.options.showAnimateClass );
            this.$target.addClass( "active " + this.options.showAnimateClass );
            return this;
        },
        /**
         * 显示页签（AppDock） 即 让该dock处于非active状态。
         * @return {AppDock} 链式调用
         */
        hide: function () {
            this.$target.removeClass( "active" );
            return this;
        },
        /**
         * 销毁AppDock。
         * @returns {AppDock}
         */
        destroy: function () {

            // 派发事件
            this.$target && this.$target.trigger( AppDock.events.remove );

            this.$target.remove();

            this.appInstance.isAppDockDestroy = true;

            this.$target = null;
            this.options = null;
            this.appInstance = null;


            return this;
        }
    } );

    // @private
    $.extend( AppDock.prototype, /** @lends AppDock.prototype */{
        /**
         * 初始化页签（AppDock）实例
         * @private
         * @param {Object} options 参数
         * @return {AppDock} 链式调用
         */
        _init: function ( options ) {
            // 1. 参数
            this.options = $.extend( {}, this.defaults, options );

            // 2. 创建target
            this._create();

            // 3. 绑定事件
            // this._bindEvent();

            return this;
        },
        /**
         * 创建页签（AppDock）节点，并将其添加到页签（AppDock）容器。
         *
         * @private
         * @return {AppDock} 链式调用
         */
        _create: function () {
            var data,
                $target,
                _this,
                htmlString
                ;

            _this = this;

            // 1. 数据 和 模板
            data = {
                icon: this.options.icon,
                title: this.options.title
            };

            // 2. 获取模板
            htmlString = dockItemTplRender( data );


            $target = $( htmlString );

            $target.hide();

            // 3. 添加进 container
            _this.$container.append( $target );

            _this.$target = $target;

            _this.show();

            _this._bindEvent();

            // 派发事件
            $target.trigger( AppDock.events.add );

            return this;
        },
        /**
         * 给页签（AppDock）绑定事件
         * @private
         * @return {AppDock} 链式调用
         */
        _bindEvent: function () {
            var _this
                ;
            _this = this;

            // 1. 点击关闭，销毁应用
            _this.$target.find( ".dock-item-btn" ).on( AppDock.events.close, function ( event ) {
                // 阻止冒泡
                event.stopPropagation();
                _this.appInstance && ( !_this.appInstance.isAppDestroy )
                && _this.appInstance.destroy();
            } );

            // 2. 点击dock，显示应用
            _this.$target.on( AppDock.events.show, function () {
                _this.appInstance.show();
            } );


            return this;
        }
    } );


    return AppDock;
} );
