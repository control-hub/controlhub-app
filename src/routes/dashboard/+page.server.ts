import { toPOJO } from '$lib/utils';

export const load = async ({ locals, url }) => {
    const teams = locals.pb.collection('teams').getFullList()
    
    return {
        teams: await teams,
        user: toPOJO(locals.user),
        cookie: locals.pb.authStore.exportToCookie(),
		url: url.pathname
    };
};