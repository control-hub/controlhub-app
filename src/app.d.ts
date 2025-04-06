// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import PocketBase from 'pocketbase';
import type { UsersResponse as User } from '$lib/types.js';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | undefined;
			pb: PocketBase;
			admin: PocketBase;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
