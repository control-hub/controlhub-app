<script lang="ts">
	import { theme } from 'theme-selector';

	import { LogOut, Moon, Sun, LayoutDashboard, ChevronDown, PlusCircle, Bolt } from 'lucide-svelte';
	import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';

	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	import { teamStore, teamAccessStore } from '$lib/stores.js';
	import { tabsStore } from '$lib/stores.js';
	import { icon } from '$lib/config';
	import { goto } from '$app/navigation';
	import { toastApi, generateTabUrl, cn, createTeam as utilsCreateTeam } from '$lib/utils';
	import { pb } from '$lib/pocketbase/client';
	import { createCollectionStore } from 'pocketbase-store';
	import type { TeamsAccessResponse, TeamsResponse } from '$lib/types';
	export let data: {
		user: any;
		cookie: string;
		url: string;
		teams: TeamsResponse[];
		team: TeamsResponse;
		teamAccess: TeamsAccessResponse;
		params: any;
	};

	teamAccessStore.set(data.teamAccess);
	teamStore.set(data.team);

	// region: PocketBase
	pb.authStore.loadFromCookie(data.cookie);
	const teamsStore = createCollectionStore<TeamsResponse>(
		pb,
		'teams',
		{ sort: '-created', autoSubGetData: false },
		data.teams
	);

	console.log(data);

	// endregion

	let createTeamOpen = false;
	let createTeamName = '';

	async function logout() {
		await toastApi.post('/api/auth/logout');
		await goto('/auth/login');
		data.user = undefined;
	}

	async function createTeam() {
		const result = await utilsCreateTeam(teamsStore, { name: createTeamName, owner: data.user.id });

		createTeamOpen = false;
		createTeamName = '';

		window.location.href = '/' + result.name;
	}
</script>

