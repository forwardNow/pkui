/**
 * @fileOverview 对PkuiWebUploader的扩展
 *
 * @author 吴钦飞（wuqf@pkusoft.net）
 */
define( function( require ) {
    var
        $ = require( "jquery" ),
        WebUploader = require( "../../0.1.5/webuploader" ) || window[ "WebUploader" ],
        PkuiWebUploader = require( "../webuploader.wrapper" )
    ;

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
     // +         '<div class="wu-statusbar-progress" style="display: none;">'
     // +             '<span class="wu-statusbar-progress-text">0%</span>'
     // +             '<span class="wu-statusbar-progress-percentage" style="width: 0%;"></span>'
     // +         '</div>'
        +         '<div class="wu-statusbar-info">共0个（0B），已上传0个</div>'
        +         '<div class="wu-statusbar-btns">'
        +             '<div class="wu-filepicker"><!-- 继续上传 --></div>'
        +             '<div class="wu-btn-upload">开始上传</div>'
        +         '</div>'
        +     '</div>'
    //+ '</div>'
        ,

        fileitemTemplate:
        '<div id="{{file.id}}" class="wu-fileitem">'
        +     '<div class="wu-fileitem-thumbnail"></div>'
        +     '<div class="wu-fileitem-title"><span class="wu-fileitem-title-text">{{file.name}}</span></div>'
        +     '<div class="wu-fileitem-progress" style="display: none;">'
        +         '<div class="wu-fileitem-progress-bar" style="width: 0;"></div>'
        +     '</div>'
        +     '<div class="wu-fileitem-control">'
        +         '<span class="wu-fileitem-control-cancel" title="删除">删除</span>'
     // +         '<span class="wu-fileitem-control-retry" title="重试" style="display:none;">重试</span>'
     // +         '<span class="wu-fileitem-control-rotateLeft">向左旋转</span>'
        +     '</div>'
        +     '<div class="wu-fileitem-error" style="display: none;"></div>'
        +     '<div class="wu-fileitem-success" style="display: none;"></div>'
        + '</div>'


    };

    /**
     * @description 创建完整版的组件
     * @private
     */
    PkuiWebUploader.prototype._fullUploader_init = function () {

        this.getOptions( true );

        this._fullUploader_create();
        this._fullUploader_declare();
        this._fullUploader_bindEvent();
    };

    PkuiWebUploader.prototype._fullUploader_create = function () {
        var
            fullUploaderOptions = this.options.fullUploader
        ;
        this.$target.addClass( "wu-full wu-container" );
        this.$target.html( fullUploaderOptions.skeletonTemplate );
    };

    PkuiWebUploader.prototype._fullUploader_declare = function () {
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
        // this.$statusbarProgress = this.$statusbar.find(".wu-statusbar-progress");

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

        // 状态：可能有 new, ready, uploading, confirm, done.
        this.state = "new";


    };

    PkuiWebUploader.prototype._fullUploader_bindEvent = function () {
        var
            _this = this
        ;
        // 实例化
        this.uploaderInstance = WebUploader.create( this.getOptions() );

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
            addFileitem.call( _this, file );

            // 文件状态
            setState.call( _this, "ready" );
            updateStatusbarInfo.call( _this, "" );
        } );

        // 当文件被移除队列后触发。
        this.uploaderInstance.on( "fileDequeued", function( file ) {
            _this.fileCount--;
            _this.fileSize -= file.size;

            if ( !_this.fileCount ) {
                setState.call( _this, "new" );
            }

            // 删除 fileitem
            $( "#" + file.id ).off().find(".wu-fileitem-control").off().end().remove();
            updateStatusbarInfo.call( _this, "" );

        } );

        this.uploaderInstance.on( "uploadProgress", function( file, percentage ) {
            var
                $fileitem = $( "#" + file.id ),
                $percent = $fileitem.find( ".wu-fileitem-progress-bar" )
            ;

            $percent.css( "width", percentage * 100 + "%" );
        } );

        this.uploaderInstance.on( "all", function( type ) {
            switch( type ) {
                case "uploadFinished":
                    setState.call( _this, "confirm" );
                    break;

                case "startUpload":
                    setState.call( _this, "uploading" );
                    break;

                case "stopUpload":
                    setState.call( _this, "paused" );
                    break;
            }
        });

        // 当选取的文件validate不通过时，会以派送错误事件的形式通知调用者。
        this.uploaderInstance.on( 'error', function ( type, file ) {
            switch ( type ) {
                case "F_EXCEED_SIZE": { // 尝试给uploader添加的文件大小超出这个值时
                    alert( "单个文件大小不符合要求：超过" + WebUploader.formatSize( _this.options.fileSingleSizeLimit ) );
                    break;
                }
                case "F_DUPLICATE": { // 尝试给uploader添加的文件大小超出这个值时
                    alert( "文件重复，" + file.name + " 已被选择！" );
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

    };



    /**
     * 更新状态栏信息
     */
    function updateStatusbarInfo() {
        var
            text,
            stats,
            uploadFailNum,
            successNum
        ;
        text = "文件总数为 {{fileCount}}，总大小为 {{fileSize}}。上传成功文件数为 {{successNum}}，上传失败文件数为 {{uploadFailNum}}。";
        stats = this.uploaderInstance.getStats();
        successNum = stats.successNum || 0;
        uploadFailNum = stats.uploadFailNum || 0;

        text = text
            .replace( "{{fileCount}}", this.fileCount + "" )
            .replace( "{{fileSize}}", WebUploader.formatSize( this.fileSize ) )
            .replace( "{{successNum}}", successNum )
            .replace( "{{uploadFailNum}}", uploadFailNum );

        this.$statusbarInfo.text( text );
    }

    /**
     * 设置状态
     * @param state {String}
     */
    function setState( state ) {
        var
            stats
        ;

        if ( state === this.state ) {
            return;
        }

        this.$target.removeClass( "state-" + this.state );
        this.$target.addClass( "state-" + state );
        this.state = state;

        switch ( this.state ) {
            // 全新
            case "new":
                this.$placeHolder.removeClass( "webuploader-element-invisible" );
                this.$filelist.hide();
                this.$statusbar.addClass( "webuploader-element-invisible" );
                this.uploaderInstance.refresh();
                break;

            // 待上传
            case "ready":
                this.$placeHolder.addClass( "webuploader-element-invisible" );
                this.$statusbarFilepickerBtn.removeClass( "webuploader-element-invisible");
                this.$filelist.show();
                this.$statusbar.removeClass("webuploader-element-invisible");
                this.uploaderInstance.refresh();
                break;

            // 正在上传
            case "uploading":
                this.$statusbarFilepickerBtn.addClass( "webuploader-element-invisible" );
                this.$uploadBtn.text( "暂停上传" );
                break;

            // 暂停
            case "paused":
                this.$uploadBtn.text( "继续上传" );
                break;

            // 上传完毕
            case "confirm":
                this.$uploadBtn.text( "开始上传" ).addClass( "disabled" );

                stats = this.uploaderInstance.getStats();

                // 如果没有错误，则结束
                if ( stats.successNum && !stats.uploadFailNum ) {
                    setState.call( this, "finish" );
                    return;
                }
                break;

            // 结束，并开始下一轮
            case "finish":
                stats = this.uploaderInstance.getStats();

                this.$statusbarFilepickerBtn.removeClass( "webuploader-element-invisible" );
                this.$uploadBtn.text( "开始上传" ).removeClass( "disabled" );

                if ( stats.successNum ) {

                    //alert( "上传成功" );

                } else {
                    // 没有成功的图片，重设
                    // this.state = "done";
                    //location.reload();
                }

                break;
        }

        updateStatusbarInfo.call( this, "" );
    }

    /**
     * 添加文件进队列
     * @param file
     */
    function addFileitem( file ) {
        var
            $fileitem,
            $prgressbar,
            $thumbnail,
            $control,
            $error,
            $success,
            _this = this
        ;

        $fileitem = $(
            _this.options.fullUploader.fileitemTemplate
                .replace( "{{file.id}}", file.id )
                .replace( "{{file.name}}", file.name + " [" + WebUploader.formatSize( file.size ) + "]" )
        );

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
                $thumbnail.addClass( _this._getFileTypeClass( file.ext ) );
            }

            $thumbnail.text("");
        }


        // 控制器
        $control.on( "click", "span", function () {
            var
                $this = $( this )
            ;

            // removeFile：移除某一文件, 默认只会标记文件状态为已取消，如果第二个参数为 true 则会从 queue 中移除。
            if ( $this.is( ".wu-fileitem-control-cancel" ) ) {
                _this.uploaderInstance.removeFile( file );
            }

        });

        /*
        File.Status
            文件状态值，具体包括以下几种类型：
            inited 初始状态
            queued 已经进入队列, 等待上传
            progress 上传中
            complete 上传完成。
            error 上传出错，可重试
            interrupt 上传中断，可续传。
            invalid 文件不合格，不能重试上传。会自动从队列中移除。
            cancelled 文件被移除。
         */
        file.on( "statuschange", function( curStatus, prevStatus ) {
            // 前一个文件已在上传队列中，则不允许删除
            if ( prevStatus === "queued" ) {
                $control.find( ".wu-fileitem-control-cancel" ).hide();
            }

            if ( curStatus === "error" || curStatus === "invalid" ) {
                showError( file.statusText );
            }
            else if ( curStatus === "interrupt" ) {
                showError( "interrupt" );
            }
            else if ( curStatus === "queued" ) {

            }
            else if ( curStatus === "progress" ) {
                $error.hide();
                $prgressbar.show();
            }
            else if ( curStatus === "complete" ) {
                $success.show();
            }

            $fileitem.removeClass( "state-" + prevStatus ).addClass( "state-" + curStatus );


        });

        $fileitem.on( "click", ".retry", function() {
            _this.uploaderInstance.retry( file );
        });

        _this.$filelist.append( $fileitem );

        function showError( fileStatusText ) {
            var
                errorText
            ;
            switch ( fileStatusText ) {
                case "exceed_size":
                    errorText = "文件过大";
                    break;

                case "interrupt":
                    errorText = "上传暂停";
                    break;

                default:
                    errorText = "上传失败，请<a href='javascript:void(0);' class='retry'>重试</a>";
                    break;
            }
            $error.show().empty().append( errorText );
        }
    }
} );