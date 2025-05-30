import type { Tab, TeamsResponse } from '$lib/types';
import { writable } from 'svelte/store';

export const providersSortOrder = ['google', 'yandex', 'github'];

export const icon = {
	default: 'h-4 w-4',
	left: 'mr-2 h-4 w-4',
	right: 'ml-2 h-4 w-4'
};

export const logos = {
	github: {
		dark: '/github-light.svg'
	}
};

export const defaultUser = writable('core');

export const tabsConfig: { [key: string]: Tab[] } = {
	script: [
		{
			name: 'Overview',
			href: ''
		},
		{
			name: 'Settings',
			href: '/~/settings'
		}
	],
	computer: [
		{
			name: 'Overview',
			href: ''
		},
		{
			name: 'Settings',
			href: '/~/settings'
		}
	],
	region: [
		{
			name: 'Overview',
			href: ''
		},
		{
			name: "Tokens",
			href: '/~/tokens'
		},
		{
			name: 'Settings',
			href: '/~/settings'
		}
	],
	team: [
		{
			name: 'Overview',
			href: ''
		},
		{
			name: 'Links',
			href: '/~/links'
		},
		{
			name: 'Members',
			href: '/~/members'
		},
		{
			name: 'Settings',
			href: '/~/settings'
		}
	]
};

export const emptyTeam: TeamsResponse = {
	id: 'undefined',
	name: 'Unselected',
	empty: true
} as any;
