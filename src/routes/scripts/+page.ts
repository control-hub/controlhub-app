import { shield } from '$lib/utils';
import { pb } from '$lib/pocketbase/client';
import { userStore, scriptsStore } from '$lib/stores.js';
import { get } from 'svelte/store';

export const prerender = false;

export const load = async ({ parent }) => {
	await parent();
	console.log(get(userStore));

	const scriptsPromise = pb.collection('scripts').getFullList({
		sort: '-created',
		expand: 'user'
		// filter: `user.id = "${shield(get(userStore)?.id as string)}"`
	});

	scriptsStore.updateOptions({
		sort: '-created',
		expand: 'user',
		// filter: `user.id = "${shield(get(userStore)?.id as string)}"`,
		autoSubGetData: false
	});

	scriptsStore.set(await scriptsPromise);
};
