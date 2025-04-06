import { answer, checkPassword } from '$lib/utils.js';

type SignupBody = {
	username: string;
	email: string;
	password: string;
	passwordConfirm: string;
};

export const POST = async ({ locals, request }) => {
	const body: SignupBody = (await request.json()) as SignupBody;

	const validate = checkPassword(body.password);

	if (!validate.success) {
		return answer({ code: 403, message: validate.error }, 403);
	}

	try {
		await locals.pb.collection('users').create(body);
	} catch (err) {
		return answer({ code: 403, message: 'User already exists' }, 403);
	}

	try {
		await locals.pb.collection('users').authWithPassword(body.username, body.password);

		return answer({ code: 200, message: 'Check your email' }, 200);
	} catch (err) {
		return answer({ code: 403, message: 'Something went wrong :(' }, 403);
	}
};
