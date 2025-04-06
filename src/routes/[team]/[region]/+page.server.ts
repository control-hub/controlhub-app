import { shield } from '$lib/utils';

export const load = async ({ params, locals }) => {
	const computers = locals.pb.collection('computers').getFullList({
		sort: '-status,-updated',
		filter: `region.name = "${shield(params.region)}" && region.team.name = "${shield(params.team)}"`
	});

	const team = locals.pb.collection('teams').getFirstListItem(`name = "${shield(params.team)}"`);

	const region = locals.pb
		.collection('regions')
		.getFirstListItem(`name = "${shield(params.region)}" && team.name = "${shield(params.team)}"`);

	return {
		team: await team,
		region: await region,
		computers: await computers
	};
};
