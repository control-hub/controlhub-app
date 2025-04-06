import { answer } from '$lib/utils.js';

export const POST = async ({ locals, url, cookies, request }) => {
	const currentProvider = (await request.json()).provider;
	const providers = await locals.pb.collection('users').listAuthMethods();

	if (!providers) {
		return answer({ code: 403, message: 'Something went wrong :(' }, 403);
	} else {
		// console.log(providers);
	}

	const redirectUrl = `${url.origin}/auth/oauth`;
	const currentAuthProvider = providers.authProviders.filter(
		(provider) => provider.name === currentProvider
	)[0];
	const authProviderRedirect = `${currentAuthProvider.authUrl}${redirectUrl}`;

	const state = currentAuthProvider.state;
	const verifier = currentAuthProvider.codeVerifier;

	cookies.set('provider', currentProvider, { path: '/' });
	cookies.set('oauth_state', state, { path: '/' });
	cookies.set('oauth_verifier', verifier, { path: '/' });

	return answer(
		{
			code: 200,
			message: `Redirecting to ${currentAuthProvider.displayName}'s OAuth`,
			url: authProviderRedirect
		},
		200
	);
};
