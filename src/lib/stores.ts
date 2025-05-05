import { derived, writable } from 'svelte/store';
import { createCollectionStore } from 'pocketbase-store';
import { pb } from '$lib/pocketbase/client';

import type {
	RegionsResponse,
	UsersResponse,
	TeamsResponse,
	TeamsAccessResponse,
	ComputersResponse,
	Tab,
	ScriptsResponse,
	ExecutionsResponse,
	TeamsLinkResponse
} from '$lib/types';
// import { shield } from '$lib/utils';

export const userStore = writable<UsersResponse | undefined>(undefined);
export const usersStore = createCollectionStore<UsersResponse>(pb, 'users', {
	sort: '-created',
	autoSubGetData: false
});

export const teamStore = writable<TeamsResponse | undefined>(undefined);
export const teamsStore = createCollectionStore<TeamsResponse>(pb, 'teams', {
	sort: '-created',
	autoSubGetData: false
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

export const teamsLinkStore = createCollectionStore<TeamsLinkResponse>(pb, 'teams_link', {
	sort: '-created',
	autoSubGetData: false
})

export const regionStore = writable<RegionsResponse | undefined>(undefined);
export const regionsStore = createCollectionStore<RegionsResponse>(pb, 'regions', {
	sort: '-created',
	autoSubGetData: false
});

export const computerStore = writable<ComputersResponse | undefined>(undefined);
export const computersStore = createCollectionStore<ComputersResponse>(pb, 'computers', {
	sort: '-status,-updated',
	autoSubGetData: false
});
export const selectedComputers = writable<ComputersResponse[]>([]);

export const executionsStore = createCollectionStore<ExecutionsResponse>(pb, 'executions', {
	sort: '-status,-updated',
	autoSubGetData: false
});
export const executionStore = writable<ExecutionsResponse | undefined>(undefined);

export const scriptStore = writable<ScriptsResponse | undefined>(undefined);
export const scriptsStore = createCollectionStore<ScriptsResponse>(pb, 'scripts', {
	sort: '-created',
	autoSubGetData: false
});

export const tabsStore = writable<Tab[]>([]);
