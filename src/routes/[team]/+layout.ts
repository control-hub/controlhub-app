import type { TeamsAccessResponse, TeamsResponse } from '$lib/types';
import { shield } from '$lib/utils';
import { pb } from '$lib/pocketbase/client';
import { teamStore, teamAccessStore, teamsStore } from '$lib/stores.js';

export const prerender = false;

export const load = async ({ parent, params }) => {
	await parent();
	const user = pb.authStore.model;

	const teamsPromise = pb.collection('teams').getFullList<TeamsResponse>({ sort: '-created' });

	const team = await pb
		.collection('teams')
		.getFirstListItem<TeamsResponse>(`name = "${shield(params.team)}"`);
	const teamAccess = await pb
		.collection('teams_access')
		.getFirstListItem<TeamsAccessResponse>(
			`team.name = "${shield(params.team)}" && user.id = "${user?.id}"`
		);

	teamStore.set(team);
	teamAccessStore.set(teamAccess);

	const teams = await teamsPromise;
	teamsStore.set(teams);

	return {};
};
