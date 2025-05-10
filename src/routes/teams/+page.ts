import { teamsStore } from '$lib/stores';

export const prerender = false;

export const load = async () => {
	await teamsStore.getData();
};
