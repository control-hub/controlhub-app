<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Ellipsis, Ban, View } from 'lucide-svelte';

	import { ExecutionsTable } from '$lib/execution';

	import { toastApi, formatDate } from '$lib/utils';
	import { icon } from '$lib/config';
	import type { UsersResponse, TeamsAccessResponse } from '$lib/types';

	import {
		teamsAccessStore,
		userStore,
		teamStore,
		executionsStore,
	} from '$lib/stores';

	let openDialog: boolean = false;

	const excludeUserViaAccess = async (access: TeamsAccessResponse) => {
		await teamsAccessStore.delete(access);

		if (access.user === $userStore?.id) {
			window.location.href = '/';
		}
	};

	const browseUserExecutions = async (access: TeamsAccessResponse) => {
		executionsStore.updateOptions({
			filter: `user.id = "${access.user}" && computer.region.team.id = "${access.team}"`,
			sort: '-updated',
			expand: 'script',
			autoSubGetData: false
		});

		await executionsStore.getData();
		openDialog = true;
	};
</script>

<Dialog.Root bind:open={openDialog}>
	<Dialog.Content class="border-none p-0">
		<ScrollArea class="h-[80vh] w-full rounded-md opacity-100">
			<ExecutionsTable showUser={false} />
		</ScrollArea>
	</Dialog.Content>
</Dialog.Root>




<div class="grid grid-cols-2 gap-4 pb-6 max-lg:grid-cols-1">
	{#each $teamsAccessStore as access (access.id)}
		{@const user = (access.expand as { user: UsersResponse }).user}

		<Card.Root class="relative col-[1/-1] animate-fade-in-up sm:col-auto">
			<div class="mx-6 my-4 flex max-w-full flex-wrap items-start justify-between align-middle">
				<div class="block max-w-[calc(100%-4rem)]">
					<Card.Header>
						<Card.Title class="notranslate mb-3 flex w-full items-baseline gap-2">
							<span>{user.username}</span>
							{#if user.id === $teamStore?.owner}
								<Badge class="text-sm">Owner</Badge>
							{/if}
						</Card.Title>
					</Card.Header>
					<Card.Footer>
						<div class="flex flex-col gap-2">
							<div class="flex max-w-full flex-row flex-wrap gap-2">
								<span>Permissions:</span>
								{#each access.permissions as permission}
									<Badge variant="secondary">{permission}</Badge>
								{/each}
							</div>
							<Card.Description>
								Joined: {formatDate(access.created)}
							</Card.Description>
						</div>
					</Card.Footer>
				</div>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button
								variant="outline"
								class="z-20 my-auto aspect-square flex-shrink-0 hover:bg-background"
								{...props}
							>
								<Ellipsis class={icon.default} />
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Group>
							<DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
							<DropdownMenu.Separator />
							<DropdownMenu.Item onclick={() => browseUserExecutions(access)}
								><View />Browse actions</DropdownMenu.Item
							>
							<DropdownMenu.Item
								onclick={toastApi.execAsync(
									async () => {
										await excludeUserViaAccess(access);
									},
									'Excluded user successfully',
									'You cannot do this action'
								)}
								class="text-red-500"><Ban />Exclude</DropdownMenu.Item
							>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
			<!-- <a href="/{$teamStore?.name as string}/{user.username}" aria-label={user.username}>
				<div class="absolute inset-0 z-10"></div>
			</a> -->
		</Card.Root>
	{/each}
</div>
