import type { SvelteComponent, Component } from 'svelte';

export type User = {
	username: string;
	email: string;
	avatar: string | null;
};

export type NavPage = {
	title: string;
	url: string;
	icon?: any;
	isActive?: boolean;
	items?: { title: string; url: string }[];
};

export type Team = {
	name: string;
	logo?: typeof SvelteComponent | Component;
	plan?: string;
};
