import { shield } from '$lib/utils';
import { pb } from '$lib/pocketbase/client';
import { computerStore, regionStore } from '$lib/stores';
import { get } from 'svelte/store';
import { tabsConfig } from '$lib/config';

export const prerender = false;

export const load = async ({ parent, params }) => {
	await parent();
	const computer = await pb
		.collection('computers')
		.getFirstListItem(
			`name = "${shield(params.computer)}" && region.id = "${shield(get(regionStore)?.id as string)}"`
		);

	computerStore.set(computer);
};
