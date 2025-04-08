<script lang="ts">
	import '../app.css';

	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Toaster } from 'svelte-sonner';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { userStore, teamStore, teamsStore } from '$lib/stores.js';

	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { writable, derived } from 'svelte/store';
	import type { UsersResponse } from '$lib/types';
	import { theme } from 'theme-selector';

	export let data: { user: UsersResponse; url: string };
	userStore.set(data.user);

	console.log('user', $userStore);

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
	<ScrollArea class="h-[100vh] w-full">
		<Sidebar.Provider>
			<AppSidebar user={$userStore} activeTeam={$teamStore} teams={$teamsStore} />
			<Sidebar.Inset>
				<header
					class="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 bg-background/95 backdrop-blur transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 supports-[backdrop-filter]:bg-background/60"
				>
					<div class="flex items-center gap-2 px-4">
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
				</header>
				<slot />
			</Sidebar.Inset>
		</Sidebar.Provider>
	</ScrollArea>
{:else}
	<slot />
{/if}
