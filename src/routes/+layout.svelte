<script lang="ts">
	import '../app.css';

	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { Toaster } from 'svelte-sonner';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { userStore } from '$lib/stores.js';

	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import type { UsersResponse } from '$lib/types';
	import { theme } from 'theme-selector';

	export let data: { user: UsersResponse; url: string };
	userStore.set(data.user);

	console.log('user', $userStore);

	const paths = derived(page, ($page) => $page.url.pathname.split('/'));
	const previousPaths = derived(paths, ($paths) =>
		$paths.map((_, i) => $paths.slice(0, i + 1).join('/'))
	);

	$: console.log($previousPaths, $paths);
</script>

<Toaster richColors theme={$theme} />

{#if $userStore}
	<Sidebar.Provider>
		<AppSidebar user={$userStore} />
		<Sidebar.Inset>
			<header
				class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
			>
				<div class="flex items-center gap-2 px-4">
					<Sidebar.Trigger class="-ml-1" />
					<Separator orientation="vertical" class="mr-2 h-4" />
					<Breadcrumb.Root>
						<Breadcrumb.List>
							{#each $previousPaths as path, i}
								{#if !['~', ''].includes($paths[i])}
									<Breadcrumb.Item class="hidden md:block">
										<Breadcrumb.Link href={path}>{$paths[i]}</Breadcrumb.Link>
									</Breadcrumb.Item>
									{#if i !== $previousPaths.length - 1}
										<Breadcrumb.Separator class="hidden md:block" />
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
{:else}
	<slot />
{/if}
