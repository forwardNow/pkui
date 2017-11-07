/**
 * @fileOverview 对 webuploader(https://fex-team.github.io/webuploader) 的一些封装，便于使用；类似于精简版。
 *
 *  也就是说，预定义几套上传组件。
 *
 *
 * @author 吴钦飞（wuqf@pkusoft.net）
 */
( function ( root, factory ) {
    // CMD
    if ( typeof define === "function" && define.cmd ) {
        define( function ( require ) {
            var
                $ = require( "jquery" ),
                WebUploader = require( "webuploader" ) || root[ "WebUploader" ]
            ;

            require( "./css/webuploader.css" );

            factory( $, WebUploader );
        } );
    }
    // global
    else {
        // Browser globals (root is window)
        factory( root[ "jQuery" ], root[ "WebUploader" ] );
    }
}( this, function ( $, WebUploader ) {
    "use strict";
    var
        NAMESPACE = "pkui.webuploader"
    ;
    if ( ! $ ) {
        throw "jQuery is required!";
    }
    if ( ! WebUploader ) {
        throw "webuploader is required!";
    }

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
     * @private
     * @description 初始化
     */
    PkuiWebUploader.prototype._init = function ( $target, opts ) {
        if ( ! $target ) {
            throw " target is required!";
        }
        this.$target = $target;
        this.options = this.getOptions( opts );

        //this.webuploaderOptions = null;
        //this.originWebUploader = this.getOriginWebUploader();

        switch( this.options._mode ) {
            case "full": {
                this._initFullUploader();
                break;
            }
            case "": {

                break;
            }
            default: {

            }
        }

    };


    /**
     * @description 获取参数，会抽取 target 的 “data-webuploader-options” 的参数
     * @param opts {{}?}
     * @return {*}
     */
    PkuiWebUploader.prototype.getOptions = function ( opts ) {
        if ( this.options ) {
            return this.options;
        }
        return $.extend( true, {}, this.defaults, this.$target.data( "pkui-component-options" ), opts );
    };

    /**
     * @description 过滤掉所有非webuploader的参数
     * @return {{}}
     */
    PkuiWebUploader.prototype.getWebUploaderOptions = function () {
        var
            optionName
        ;

        if ( ! this.options ) {
            this.options = this.getOptions();
        }
        if ( this.webUploaderOptions ) {
            return this.webUploaderOptions;
        }

        this.webUploaderOptions = {};

        for ( optionName in this.options ) {
            if ( ! this.options.hasOwnProperty( optionName ) ) {
                continue;
            }
            if ( optionName.charAt( 0 ) === '_' ) {
                continue;
            }
            this.webUploaderOptions[ optionName ] = this.options[ optionName ];
        }

        return this.webUploaderOptions;
    };

//-----------
    PkuiWebUploader.prototype.defaults.fullUploader = {
        skeletonTemplate:
        //  '<div class="wu-container">'
              '<div class="wu-filelist-container">'
        +         '<div class="wu-dnd-placeholder">'
        +             '<div class="wu-filepicker"><!-- 开始上传 --></div>'
        +             '<div>或将文件拖到这里，单次最多可选30个</div>'
        +         '</div>'
        +         '<div class="wu-filelist"></div>'
        +     '</div>'
        +     '<div class="wu-statusbar" style="display:none;">'
        +         '<div class="wu-statusbar-progress" style="display: none;">'
        +             '<span class="wu-statusbar-progress-text">0%</span>'
        +             '<span class="wu-statusbar-progress-percentage" style="width: 0%;"></span>'
        +         '</div>'
        +         '<div class="wu-statusbar-info">共0个（0B），已上传0个</div>'
        +         '<div class="wu-statusbar-btns">'
        +             '<div class="wu-filepicker"><!-- 继续上传 --></div>'
        +             '<div class="wu-btn-upload state-pedding">开始上传</div>'
        +         '</div>'
        +     '</div>'
        //+ '</div>'
        ,

        fileitemTemplate:
          '<div id="{{file.id}}" class="wu-fileitem">'
        +     '<div class="wu-fileitem-thumbnail"></div>'
        +     '<div class="wu-fileitem-title">{{file.name}}</div>'
        +     '<div class="wu-fileitem-progress" style="display: none;">'
        +         '<div class="wu-fileitem-progress-bar" style="width: 0;"></div>'
        +     '</div>'
        +     '<div class="wu-fileitem-control" style="display: none;">'
        +         '<span class="wu-fileitem-control-cancel">删除</span>'
        +         '<span class="wu-fileitem-control-rotateRight">向右旋转</span>'
        +         '<span class="wu-fileitem-control-rotateLeft">向左旋转</span>'
        +     '</div>'
        +     '<div class="wu-fileitem-error" style="display: none;"></div>'
        +     '<div class="wu-fileitem-success" style="display: none;"></div>'
        + '</div>'


    };

    /**
     * @description 创建完整版的组件
     * @private
     */
    PkuiWebUploader.prototype._initFullUploader = function () {
        // var
        //     options = this.options,
        //     webUploaderOptions = this.webUploaderOptions
        // ;

        if ( ! WebUploader.Uploader.support() ) {
            alert( "Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器");
            throw new Error( "WebUploader does not support the browser you are using." );
        }

        this._createFullUploader();
        this._renderFullUploader();
        this._bindFullUploader();
    };

    PkuiWebUploader.prototype._createFullUploader = function () {
        var
            fullUploaderOptions = this.options.fullUploader
        ;
        this.$target.addClass( "wu-full wu-container" );
        this.$target.html( fullUploaderOptions.skeletonTemplate );
    };

    PkuiWebUploader.prototype._renderFullUploader = function () {
        var
            $target = this.$target
        ;

        // 文件缩略图容器
        this.$filelistContainer = $target.find( ".wu-filelist-container" );

        // 文件缩略图容器 - 文件选取按钮
        this.$dndFilepickerBtn = this.$filelistContainer.find( ".wu-filepicker" );

        // 文件缩略图容器 - 图片队列
        this.$filelist = this.$filelistContainer.find( ".wu-filelist" );

        // 文件缩略图容器 - 没选择文件之前的内容（占位内容）
        this.$placeHolder = this.$filelistContainer.find(".wu-dnd-placeholder");

        // 状态栏
        this.$statusbar = $target.find( ".wu-statusbar" );

        // 状态栏 - 总体进度条
        this.$statusbarProgress = this.$statusbar.find(".wu-statusbar-progress");

        // 状态栏 - 文件总体选择信息。
        this.$statusbarInfo = this.$statusbar.find(".wu-statusbar-info");

        // 状态栏 - 文件选取按钮
        this.$statusbarFilepickerBtn = this.$statusbar.find( ".wu-filepicker" );

        // 状态栏 -上传按钮（开始上传）
        this.$uploadBtn = this.$statusbar.find(".wu-btn-upload");

        // 添加的文件数量
        this.fileCount = 0;

        // 添加的文件总大小
        this.fileSize = 0;

        // 优化retina, 在retina下这个值是2
        this.ratio = window[ "devicePixelRatio" ] || 1;

        // 缩略图大小
        this.thumbnailWidth = 110 * this.ratio;
        this.thumbnailHeight = 110 * this.ratio;

        // 状态：可能有 pedding, ready, uploading, confirm, done.
        this.state = "pedding";

        // 所有文件的进度信息，key为file id
        this.percentages = {};

        this.supportTransition = (function(){
            var s = document.createElement("p").style,
                r = "transition" in s ||
                    "WebkitTransition" in s ||
                    "MozTransition" in s ||
                    "msTransition" in s ||
                    "OTransition" in s;
            s = null;
            return r;
        })();

    };

    PkuiWebUploader.prototype._bindFullUploader = function () {
        var
            _this = this
        ;
        // 实例化
        this.uploaderInstance = WebUploader.create( this.getWebUploaderOptions() );

        // 开始上传按钮
        _this.$uploadBtn.on( "click", function () {
            if ( $( this ).hasClass( "disabled" ) ) {
                return false;
            }

            if ( _this.state === "ready" ) {
                _this.uploaderInstance.upload();
            } else if ( _this.state === "paused" ) {
                _this.uploaderInstance.upload();
            } else if ( _this.state === "uploading" ) {
                _this.uploaderInstance.stop();
            }
        });

        _this.$statusbarInfo.on( "click", ".retry", function() {
            _this.uploaderInstance.retry();
        } );



        // 文件缩略图容器 - 文件选取按钮
        this.uploaderInstance.addButton( {
            id: this.$dndFilepickerBtn.get( 0 ),
            label: "点击选择文件"
        } );

        // 状态栏 - 文件选取按钮
        this.uploaderInstance.addButton( {
            id: this.$statusbarFilepickerBtn.get( 0 ),
            label: "继续添加"
        } );

        // 当有文件加入队列时（当文件被加入队列以后触发）
        this.uploaderInstance.on( "fileQueued", function ( file ) {

            // 总文件数加1
            _this.fileCount++;
            // 总文件大小加1
            _this.fileSize += file.size;

            // 当加入第一个文件时，隐藏dnd容器，并显示状态栏
            if ( _this.fileCount === 1 ) {
                _this.$placeHolder.addClass( "webuploader-element-invisible" );
                _this.$statusbar.show();
            }

            // 将文件的缩略图加入到 缩略图队列
            addFileitem( file );

            // 文件状态
            setState( "ready" );
            updateTotalProgress();
        } );

        this.uploaderInstance.on( "fileDequeued", function( file ) {
            _this.fileCount--;
            _this.fileSize -= file.size;

            if ( !_this.fileCount ) {
                setState( "pedding" );
            }

            removeFile( file );
            updateTotalProgress();

        } );
        
        this.uploaderInstance.on( "uploadProgress", function( file, percentage ) {
            var
                $fileitem = $( "#" + file.id ),
                $percent = $fileitem.find(".wu-fileitem-progress-bar")
            ;

            $percent.css( "width", percentage * 100 + "%" );
            _this.percentages[ file.id ][ 1 ] = percentage;
            updateTotalProgress();
        } );

        this.uploaderInstance.on( "all", function( type ) {
            switch( type ) {
                case "uploadFinished":
                    setState( "confirm" );
                    break;

                case "startUpload":
                    setState( "uploading" );
                    break;

                case "stopUpload":
                    setState( "paused" );
                    break;
            }
        });

        this.uploaderInstance.on( 'error', function ( type ) {
            switch ( type ) {
                case "F_EXCEED_SIZE": { // 尝试给uploader添加的文件大小超出这个值时
                    alert( "单个文件大小不符合要求：超过" + WebUploader.formatSize( _this.options.fileSingleSizeLimit ) );
                    break;
                }
                case "Q_TYPE_DENIED": { // 当文件类型不满足时触发
                    alert( "文件类型不符合要求：仅限 " + _this.options.accept.extensions + " 类型。" );
                    break;
                }
                case "Q_EXCEED_NUM_LIMIT": { // 在设置了fileNumLimit且尝试给uploader添加的文件数量超出这个值
                    alert( "文件总数量不符合要求：超过" + _this.options.fileNumLimit );
                    break;
                }
                case "Q_EXCEED_SIZE_LIMIT": { // 尝试给uploader添加的文件总大小超出这个值时
                    alert( "文件总大小不符合要求：超过" + WebUploader.formatSize( _this.options.fileSizeLimit ) );
                    break;
                }
                default: {
                    alert( "错误类型：" + type );
                }
            }
        } );

        _this.$target.addClass( "state-" + _this.state );
        updateTotalProgress();


        function addFileitem( file ) {
            var
                $fileitem,
                $prgressbar,
                $thumbnail,
                $control,
                $error,
                $success
            ;

            $fileitem = $( _this.options.fullUploader.fileitemTemplate
                            .replace( "{{file.id}}", file.id )
                            .replace( "{{file.name}}", file.name ) );

            $prgressbar = $fileitem.find( ".wu-fileitem-progress-bar" );
            $control = $fileitem.find( ".wu-fileitem-control" );

            $thumbnail = $fileitem.find( ".wu-fileitem-thumbnail" );
            $error = $fileitem.find( ".wu-fileitem-error" );
            $success = $fileitem.find( ".wu-fileitem-success" );


            // 文件不合法
            if ( file.getStatus() === "invalid" ) {
                showError( file.statusText );
            }
            // 缩略图
            else {
                $thumbnail.text( "正在生成缩略图" );
                // 图片
                if ( file.type.indexOf( "image" ) !== -1 ) {
                    _this.uploaderInstance.makeThumb( file, function( error, src ) {
                        if ( error ) {
                            $thumbnail.text( "不能预览" );
                            return;
                        }

                        $thumbnail.empty().append( $( "<img src='" + src + "' class='wu-fileitem-img'>" ) );
                    }, _this.thumbnailWidth, _this.thumbnailHeight );
                }
                // 非图片
                else {
                    $thumbnail.addClass( "wu-fileitem-thumbnail-placeholder" );
                }

                $thumbnail.text("");

                // 保存文件的进度信息
                _this.percentages[ file.id ] = [ file.size, 0 ];

                file.rotation = 0;

            }


            // 控制器
            $control.on( "click", "span", function () {
                var
                    deg,
                    $this = $( this )
                ;

                if ( $this.is( ".wu-fileitem-control-cancel" ) ) {
                    _this.uploaderInstance.removeFile( file );
                    return;
                } else if ( $this.is( ".wu-fileitem-control-rotateRight" ) ) {
                    file.rotation += 90;
                } else if ( $this.is( ".wu-fileitem-control-rotateLeft" ) ) {
                    file.rotation -= 90;
                }

                if ( _this.supportTransition ) {
                    deg = "rotate(" + file.rotation + "deg)";
                    $thumbnail.css({
                        "-webkit-transform": deg,
                        "-mos-transform": deg,
                        "-o-transform": deg,
                        "transform": deg
                    });
                } else {
                    $thumbnail.css( "filter", "progid:DXImageTransform.Microsoft.BasicImage(rotation="+ (~~((file.rotation/90)%4 + 4)%4) +")");
                }

            });

            file.on( "statuschange", function( cur, prev ) {
                if ( prev === "progress" ) {
                    $prgressbar.width(0);
                } else if ( prev === "queued" ) {
                    // $fileitem.off( "mouseenter mouseleave" );
                    $control.find( ".wu-fileitem-control-cancel" ).remove();
                }

                // 成功
                if ( cur === "error" || cur === "invalid" ) {
                    console.log( file.statusText );
                    showError( file.statusText );
                    _this.percentages[ file.id ][ 1 ] = 1;
                } else if ( cur === "interrupt" ) {
                    showError( "interrupt" );
                } else if ( cur === "queued" ) {
                    _this.percentages[ file.id ][ 1 ] = 0;
                } else if ( cur === "progress" ) {
                    $error.hide();
                    $prgressbar.show();
                } else if ( cur === "complete" ) {
                    $success.show();
                }

                $fileitem.removeClass( "state-" + prev ).addClass( "state-" + cur );


            });

            $fileitem.on( "mouseenter", function() {
                $control.stop().slideDown();
            });

            $fileitem.on( "mouseleave", function() {
                $control.stop().slideUp();
            });

            _this.$filelist.append( $fileitem );

            function showError( fileStatusText ) {
                var
                    errorText
                ;
                switch ( fileStatusText ) {
                    case "exceed_size":
                        errorText = "文件大小超出";
                        break;

                    case "interrupt":
                        errorText = "上传暂停";
                        break;

                    default:
                        errorText = "上传失败，请重试";
                        break;
                }
                $error.show().text( errorText );
            }
        }

        function setState( val ) {
            var
                stats
            ;

            if ( val === _this.state ) {
                return;
            }

            _this.$target.removeClass( "state-" + _this.state );
            _this.$target.addClass( "state-" + val );
            _this.state = val;

            switch ( _this.state ) {
                case "pedding":
                    _this.$placeHolder.removeClass( "webuploader-element-invisible" );
                    _this.$filelistContainer.removeClass("filled");
                    _this.$filelist.hide();
                    _this.$statusbar.addClass( "webuploader-element-invisible" );
                    _this.uploaderInstance.refresh();
                    break;

                case "ready":
                    _this.$placeHolder.addClass( "webuploader-element-invisible" );
                    _this.$statusbarFilepickerBtn.removeClass( "webuploader-element-invisible");
                    _this.$filelistContainer.addClass("filled");
                    _this.$filelist.show();
                    _this.$statusbar.removeClass("webuploader-element-invisible");
                    _this.uploaderInstance.refresh();
                    break;

                case "reReady":
                    setState( "ready" );
                    _this.$uploadBtn.text( "开始上传" ).removeClass( "disabled" );
                    break;

                case "uploading":
                    _this.$statusbarFilepickerBtn.addClass( "webuploader-element-invisible" );
                    _this.$statusbarProgress.show();
                    _this.$uploadBtn.text( "暂停上传" );
                    break;

                case "paused":
                    _this.$statusbarProgress.show();
                    _this.$uploadBtn.text( "继续上传" );
                    break;

                case "confirm":
                    _this.$statusbarProgress.hide();
                    _this.$uploadBtn.text( "开始上传" ).addClass( "disabled" );

                    stats = _this.uploaderInstance.getStats();
                    if ( stats.successNum && !stats.uploadFailNum ) {
                        setState( "finish" );
                        return;
                    }
                    break;
                case "finish":
                    stats = _this.uploaderInstance.getStats();
                    if ( stats.successNum ) {

                        //alert( "上传成功" );

                    } else {
                        // 没有成功的图片，重设
                        _this.state = "done";
                        //location.reload();
                    }


                    setState( "reReady" );

                    break;
            }

            updateStatus();
        }

        function updateTotalProgress() {
            var loaded = 0,
                total = 0,
                $spans = _this.$statusbarProgress.children(),
                percent;

            $.each( _this.percentages, function( k, v ) {
                total += v[ 0 ];
                loaded += v[ 0 ] * v[ 1 ];
            } );

            percent = total ? loaded / total : 0;

            $spans.eq( 0 ).text( Math.round( percent * 100 ) + "%" );
            $spans.eq( 1 ).css( "width", Math.round( percent * 100 ) + "%" );
            updateStatus();
        }

        function updateStatus() {
            var
                text = "",
                stats
            ;

            if ( _this.state === "ready" ) {
                text = "选中" + _this.fileCount + "个文件，共" + WebUploader.formatSize( _this.fileSize ) + "。";
            } else if ( _this.state === "confirm" ) {
                stats = _this.uploaderInstance.getStats();
                if ( stats.uploadFailNum ) {
                    text = "已成功上传 " + stats.successNum+ " 个文件，" + stats.uploadFailNum + " 个文件上传失败，<a class='retry' href='#'>重新上传</a>失败文件"
                }

            } else {
                stats = _this.uploaderInstance.getStats();
                text = "共" + _this.fileCount + "个（" + WebUploader.formatSize( _this.fileSize )  + "），已上传" + stats.successNum + "个";

                if ( stats.uploadFailNum ) {
                    text += "，失败" + stats.uploadFailNum + "个";
                }
            }

            _this.$statusbarInfo.html( text );
        }

        function removeFile( file ) {
            var
                $fileitem = $( "#" + file.id )
            ;

            delete _this.percentages[ file.id ];
            updateTotalProgress();
            $fileitem.off().find(".wu-fileitem-control").off().end().remove();
        }
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


    // DOM构建完毕后，扫描所有节点，将标记为“webuploader”的元素进行初始化
    if ( ! window.PKUI ) {
        $( document ).ready( function () {
            $( '[data-pkui-component="webuploader2"]' ).pkuiWebUploader();
        } );
    } else {
        window.PKUI.component.webuploader2 = $.fn.pkuiWebUploader;
    }

} ));