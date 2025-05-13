import PocketBase from 'pocketbase';
import type { TypedPocketBase } from '$lib/types';
import { env } from '$env/dynamic/public';

export const createPb = (autoCancellation: boolean = false): TypedPocketBase => {
	const pb = new PocketBase(env.PUBLIC_POCKETBASE_URL) as TypedPocketBase;

	pb.autoCancellation(autoCancellation);

	return pb;
};
