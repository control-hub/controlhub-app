import { shield } from '$lib/utils';
import { tabsStore, computersStore, regionStore } from '$lib/stores';
import { tabsConfig } from '$lib/config';
import { get } from 'svelte/store';

export const prerender = false;

export const load = async ({ parent, params }) => {
	await parent();

	computersStore.updateOptions({
		sort: '-name,-status,-updated',
		filter: `region.id = "${shield(get(regionStore)?.id as string)}"`,
		expand: `script`,
		autoSubGetData: false
	});

	await computersStore.getData();
};
