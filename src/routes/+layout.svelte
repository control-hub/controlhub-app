<script lang="ts">
	import '../app.css';

	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Button } from '$lib/components/ui/button';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Toaster } from 'svelte-sonner';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { userStore, teamStore, teamsStore } from '$lib/stores.js';

	import { pb } from '$lib/pocketbase/client';
	import { tabsStore } from '$lib/stores.js';
	import { generateTabUrl, cn } from '$lib/utils';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { writable, derived } from 'svelte/store';
	import { theme } from 'theme-selector';
	import { slide } from 'svelte/transition';

	const currentPathname = writable($page.url.pathname);

	afterNavigate(() => {
		currentPathname.set($page.url.pathname);
	});

	const paths = derived(currentPathname, ($pathname) => {
		return $pathname.split('/');
	});
	const previousPaths = derived(paths, ($paths) =>
		$paths.map((_, i) => $paths.slice(0, i + 1).join('/'))
	);

	$: console.log($previousPaths, $paths);
</script>

<Toaster richColors theme={$theme} />

{#if $userStore}
	<ScrollArea class="h-[100svh] w-full">
		<Sidebar.Provider>
			<AppSidebar user={$userStore} activeTeam={$teamStore} teams={$teamsStore} />
			<Sidebar.Inset>
				<header
					class="sticky top-0 z-40 shrink-0 items-center gap-2 bg-background/95 backdrop-blur transition-[width] ease-linear supports-[backdrop-filter]:bg-background/60"
				>
					<div class="flex items-center gap-2 px-4 py-4">
						<Sidebar.Trigger class="-ml-1" />
						<Separator orientation="vertical" class="mr-2 h-4" />
						<Breadcrumb.Root>
							<Breadcrumb.List>
								{#each $previousPaths as path, i (i)}
									{#if !['~', ''].includes($paths[i])}
										<Breadcrumb.Item>
											<Breadcrumb.Link href={path}>{decodeURIComponent($paths[i])}</Breadcrumb.Link>
										</Breadcrumb.Item>
										{#if i !== $previousPaths.length - 1}
											<Breadcrumb.Separator />
										{/if}
									{/if}
								{/each}
							</Breadcrumb.List>
						</Breadcrumb.Root>
					</div>
					{#if $tabsStore.length > 0}
						<div class="flex h-12 w-full items-center justify-between px-4" transition:slide>
							<div class="flex h-full">
								{#each $tabsStore as tab}
									{@const url = generateTabUrl($page.url.pathname, tab, $tabsStore)}
									{@const isActive = url === $page.url.pathname}
									<div
										class={cn(
											'h-full px-2 py-2',
											isActive ? 'border-b-2 border-gray-300' : 'pb-[10px]'
										)}
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
					{/if}
					<div class="border-b border-input"></div>
				</header>
				<div class="container flex justify-center">
					<div class="my-6 w-[min(1080px,90%)]">
						<slot />
					</div>
				</div>
			</Sidebar.Inset>
		</Sidebar.Provider>
	</ScrollArea>
{:else}
	<slot />
{/if}
