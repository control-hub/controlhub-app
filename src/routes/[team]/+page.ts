import { pb } from '$lib/pocketbase/client';
import { regionsStore, tabsStore, teamStore } from '$lib/stores.js';
import { tabsConfig } from '$lib/config';
import { get } from 'svelte/store';

export const prerender = false;

export const load = async ({ parent, params }) => {
	await parent();
	tabsStore.set(tabsConfig.team as any);

	try {
		const regions = await pb
			.collection('regions')
			.getFullList({ filter: `team.id = "${get(teamStore)?.id as string}"`, sort: '-created' });

		regionsStore.set(regions);
	} catch (err) {
		window.location.href = '/';
	}
};
