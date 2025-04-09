<script lang="ts">
	import type { ComputersResponse } from '$lib/types';
	import { createCollectionStore } from 'pocketbase-store';
	import { writable } from 'svelte/store';
	import { shield, cn, beforeNavigateOut } from '$lib/utils';
	import { pb } from '$lib/pocketbase/client';
	import { onMount, onDestroy } from 'svelte';
	import { icon } from '$lib/config';

	import { Play, Square } from 'lucide-svelte';
	import { tabsStore } from '$lib/stores';

	import { ComputersTable } from '$lib/computer/table';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	export let data;

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

	beforeNavigateOut(() => {
		tabsStore.set([]);
	});

	const checkedList = writable<string[]>([]);
	const filterPhrase = writable<string>('');

	const playClasses = {
		1: 'bg-green-500 hover:bg-green-600',
		0: 'bg-yellow-500 hover:bg-yellow-600'
	};
	const play = writable(false);
</script>

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
<span class="mt-4">Selected: {$checkedList}</span>
