import { env } from '$env/dynamic/private';
import { createPb } from '.';

const admin_ = createPb();

await admin_.admins.authWithPassword(env.POCKETBASE_ADMIN_LOGIN, env.POCKETBASE_ADMIN_PASSWORD, {
	autoRefreshThreshold: 30 * 60
});

export const admin = admin_;
