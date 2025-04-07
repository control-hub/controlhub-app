import { derived, writable } from 'svelte/store';
import type {
	RegionsResponse,
	UsersResponse,
	TeamsResponse,
	TeamsAccessResponse,
	Tab
} from '$lib/types';

export const userStore = writable<UsersResponse | null>(null);
export const regionStore = writable<RegionsResponse | null>(null);
export const teamStore = writable<TeamsResponse | null>(null);
export const teamAccessStore = writable<TeamsAccessResponse | null>(null);

export const havePermission = derived(
	[teamAccessStore, teamStore],
	([$teamAccessStore, $teamStore]: [TeamsAccessResponse | null, TeamsResponse | null]) => {
		return (permission: string) => {
			if (!$teamStore || !$teamAccessStore) return false;
			if ($teamStore.owner === $teamAccessStore.user) return true;

			return $teamAccessStore.permissions.includes(permission as any);
		};
	}
);

export const tabsStore = writable<Tab[]>([]);
