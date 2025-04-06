export let POST = async ({ locals, request }) => {
	const body = await request.json();
	const team = await locals.pb.collection('teams').getOne(body.teamId);
	const user = locals.user?.id;

	// TODO

	if (!team || !user) {
		return new Response(null, { status: 403 });
	}
};
