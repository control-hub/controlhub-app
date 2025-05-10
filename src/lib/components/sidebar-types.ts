export type NavPage = {
	title: string;
	url: string;
	icon?: any;
	isActive?: boolean;
	items?: { title: string; url: string }[];
};
