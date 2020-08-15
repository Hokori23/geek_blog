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
exports.Delete_User = exports.Update_User = exports.Retrieve_User_Safely = exports.Retrieve_User = exports.Add_User = void 0;
var vo_1 = require("../vo");
/**
 * 添加用户
 * @param { User } user
 */
var Add_User = function (user) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var sql, params, db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sql = "\n      INSERT INTO user\n      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n    ";
                    params = user.toArray();
                    return [4 /*yield*/, DB()];
                case 1:
                    db = _a.sent();
                    db.query(sql, params, function (err, res) {
                        if (err) {
                            reject(err);
                        }
                        resolve(res);
                    });
                    db.end();
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.Add_User = Add_User;
/**
 * 查询单个用户
 * @param { string } account
 */
var Retrieve_User = function (account) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var sql, db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sql = "\n      SELECT * FROM user WHERE account = ?\n    ";
                    return [4 /*yield*/, DB()];
                case 1:
                    db = _a.sent();
                    db.query(sql, [account], function (err, res) {
                        if (err) {
                            reject(err);
                        }
                        resolve(res);
                    });
                    db.end();
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.Retrieve_User = Retrieve_User;
/**
 * 查询单个用户（不含密码）
 * @param { string } account
 */
var Retrieve_User_Safely = function (account) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var sql, tempUser, keys, keysLength, db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sql = "\n      SELECT\n    ";
                    tempUser = new vo_1.User();
                    keys = Object.keys(tempUser);
                    keysLength = keys.length;
                    keys.forEach(function (v, index) {
                        if (v !== 'password') {
                            sql += "\n        " + v + (index === keysLength ? '' : ',') + "\n        ";
                        }
                    });
                    sql += "\n      WHERE account = ?\n    ";
                    return [4 /*yield*/, DB()];
                case 1:
                    db = _a.sent();
                    db.query(sql, [account], function (err, res) {
                        if (err) {
                            reject(err);
                        }
                        resolve(res);
                    });
                    db.end();
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.Retrieve_User_Safely = Retrieve_User_Safely;
/**
 * 更新用户信息
 * @param { User } oldUser
 * @param { User } newUser
 */
var Update_User = function (oldUser, newUser) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var sql, keys, keysLength, params, db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sql = "\n      UPDATE user SET\n    ";
                    keys = Object.keys(oldUser);
                    keysLength = keys.length;
                    keys.forEach(function (v, index) {
                        sql += "\n      " + v + " = ?" + (index === keysLength ? '' : '?') + "\n      ";
                    });
                    sql += "\n      WHERE account = ?\n    ";
                    // 混合用户信息
                    newUser = _PUBLIC.assign([oldUser, newUser], true);
                    params = newUser.toArray().push(newUser.account);
                    return [4 /*yield*/, DB()];
                case 1:
                    db = _a.sent();
                    db.query(sql, params, function (err, res) {
                        if (err) {
                            reject(err);
                        }
                        resolve(res);
                    });
                    db.end();
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.Update_User = Update_User;
/**
 * 删除用户账号
 * @param { string} account
 */
var Delete_User = function (account) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var sql, db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sql = "\n    DELETE FROM user WHERE account = ?\n  ";
                    return [4 /*yield*/, DB()];
                case 1:
                    db = _a.sent();
                    db.query(sql, [account], function (err, res) {
                        if (err) {
                            reject(err);
                        }
                        resolve(res);
                    });
                    db.end();
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.Delete_User = Delete_User;
