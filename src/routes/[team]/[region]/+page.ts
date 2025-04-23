import { shield } from '$lib/utils';
import { pb } from '$lib/pocketbase/client';
import { tabsStore, computersStore } from '$lib/stores';
import { tabsConfig } from '$lib/config';

export const prerender = false;

export const load = async ({ parent, params }) => {
	await parent();

	const computersPromise = pb.collection('computers').getFullList({
		sort: '-status,-updated',
		filter: `region.name = "${shield(params.region)}" && region.team.name = "${shield(params.team)}"`
	});

	const computers = await computersPromise;

	computersStore.updateOptions({
		sort: '-status,-updated',
		filter: `region.name = "${shield(params.region)}" && region.team.name = "${shield(params.team)}"`,
		autoSubGetData: false
	});

	computersStore.set(computers);
	tabsStore.set(tabsConfig.region);
};
