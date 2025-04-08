import { shield } from '$lib/utils';
import { pb } from '$lib/pocketbase/client';

export const prerender = false;

export const load = async ({ params }) => {
	try {
		const regionsPromise = pb
			.collection('regions')
			.getFullList({ filter: `team.name = "${shield(params.team)}"`, sort: '-created' });

		return {
			regions: await regionsPromise
		};
	} catch (err) {
		window.location.href = '/start/clear';
	}
};
