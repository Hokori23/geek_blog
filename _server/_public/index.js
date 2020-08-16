"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Restful = exports.crypto = exports.assign = exports.isUndef = exports.isDef = void 0;
var _config_1 = require("../../geekblog.config.js");
var crytpoConfig = _config_1.serverConfig.crytpo;
var CRYPTO = require('crypto');
/**
 * 判断变量是否已定义
 * @param { object } v
 */
var isDef = function (v) {
    return v !== undefined && v !== null;
};
exports.isDef = isDef;
/**
 * 判断变量是否未定义
 * @param { object } v
 */
var isUndef = function (v) {
    return v === undefined || v === null;
};
exports.isUndef = isUndef;
/**
 * @param { array } objArr
 * @param { boolean } flag
 * @description 当flag == true时，后面源对象可枚举属性isUndef时，不会覆盖前方对象属性
 */
var assign = function (objArr, flag) {
    if (isUndef(objArr)) {
        return new ReferenceError('Excepted for arguments: [ objArr: Array, flag: Boolean ]');
    }
    // 检查传参类型
    if (!(objArr instanceof Array)) {
        throw new TypeError('Excepted for Array at 1st argument');
    }
    if (!flag) {
        return Object.assign.apply(Object, __spreadArrays([{}], objArr));
    }
    var _loop_1 = function (i) {
        if (typeof objArr[i] !== 'object' ||
            objArr[i].toString() !== '[object Object]') {
            throw new TypeError('Excepted for Object arguments in 1st Array');
        }
        Object.keys(objArr[i]).forEach(function (v) {
            if (isDef(objArr[i][v])) {
                objArr[i - 1][v] = objArr[i][v];
            }
        });
    };
    // 检查传参类型
    for (var i = objArr.length - 1; i > 0; i--) {
        _loop_1(i);
    }
    return objArr[0];
};
exports.assign = assign;
/**
 * 加密函数
 * @param { string } v 加密字段
 */
var crypto = function (v) {
    var onceCryptLength = crytpoConfig.onceCryptLength, cryptCount = crytpoConfig.cryptCount, digest = crytpoConfig.digest;
    var md5 = CRYPTO.createHash('md5');
    var vLength = v.length;
    // 每次分段加密的字符串最大长度
    if (isDef(onceCryptLength) && onceCryptLength > 0) {
        while (v) {
            var tempV = v.slice(0, onceCryptLength);
            v = v.slice(onceCryptLength);
            md5.update(tempV + " - ");
        }
        return md5.digest(digest);
    }
    // 一次加密至多分段几次加密
    if (isDef(cryptCount) && cryptCount > 0) {
        if (vLength <= cryptCount) {
            return md5.update(v).digest(digest);
        }
        else {
            var onceCryptLength_1 = ~~(vLength / cryptCount);
            while (v) {
                var tempV = v.slice(0, onceCryptLength_1);
                v = v.slice(onceCryptLength_1);
                md5.update(tempV + " - ");
            }
            return md5.digest(digest);
        }
    }
    throw new ReferenceError('Excepted for crytpo from serverConfig: [ onceCryptLength: Number > 0, cryptCount: Number > 0 ]');
};
exports.crypto = crypto;
var Restful = /** @class */ (function () {
    function Restful(code, message, data) {
        if (data === void 0) { data = {}; }
        this.code = code;
        this.message = message;
        this.data = data;
    }
    Restful.initWithError = function (e) {
        return new Restful(e.errno, e.message);
    };
    return Restful;
}());
exports.Restful = Restful;
exports.default = { isDef: isDef, isUndef: isUndef, assign: assign, crypto: crypto, Restful: Restful };
