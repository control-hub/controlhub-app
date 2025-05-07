import { shield } from '$lib/utils';
import { pb } from '$lib/pocketbase/client';
import { executionStore } from '$lib/stores';
export const prerender = false;

export const load = async ({ parent, params }) => {
	await parent();
	const execution = await pb
		.collection('executions')
		.getFirstListItem(`id = "${shield(params.execution)}"`, { expand: `script,user,script.user` });

	executionStore.set(execution);
};
