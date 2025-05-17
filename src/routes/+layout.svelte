<script lang="ts">
	import '../app.css';

	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Button } from '$lib/components/ui/button';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Toaster } from 'svelte-sonner';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { userStore } from '$lib/stores.js';

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
</script>

<Toaster richColors theme={$theme} />

{#if $userStore}
	<ScrollArea class="h-[100svh] w-full">
		<Sidebar.Provider>
			<AppSidebar />
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
						<div transition:slide>
							<ScrollArea
								class="w-[100vw] whitespace-nowrap sm:w-full"
								scrollbarXClasses="hidden"
								orientation="horizontal"
							>
								<div class="flex h-12 w-max items-center justify-between px-4">
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
							</ScrollArea>
						</div>
					{/if}
					<div class="w-[min(100vw,100%)] border-b border-input"></div>
				</header>
				<div class="container flex justify-center h-full">
					<div class="mt-6 mb-6 w-full h-[calc(100%-3rem)]">
						<slot />
					</div>
				</div>
			</Sidebar.Inset>
		</Sidebar.Provider>
	</ScrollArea>
{:else}
	<slot />
{/if}
