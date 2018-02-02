/**
 * @fileOverview 对 bootgrid 的扩展，扩展删除记录功能
 * @author 吴钦飞（wuqf@pkusoft.net）
 */
define( function ( require ) {
    var
        $ = require( "jquery" ),
        layer = window.layer,

        namespace = "pkui.datagrid.delete",
        defaults
        ;

    defaults = {
        // "#sysParaDatagrid"
        datagridSelector: "",
        // "paraCode"
        PKName: "",
        // "__CTX__/admin/sysParaDelete"
        url: "",
        /** 额外的参数
         * "extraData": {
         *      "isSend": "#sysMessage-isSend"
         *  }
         */
        extraData: null,

        // 确认对话框-标题文字
        confirmDialogTitle: "信息",
        // 确认对话框-内容文字
        confirmDialogContent: "是否删除？",
        // 确认对话框-确认按钮上的文字
        confirmDialogOkBtnText: "删除",
        // 确认对话框-取消按钮上的文字
        confirmDialogCancelBtnText: "取消",

        // 发送删除请求并成功删除，如果返回的 JsonResult.message 为空，则显示默认的成功提示
        successDeleteTips: "删除成功！",
        // 发送删除请求但删除失败，如果返回的 JsonResult.message 为空，则显示默认的失败提示
        failDeleteTips: "删除失败：未知的错误",

        // 删除记录后，是否标记删除行
        isMarkAfterDeleteRecord: true,
        // 删除记录后，是否移除<tr>
        isRemoveRowAfterDeleteRecord: false,
        // 删除记录后，是否刷新表格（datagrid）
        isReloadDeleteRecord: false
    };

    function DatagridDelete( target, options ) {
        this.options = $.extend( true, {}, defaults, options );
        this.$target = $( target );
        this.$datagrid = $( this.options.datagridSelector );
        _init.call( this );
    }

    function _init() {
        var
            options = this.options,
            $button = this.$target,
            $table = this.$datagrid
            ;
        this.$target.on( "click." + namespace, function () {
            deleteRecord( $table, $button, options );
        } );
    }

    function deleteRecord( $table, $button, options ) {
        var
            seletedRowIds = $table.bootgrid( "getSelectedRows" ),
            extraData = options.extraData,
            data = ""
            ;

        // 如果处于 isloading 状态，则退出
        if ( $button.attr( "disabled" ) ) {
            return;
        }

        if ( seletedRowIds.length === 0 ) {
            layer.msg( '请选中一条或多条记录进行删除！', { icon: 0 } );
            return;
        }

        /*
        confirmDialogTitle: "信息",
        confirmDialogContent: "是否删除？",
        confirmDialogOkBtnText: "删除",
        confirmDialogCancelBtnText: "取消"
        */
        // 确认删除
        layer.confirm( options.confirmDialogContent,
            {
                title: options.confirmDialogTitle,
                btn: [ options.confirmDialogOkBtnText , options.confirmDialogCancelBtnText ] //按钮
            },
            // 确认
            function( index ){
                doDelete();
                layer.close( index );
            },
            // 取消
            function(){

            }
        );

        function doDelete () {
            var
                paraName,
                paraSelector
            ;
            // 打开 loading
            $button.isLoading( { position: "insideButton" } );

            // 将 [ 1, 2, 3 ] 转换为 "paraCode=1&paraCode=2&paraCode=3"
            $.each( seletedRowIds, function ( index, pkValue ) {
                if ( index > 0 ) {
                    data += "&";
                }
                data += options.PKName + "=" + pkValue;
            } );

            // 处理额外的参数
            if ( extraData ) {
                for ( paraName in extraData ) {
                    if ( ! extraData.hasOwnProperty( paraName ) ) {
                        continue;
                    }
                    paraSelector = extraData[ paraName ];
                    data += "&" + paraName + "=" + $( paraSelector ).val();
                }
            }

            $.ajax( {
                url: options.url,
                data: data
            } ).done( function ( jsonResult ) {
                // 服务器端处理成功
                if ( jsonResult.success ) {
                    // 提示
                    layer.msg( jsonResult.message || options.successDeleteTips, { icon: 1 } );
                    // 标志 删除的那行
                    if ( options.isMarkAfterDeleteRecord ) {
                        $table.bootgrid( "deleteRow", seletedRowIds );
                    }
                    // 移除 已删除的行
                    if ( options.isRemoveRowAfterDeleteRecord ) {
                        $table.bootgrid( "remove", seletedRowIds );
                    }
                    // 刷新
                    if ( options.isReloadDeleteRecord ) {
                        $table.bootgrid( "reload" );
                    }

                }
                // 服务器端处理失败
                else {
                    // 提示
                    layer.alert( jsonResult.message || options.failDeleteTips , { icon: 2 } );
                }
            } ).fail( function () {
                // 提示网络错误
                layer.alert( '网络错误/登陆失效！', { icon: 0 } );
            } ).always( function () {
                // 关闭 loading
                $button.isLoading( "hide" );
            } );
        }
    }


    $.fn.DatagridDelete = function ( options ) {
        var _this = this,
            args = arguments;


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
                $( this ).data( namespace, new DatagridDelete( this, options ) );
                // FIX 标志已被初始化
                $( this ).attr( "isrendered", true );
            }
        } );

        return this;
    };

    window.PKUI.component[ "datagrid-delete" ] = $.fn.DatagridDelete;
} );