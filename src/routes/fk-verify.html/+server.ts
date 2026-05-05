import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response('2b331f2d497a3eb82bac71709d7997ed', {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8'
		}
	});
};
