interface User {
	id: number;
	account: string;
	username: string;
	email: string;
	password: string;
	avatar_url: string;
	bio: string;
	power: number;
	social_buttons: string;
}

class User {
	id: number;
	account: string;
	username: string;
	email: string;
	password: string;
	avatar_url: string;
	bio: string;
	power: number;
	social_buttons: string;
	constructor(
		id: number,
		account: string,
		username: string,
		email: string,
		password: string,
		avatar_url: string,
		bio: string,
		power: number,
		social_buttons: string
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
	}
}

module.exports = User;
