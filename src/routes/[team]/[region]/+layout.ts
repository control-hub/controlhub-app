import { shield } from '$lib/utils';
import { pb } from '$lib/pocketbase/client';
import { regionStore } from '$lib/stores';
import { tabsConfig } from '$lib/config';

export const prerender = false;

export const load = async ({ parent, params }) => {
	await parent();
	const region = await pb
		.collection('regions')
		.getFirstListItem(`name = "${shield(params.region)}"`);

	regionStore.set(region);
};
