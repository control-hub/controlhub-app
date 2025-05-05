import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, params, parent }) => {
	const data = await parent();

	let link;
	let team;

	try {
		link = await locals.admin.collection('teams_link').getFirstListItem(`token = "${params.link}"`);
		team = await locals.admin.collection('teams').getOne(link.team);
	} catch (err) {
		throw redirect(302, '/');
	}

	try {
		await locals.admin.collection('teams_access').create({
			team: link.team,
			user: data.user?.id as string,
			permissions: link.permissions
		});
	} catch (err) {
		throw redirect(302, `/${encodeURIComponent(team.name)}`);
	}

	link.joined.push(data.user?.id as string);
	await locals.admin.collection('teams_link').update(link.id, { joined: link.joined });

	throw redirect(302, `/${encodeURIComponent(team.name)}`);
};
