/**
 * 字典数据源
 */
define( function ( require ) {
    "use strict";
    var DataSource,
        $ = require( "jquery" )
    ;

    DataSource = {
        // 在 _pkui.js 注册组件时，再设置
        timestamp: undefined
    };

    DataSource.init = function () {
        this.timestamp = window.PKUI.timestamp;
    };

    // 缓存
    DataSource.cache = {
        "list": {}, // { DIC_GENDER: [ { code:'',text:'',spell:'',aspell:'' }, ... ], ... }
        "set": {},  // { DIC_GENDER: { 'code1':'text1', 'code2':'text2', ... }, ... }
        "ext": { // 扩展的缓存，专门存放非标准的list或set
            "select2": {}
        }
    };

    // 提供的API
    DataSource = $.extend( DataSource, {
        /**
         * 根据指定字典名称获取dataList，步骤：
         * 1. 从缓存中取指定url的dataList，取到则返回，否则，进行下一步；
         * 2. 根据url发送请求，将获取到的xml文档对象转换成dataList，并缓存；
         * @param dicName: 字典文件的url
         * @returns {*}: 返回的格式
         * [
         *      { code: "", text: "", spell: "", aspell: "" },
         *      { code: "", text: "", spell: "", aspell: "" },
         *      ...
         * ]
         */
        getDataList: function ( dicName ) {
            var listCache,
                dataList
                ;
            // 1. 从listCache中取
            listCache = this.cache[ "list" ];
            dataList = listCache[ dicName ];

            // 2. 取到了，则直接返回
            if ( dataList ) {
                return dataList;
            }

            // 3. 没取到，请求字典文件
            this.request.getXmlAndCache( dicName );

            return listCache[ dicName ];
        },
        /**
         * 根据指定字典名称获取dataSet，步骤：
         * 1. 从缓存中取，取到了则返回，取不到则进行下一步；
         * 2. 调用 getDataList() 方法获取 dataList，将 dataList 转换成 dataSet，缓存并返回
         * @param dicName 字典文件的url
         * @returns {*}: 返回的格式
         * {
         *      code1: text1,
         *      code2: text2,
         *      ...
         * }
         */
        getDataSet: function ( dicName ) {
            var setCache,
                dataSet,
                dataList
            ;

            setCache = this.cache[ "set" ];

            // 1. 从 setCache 中取，取到则返回
            dataSet = setCache[ dicName ];

            if( dataSet ) {
                return dataSet;
            }

            // 2. 取不到，则从 listCache 中取（没有则请求并转换）
            dataList = this.getDataList( dicName );

            // 3. 将list转换为set
            dataSet = this.utils.convertDataListToDataSet( dataList );

            // 4. 缓存 dataSet
            setCache[ dicName ] = dataSet;

            return dataSet;
        },
        /**
         * 获取扩展的dataList
         * @param dicName 字典文件的url
         * @param extType 扩展类型，一般是插件名称
         * @param extConverter 有预定义好的转换器，也可以用自定义的
         * @returns {*}
         */
        getExtDataList: function ( dicName, extType, extConverter ) {
            var dataList,
                extDataList,
                extCache
            ;
            extCache = this.cache[ "ext" ];

            // 1. 从extCache缓存中取，取到了则直接返回
            if ( ! extCache[ extType ] ) { // 如果没有对应的扩展类缓存，则创建
                extCache[ extType ] = {};
            }
            extDataList = extCache[ extType ][ dicName ];

            if ( extDataList ) {
                return extDataList;
            }

            // 2. 取不到，则获取dataList
            dataList = this.getDataList( dicName );

            // 3. 将 dataList 转化为 extType类型 的数据格式
            extDataList = this.utils.convertDataListToExtDataList( dataList, extType, extConverter );

            // 4. 缓存，并返回
            extCache[ extType ][ dicName ] = extDataList;

            return extDataList;
        },
        /**
         * 通过字典名称和code获取value
         * @param dicName
         * @param code
         * @returns {*}
         */
        getDicValue: function( dicName, code ) {
            return this.getDataSet(dicName)[ code ];
        },
        /**
         * 清空缓存。
         * 如果指定了字典名称则删除指定的字典，否则删除所有。
         * 通常用于字典内容变化后，进行数据源的刷新
         * @param dicName {Array|String}
         */
        clearCache: function ( dicName ) {
            var cache = DataSource.cache
            ;

            // 更新时间戳，避免使用缓存字典文件
            this.timestamp = "v=" + ( new Date() ).getTime();

            // dicName没有指定 或 数组长度为0，则直接清空所有缓存
            if ( ! dicName || ( $.isArray( dicName ) && dicName.length === 0 ) ) {
                cache = {
                    "list": {},
                    "set": {}
                };
                return;
            }
            // 如果指定了字典名称，则删除指定的字典
            if ( typeof dicName === "string" ) {
                dicName = [ dicName ];
            }
            $.each( dicName, function ( index, dicname ) {
                if ( cache[ "list" ].hasOwnProperty( dicname ) ) {
                    delete cache[ "list" ][ dicname ];
                }
                if ( cache[ "set" ].hasOwnProperty( dicname ) ) {
                    delete cache[ "set" ][ dicname ];
                }
            } );
        }


    } );

    // 请求
    DataSource.request = {
        /**
         * 同步请求指定url的字典文件
         * @param url: 请求的字典文件url
         * @param doSuccess: 请求成功后的回调函数
         * @param doError: 请求出错后的回调函数
         * @param method: 请求方式，"GET"（默认） 或 "POST"
         * @returns {DataSource}: 链式调用
         */
        syncAjax: function ( url, doSuccess, doError, method  ) {
            method = method || "GET";
            $.ajax( {
                type: method,
                url: url,
                async: false, // 同步请求
                timeout: 30000, // 设置请求超时时间（毫秒）
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                cache: true, // 缓存此页面
                dataType: "xml", // 预期服务器返回的数据类型。
                success: function ( data ) {
                    doSuccess( data );
                },
                error: function () {
                    doError( );
                }
            } );
        },
        /**
         * 请求指定名称的字典文件，并转换成dataList缓存起来。
         * @param dicNames: 可以是单个url字符串，也可以是 url字符串数组
         * @returns {DataSource}: 链式调用
         */
        getXmlAndCache: function ( dicNames ) {
            var _this
                ;

            _this = this;

            if ( typeof dicNames === "string" ) {
                dicNames = [ dicNames ];
            }

            $.unique( dicNames ); // 去重

            // Ajax同步请求每个 dic ，并将请求返回的xml文档对象缓存起来
            $.each( dicNames, function ( index, dicName ) {
                var dicUrl = DataSource.utils.getDicUrl( dicName )
                ;
                _this.syncAjax(
                    dicUrl,
                    function ( xmlDoc ) {
                        _this.handleRequestDicSuccess( dicName, xmlDoc );
                    },
                    function () {
                        _this.handleRequestDicError( dicName );
                    }
                );
            } );

            return this;
        },
        handleRequestDicSuccess: function ( dicName, xmlDoc ) {
            var isSuccess,
                listCache,
                _this,
                dicUrl = DataSource.utils.getDicUrl( dicName )
                ;
            _this = this;
            isSuccess = xmlDoc && ( xmlDoc.getElementsByTagName( "row" ).length > 0 );
            listCache = DataSource.cache[ "list" ];
            if ( isSuccess ) {
                console.info( dicUrl, "\t字典获取成功。" );
            } else {
                if ( listCache[ dicName ] == "isRepeated" ) {
                    console.info( dicUrl, "\t字典获取失败: 第二次获取失败。" );
                }
                console.info( dicUrl, "\t字典获取失败: 进行第二次获取。" );
                // 尝试再次获取，通过POST请求
                listCache[ dicName ] = "isRepeated";
                DataSource.request(
                    dicUrl,
                    function ( data ) {
                        _this.handleRequestDicSuccess( dicName, data );
                    },
                    function () {
                        _this.handleRequestDicError( dicName );
                    },
                    "POST"
                );
            }
            // 缓存数据
            listCache[ dicName ] = DataSource.utils.convertXmlDocToDataList( xmlDoc );
        },
        handleRequestDicError: function ( dicName ) {
            console.info( dicName, "\t字典获取失败: 网络原因/路径错误。" );
        }
    };

    // 工具
    DataSource.utils = {
        /**
         * 根据字典文件名获取其URL，如果不是"DIC_"的格式，则直接当做URL来处理
         * @param dicName 字典文件名，如 DIC_GENDER
         * @returns {*}
         */
        getDicUrl: function ( dicName ) {
            // 不以"DIC_"打头的字典，不添加时间戳
            if ( dicName.indexOf( "DIC_" ) !== 0 ){
                return dicName;
            }
            return window.PKUI.dicPath + dicName + ".xml?" + DataSource.timestamp;
        },
        /**
         * 将xml文档对象转换成标准的dataList
         * @param xmlDoc xml文档对象
         * @returns {Array}
         */
        convertXmlDocToDataList: function ( xmlDoc ) {
            var dataList,
                rowElts
                ;

            dataList = [];
            rowElts = xmlDoc.getElementsByTagName( "row" );

            $.each( rowElts, function ( index, rowElt ) {
                dataList.push( {
                    "code": rowElt.getAttribute( "DIC_CODE" ),
                    "text": rowElt.getAttribute( "DIC_TEXT" ),
                    "spell": rowElt.getAttribute( "DIC_SPELL" ),
                    "aspell": rowElt.getAttribute( "DIC_ASPELL" )
                } );
            } );

            return dataList;
        },
        convertDataListToDataSet: function ( dataList ) {
            var dataSet
                ;
            dataSet = {};
            $.each( dataList, function ( index, dicData ) {
                dataSet[ dicData[ "code" ] ] = dicData[ "text" ];
            } );
            return dataSet;
        },
        convertDataListToExtDataList: function ( dataList, extType, extConverter ) {
            var extDataList
                ;

            // 如果传了自定义的extConverter，则调用自定义的extConverter
            if ( extConverter ) {
                return extConverter( dataList );
            }

            switch ( extType ) {
                case "select2": { // 预定义的 extConverter
                    extDataList = DataSource.converter.get( "select2" )( dataList );
                    break;
                }
            }
            return extDataList;
        }
    };


    // 转换器
    DataSource.converter = {
        get: function ( type ) {
            return this[ type ];
        },
        select2 : function ( dataList ) {
            var extDataList
                ;
            extDataList = [];
            $.each( dataList, function ( index, data ) {
                extDataList.push( {
                    "id": data[ "code" ],
                    "text": data[ "text" ],
                    "spell": data[ "spell" ] + data[ "code" ]
                } );
            } );
            return extDataList;
        }
    };

    //window.PKUI.component.DataSource = DataSource;

    return DataSource;
} );
