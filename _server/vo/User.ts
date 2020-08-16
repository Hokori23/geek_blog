import { isUndef } from '@public';

interface User {
  id?: number;
  account?: string;
  username?: string;
  email?: string;
  password?: string;
  avatar_url?: string;
  bio?: string;
  power?: number;
  social_buttons?: string;
  last_activated_at?: string;
}

class User implements User {
  id?: number;
  account?: string;
  username?: string;
  email?: string;
  password?: string;
  avatar_url?: string;
  bio?: string;
  power?: number;
  social_buttons?: string;
  last_activated_at?: string;
  constructor(
    id?: number,
    account?: string,
    username?: string,
    email?: string,
    password?: string,
    avatar_url?: string,
    bio?: string,
    power?: number,
    social_buttons?: string,
    last_activated_at?: string
  ) {
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
  toArray(): Array<any> {
    const {
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
    } = this;
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
  }
  // 检查参数完整性
  checkIntegrity(params?: Array<string>): boolean {
    if (params) {
      for (let i = 0; i < params.length; i++) {
        if (isUndef(this[params[i]])) {
          return false;
        }
      }
      return true;
    } else {
      const arr = this.toArray();
      for (let i = 0; i < arr.length; i++) {
        if (isUndef(arr[i])) {
          return false;
        }
      }
      return true;
    }
  }
  static clone(obj: User): User {
    const {
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
    } = obj;
    return new User(
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
    );
  }
}

export default User;
