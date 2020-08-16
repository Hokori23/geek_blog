"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _public_1 = require("../_public");
var User = /** @class */ (function () {
    function User(id, account, username, email, password, avatar_url, bio, power, social_buttons, last_activated_at) {
        this.id = id;
        this.account = account;
        this.username = username;
        this.email = email;
        this.password = password;
        this.avatar_url = avatar_url;
        this.bio = bio;
        this.power = power;
        this.social_buttons = social_buttons;
        this.last_activated_at = last_activated_at;
    }
    User.prototype.toArray = function () {
        var _a = this, id = _a.id, account = _a.account, username = _a.username, email = _a.email, password = _a.password, avatar_url = _a.avatar_url, bio = _a.bio, power = _a.power, social_buttons = _a.social_buttons, last_activated_at = _a.last_activated_at;
        return [
            id,
            account,
            username,
            email,
            password,
            avatar_url,
            bio,
            power,
            social_buttons,
            last_activated_at
        ];
    };
    // 检查参数完整性
    User.prototype.checkIntegrity = function (params) {
        if (params) {
            for (var i = 0; i < params.length; i++) {
                if (_public_1.isUndef(this[params[i]])) {
                    return false;
                }
            }
            return true;
        }
        else {
            var arr = this.toArray();
            for (var i = 0; i < arr.length; i++) {
                if (_public_1.isUndef(arr[i])) {
                    return false;
                }
            }
            return true;
        }
    };
    User.clone = function (obj) {
        var id = obj.id, account = obj.account, username = obj.username, email = obj.email, password = obj.password, avatar_url = obj.avatar_url, bio = obj.bio, power = obj.power, social_buttons = obj.social_buttons, last_activated_at = obj.last_activated_at;
        return new User(id, account, username, email, password, avatar_url, bio, power, social_buttons, last_activated_at);
    };
    return User;
}());
exports.default = User;
