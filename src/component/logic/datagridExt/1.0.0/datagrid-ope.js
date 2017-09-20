/**
 * @fileOverview
 *  对 bootgrid 的扩展，
 *  当操作列里面的功能按钮（链接）过多时，以下拉菜单的方式呈现
 *
 *  具体执行流程：
 *      1. bootgrid 数据载入完毕后
 *      2. 计算 操作列的整体宽度 columnWidth，计算 操作列内所有操作元素的总宽度 allEltsWidth
 *      3. 如果 columnWidth < allEltsWidth，
 *         则添加占位容器元素“更多”，并逐步将操作元素追加到“更多”，直至 columnWidth > allEltsWidth
 *      4. 点击“更多”时，在 bootgrid 的父元素里创建弹出层下拉菜单，将“更多”里的操作元素克隆到弹出层下拉菜单
 *      5. 一旦弹出层下拉菜单关闭，立即销毁
 *      6. 一旦调整列宽后，重复步骤2、3
 *
 *  注意：
 *      在数据载入完毕后，进行实例化
 *
 * @author 吴钦飞（wuqf@pkusoft.net）
 */
define( function ( require ) {
    "use strict";
    var
        $ = require( "jquery" ),
        namespace = "pkui.datagrid.ope"
    ;

    /**
     * 默认参数
     */
    DatagridOpe.prototype.defaults = {
        // 操作列单元格：第一行第一列最后一个单元格
        opeCellSelector: "tbody>tr>td:last-child>.pkui-grid-cell",
        moreTemplate: "<button type='button' class='btn btn-info-2 js--more'>　<span class='caret'></span> 更多</button>"
    };

    /**
     * 构造函数
     * @param target {Element} table
     * @param opts {{}?}
     * @constructor
     */
    function DatagridOpe( target, opts ) {
        this.$target = $( target );
        this._init( opts );
    }

    /**
     * 初始化方法
     * @param opts {{}?}
     * @private
     */
    DatagridOpe.prototype._init = function ( opts ) {
        this.opts = $.extend( true, {}, this.defaults, opts );
        this.adjustOpeColumnContent();
    };

    /**
     * 调整操作列的内容
     */
    DatagridOpe.prototype.adjustOpeColumnContent = function () {
        var
            $opeColumn = this._getOpeColumn(),
            $opeColumnChildren = $opeColumn.children(),
            opeColumnWidth = this._calcOpeColumnWidth( $opeColumn ),
            opeColumnContentWidth = this._calcOpeColumnContentWidth( $opeColumn )
        ;
        // 如果 操作列的宽度 大于 内容的宽度，则不进行调整
        if ( opeColumnWidth > opeColumnContentWidth ) {
            return;
        }
        // 如果 操作列内的功能按钮（链接）数 少于 3，则不行调整
        if ( $opeColumnChildren.size() < 3 ) {
            return;
        }

        // TODO
    };


    /**
     * 计算操作列的宽度
     * @param $opeColumn {jQuery}
     * @return {number}
     * @private
     */
    DatagridOpe.prototype._calcOpeColumnWidth = function ( $opeColumn ) {
        $opeColumn = $opeColumn || this._getOpeColumn();
        return $opeColumn.width();
    };

    /**
     * 计算操作列内各个元素的宽度和
     * @param $opeColumn {jQuery}
     * @return {number}
     * @private
     */
    DatagridOpe.prototype._calcOpeColumnContentWidth = function ( $opeColumn ) {
        var
            $children,
            totalWidth = 0
        ;
        $opeColumn = $opeColumn || this._getOpeColumn();
        $children = $opeColumn.eq( 0 ).children();
        $children.each( function () {
            var
                $this = $( this )
            ;
            totalWidth += ( $this.outerWidth() || 0 );
        } );
        return totalWidth;
    };

    /**
     * 获取所有的操作列
     * return {jQuery}
     * @private
     */
    DatagridOpe.prototype._getOpeColumn = function () {
        return this.$target.find( this.opts.opeCellSelector );
    };

    $.fn.DatagridOpe = function ( options ) {
        var
            _this = this,
            args = arguments
        ;


        _this.each( function () {
            var instance = $( this ).data( namespace );

            // 已经初始化
            if ( instance ) {
                // 如果是方法名字符串
                if ( typeof options === "string" ) {
                    // 如果是私有方法，则返回
                    if ( options.charAt( 0 ) === '_' ) {
                        return;
                    }
                    instance[ options ].apply( instance, [].slice.call( args, 1 ) );
                }
                // 如果是参数对象，则 reset
                else if ( options ) {
                    //instance._reset( true );
                    //instance._init( this, options );
                }
            }
            // 初始化
            else {
                $( this ).data( namespace, new DatagridOpe( this, options ) );
                // FIX 标志已被初始化
                $( this ).attr( "isrendered", true );
            }
        } );

        return this;
    };

    window.PKUI.component[ "datagrid-ope" ] = $.fn.DatagridOpe;
} );