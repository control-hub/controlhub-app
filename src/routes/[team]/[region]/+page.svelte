<script lang="ts">
	import { writable } from 'svelte/store';
	import { cn, beforeNavigateOut } from '$lib/utils';
	import { onMount, onDestroy } from 'svelte';
	import { icon } from '$lib/config';
	import { computersStore } from '$lib/stores';

	import { Play, Square } from 'lucide-svelte';
	import { tabsStore } from '$lib/stores';

	import { ComputersTable } from '$lib/computer/table';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import type { ComputersResponse } from '$lib/types';

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

	const checkedList = writable<ComputersResponse[]>([]);
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
<ComputersTable {filterPhrase} {checkedList} />
<!-- <span class="mt-4">Selected: {$checkedList}</span> -->
