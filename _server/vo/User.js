"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
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
    return User;
}());
exports.User = User;
module.exports = User;
