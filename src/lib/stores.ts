import { derived, writable } from 'svelte/store';
import { createCollectionStore } from 'pocketbase-store';
import { pb } from '$lib/pocketbase/client';

import type {
	RegionsResponse,
	UsersResponse,
	TeamsResponse,
	TeamsAccessResponse,
	Tab
} from '$lib/types';
import { shield } from '$lib/utils';

export const userStore = writable<UsersResponse | undefined>(undefined);

export const teamStore = writable<TeamsResponse | undefined>(undefined);
export const teamsStore = createCollectionStore<TeamsResponse>(pb, 'teams', {
	autoSubGetData: false,
	sort: '-created'
});

export const teamAccessStore = writable<TeamsAccessResponse | undefined>(undefined);

export const havePermission = derived(
	[teamAccessStore, teamStore],
	([$teamAccessStore, $teamStore]: [
		TeamsAccessResponse | undefined,
		TeamsResponse | undefined
	]) => {
		return (permission: string) => {
			if (!$teamStore || !$teamAccessStore) return false;
			if ($teamStore.owner === $teamAccessStore.user) return true;

			return $teamAccessStore.permissions.includes(permission as any);
		};
	}
);

export const regionStore = writable<RegionsResponse | undefined>(undefined);
export const regionsStore = createCollectionStore<RegionsResponse>(pb, 'regions', {
	sort: '-created',
	autoSubGetData: false
});

export const tabsStore = writable<Tab[]>([]);
