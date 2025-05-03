<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { executionsStore, teamStore, regionStore, computerStore } from '$lib/stores';
	import { onMount, onDestroy } from 'svelte';
	import type { UsersResponse } from '$lib/types';
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

	const STATUS_COLORS = {
		0: 'bg-gray-400',
		1: 'bg-yellow-500',
		2: 'bg-green-500',
		3: 'bg-red-500'
	};

	onMount(async () => {
		await executionsStore.subscribeOnPocketBase();
	});

	onDestroy(async () => {
		await executionsStore.unsubscribeFromPocketBase();
	});

	const readableDuration = (s?: number) => {
		if (!s) return '—';
		return `${s.toFixed(1)} s`;
	};
</script>

<div class="grid grid-cols-1 gap-3">
	{#each $executionsStore as execution (execution.id)}
		{@const user = (execution.expand as { user: UsersResponse }).user}
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
								<Avatar.Root class="h-8 w-8 rounded-lg">
									<Avatar.Image
										class="object-cover"
										src="{PUBLIC_POCKETBASE_URL}/api/files/users/{user.id}/{user.avatar}"
										alt={user.username}
									/>
									<Avatar.Fallback
										class="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
									>
										{user.username[0].toUpperCase() +
											user.username[user.username.length - 1].toUpperCase()}
									</Avatar.Fallback>
								</Avatar.Root>
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
	{/each}
</div>
