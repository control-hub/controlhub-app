import { pb } from '$lib/pocketbase/client';
import { teamsStore, teamStore } from '$lib/stores';
import { emptyTeam } from '$lib/config';

export const prerender = false;

export const load = async () => {
	teamStore.set(emptyTeam);
	await teamsStore.getData();

	return {};
};
