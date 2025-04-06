import { shield } from '$lib/utils';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	try {
		const regions = locals.pb
			.collection('regions')
			.getFullList({ filter: `team.name = "${shield(params.team)}"`, sort: '-created' });

		return {
			regions: await regions,
		};
	} catch (err) {
		throw redirect(302, '/start/clear');
	}
};
