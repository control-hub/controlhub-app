<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import type { UsersResponse } from '$lib/types';

	export let user: UsersResponse;
</script>

<Avatar.Root class="h-8 w-8 rounded-lg">
	<Avatar.Image
		class="object-cover"
		src="{PUBLIC_POCKETBASE_URL}/api/files/users/{user.id}/{user.avatar}"
		alt={user.username}
	/>
	<Avatar.Fallback class="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
		>{user.username[0].toUpperCase() +
			user.username[user.username.length - 1].toUpperCase()}</Avatar.Fallback
	>
</Avatar.Root>
