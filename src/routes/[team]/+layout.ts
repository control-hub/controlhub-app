import type { TeamsAccessResponse, TeamsResponse } from '$lib/types';
import { shield } from '$lib/utils';
import { pb } from '$lib/pocketbase/client';
import { teamStore, teamAccessStore, teamsStore } from '$lib/stores.js';

export const prerender = false;

export const load = async (event) => {
	// if (typeof window === 'undefined') {
	// 	// Server-side: skip auth and data fetching, return minimal data

	// }

	// Client-side: load auth from cookie and fetch data

	const user = pb.authStore.model;

	const teamsPromise = pb.collection('teams').getFullList<TeamsResponse>({ sort: '-created' });

	let team = null;
	let teamAccess = null;
	let teamNotFound = false;

	team = await pb
		.collection('teams')
		.getFirstListItem<TeamsResponse>(`name = "${shield(event.params.team)}"`);
	teamAccess = await pb
		.collection('teams_access')
		.getFirstListItem<TeamsAccessResponse>(
			`team.name = "${shield(event.params.team)}" && user.id = "${user?.id}"`
		);

	const teams = await teamsPromise;

	teamAccessStore.set(teamAccess);
	teamStore.set(team);
	teamsStore.set(teams);

	return {};
};
