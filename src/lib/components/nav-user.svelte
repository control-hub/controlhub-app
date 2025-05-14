<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { Settings2, LogOut, ChevronsUpDown, Github } from 'lucide-svelte';
	import type { UsersResponse } from '$lib/types';
	import { userStore } from '$lib/stores';
	import { logout } from '$lib/utils';
	import { UserAvatar } from '$lib/user';

	import { theme } from 'theme-selector';
	import { Moon, Sun, Bolt } from 'lucide-svelte';

	const sidebar = useSidebar();
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
						<UserAvatar user={$userStore as UsersResponse} />
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold" translate="no">{$userStore?.username}</span>
							<span class="truncate text-xs" translate="no">{$userStore?.email}</span>
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
						<UserAvatar user={$userStore as UsersResponse} />
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold" translate="no">{$userStore?.username}</span>
							<span class="truncate text-xs" translate="no">{$userStore?.email}</span>
						</div>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Group></DropdownMenu.Group>
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						{#snippet child({ props })}
							<a target="_blank" rel="noopener noreferrer" href="https://github.com/control-hub/controlhub" {...props}>
								<Github />
								GitHub
							</a>
						{/snippet}
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						{#snippet child({ props })}
							<a href="/settings" {...props}>
								<Settings2 />
								Settings
							</a>
						{/snippet}
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
