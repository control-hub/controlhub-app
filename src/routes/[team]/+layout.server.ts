import { redirect } from '@sveltejs/kit';
import { toPOJO } from '$lib/utils';
import { shield } from '$lib/utils';

export const load = async ({ locals, url, params}) => {
	const user = locals.user;

	console.log(params.team)

	if (!user && !url.pathname.startsWith('/auth/')) {
		throw redirect(302, '/auth/login');
	}

	const teams = locals.pb.collection('teams').getFullList();
	const teamAccess = locals.pb.collection('teams_access').getFirstListItem(`team.name = "${shield(params.team)}" && user.id = "${user?.id}"`);
	console.log(`name = "${shield(params.team)}"`)
	const team = locals.pb
		.collection('teams')
		.getFirstListItem(`name = "${shield(params.team)}"`);

	return {
		team: await team,
		teamAccess: await teamAccess,
		params: params,
		user: toPOJO(user),
		teams: await teams,
		cookie: locals.pb.authStore.exportToCookie(),
		url: url.pathname
	};
};
