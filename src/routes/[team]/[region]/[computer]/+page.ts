import { get } from 'svelte/store';
import { executionsStore, computerStore } from '$lib/stores';

export const prerender = false;

export const load = async ({ parent, params }) => {
	await parent();

	executionsStore.updateOptions({
		sort: '-updated',
		filter: `computer.id = "${get(computerStore)?.id as string}" && invisible = false`,
		expand: `script,user`,
		autoSubGetData: false
	});

	await executionsStore.getData();
};
