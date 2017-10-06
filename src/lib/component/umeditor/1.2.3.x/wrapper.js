/**
 * @override 将UMEditor封装成PKUI组件，以便于使用
 * @author 吴钦飞（wuqf@pkusoft.net）
 */
define( function ( require ) {

    window.UMEDITOR_HOME_URL = window.PKUI.basePath + "/lib/component/umeditor/1.2.3.x/";

    // 引入 UMEditor
    require( "lib/component/umeditor/1.2.3.x/lang/zh-cn/zh-cn" );

    var
        namespace = "pkui.umeditor"
    ;
    /**
     *
     * @param target {Element} UMEditor绑定的元素
     * @param opts {{}?} UMEditor的参数
     * @constructor
     */
    function UMEditor( target, opts ) {
        var
            targetId = target.id
        ;
        if ( ! targetId ) {
            window.layer.alert( { icon: 2 }, "UMEditor绑定的元素必须要有id属性" );
            throw "UMEditor绑定的元素必须要有id属性";
        }
        setTimeout( function () {
            window.UM.getEditor( targetId, opts );
        }, 500 );
    }

    // 注册到jQuery
    $.fn.UMEditor = function ( options ) {
        var
            _this = this,
            args = arguments
        ;


        _this.each( function () {
            var
                instance = $( this ).data( namespace ),
                UM,
                editor,
                editorId,
                p
            ;

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
                // FIX 标志已被初始化
                $( this ).attr( "isrendered", true );

                /*
                    由于，实例都是以id为键名缓存在 UM的cache 中
                    而一般性的移除容器节点无法达到达到真正的删除
                    所以，再以相同id再次创建实例时，需要进行销毁
                */
                UM = window.UM;
                editorId = this.id;
                editor = UM.clearCache( editorId );

                if ( editor ) {
                    for ( p in editor ) {
                        if ( editor.hasOwnProperty( p ) ) {
                            delete editor[ p ];
                        }
                    }
                }


                $( this ).data( namespace, new UMEditor( this, options ) );
            }
        } );

        return this;
    };

    // 注册为PKUI组件
    window.PKUI.component.umeditor = $.fn.UMEditor;

} );