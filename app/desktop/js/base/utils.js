/**
 * @fileOverview 工具类
 * @author 吴钦飞（wuqf@pkusoft.net）
 *
 * @module module:base/utils
 * @requires module:jquery
 */
define( function ( require ) {
    var $,
        Utils
        ;
    $ = require( "jquery" );
    /**
     * 工具类
     * @exports module:base/utils
     */
    Utils = {
        /**
         * 网页框口宽度
         * @private
         */
        _pageWidth: 0,
        /**
         * 网页框口高度
         * @private
         */
        _pageHeight: 0,
        /**
         * 获取网页宽度
         * @memberOf module:base/utils#
         * @returns {number} 网页宽度
         */
        getPageWidth: function () {
            var _this,
                $window
                ;
            _this = this;
            if ( this._pageWidth ) {
                return this._pageWidth;
            } else {
                $window = $( window );
                $window.resize( function () {
                    _this._pageWidth = $window.width();
                    _this._pageHeight = $window.height();
                } );
                return $window.width();
            }
        },
        /**
         * 获取网页高度
         * @memberOf module:base/utils#
         * @returns {number} 网页高度
         */
        getPageHeight: function () {
            if ( this._pageHeight ) {
                return this._pageHeight;
            } else {
                return $( window ).height();
            }
        },
        /**
         * 从HTML标签属性中获取序列化的JSON对象，将其反序列化返回
         * @memberOf module:base/utils#
         * @param target {jQuery|HTMLElement} 目标DOM结点
         * @param htmlProp {string} HTML自定义属性名，默认为 "data-pkui-options"
         * @returns {*} 返回字典对象
         */
        getOptionsFromTag: function ( target, htmlProp ) {
            var $target,
                options
                ;
            $target = target[ "jquery" ] ? target : $( target );
            htmlProp = htmlProp || "data-pkui-options";

            options = $.parseJSON( $target.attr( htmlProp ) );

            return options;
        }
    };

    return Utils;
} );
