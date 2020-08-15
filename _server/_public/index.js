"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var _PUBLIC;
(function (_PUBLIC) {
    /**
     * 判断变量是否已定义
     * @param { object } v
     */
    _PUBLIC.isDef = function (v) {
        return v !== undefined && v !== null;
    };
    /**
     * 判断变量是否未定义
     * @param { object } v
     */
    _PUBLIC.isUndef = function (v) {
        return v === undefined || v === null;
    };
    /**
     * @param { array } objArrg
     * @param { boolean } flag
     * @description 当flag == true时，后面源对象可枚举属性isUndef时，不会覆盖前方对象属性
     */
    _PUBLIC.assign = function (objArr, flag) {
        if (_PUBLIC.isUndef(objArr)) {
            return new ReferenceError('Excepted for arguments: [objArr, flag]');
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
                if (_PUBLIC.isDef(objArr[i][v])) {
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
})(_PUBLIC || (_PUBLIC = {}));
