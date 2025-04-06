import { answer, checkPassword } from '$lib/utils.js';

type LoginBody = {
	login: string;
	password: string;
};

export const POST = async ({ locals, request }) => {
	const body: LoginBody = (await request.json()) as LoginBody;

	const validate = checkPassword(body.password);
	if (!validate.success) {
		return answer({ code: 403, message: validate.error }, 403);
	}

	try {
		await locals.pb.collection('users').authWithPassword(body.login, body.password);
		return answer({ code: 200, message: 'Logged in successfully' }, 200);
	} catch (err) {
		return answer({ code: 403, message: 'Incorrect login or password' }, 403);
	}
};
