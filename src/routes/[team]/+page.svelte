<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { tabsStore } from '$lib/stores';
	import { tabsConfig } from '$lib/config';
	import { Input } from '$lib/components/ui/input';
	import { RegionsTable } from '$lib/region';

	import { writable } from 'svelte/store';

	const filterPhrase = writable('');

	onMount(async () => {
		tabsStore.set(tabsConfig.team)
	});

	onDestroy(async () => {
		tabsStore.update((tabs) => (tabs === tabsConfig.team) ? [] : tabs)
	});
</script>

<div class="mb-4 flex gap-4">
	<Input class="w-full" placeholder="Search..." bind:value={$filterPhrase} />
</div>

<RegionsTable {filterPhrase} />
