import { pb } from '$lib/pocketbase/client';
import { teamsLinkStore, tabsStore, teamStore } from '$lib/stores.js';
import { tabsConfig } from '$lib/config';
import { get } from 'svelte/store';

export const prerender = false;

export const load = async ({ parent, params }) => {
    await parent();
    tabsStore.set(tabsConfig.team as any);

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
