<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { randintSeed } from '$lib/utils';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import Plus from '@lucide/svelte/icons/plus';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { toastApi, createTeam as utilsCreateTeam } from '$lib/utils';
	import { teamsStore, userStore } from '$lib/stores';

	const dialogOpen = writable(false);

	import {
		Cuboid,
		Radar,
		Airplay,
		BookUser,
		Cast,
		Cylinder,
		Diameter,
		Eclipse,
		Radius,
		Box,
		Package,
		PackageOpen,
		Bolt,
		Container,
		Pyramid,
		TriangleRight,
		Blend,
		Pentagon,
		Hexagon,
		CircleDot,
		CircleDotDashed,
		Cone,
		Square,
		Triangle,
		Tangent,
		Torus,
		SquareDashed
	} from 'lucide-svelte';
	import type { Team } from './sidebar-types';
	import { writable } from 'svelte/store';
	import ScrollArea from './ui/scroll-area/scroll-area.svelte';
	import { goto } from '$app/navigation';

	// This should be `Component` after @lucide/svelte updates types
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let { teams, activeTeam }: { teams: Team[]; activeTeam?: Team } = $props();

	let createTeamName = $state('');
	const sidebar = useSidebar();

	const logos = [
		Cuboid,
		Cylinder,
		Diameter,
		Eclipse,
		Radius,
		Box,
		Package,
		Bolt,
		Container,
		Pyramid,
		TriangleRight,
		Blend,
		Pentagon,
		Hexagon,
		CircleDot,
		CircleDotDashed,
		Cone,
		Square,
		Triangle,
		Tangent,
		Torus
	];

	const createTeam = async () => {
		const result = await utilsCreateTeam(teamsStore, {
			name: createTeamName,
			owner: $userStore?.id as string
		});
		createTeamName = '';
		dialogOpen.set(false);

		goto('/' + result.name);
	};
</script>

{#if activeTeam}
	<Sidebar.Menu>
		<Sidebar.MenuItem>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						{@const activeTeamLogo =
							activeTeam.logo ?? logos[randintSeed(activeTeam.name, 0, logos.length - 1)]}
						<Sidebar.MenuButton
							{...props}
							size="lg"
							class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							{#if !activeTeam.empty}
								<div
									class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
								>
									<svelte:component this={activeTeamLogo} class="size-4" />
								</div>
							{:else if activeTeam}
								<div class="flex aspect-square size-8 items-center justify-center rounded-lg">
									<SquareDashed class="size-6" />
								</div>
							{/if}
							<div class="grid flex-1 text-left text-sm leading-tight">
								<span class="truncate font-semibold">
									{activeTeam.name}
								</span>
								<span class="truncate text-xs">{activeTeam.plan}</span>
							</div>
							<ChevronsUpDown class="ml-auto" />
						</Sidebar.MenuButton>
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
						{#each teams as team, index (team.name)}
							{@const logo = team.logo ?? logos[randintSeed(team.name, 0, logos.length - 1)]}
							<DropdownMenu.Item onSelect={() => goto('/' + team.name)} class="gap-2 p-2">
								<div class="flex size-6 items-center justify-center rounded-sm border">
									<svelte:component this={logo} class="size-4 shrink-0" />
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
	<Skeleton class="h-[3rem] w-full rounded-lg" />
{:else}
	<Skeleton class="h-[2rem] w-full rounded-lg" />
{/if}
