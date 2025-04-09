import { shield } from '$lib/utils';
import { pb } from '$lib/pocketbase/client';
import { regionsStore, tabsStore } from '$lib/stores.js';
import { tabsConfig } from '$lib/config';

export const prerender = false;

export const load = async ({ params }) => {
	tabsStore.set(tabsConfig.team as any);

	try {
		const regions = await pb
			.collection('regions')
			.getFullList({ filter: `team.name = "${shield(params.team)}"`, sort: '-created' });

		regionsStore.set(regions);
	} catch (err) {
		window.location.href = '/start/clear';
	}
};
