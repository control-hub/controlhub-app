<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { teamStore, regionStore, computerStore } from '$lib/stores';
	import type { ExecutionsResponse, UsersResponse } from '$lib/types';
	import { UserAvatar } from '$lib/user';

	export let execution: ExecutionsResponse;

	const STATUS_COLORS = {
		0: 'bg-gray-400',
		1: 'bg-yellow-500',
		2: 'bg-green-500',
		3: 'bg-red-500'
	};

	const readableDuration = (s?: number) => {
		if (!s) return '—';
		return `${s.toFixed(1)} s`;
	};

	const user = (execution.expand as { user: UsersResponse }).user;
</script>

<a href="/{$teamStore?.name}/{$regionStore?.name}/{$computerStore?.name}/{execution.id}">
	<Alert.Root class="flex justify-between gap-4">
		<div class="flex items-center gap-4">
			<div class="size-4 rounded-full {STATUS_COLORS[execution.status ?? 0]}"></div>
			<div class="flex flex-col">
				<Alert.Title>{execution.id}</Alert.Title>
				<span class="text-muted-foreground">
					Duration: {readableDuration(execution.duration)}
				</span>
			</div>
		</div>
		<div class="flex items-center gap-2">
			<span class="text-muted-foreground"> by </span>
			<a href="/scripts/{user.username}">
				<Tooltip.Root>
					<Tooltip.Trigger>
						<UserAvatar {user} />
					</Tooltip.Trigger>
					<Tooltip.Content>
						<pre class="max-w-xs overflow-x-auto text-xs">{JSON.stringify(
								{ id: user.id, email: user.email, username: user.username },
								null,
								4
							)}</pre>
					</Tooltip.Content>
				</Tooltip.Root>
			</a>
		</div>
	</Alert.Root>
</a>
