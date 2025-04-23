import { pb } from '$lib/pocketbase/client';
import { shield } from '$lib/utils';
import { scriptStore } from '$lib/stores.js';

export const prerender = false;
export const ssr = false;

export const load = async ({ parent, params }) => {
	await parent();
	const { user, script } = params;

	const scriptPromise = pb
		.collection('scripts')
		.getFirstListItem(`user.username = "${shield(user)}" && name = "${shield(script)}"`);
	scriptStore.set(await scriptPromise);

	return {
		user: user
	};
};
