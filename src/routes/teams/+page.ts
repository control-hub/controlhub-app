import { pb } from '$lib/pocketbase/client';

export const prerender = false;

export const load = async () => {
	const teams = pb.collection('teams').getFullList({ sort: '-created' });

	return {
		teams: await teams
	};
};
