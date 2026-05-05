import { toPOJO } from '$lib/utils';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
	const user = locals.user;

	if (!user && !url.pathname.startsWith('/auth/') && !url.pathname.startsWith('/landing') && !url.pathname.startsWith('/fk-verify.html')) {
		throw redirect(302, '/auth/login');
	}

	return {
		user: toPOJO(user),
		cookie: locals.pb.authStore.exportToCookie()
	};
};
