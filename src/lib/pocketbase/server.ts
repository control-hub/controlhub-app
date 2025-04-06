import { POCKETBASE_ADMIN_LOGIN, POCKETBASE_ADMIN_PASSWORD } from '$env/static/private';
import { createPb } from '.';

const admin_ = createPb();

await admin_.admins.authWithPassword(POCKETBASE_ADMIN_LOGIN, POCKETBASE_ADMIN_PASSWORD, {
	autoRefreshThreshold: 30 * 60
});

export const admin = admin_;
