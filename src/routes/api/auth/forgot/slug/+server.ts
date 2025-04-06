import { answer, checkPassword } from '$lib/utils.js';

type RecoverBody = {
	token: string;
	password: string;
	passwordConfirm: string;
};

export const POST = async ({ locals, request }) => {
	const body: RecoverBody = (await request.json()) as RecoverBody;

	const validate = checkPassword(body.password);
	if (!validate.success) {
		return answer({ code: 403, message: validate.error }, 403);
	}

	try {
		await locals.pb
			.collection('users')
			.confirmPasswordReset(body.token, body.password, body.passwordConfirm);
		return answer({ code: 200, message: 'Password reset successful.' }, 200);
	} catch (err) {
		// console.log(err);
		return answer({ code: 403, message: 'Something went wrong :(' }, 403);
	}
};
