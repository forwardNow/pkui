/**
 * @fileOverview （中国）公民身份证号码校验
 *
 *  15位校验规则 6位地址编码+6位出生日期+3位顺序号
 *  18位校验规则 6位地址编码+8位出生日期+3位顺序号+1位校验位
 *
 * @author 吴钦飞(wuqf@pkusoft.net)
 */
define( function( require ) {
    var
        // 区划代码
        GB2260 = require( "../1.3.0/GB2260" ),
        IDValidator = {}
    ;

    /**
     * 已经验证过的 ID
     * @private
     */
    IDValidator._idCodeCache = {

    };

    /**
     * 地址缓存，避免在 GB2260 中重复查找
     * @private
     */
    IDValidator._addressCache = {

    };

    /**
     * 校验位缓存
     * @private
     */
    IDValidator._checkBitCache = {

    };

    /**
     * 验证身份证号码的有效性
     * @param idCode {String}
     * @return {Boolean}
     */
    IDValidator.validateID = function ( idCode ) {
        var
            result = true
        ;
        if ( !idCode ) {
            return false;
        }

        if ( typeof idCode !== "string" ) {
            idCode += "";
        }

        // 从缓存里取
        if ( this._idCodeCache.hasOwnProperty( idCode ) ) {
            return this._idCodeCache[ idCode ];
        }

        // 验证长度 15位或18位
        if ( this._validateIDLength( idCode ) === false ) {
            console.info( idCode + " 长度 不符合要求。" );
            result = false;
        }

        // 验证 地址码（6位）
        else if ( this._validateIDAddress( idCode ) === false ) {
            console.info( idCode + " 地址码 不符合要求。" );
            result = false;
        }

        // 验证 出生日期（8位）
        else if ( this._validateIDBirthday( idCode ) === false ) {
            console.info( idCode + " 出生日期 不符合要求。" );
            result = false;
        }

        // 验证 顺序号（3位）

        // 验证 校验位（1位）
        else if ( this._validateIDCheckBit( idCode ) === false ) {
            console.info( idCode + " 校验位 不符合要求。" );
            result = false;
        }

        //
        this._idCodeCache[ idCode ] = result;

        return result;
    };

    /**
     * 验证长度 15位或18位
     * @private
     * @param idCode {String}
     * @return {Boolean}
     */
    IDValidator._validateIDLength = function ( idCode ) {
        var
            length = this.getIDLength( idCode )
        ;
        return length === 15 || length === 18;
    };
    /**
     * 获取长度 15位或18位
     * @param idCode {String}
     * @return {Number}
     */
    IDValidator.getIDLength = function ( idCode ) {
        return ( idCode + "" ).length;
    };


    /**
     * 验证地址码
     * @param idCode
     * @return {boolean}
     * @private
     */
    IDValidator._validateIDAddress = function ( idCode ) {
        var
            addressText = this.getIDAddressText( idCode )
        ;
        return !!addressText;
    };
    /**
     * 获取地址码
     * @param idCode {string}
     * @return {string}
     * @private
     */
    IDValidator.getIDAddressCode = function ( idCode ) {
        return idCode.substring( 0, 6 );
    };

    /**
     * 根据 地址码，获取地址
     * @param idCode {string}
     * @return {string}
     * @private
     */
    IDValidator.getIDAddressText = function ( idCode ) {
        var
            addressCode = this.getIDAddressCode( idCode ),
            addressText
        ;

        /* 首先在缓存里找，找到则直接返回 */
        addressText = this._addressCache[ addressCode ];

        if ( addressText ) {
            return addressText;
        }

        /* 缓存里找不到，则在 GB2260 里找 */
        addressText = GB2260[ addressCode ];

        // 如果找不到 省市县区，则找 省市
        if ( !addressText ) {
            addressText = GB2260[ addressCode.substring( 0, 4 ) + "00" ];
        }
        // 如果找不到 省市，则找 省
        if ( !addressText ) {
            addressText = GB2260[ addressCode.substring( 0, 2 ) + "0000" ];
        }
        // 如果找不到 省，则说明此地址码是错误的
        if ( !addressText ) {
            addressText = "";
        }

        // 缓存
        this._addressCache[ addressCode ] = addressText;

        return addressText;
    };

    /**
     * 验证出生日期
     * @param idCode {string}
     * @return {boolean}
     * @private
     */
    IDValidator._validateIDBirthday = function ( idCode ) {
        var
            birthday = this.getIDBirthday( idCode ).split( "-" ),
            year = parseInt( birthday[ 0 ] ),
            month = parseInt( birthday[ 1 ] ) - 1,
            day = parseInt( birthday[ 2 ] ),
            date
        ;
        date = new Date( year, month, day );

        return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
    };

    /**
     * 获取出生日期，可指定 年月日的分隔符
     * @param idCode {string}
     * @param delimiter {string?} 分隔符，默认为“-”
     * @return {string}
     */
    IDValidator.getIDBirthday = function ( idCode, delimiter ) {
        var
            birthdayCode,
            idLength = this.getIDLength( idCode )
        ;

        delimiter = delimiter || "-";

        if ( idLength === 15 ) {
            birthdayCode = idCode.substring( 6, 12 );
            birthdayCode = "19" + birthdayCode;
        }
        else if ( idLength === 18 ) {
            birthdayCode = idCode.substring( 6, 14 );
        }

        return birthdayCode.substring( 0, 4 )
            + delimiter + birthdayCode.substring( 4, 6 )
            + delimiter + birthdayCode.substring( 6, 8 );
    };

    /**
     * 验证 校验位
     * @param idCode {string}
     * @return {boolean}
     * @private
     */
    IDValidator._validateIDCheckBit = function ( idCode ) {
        var
            checkBit = this.getIDCheckBit( idCode )
        ;
        return checkBit === idCode.substring( 17, 18 );
    };

    /**
     * 根据 17位的身份证号 获取校验位
     * @param idCode {string}
     * @return {string}
     */
    IDValidator.getIDCheckBit = function ( idCode ) {
        var
            // 加权因子
            factor,
            // 校验位
            parity,
            aP = [],
            aB = [],
            i,
            sum = 0
        ;

        // 查看缓存
        if ( this._checkBitCache.hasOwnProperty( idCode ) ) {
            return this._checkBitCache[ idCode ];
        }

        factor = [ 1, 2, 4, 8, 5, 10, 9, 7, 3, 6, 1, 2, 4, 8, 5, 10, 9, 7 ];

        parity = [ "1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2" ];

        for ( i = 1; i < 18; i++ ) {
            aP[ i ] = idCode.substr( 17 - i, 1 );
        }
        for ( i = 1; i < 18; i++ ) {
            aB[ i ] = parseInt( aP[ i ] ) * parseInt( factor[ i ] );
            sum += aB[ i ];
        }

        // 缓存
        this._checkBitCache[ idCode ] = parity[ sum % 11 ];

        return this._checkBitCache[ idCode ];
    };

    /**
     * 获取年龄
     * @param idCode {string}
     * @return {number}
     */
    IDValidator.getIDAge = function ( idCode ) {
        var
            age,
            birthday = this.getIDBirthday( idCode ).split( "-" ),
            year = parseInt( birthday[ 0 ] ),
            month = parseInt( birthday[ 1 ] ) - 1,
            day = parseInt( birthday[ 2 ] ),
            date = new Date(),
            nowYear = date.getFullYear(),
            nowMonth = date.getMonth(),
            nowDay = date.getDate()
        ;

        age = nowYear - year;

        // 如果 大于当前月份，则要减一岁
        if ( month > nowMonth ) {
            return age - 1;
        }
        // 如果 小于当前月份
        else if ( month < nowMonth ) {
            return age;
        }

        // 如果月份相等，则判断日期

        if ( day > nowDay ) {
            return age - 1;
        }
        else {
            return age;
        }

    };


    /**
     * 获取性别，
     *
     *  18位身份证号码
     *      第17位代表性别，奇数为男，偶数为女
     *  15位身份证号码
     *      第15位代表性别，奇数为男，偶数为女
     *
     * @param idCode {string}
     * @param isValue {boolean?}
     * @return {string}
     */
    IDValidator.getIDGender = function ( idCode, isValue ) {
        var
            length = this.getIDLength( idCode ),
            gender
        ;
        if ( length === 15 ) {
            gender = idCode.substring( 14, 15 ) % 2;
        } else if ( length === 18 ) {
            gender = idCode.substring( 16, 17 ) % 2;
        }

        if ( isValue ) {
            return gender + "";
        }

        return gender === 1 ? "男" : "女";
    };

    /**
     * 获取性别代码
     * @param idCode {string}
     * @return {string} "1"(男)，"0"(女)
     */
    IDValidator.getIDGenderCode = function ( idCode ) {
        return this.getIDGender( idCode, true );
    };

    /**
     * 获取性别
     * @param idCode {string}
     * @return {string} "男","女"
     */
    IDValidator.getIDGenderText = function ( idCode ) {
        return this.getIDGender( idCode );
    };

    return IDValidator;
} );