import { shield } from '$lib/utils';
import { pb } from '$lib/pocketbase/client';
import { tabsStore } from '$lib/stores';
import { tabsConfig } from '$lib/config';

export const prerender = false;

export const load = async ({ params }) => {
	const computersPromise = pb.collection('computers').getFullList({
		sort: '-status,-updated',
		filter: `region.name = "${shield(params.region)}" && region.team.name = "${shield(params.team)}"`
	});

	const team = await pb.collection('teams').getFirstListItem(`name = "${shield(params.team)}"`);

	const region = await pb
		.collection('regions')
		.getFirstListItem(`name = "${shield(params.region)}" && team.name = "${shield(params.team)}"`);

	const computers = await computersPromise;

	tabsStore.set(tabsConfig.region);

	return {
		team,
		region,
		computers
	};
};
