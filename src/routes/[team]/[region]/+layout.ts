import { shield } from '$lib/utils';
import { pb } from '$lib/pocketbase/client';
import { regionStore, teamStore } from '$lib/stores';
import { tabsConfig } from '$lib/config';
import { get } from 'svelte/store';

export const prerender = false;

export const load = async ({ parent, params }) => {
	await parent();
	const region = await pb
		.collection('regions')
		.getFirstListItem(
			`name = "${shield(params.region)}" && team.id = "${shield(get(teamStore)?.id as string)}"`
		);

	regionStore.set(region);
};
