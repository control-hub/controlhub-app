import { get } from 'svelte/store';
import { executionsStore, computerStore, executionsStoreCount, executionsPerPage } from '$lib/stores';
import { pb } from '$lib/pocketbase/client';

export const prerender = false;

export const load = async ({ parent, params }) => {
	await parent();

	executionsPerPage.set(11);

	const options = {
		sort: '-updated',
		filter: `computer.id = "${get(computerStore)?.id as string}"`,
		expand: `script,user`
	}

	executionsStore.updateOptions({
		...options,
		autoSubGetData: false
	});

	const data = await pb.collection('executions').getList(1, get(executionsPerPage), options);
	executionsStoreCount.set(data.totalItems);
	executionsStore.set(data.items);
	// await executionsStore.getData();
};
