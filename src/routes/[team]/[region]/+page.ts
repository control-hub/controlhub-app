import { shield } from '$lib/utils';
import { pb } from '$lib/pocketbase/client';
import { tabsStore, computersStore } from '$lib/stores';
import { tabsConfig } from '$lib/config';

export const prerender = false;

export const load = async ({ parent, params }) => {
	await parent();

	computersStore.updateOptions({
		sort: '-name,-status,-updated',
		filter: `region.name = "${shield(params.region)}" && region.team.name = "${shield(params.team)}"`,
		autoSubGetData: false
	});

	await computersStore.getData();
	tabsStore.set(tabsConfig.region);
};
