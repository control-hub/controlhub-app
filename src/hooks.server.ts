import { admin } from '$lib/pocketbase/server';
import { createPb } from '$lib/pocketbase';
import { toPOJO } from '$lib/utils';
import type { Handle } from '@sveltejs/kit';
import type { UsersResponse } from '$lib/types';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.admin = admin;

	if (!event.locals.pb) {
		event.locals.pb = createPb();
	}

	await event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	if (event.locals.pb.authStore.isValid) {
		try {
			await event.locals.pb.collection('users').authRefresh();
		} catch (err) {
			event.locals.pb.authStore.clear();
		}
	}

	if (event.locals.pb.authStore.isValid) {
		event.locals.user = toPOJO(event.locals.pb.authStore.model as UsersResponse);
	} else {
		event.locals.user = undefined;
	}

	const response = await resolve(event);

	response.headers.append(
		'set-cookie',
		event.locals.pb.authStore.exportToCookie({ httpOnly: true, secure: true }) // TODO: make secure on production
	);

	return response;
};
