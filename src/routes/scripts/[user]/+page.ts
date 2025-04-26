import { shield } from '$lib/utils';
import { pb } from '$lib/pocketbase/client';
import { scriptsStore } from '$lib/stores.js';

export const prerender = false;

export const load = async ({ parent, params }) => {
	await parent();

	const { user } = params;

	const scriptsPromise = pb.collection('scripts').getFullList({
		sort: '-created',
		expand: 'user',
		filter: `user.username = "${shield(user)}"`,
		// filter: `user.id = "${shield(get(userStore)?.id as string)}"`
	});

	scriptsStore.updateOptions({
		sort: '-created',
		expand: 'user',
		filter: `user.username = "${shield(user)}"`,
		// filter: `user.id = "${shield(get(userStore)?.id as string)}"`,
		autoSubGetData: false
	});

	scriptsStore.set(await scriptsPromise);
	
	return {
		username: user,
	}
};
