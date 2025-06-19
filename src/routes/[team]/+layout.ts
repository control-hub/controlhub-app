import type { TeamsAccessResponse, TeamsResponse } from '$lib/types';
import { shield } from '$lib/utils';
import { pb } from '$lib/pocketbase/client';
import { teamStore, teamAccessStore, teamsStore, userStore } from '$lib/stores.js';
import { get } from 'svelte/store';

export const prerender = false;

export const load = async ({ parent, params }) => {
	await parent();
	const teamsPromise = pb.collection('teams').getFullList<TeamsResponse>({ sort: '-created' });

	console.log(params.team)

	const team = await pb
		.collection('teams')
		.getFirstListItem<TeamsResponse>(`name = "${shield(params.team)}"`);
	const teamAccess = await pb
		.collection('teams_access')
		.getFirstListItem<TeamsAccessResponse>(
			`team.id = "${team.id}" && user.id = "${get(userStore)?.id}"`
		);

	teamStore.set(team);
	teamAccessStore.set(teamAccess);

	const teams = await teamsPromise;
	teamsStore.set(teams);

	return {};
};
