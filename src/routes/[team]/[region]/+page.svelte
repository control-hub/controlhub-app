<script lang="ts">
	import type { ComputersResponse, RegionsResponse, TeamsResponse } from '$lib/types';
	import { createCollectionStore } from 'pocketbase-store';
	import { writable } from 'svelte/store';
	import { shield, cn } from '$lib/utils';
	import { pb } from '$lib/pocketbase/client';
	import { onMount, onDestroy } from 'svelte';
	import { icon, tabsConfig } from '$lib/config';

	import { Play, Square } from 'lucide-svelte';

	import { ComputersTable } from '$lib/computer/table';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { tabsStore } from '$lib/stores.js';

	export let data: {
		computers: ComputersResponse[];
		region: RegionsResponse;
		cookie: string;
	};

	tabsStore.set(tabsConfig.region);
	// region: PocketBase
	pb.authStore.loadFromCookie(data.cookie);

	const computersStore = createCollectionStore<ComputersResponse>(
		pb,
		'computers',
		{
			sort: '-status,-updated',
			filter: `region.id = "${shield(data.region.id)}"`,
			autoSubGetData: false
		},
		data.computers
	);

	onMount(async () => {
		await computersStore.subscribeOnPocketBase();
	});

	onDestroy(async () => {
		await computersStore.unsubscribeFromPocketBase();
	});
	// endregion

	const checkedList = writable<string[]>([]);
	const filterPhrase = writable<string>('');

	const playClasses = {
		1: 'bg-green-500 hover:bg-green-600',
		0: 'bg-yellow-500 hover:bg-yellow-600'
	};
	const play = writable(false);
</script>

<div class="my-6 w-[min(1080px,90%)]">
	<div class="flex gap-4 pb-4">
		<Input class="w-full" placeholder="Search..." bind:value={$filterPhrase} />
		<Button
			class={cn('gap-0 text-center', playClasses[$play ? 0 : 1])}
			onclick={() => play.update((p: boolean) => !p)}
		>
			{#if !$play}
				<Play class={icon.left} />
			{:else}
				<Square class={icon.left} />
			{/if}
			Start
		</Button>
	</div>
	<ComputersTable region={data.region} data={computersStore} {filterPhrase} {checkedList} />
	{$checkedList}
	<div class="h-4"></div>
</div>
