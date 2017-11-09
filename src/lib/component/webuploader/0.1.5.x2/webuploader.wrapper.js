/**
 * @fileOverview 对 webuploader(https://fex-team.github.io/webuploader) 的一些封装，便于使用；类似于精简版。
 *
 *  也就是说，预定义几套上传组件。
 *
 *
 * @author 吴钦飞（wuqf@pkusoft.net）
 */
define( function ( require ) {
    "use strict";
    var
        $ = require( "jquery" ) ,
        WebUploader = require( "../0.1.5/webuploader" ) || window[ "WebUploader" ],
        NAMESPACE = "pkui.webuploader"
    ;

    // 样式
    require( "./css/webuploader.css" );

    /**
     * @description 默认参数
     *      以“_”打头的参数：本模块的参数，而非传入给 WebUploader 的参数
     */
    PkuiWebUploader.prototype.defaults = {
        _mode: "full",
        paste: document.body,
        // accept: {
        //     extensions: "gif,jpg,jpeg,bmp,png,doc,docx,dmg",
        // },
        disableGlobalDnd: true,
        chunked: true,
        fileNumLimit: 300,
        fileSizeLimit: 200 * 1024 * 1024,    // 200 M
        fileSingleSizeLimit: 50 * 1024 * 1024    // 50 M
    };

    /**
     * @constructor
     * @parm $target {jQuery}
     * @parm opts {{}?}
     */
    function PkuiWebUploader( $target, opts ) {
        this._init( $target, opts );
    }

    /**
     * @description 声明实例属性
     * @private
     */
    PkuiWebUploader.prototype._declare = function () {

        /** 目标元素 */
        this.$target = null;

        /** 参数 */
        this.options = null;

        /** WebUploader 的实例 */
        this.webUploaderInstance = null;

    };

    /**
     * @description 初始化
     * @private
     */
    PkuiWebUploader.prototype._init = function ( $target, opts ) {
        var
            _this = this
        ;

        if ( ! WebUploader.Uploader.support() ) {
            alert( "Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器");
            throw new Error( "WebUploader does not support the browser you are using." );
        }

        if ( ! $target ) {
            throw " target is required!";
        }

        this._declare();

        this.$target = $target;
        this.options = this.getOptions( opts );

        switch( this.options._mode ) {
            case "full": {
                require.async( "./mode/full", function () {
                    _this._fullUploader_init();
                } );
                break;
            }
            case "file": {

                break;
            }
            default: {

            }
        }

    };

    /**
     * @description 获取非图片fileitem的缩略图CSS类
     * @param fileExt {String?} 文件后缀名
     * @private
     */
    PkuiWebUploader.prototype._getFileTypeClass = function ( fileExt ) {
        fileExt = fileExt || "file";
        return "wu-fileitem-thumbnail-file wu-fileitem-thumbnail-" + fileExt;
    };

    /**
     * @description 获取参数
     *      参数来源：
     *          1、默认参数（优先级低）
     *          2、HTML参数（data-pkui-component-options）（优先级中）
     *          3、参入的函数参数（优先级高）
     *
     * @param isRefresh {Boolean?} 重新获取
     * @return {*}
     */
    PkuiWebUploader.prototype.getOptions = function ( isRefresh ) {
        var
            opts
        ;
        if ( this.options && ! isRefresh ) {
            return this.options;
        }
        opts = $.extend( true, {}, this.defaults, this.$target.data( "pkui-component-options" ) );
        this.options = opts;
        return opts;
    };


    /**
     * @description 设置 WebUploader 示例
     * @param webUploaderInstance {*} WebUploader 的实例
     */
    PkuiWebUploader.prototype.setWebUploaderInstance = function ( webUploaderInstance ) {
        this.webUploaderInstance = webUploaderInstance;
    };
    /**
     * @description 获取 WebUploader 示例
     */
    PkuiWebUploader.prototype.getWebUploaderInstance = function () {
        return this.webUploaderInstance;
    };



    /**
     * 注册到 jQuery.fn
     * @param opts {(*|String)?}
     * @returns {jQuery}
     */
    $.fn.pkuiWebUploader = function ( opts ) {
        return this.each( function () {
            var
                $this = $( this ),
                instance = $this.data( NAMESPACE )
            ;
            // 已经初始化
            if ( instance ) {
                // 如果是参数字符串
                if ( typeof opts === "string" ) {
                    // 如果是私有方法，则返回
                    if ( opts.charAt( 0 ) === '_' ) {
                        return;
                    }
                    instance[ opts ].apply( instance, [].slice.call( args, 1 ) );
                }
                // 如果是参数对象，则 reset
                else if ( opts ) {
                    //instance._reset( true );
                    //instance._init( this, options );
                }
            }
            // 初始化
            else {
                $this.attr( "isrendered", true );
                $this.data( NAMESPACE, new PkuiWebUploader( $this, opts ) );
            }
        } );

    };


    if ( window.PKUI ) {
        window.PKUI.component.webuploader2 = $.fn.pkuiWebUploader;
    }

    return PkuiWebUploader;

} );