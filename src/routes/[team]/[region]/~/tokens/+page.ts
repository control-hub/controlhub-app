import { shield } from '$lib/utils';
import { computersStore, regionStore } from '$lib/stores';
import { get } from 'svelte/store';

export const prerender = false;

export const load = async ({ parent, params }) => {
    await parent();

    if (get(computersStore).length === 0) {
        
        computersStore.updateOptions({
            sort: '-name,-status,-updated',
            filter: `region.id = "${shield(get(regionStore)?.id as string)}"`,
            expand: `script`,
            autoSubGetData: false
        });
        
        await computersStore.getData();
    }
};
