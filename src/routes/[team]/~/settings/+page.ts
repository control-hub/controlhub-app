import { teamStore, teamsAccessStore } from '$lib/stores.js';
import { get } from 'svelte/store';

export const prerender = false;

export const load = async ({ parent }) => {
    await parent();

    teamsAccessStore.updateOptions({
        filter: `team = "${get(teamStore)?.id as string}"`,
        sort: '-created',
        expand: 'user',
        autoSubGetData: false
    });

    await teamsAccessStore.getData();
};
