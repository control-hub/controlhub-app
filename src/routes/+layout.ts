import { pb } from '$lib/pocketbase/client';
import { tabsStore, teamStore, userStore } from '$lib/stores';

export const prerender = false;

export const load = async ({ data }) => {
	tabsStore.set([]);
	teamStore.set(undefined);

	userStore.set(data.user);
	pb.authStore.loadFromCookie(data.cookie);

	console.log(data.user);
	return data;
};
