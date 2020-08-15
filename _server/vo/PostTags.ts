interface PostTags {
	id: number;
	post_id: number;
	name: string;
	description: string;
	parent_id: number;
	icon_display: boolean;
	icon_class: string;
	icon_color: string;
}

class PostTags {
	constructor(
		id: number,
		post_id: number,
		name: string,
		description: string,
		parent_id: number,
		icon_display: boolean,
		icon_class: string,
		icon_color: string
	) {
		this.id = id;
		this.post_id = post_id;
		this.name = name;
		this.description = description;
		this.parent_id = parent_id;
		this.icon_display = icon_display;
		this.icon_class = icon_class;
		this.icon_color = icon_color;
	}
}

export default PostTags