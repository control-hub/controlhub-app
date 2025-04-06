import { compareProviders } from '$lib/utils.js';
import { providersSortOrder } from '$lib/config.js';

export const load = async ({ locals }) => {
	const methods = (await locals.pb.collection('users').listAuthMethods()).authProviders
		.toSorted((a, b) => compareProviders(a, b, providersSortOrder.toReversed()))
		.toReversed();
	return {
		providers: methods
	};
};
