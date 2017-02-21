/**
 * @file 应用入口
 * @author 吴钦飞(wuqf@pkusoft.net)
 */
define(function (require) {
    var $ = require("jquery");
    var Launchpad = require("./common/_launchpad");
    var Dialog = require("./common/_dialog");
    $(document).ready(function () {
        Launchpad.init();
        Dialog.init();
    });
});
