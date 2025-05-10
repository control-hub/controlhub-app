import { shield } from '$lib/utils';
import { pb } from '$lib/pocketbase/client';
import { scriptsStore } from '$lib/stores.js';

export const prerender = false;

export const load = async ({ parent, params }) => {
	await parent();

	const { user } = params;

	scriptsStore.updateOptions({
		sort: '-executed,-created',
		expand: 'user',
		filter: `user.username = "${shield(user)}"`,
		// filter: `user.id = "${shield(get(userStore)?.id as string)}"`,
		autoSubGetData: false
	});

	await scriptsStore.getData()
	
	return {
		username: user,
	}
};
