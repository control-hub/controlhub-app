<script lang="ts">
	import { theme } from 'theme-selector';

	import { LogOut, Moon, Sun, LayoutDashboard, ChevronDown, PlusCircle, Bolt } from 'lucide-svelte';
	import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';

	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	import { page } from '$app/stores';
	import { teamStore, teamAccessStore, teamsStore } from '$lib/stores.js';
	import { tabsStore } from '$lib/stores.js';
	import { icon } from '$lib/config';
	import { beforeNavigate, goto } from '$app/navigation';
	import { toastApi, generateTabUrl, cn, createTeam as utilsCreateTeam } from '$lib/utils';
	import { pb } from '$lib/pocketbase/client';
	import { createCollectionStore } from 'pocketbase-store';
	import type { TeamsAccessResponse, TeamsResponse } from '$lib/types';
	import { onDestroy, onMount } from 'svelte';

	beforeNavigate(({ to, from }) => {
		const nextPath = from?.url.pathname || '';
		const currentPath = to?.url.pathname.split('/').slice(0, 2).join('/') || '';

		console.log(currentPath);

		if (!nextPath.startsWith(currentPath)) {
			teamAccessStore.set(undefined);
			teamStore.set(undefined);
			teamsStore.set([]);
		}
	});
</script>

<div class="flex flex-col">
	<header
		class="sticky top-16 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
	>
		<div class="flex h-12 w-full items-center justify-between border-b border-input px-4">
			<div class="flex h-full">
				{#each $tabsStore as tab}
					{@const url = generateTabUrl($page.url.pathname, tab, $tabsStore)}
					{@const isActive = url === $page.url.pathname}
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

	<div class="container flex justify-center">
		<div class="my-6 w-[min(1080px,90%)]">
			<slot />
		</div>
	</div>
</div>
