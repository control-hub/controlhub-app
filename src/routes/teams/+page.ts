import { pb } from '$lib/pocketbase/client';
import { teamsStore, teamStore, tabsStore } from '$lib/stores';
import { emptyTeam, tabsConfig } from '$lib/config';

export const prerender = false;

export const load = async () => {
	const teams = await pb.collection('teams').getFullList({ sort: '-created' });

	teamStore.set(emptyTeam);
	teamsStore.set(teams);

	return {};
};
