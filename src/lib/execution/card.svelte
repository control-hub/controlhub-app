<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { executionStore } from '$lib/stores';
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import type { UsersResponse, ScriptsResponse, ComputersResponse } from '$lib/types';
	import { formatDate } from '$lib/utils';
	import { CopyText } from '$lib/text/copy';

	const statusLabelMap = {
		0: 'Waiting',
		1: 'Executing',
		2: 'Done',
		3: 'Error'
	};
	const STATUS_COLORS = [
		'bg-gray-400 text-gray-900',
		'bg-yellow-500 text-yellow-900',
		'bg-green-500 text-green-900',
		'bg-red-500 text-red-900'
	];

	$: user = ($executionStore?.expand as { user: UsersResponse }).user;
	$: script = ($executionStore?.expand as { script: ScriptsResponse }).script;
</script>

<Card.Root
	class="mx-auto w-full max-w-2xl overflow-hidden break-words rounded-2xl border bg-background shadow-md"
>
	<Card.Header class="flex items-center justify-between px-6 pt-6">
		<div class="flex flex-row items-center gap-4">
			<Card.Title class="text-lg font-semibold">Execution #{$executionStore?.id}</Card.Title>
			<Badge class={`text-xs ${STATUS_COLORS[$executionStore?.status ?? 0]}`}>
				{statusLabelMap[$executionStore?.status ?? 0]}
			</Badge>
		</div>
	</Card.Header>

	<Card.Content class="space-y-6 px-6 py-4 text-sm">
		<div class="flex justify-between">
			<span class="text-muted-foreground">Duration:</span>
			<span>{$executionStore?.duration?.toFixed(1) ?? '—'} s</span>
		</div>

		{#if script}
			<div class="flex justify-between">
				<span class="text-muted-foreground">Script:</span>
				<a
					href="/scripts/{(script.expand as { user?: UsersResponse })?.user?.username}/{script.name}"
					class="font-medium underline underline-offset-4 hover:opacity-80"
				>
					{script.name}
				</a>
			</div>
		{/if}

		{#if $executionStore?.executable}
			<p class="mb-1 text-muted-foreground">Executable:</p>
			<CopyText value={$executionStore.executable.split('\n').slice(2).join('\n')} />
		{/if}

		{#if $executionStore?.logs != '\n' && $executionStore?.logs}
			<p class="mb-1 text-muted-foreground">Logs:</p>
			<CopyText value={$executionStore.logs} />
		{/if}
	</Card.Content>

	<Card.Footer class="flex w-full justify-end px-6 pb-6">
		<div class="flex w-full items-baseline justify-between">
			{#if user}
				<span class="text-muted-foreground">{formatDate($executionStore?.updated as string)}</span>
				<div class="flex items-center gap-2">
					<span class="text-muted-foreground">by</span>
					<a href="/scripts/{user.username}">
						<Tooltip.Root>
							<Tooltip.Trigger>
								<Avatar.Root class="h-8 w-8 rounded-lg border">
									<Avatar.Image
										class="object-cover"
										src="{PUBLIC_POCKETBASE_URL}/api/files/users/{user.id}/{user.avatar}"
										alt={user.username}
									/>
									<Avatar.Fallback class="rounded-lg bg-muted text-foreground">
										{user.username[0].toUpperCase() +
											user.username[user.username.length - 1].toUpperCase()}
									</Avatar.Fallback>
								</Avatar.Root>
							</Tooltip.Trigger>
							<Tooltip.Content>
								<pre class="max-w-xs items-start text-start">{JSON.stringify(
										{ id: user.id, email: user.email, username: user.username },
										null,
										4
									)}</pre>
							</Tooltip.Content>
						</Tooltip.Root>
					</a>
				</div>
			{/if}
		</div>
	</Card.Footer>
</Card.Root>
