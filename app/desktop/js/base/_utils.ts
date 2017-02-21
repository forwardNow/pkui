declare function define(...args: any[]): any;
/**
 * @file 工具类
 * @author 吴钦飞(wuqf@pkusoft.net)
 */
define( function (require) {
    let $, Utils;
    $ = require("jquery");

    Utils = {
        pageWidth: 0,
        init: function () {
            this.bind();
        },
        bind: function () {
            let _this = this;
            let $window = $( window );
            _this.pageWidth = $window.width();
            $window.resize(function() {
                _this.pageWidth = $( window ).width();
            });
        },
    };

    $( document ).ready( function() {
        Utils.init();
    } );

    return Utils;
});