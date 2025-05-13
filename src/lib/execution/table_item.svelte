<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Alert from '$lib/components/ui/alert';
	import { Code } from '$lib/components/ui/code';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { pb } from '$lib/pocketbase/client';
	import { teamStore, regionStore, computerStore } from '$lib/stores';
	import type { ExecutionsResponse, ScriptsResponse, UsersResponse } from '$lib/types';
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

	export let showUser: boolean = true;

	const goToElement = async () => {
		const computer =
			$computerStore || (await pb.collection('computers').getOne(execution.computer));
		const region =
			$regionStore || (await pb.collection('regions').getOne(computer?.region as string));
		const team = $teamStore || (await pb.collection('teams').getOne(region?.team as string));
		goto('/' + team?.name + '/' + region?.name + '/' + computer?.name + '/' + execution.id);
	};
</script>

<button onclick={goToElement}>
	<Alert.Root class="flex justify-between gap-4">
		<div class="flex items-center gap-4">
			<div class="size-4 rounded-full {STATUS_COLORS[execution.status ?? 0]}"></div>
			<div class="flex flex-col items-start">
				{#if (execution.expand as { script: ScriptsResponse })?.script}
					<Alert.Title>
						{(execution.expand as { script: ScriptsResponse }).script.name}
					</Alert.Title>
					<span class="text-muted-foreground">
						Id: {execution.id}
					</span>
				{:else}
					<Alert.Title>
						{execution.id}
					</Alert.Title>
					<span class="text-muted-foreground">
						Id: {execution.id}
					</span>
				{/if}
				<span class="text-muted-foreground">
					Duration: {readableDuration(execution.duration)}
				</span>
			</div>
		</div>
		{@const user = (execution.expand as { user: UsersResponse })?.user}
		{#if user !== undefined && showUser}
			<div class="flex items-center gap-2">
				<span class="text-muted-foreground"> by </span>
				<a href="/scripts/{user.username}" class="flex gap-2 items-center text-md text-foreground/75">
					<u>{user.username}</u>
					<UserAvatar {user} />
				</a>
			</div>
		{/if}
	</Alert.Root>
</button>