<div class="flex min-h-screen flex-col">
	<header class="sticky top-0 z-10 w-full bg-muted/10 backdrop-blur">
		<div class="flex h-14 w-full items-center justify-between px-4">
			<div class="flex items-center space-x-4">
				<a class="flex items-center space-x-2" href="/dashboard">
					<img
						src={`/controlhub_${$theme === 'dark' ? 'light' : 'dark'}.svg`}
						alt="ControlHub Logo"
						class="h-6 w-6"
					/>
				</a>
				<div class="align-center flex gap-2">
					{#if $teamsStore != undefined && $teamsStore.length > 0}
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								{#snippet child({ props })}
									<Button {...props} variant="outline" class="justify-between"
										>{$teamStore?.name}
										<ChevronDown class={icon.left} /></Button
									>
								{/snippet}
							</DropdownMenu.Trigger>
							<DropdownMenu.Content>
								{#if $teamsStore.length > 1}
									<DropdownMenu.Group class="mb-2 mt-1 space-y-2">
										{#each $teamsStore as team (team.name)}
											{#if team.id !== $teamStore?.id}
												<DropdownMenu.Item
													class="justify-between"
													onclick={() => {
														window.localStorage.setItem('team', JSON.stringify(team));
														document.location.href = '/' + team.name;
													}}
												>
													{team.name}
												</DropdownMenu.Item>
											{/if}
										{/each}
									</DropdownMenu.Group>

									<DropdownMenu.Separator />
								{/if}
								<Dialog.Root bind:open={createTeamOpen}>
									<Dialog.Trigger>
										{#snippet child({ props })}
											<Button {...props} class="w-full text-center" variant="ghost">
												Create team
												<PlusCircle class={icon.left} />
											</Button>
										{/snippet}
									</Dialog.Trigger>
									<Dialog.Content class="sm:max-w-[425px]" trapFocus={false}>
										<Dialog.Header>
											<Dialog.Title>Create team</Dialog.Title>
											<Dialog.Description>Enter your new team name.</Dialog.Description>
										</Dialog.Header>
										<form
											class="flex gap-2"
											on:submit|preventDefault={toastApi.execAsync(
												createTeam,
												`Team ${createTeamName} created.`,
												`Failed to create team ${createTeamName}.`
											)}
										>
											<Input
												id="name"
												class="col-span-3"
												placeholder="Team name"
												bind:value={createTeamName}
											/>
											<Button type="submit">Create <PlusCircle class={icon.left} /></Button>
										</form>
									</Dialog.Content>
								</Dialog.Root>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					{/if}
				</div>
			</div>
			<div class="flex items-center space-x-4">
				<nav class="flex items-center space-x-4">
					<a href="/docs" class="text-sm font-medium text-muted-foreground hover:text-foreground">
						Docs
					</a>
					<a href="/help" class="text-sm font-medium text-muted-foreground hover:text-foreground">
						Help
					</a>
				</nav>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="ghost" class="relative h-8 w-8 rounded-full">
								<Avatar class="h-8 w-8">
									<AvatarImage
										src={data.user.avatar || `/placeholder.svg?height=32&width=32`}
										alt={data.user.username}
									/>
									<AvatarFallback class="bg-gradient-to-br from-[#FF1CF7] to-[#b249f8]">
										{data.user.username.slice(0, 2).toUpperCase()}
									</AvatarFallback>
								</Avatar>
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						<DropdownMenu.Label class="font-normal">
							<div class="flex flex-col space-y-1">
								<p class="text-sm font-medium leading-none">{data.user.username}</p>
								<p class="text-xs leading-none text-muted-foreground">
									{data.user.email.slice(0, 16) + (data.user.email.length > 16 ? '...' : '')}
								</p>
							</div>
						</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>
							{#snippet child({ props })}
								<a {...props} href="/dashboard">
									<LayoutDashboard class={icon.right} />
									Dashboard
								</a>
							{/snippet}
						</DropdownMenu.Item>
						<DropdownMenu.Sub>
							<DropdownMenu.SubTrigger>
								{#if $theme === 'light'}
									<Sun class={icon.right} />
								{:else if $theme === 'dark'}
									<Moon class={icon.right} />
								{/if}
								Theme
							</DropdownMenu.SubTrigger>
							<DropdownMenu.SubContent>
								<DropdownMenu.Item onclick={() => theme.set('light')}>
									<Sun class="mr-2 h-4 w-4" />
									<span>Light</span>
								</DropdownMenu.Item>
								<DropdownMenu.Item onclick={() => theme.set('dark')}>
									<Moon class="mr-2 h-4 w-4" />
									<span>Dark</span>
								</DropdownMenu.Item>
								<DropdownMenu.Item onclick={() => theme.set('system')}>
									<Bolt class="mr-2 h-4 w-4" />
									<span>System</span>
								</DropdownMenu.Item>
							</DropdownMenu.SubContent>
						</DropdownMenu.Sub>
						<DropdownMenu.Separator />
						<DropdownMenu.Item onclick={logout} class="text-red-600">
							<LogOut class={icon.right} />Logout
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
		<div class="flex h-12 w-full items-center justify-between border-b border-input px-4">
			<div class="flex h-full">
				{#each $tabsStore as tab}
					{@const url = generateTabUrl(data.url, tab, $tabsStore)}
					{@const isActive = url === data.url}
					<div
						class={cn('h-full px-2 py-2', isActive ? 'border-b-2 border-gray-300' : 'pb-[10px]')}
					>
						<Button
							variant="ghost"
							href={url}
							class={cn(
								'h-full font-medium',
								!isActive ? 'text-muted-foreground hover:text-foreground' : ''
							)}
						>
							{tab.name}
						</Button>
					</div>
				{/each}
			</div>
		</div>
	</header>

	<main class="flex-1">
		<ScrollArea class="h-[calc(100vh-6.5rem-1px)] w-full">
			<div class="flex h-[calc(100vh-6.5rem-1px)]">
				<div class="container flex max-w-md justify-center">
					<div class="block">
						<slot />
					</div>
				</div>
			</div>
		</ScrollArea>
	</main>
</div>
