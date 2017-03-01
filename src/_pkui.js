;+function ( window ) {
    var PKUI
    ;
    PKUI = {
        responseDataHandler: function ( responseData ) {
            if ( typeof responseData === "string" ) {
                responseData = ( new Function( "return " + responseData ) )();
            }
            if ( ! responseData.success ) {
                console.info( "/(ㄒoㄒ)/~~获取数据失败！" );
                return false;
            }
            return responseData.data;
        }
    };

    // namespace
    window.PKUI;

}( window );