<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { env } from '$env/dynamic/public';
	import type { UsersResponse } from '$lib/types';
	import { cn } from '$lib/utils';

	export let user: UsersResponse;
	let className: string = '';
	export { className as class };
</script>

<Avatar.Root class={cn("h-8 w-8 rounded-lg", className)}>
	<Avatar.Image
		class="object-cover"
		src="{env.PUBLIC_POCKETBASE_URL}/api/files/users/{user.id}/{user.avatar}?thumb=100x100"
		alt={user.username}
	/>
	<Avatar.Fallback class="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
		>{user.username[0].toUpperCase() +
			user.username[user.username.length - 1].toUpperCase()}</Avatar.Fallback
	>
</Avatar.Root>
