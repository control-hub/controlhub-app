import { redirect } from '@sveltejs/kit';
import { toPOJO } from '$lib/utils';
import { shield } from '$lib/utils';

export const load = async ({ locals, url, params }) => {
	const user = locals.user;

	console.log(params.team);

	if (!user && !url.pathname.startsWith('/auth/')) {
		throw redirect(302, '/auth/login');
	}

	const teamsPromise = locals.pb.collection('teams').getFullList();

	let team = null;
	let teamAccess = null;
	let teamNotFound = false;

	try {
		team = await locals.pb.collection('teams').getFirstListItem(`name = "${shield(params.team)}"`);
	} catch (error) {
		if (error && typeof error === 'object' && 'status' in error && (error as any).status === 404) {
			teamNotFound = true;
		} else {
			throw error;
		}
	}

	if (!teamNotFound) {
		try {
			teamAccess = await locals.pb
				.collection('teams_access')
				.getFirstListItem(`team.name = "${shield(params.team)}" && user.id = "${user?.id}"`);
		} catch (error) {
			if (
				!(error && typeof error === 'object' && 'status' in error && (error as any).status === 404)
			) {
				throw error;
			}
			// else leave teamAccess as null
		}
	}

	const teams = await teamsPromise;

	return {
		team,
		teamAccess,
		teamNotFound,
		params,
		user: toPOJO(user),
		teams,
		cookie: locals.pb.authStore.exportToCookie(),
		url: url.pathname
	};
};
