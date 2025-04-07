import { toPOJO } from '$lib/utils';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
	const user = locals.user;

	if (!user && !url.pathname.startsWith('/auth/')) {
		throw redirect(302, '/auth/login');
	}

	return {
		user: toPOJO(user),
		url: url.pathname
	};
};
