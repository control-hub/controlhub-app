import { answer } from '$lib/utils.js';

type ForgotBody = {
	email: string;
};

export const POST = async ({ locals, request }) => {
	const body: ForgotBody = (await request.json()) as ForgotBody;

	if (
		(await locals.admin.collection('users').getList(1, 1, { filter: `email="${body.email}"` }))
			.totalItems == 0
	) {
		return answer({ code: 403, message: 'Wrong email' }, 403);
	}

	try {
		await locals.admin.collection('users').requestPasswordReset(body.email);
		return answer({ code: 200, message: 'Password reset email sent' }, 200);
	} catch (err) {
		return answer({ code: 403, message: 'Something went wrong :(' }, 403);
	}
};
