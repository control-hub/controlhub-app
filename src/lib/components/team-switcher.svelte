<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import { TeamIcon } from '$lib/team';
	import { Plus } from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { toastApi, createTeam as utilsCreateTeam } from '$lib/utils';

	const dialogOpen = writable(false);

	import type { TeamsResponse } from '$lib/types';
	import { writable } from 'svelte/store';
	import ScrollArea from './ui/scroll-area/scroll-area.svelte';
	import { goto } from '$app/navigation';
	import { teamsStore, teamStore } from '$lib/stores';

	// This should be `Component` after @lucide/svelte updates types
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let createTeamName = '';
	const sidebar = useSidebar();

	const createTeam = async () => {
		const result = await utilsCreateTeam(createTeamName);
		createTeamName = '';
		dialogOpen.set(false);

		goto('/' + result.name);
	};
</script>

{#if $teamStore}
	<Sidebar.Menu>
		<Sidebar.MenuItem>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						{#if $teamStore !== undefined}
							<Sidebar.MenuButton
								{...props}
								size="lg"
								class="animate-fade-in-up data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<div
									class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
								>
									<TeamIcon team={$teamStore} class="size-4"/>
								</div>
								<div class="grid flex-1 text-left text-sm leading-tight">
									<span class="truncate font-semibold">
										{$teamStore.name}
									</span>
								</div>
								<ChevronsUpDown class="ml-auto" />
							</Sidebar.MenuButton>
						{/if}
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content
					class="w-[var(--bits-dropdown-menu-anchor-width)] min-w-56 rounded-lg"
					align="start"
					side={sidebar.isMobile ? 'bottom' : 'right'}
					sideOffset={4}
				>
					<DropdownMenu.Label class="text-xs text-muted-foreground">Teams</DropdownMenu.Label>
					<ScrollArea class={`max-h-[20vh]-scroll`}>
						{#each $teamsStore as team, index (team.id)}
							<DropdownMenu.Item onSelect={() => goto('/' + team.name + '/')} class="gap-2 p-2">
								<div class="flex size-6 items-center justify-center rounded-sm border">
									<TeamIcon team={team} class="size-3"/>
								</div>
								{team.name}
							</DropdownMenu.Item>
						{/each}
					</ScrollArea>
					<DropdownMenu.Separator />
					<DropdownMenu.Item class="gap-2 p-2" onSelect={() => dialogOpen.set(!$dialogOpen)}>
						<div class="flex size-6 items-center justify-center rounded-md border bg-background">
							<Plus class="size-4" />
						</div>
						<div class="font-medium text-muted-foreground">Add team</div>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</Sidebar.MenuItem>
	</Sidebar.Menu>
	<!-- Create team dialog -->
	<Dialog.Root bind:open={$dialogOpen}>
		<Dialog.Content trapFocus={false}>
			<Dialog.Header>
				<Dialog.Title>Create team</Dialog.Title>
				<Dialog.Description>Enter your new team name.</Dialog.Description>
			</Dialog.Header>
			<form
				class="flex gap-2"
				onsubmit={toastApi.execAsync(
					createTeam,
					`Team ${createTeamName} created.`,
					`Failed to create team ${createTeamName}.`
				)}
			>
				<Input id="name" class="col-span-3" placeholder="Team name" bind:value={createTeamName} />
				<Button type="submit">Create</Button>
			</form>
		</Dialog.Content>
	</Dialog.Root>
{:else if sidebar.open}
	<Skeleton class="h-[3rem] w-full rounded-lg bg-sidebar" />
{:else}
	<Skeleton class="h-[2rem] w-full rounded-lg bg-sidebar" />
{/if}
