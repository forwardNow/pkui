/**
 * 用于替换占位符
 */
define( function ( require ) {
    var
        $ = require( "jquery" ),
        PlaceholderHandler = {}
    ;

    PlaceholderHandler.defaults = {
        prefix: "{%",
        postfix: "%}"
    };

    /**
     * 默认正则表达式
     * @type {RegExp}
     * @private
     */
    PlaceholderHandler._regex = /{%\s*([.a-zA-Z0-9_]+)\s*%}/gm;

    /**
     * 处理的字符串，都会从这里查找匹配的通配符
     * @type {{}}
     * @private
     */
    PlaceholderHandler._configSet = {

    };

    /**
     * 重置正则，用于当匹配符改变时
     * \{%\s*([.a-zA-Z0-9_]+)\s*%}
     * @private
     */
    PlaceholderHandler._resetRegex = function () {
        var
            regexString,
            prefix = this._escapeRegex( this.defaults.prefix ),
            postfix = this._escapeRegex( this.defaults.postfix )
        ;

        regexString = prefix + "\\s*([.a-zA-Z0-9_]+)\\s*" + postfix;
        this._regex = new RegExp( regexString, "gm" );
    };
    /**
     * 设置参数
     */
    PlaceholderHandler.setOptions = function ( opts ) {
        // 覆盖
        $.extend( this.defaults, opts );
        this._resetRegex();
    };

    /**
     * 添加匹配源，重名的属性将覆盖原属性
     * @param config {*} 配置，字典类型
     * @param isNotOverride {Boolean?} 是否不覆盖同名属性
     */
    PlaceholderHandler.appendMatchSource = function ( config, isNotOverride ) {
        var
            key,
            _configSet = this._configSet
        ;
        if ( !config ) {
            throw "error";
        }
        for ( key in config ) {
            if ( ! config.hasOwnProperty( key ) ) {
                continue;
            }
            if ( _configSet.hasOwnProperty( key )  ) {
                if ( isNotOverride ) {
                    console.warn( "同名属性[" + key + "]，处理方式：跳过。" );
                } else {
                    _configSet[ key ] = config[ key ];
                    console.warn( "同名属性[" + key + "]，处理方式：覆盖原属性。" );
                }
            } else {
                _configSet[ key ] = config[ key ];
            }
        }
    };

    /**
     * 将目标字符串里的占位符（“{% xxx %}”）全部替换掉。
     *
     * regex
     *      \{%\s*([.a-zA-Z0-9_]+)\s*%\}
     *
     * @param target {String} 要处理的目标字符串
     * @returns {String} 返回处理后的字符串
     */
    PlaceholderHandler.process = function ( target ) {
        var
            configSet = this._configSet
        ;

        target = target.replace( this._regex, function ( fullMatch, group1 ) {
            if ( ! configSet.hasOwnProperty( group1 ) ) {
                throw "占位符替换失败：没有配置[" + group1 + "]占位符";
            }
            return configSet[ group1 ];
        } );

        return target;
    };


    /**
     * 替换正则关键字
     * @param value
     * @returns {string}
     * @private
     */
    PlaceholderHandler._escapeRegex = function( value ) {
        return value.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" );
    };

    /**
     * 初始化方法
     * @private
     */
    PlaceholderHandler._init = function () {

    };

    PlaceholderHandler._init();


    return PlaceholderHandler;
} );