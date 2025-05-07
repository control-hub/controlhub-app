import { teamsLinkStore, teamStore } from '$lib/stores.js';
import { get } from 'svelte/store';

export const prerender = false;

export const load = async ({ parent, params }) => {
    await parent();

    try {
        teamsLinkStore.updateOptions({
            filter: `team.id = "${get(teamStore)?.id as string}"`,
            sort: '-created',
            autoSubGetData: false
        })

        await teamsLinkStore.getData();
    } catch (err) {
        window.location.href = '/';
    }
};
