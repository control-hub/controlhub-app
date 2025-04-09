import PocketBase from 'pocketbase';
import type { TypedPocketBase } from '$lib/types';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

export const createPb = (autoCancellation: boolean = false): TypedPocketBase => {
	const pb = new PocketBase(PUBLIC_POCKETBASE_URL) as TypedPocketBase;

	pb.autoCancellation(autoCancellation);

	return pb;
};
