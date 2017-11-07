/**
 * 对 原始webuploader的扩展
 */
define( function ( require ) {

    require( "../0.1.5/webuploader.js" );
    require( "./webuploader.css" );

    var
        $ = require( "jquery" ),
        WebUploader = window.WebUploader,
        Uploader,
        namespace = "pkui.uploader"
        ;

    Uploader = function ( target, options ) {
        var $target = $( target );

        if ( !$target.attr( "id" ) ) {
            $target.attr( "id", "uploader_" + ( new Date() ).getTime() );
        }
        this.WebUploaderInstance = init( $target.attr( "id" ), options );
    };

    Uploader.prototype.defaults = {

        // 文件接收服务端。
        server: "http://localhost:8080/pkui/upload",
        // 自动上传。
        auto: false,

        // 单个问价大小限制，8 MB
        fileSingleSizeLimit: 1024 * 1024 * 8,

        swf: window.PKUI.basePath + "/lib/component/webuploader/0.1.4/Uploader.swf",
        // 不压缩image
        resize: false,
        // "file" / "image"
        _type: "file",

        _template: '<ul class="uploader-filelist clearfix" title="可将文件拖拽到此区域进行上传"></ul>'
        +         '<div class="uploader-controls">'
        +         '    <div class="uploader-picker"><i class="fa fa-file-o"></i> 选择文件</div>'
        +         '    <button type="button" class="btn btn-success uploader-startup" ><i class="fa fa-upload"></i>  开始上传</button>'
        +         '    <span class="text-warning uploader-info">已上传成功文件数：0。 上传失败文件数：0。</span>'
        +         '</div>'

    };

    function init ( containerId, options ) {

        var
            type,
            defaults,
            $container, // 容器
            $fileList, // 文件列表容器
            $startBtn, // “开始上传”按钮
            $info, // 上传信息
            state, // 上传状态
            WebUploaderInstance, // 实例

            ratio,
            thumbnailWidth,
            thumbnailHeight
            ;

        defaults = {
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: "#" + containerId + " .uploader-picker",
            // 指定Drag And Drop拖拽的容器
            dnd: '#' + containerId + ' .uploader-filelist'
        };

        options = $.extend( defaults, Uploader.prototype.defaults, options || {} );

        type = options._type;

        $container = $( "#" + containerId ).html( Uploader.prototype.defaults._template ).addClass( "uploader-theme-" + type );
        $fileList = $( ".uploader-filelist", $container );
        $startBtn = $( ".uploader-startup", $container );
        $info = $( ".uploader-info", $container );


        // 优化retina, 在retina下这个值是2
        ratio = window[ "devicePixelRatio" ] || 1;

        // 缩略图大小
        thumbnailWidth = 100 * ratio;
        thumbnailHeight = 100 * ratio;

        // 初始化
        WebUploaderInstance = WebUploader.create( options );

        // 上传状态
        WebUploaderInstance.on('all', function(type) {
            if (type === 'startUpload') {
                state = 'uploading';
            } else if (type === 'stopUpload') {
                state = 'paused';
            } else if (type === 'uploadFinished') {
                state = 'done';
            }

            if (state === 'uploading') {
                $startBtn.html('<i class="fa fa-upload"></i> 暂停上传' ).addClass( "btn-warning" );
            } else {
                $startBtn.html('<i class="fa fa-upload"></i> 开始上传').removeClass( "btn-warning" );
            }
        });
        // 点击开始按钮
        $startBtn.on('click', function() {
            if (state === 'uploading') {
                WebUploaderInstance.stop( true ); // 正在上传的文件以及等待上传的文件都暂停
            } else {
                WebUploaderInstance.upload();
            }
        });

        // （当文件被加入队列以后触发。）添加文件条目
        WebUploaderInstance.on( 'fileQueued', function( file ) {
            var fileId,
                fileName,
                fileSize,
                $fileItem,
                $img
                ;
            fileId = file.id;
            fileName = file.name;
            fileSize = WebUploader.formatSize( file.size );

            if ( type == "file" ) {
                $fileItem = $( '<li class="uploader-fileitem" id=' + fileId + '>\
                                <button type="button" class="close">&times;</button>\
                                <span class="filename">' + fileName + ' (' + fileSize + ') - </span>\
                                <span class="state">等待上传</span>\
                                <div class="uploader-progress">\
                                   <div class="uploader-progress-bar" style="width: 1%;"></div>\
                                </div>\
                           </li>' );
            } else if ( type == "image" ) {
                $fileItem = $( '<li class="uploader-fileitem" id=' + fileId + '>\
                                <button type="button" class="close">&times;</button>\
                                <div class="thumbnail"><img /></div>\
                                <span class="filename">' + fileName + ' (' + fileSize + ') - </span>\
                                <span class="state">等待上传</span>\
                                <div class="uploader-progress">\
                                   <div class="uploader-progress-bar" style="width: 1%;"></div>\
                                </div>\
                           </li>' );
                $img = $fileItem.find( "img" );

                // 创建缩略图
                WebUploaderInstance.makeThumb( file, function( error, src ) {
                    if ( error ) {
                        $img.replaceWith('<span class="text-danger">不能预览!</span>');
                        return;
                    }

                    $img.attr( 'src', src );
                }, thumbnailWidth, thumbnailHeight );

            }
            $fileList.append( $fileItem );

        });

        // 当点击关闭按钮时，标记文件状态为已取消, 同时将中断文件传输。并且删除LI节点
        $fileList.on("click", "button.close", function() {
            var $this,
                $fileitem,
                fileId
                ;
            $this = $(this);
            $fileitem = $this.parent( ".uploader-fileitem" );
            fileId = $fileitem.attr("id");
            WebUploaderInstance.cancelFile(fileId);
            $fileitem.fadeOut();
        }).on("click", ".state > a", function() { // 点击“上传失败”
            var $this,
                $fileitem,
                fileId
                ;
            $this = $(this);
            $fileitem = $this.closest( ".uploader-fileitem" );
            fileId = $fileitem.attr("id");

            WebUploaderInstance.retry( WebUploaderInstance.getFile( fileId ) );
            return false;
        });

        // 文件上传过程中创建进度条实时显示。（上传过程中触发，携带上传进度。）
        WebUploaderInstance.on('uploadProgress', function(file, percentage) {
            var $fileItem,
                $percent
                ;
            $fileItem = $('#' + file.id);
            $percent = $fileItem.find( '.uploader-progress-bar');

            $fileItem.addClass("uploading").find('.state').text('上传中');
            $percent.css('width', percentage * 100 + '%');
        });

        // （当文件上传成功时触发。）
        WebUploaderInstance.on('uploadSuccess', function(file, jsonResult) {
            if ( jsonResult.success ) {
                $('#' + file.id).addClass("success").find('.state').text('已上传')
                    .end().find('.close').hide();
            } else {
                $('#' + file.id).addClass("error").find('.state').text( jsonResult.message || '已上传，但服务器端处理失败。');
            }
        });
        // （当文件上传出错时触发。）
        WebUploaderInstance.on('uploadError', function(file) {
            $('#' + file.id).addClass("error").find('.state').html('上传出错 <a href="#">重新上传</a>');
        });
        // （不管成功或者失败，文件上传完成时触发。）
        WebUploaderInstance.on('uploadComplete', function(file) {
            var stats,
                successNum,
                uploadFailNum
                ;
            stats = WebUploaderInstance.getStats();
            successNum = stats.successNum;
            uploadFailNum = stats.uploadFailNum;
            $info.text("已上传成功文件数：" + successNum + "。 上传失败文件数：" + uploadFailNum + "。");
        });

        // 处理图片添加失败的处理
        WebUploaderInstance.on( 'error', function ( type ) {
            switch ( type ) {
                case "F_EXCEED_SIZE": { // 尝试给uploader添加的文件大小超出这个值时
                    alert( "单个文件大小不符合要求：不超过" + ( options.fileSingleSizeLimit / 1024 ) + "KB。" );
                    break;
                }
                case "Q_TYPE_DENIED": { // 当文件类型不满足时触发
                    alert( "文件类型不符合要求：仅限 " + options.accept.extensions + " 类型。" );
                    break;
                }
                case "Q_EXCEED_NUM_LIMIT": { // 在设置了fileNumLimit且尝试给uploader添加的文件数量超出这个值
                    alert( "文件总数量不符合要求：超过" + options.fileNumLimit + "。" );
                    break;
                }
                case "Q_EXCEED_SIZE_LIMIT": { // 尝试给uploader添加的文件总大小超出这个值时
                    break;
                }
                default: {
                    alert( "错误类型：" + type );
                }
            }
        } );

        return WebUploaderInstance;
    }

    $.fn.Uploader = function ( options ) {

        this.each( function () {
            var
                $this = $( this ),
                instance = $this.data( namespace )
            ;

            // 如果没有初始化，则进行初始化
            if ( ! instance ) {
                $this.attr( "isrendered", true );
                instance = new Uploader( this, options );
                $this.data( namespace, instance );
            }

        } );

        return this;
    };




    return Uploader;
} );
