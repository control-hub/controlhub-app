import { answer } from '$lib/utils.js';

export const POST = async ({ locals, cookies }) => {
	locals.pb.authStore.clear();

	locals.user = undefined;

	return answer({ code: 200, message: 'Logged out successfully' }, 200);
};
