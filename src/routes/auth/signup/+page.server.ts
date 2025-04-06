export const load = async ({ locals }) => {
	return {
		providers: (await locals.pb.collection('users').listAuthMethods()).authProviders
	};
};
