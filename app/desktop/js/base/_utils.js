/**
 * @file 工具类
 * @author 吴钦飞(wuqf@pkusoft.net)
 */
define(function (require) {
    var $, Utils;
    $ = require("jquery");
    Utils = {
        pageWidth: 0,
        init: function () {
            this.bind();
        },
        bind: function () {
            var _this = this;
            var $window = $(window);
            _this.pageWidth = $window.width();
            $window.resize(function () {
                _this.pageWidth = $(window).width();
            });
        }
    };
    $(document).ready(function () {
        Utils.init();
    });
    return Utils;
});
