import { redirect } from '@sveltejs/kit';
import { toPOJO } from '$lib/utils';

export const load = async ({ locals, url }) => {
	const user = locals.user;

	if (!user && !url.pathname.startsWith('/auth/')) {
		throw redirect(302, '/auth/login');
	}

	const teams = locals.pb.collection('teams').getFullList();

	return {
		user: toPOJO(user),
		teams: await teams,
		cookie: locals.pb.authStore.exportToCookie(),
		url: url.pathname
	};
};
