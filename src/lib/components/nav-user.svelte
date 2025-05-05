<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import BadgeCheck from '@lucide/svelte/icons/badge-check';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import LogOut from '@lucide/svelte/icons/log-out';
	import type { User } from './sidebar-types';
	import type { UsersResponse } from '$lib/types';
	import { teamsStore, userStore, teamStore, teamAccessStore } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { toastApi } from '$lib/utils';
	import { UserAvatar } from '$lib/user';

	import { theme } from 'theme-selector';
	import { Moon, Sun, Bolt } from 'lucide-svelte';

	let { user }: { user: User } = $props();
	const sidebar = useSidebar();

	async function logout() {
		await toastApi.post('/api/auth/logout');
		await goto('/auth/login');
		userStore.set(undefined);
		teamsStore.set([]);
		teamStore.set(undefined);
		teamAccessStore.set(undefined);
	}
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						{...props}
					>
						<UserAvatar user={user as UsersResponse} />
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold" translate="no">{user.username}</span>
							<span class="truncate text-xs" translate="no">{user.email}</span>
						</div>
						<ChevronsUpDown class="ml-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-[var(--bits-dropdown-menu-anchor-width)] min-w-56 rounded-lg"
				side={'bottom'}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<UserAvatar user={user as UsersResponse} />
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold" translate="no">{user.username}</span>
							<span class="truncate text-xs" translate="no">{user.email}</span>
						</div>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Group></DropdownMenu.Group>
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<BadgeCheck />
						Account
					</DropdownMenu.Item>
					<DropdownMenu.Sub>
						<DropdownMenu.SubTrigger>
							{#if $theme === 'light'}
								<Sun />
							{:else if $theme === 'dark'}
								<Moon />
							{/if}
							Theme
						</DropdownMenu.SubTrigger>
						<DropdownMenu.SubContent>
							<DropdownMenu.Item onclick={() => theme.set('light')}>
								<Sun />
								<span>Light</span>
							</DropdownMenu.Item>
							<DropdownMenu.Item onclick={() => theme.set('dark')}>
								<Moon />
								<span>Dark</span>
							</DropdownMenu.Item>
							<DropdownMenu.Item onclick={() => theme.set('system')}>
								<Bolt />
								<span>System</span>
							</DropdownMenu.Item>
						</DropdownMenu.SubContent>
					</DropdownMenu.Sub>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={logout} class="text-red-600">
					<LogOut />Logout
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
