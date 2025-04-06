import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

export const createPb = (autoCancellation: boolean = false) => {
	const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

	pb.autoCancellation(autoCancellation);

	return pb;
};
