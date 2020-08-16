"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var _action_1 = require("../action");
var _public_1 = require("../_public");
/**
 * 初始化超级管理员
 * @param { User } user
 */
var Create__Init = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var restful, res, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, _action_1.UserAction.Retrieve__All__Safely()];
            case 1:
                res = _a.sent();
                if (res.length) {
                    restful = new _public_1.Restful(1, '已有其它用户存在，不可创建新的超级管理员账号，请登录数据库检查或重新创建数据库');
                    return [2 /*return*/, restful];
                }
                // 加密密码
                user.password = _public_1.crypto(user.password);
                // 权限1: 超级管理员
                user.power = 1;
                return [4 /*yield*/, _action_1.UserAction.Create(user)];
            case 2:
                res = _a.sent();
                if (res.length) {
                    restful = new _public_1.Restful(2, '账号已存在');
                }
                else {
                    // 脱敏
                    delete res[0].password;
                    restful = new _public_1.Restful(0, '添加超级管理员成功', res[0]);
                }
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.log('UserService error');
                restful = _public_1.Restful.initWithError(e_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, restful];
        }
    });
}); };
/**
 * 添加管理员
 * @param { User } user
 */
var Create = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var res, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, _action_1.UserAction.Retrieve(user.account)];
            case 1:
                res = _a.sent();
                if (res.length) {
                    return [2 /*return*/, new _public_1.Restful(1, '账号已存在')];
                }
                // 加密密码
                user.password = _public_1.crypto(user.password);
                /**
                 * 1. 权限0: 管理员
                 * 2. 去除ID
                 */
                user.power = 0;
                user.id = undefined;
                return [4 /*yield*/, _action_1.UserAction.Create(user)];
            case 2:
                res = _a.sent();
                // 脱敏
                delete user.password;
                return [2 /*return*/, new _public_1.Restful(0, '添加管理员成功', user)];
            case 3:
                e_2 = _a.sent();
                return [2 /*return*/, _public_1.Restful.initWithError(e_2)];
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * 登录
 * @param { string } account
 * @param { string } password
 */
var Login = function (account, password) { return __awaiter(void 0, void 0, void 0, function () {
    var restful, res, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, _action_1.UserAction.Retrieve(account)];
            case 1:
                res = _a.sent();
                if (!res.length) {
                    restful = new _public_1.Restful(1, '账号不存在');
                }
                else {
                    // 匹配密码
                    if (_public_1.crypto(password) === res[0].password) {
                        // 脱敏
                        delete res[0].password;
                        restful = new _public_1.Restful(0, '登陆成功', res[0]);
                    }
                    else {
                        restful = new _public_1.Restful(2, '账号或密码错误');
                    }
                }
                return [3 /*break*/, 3];
            case 2:
                e_3 = _a.sent();
                restful = _public_1.Restful.initWithError(e_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/, restful];
        }
    });
}); };
/**
 * 查询单个用户
 * @param { string } account
 */
var Retrieve = function (account) { return __awaiter(void 0, void 0, void 0, function () {
    var restful, res, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, _action_1.UserAction.Retrieve(account)];
            case 1:
                res = _a.sent();
                if (!res.length) {
                    restful = new _public_1.Restful(1, '账号不存在');
                }
                else {
                    restful = new _public_1.Restful(0, '查询成功', res[0]);
                }
                return [3 /*break*/, 3];
            case 2:
                e_4 = _a.sent();
                restful = _public_1.Restful.initWithError(e_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/, restful];
        }
    });
}); };
/**
 * 遍历用户
 */
var Retrieve__All = function () { return __awaiter(void 0, void 0, void 0, function () {
    var restful, res, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, _action_1.UserAction.Retrieve__All__Safely()];
            case 1:
                res = _a.sent();
                if (!res.length) {
                    restful = new _public_1.Restful(1, '无账号');
                }
                else {
                    restful = new _public_1.Restful(0, '查询成功', res);
                }
                return [3 /*break*/, 3];
            case 2:
                e_5 = _a.sent();
                restful = _public_1.Restful.initWithError(e_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/, restful];
        }
    });
}); };
/**
 * 编辑用户
 * @param { User }user
 */
var Update = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var restful, res, e_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, _action_1.UserAction.Retrieve(user.account)];
            case 1:
                res = _a.sent();
                if (!!res.length) return [3 /*break*/, 2];
                restful = new _public_1.Restful(1, '账号不存在');
                return [3 /*break*/, 5];
            case 2: return [4 /*yield*/, _action_1.UserAction.Update(res[0], user)];
            case 3:
                _a.sent();
                return [4 /*yield*/, _action_1.UserAction.Retrieve(user.account)];
            case 4:
                res = _a.sent();
                restful = new _public_1.Restful(0, '编辑成功', res[0]);
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                e_6 = _a.sent();
                restful = _public_1.Restful.initWithError(e_6);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/, restful];
        }
    });
}); };
/**
 * 注销
 * @param { string } account
 * @param { string } password
 */
var withDraw = function (account, password) { return __awaiter(void 0, void 0, void 0, function () {
    var restful, res, e_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, _action_1.UserAction.Retrieve(account)];
            case 1:
                res = _a.sent();
                if (!res.length) {
                    restful = new _public_1.Restful(1, '账号不存在');
                }
                else {
                    if (res[0].power > 0) {
                        restful = new _public_1.Restful(3, '不可删除超级管理员账号！');
                    }
                    else if (_public_1.crypto(password) === res[0].password) {
                        // 匹配密码
                        restful = new _public_1.Restful(0, '注销成功');
                    }
                    else {
                        restful = new _public_1.Restful(2, '密码错误');
                    }
                }
                return [3 /*break*/, 3];
            case 2:
                e_7 = _a.sent();
                restful = _public_1.Restful.initWithError(e_7);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/, restful];
        }
    });
}); };
exports.default = {
    Create__Init: Create__Init,
    Create: Create,
    Login: Login,
    Retrieve: Retrieve,
    Retrieve__All: Retrieve__All,
    Update: Update,
    withDraw: withDraw
};
