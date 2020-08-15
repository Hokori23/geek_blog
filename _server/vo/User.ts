export interface User {
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

export class User {
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
}

module.exports = User;
