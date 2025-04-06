import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
	if (locals.pb.authStore.isValid) {
		throw redirect(302, '/start');
	}
};
