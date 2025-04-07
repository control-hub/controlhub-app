import { shield } from '$lib/utils';

export const load = async ({ params, locals }) => {
	const computersPromise = locals.pb.collection('computers').getFullList({
		sort: '-status,-updated',
		filter: `region.name = "${shield(params.region)}" && region.team.name = "${shield(params.team)}"`
	});

	let team = null;
	let region = null;
	let teamNotFound = false;
	let regionNotFound = false;

	try {
		team = await locals.pb.collection('teams').getFirstListItem(`name = "${shield(params.team)}"`);
	} catch (error) {
		if (error && typeof error === 'object' && 'status' in error && (error as any).status === 404) {
			teamNotFound = true;
		} else {
			throw error;
		}
	}

	try {
		region = await locals.pb
			.collection('regions')
			.getFirstListItem(
				`name = "${shield(params.region)}" && team.name = "${shield(params.team)}"`
			);
	} catch (error) {
		if (error && typeof error === 'object' && 'status' in error && (error as any).status === 404) {
			regionNotFound = true;
		} else {
			throw error;
		}
	}

	const computers = await computersPromise;

	return {
		team,
		region,
		teamNotFound,
		regionNotFound,
		computers
	};
};
